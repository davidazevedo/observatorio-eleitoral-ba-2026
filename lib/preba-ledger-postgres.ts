import { createHash } from 'node:crypto';
import { Pool, type PoolClient } from 'pg';

type EventKind='reserved'|'object_written'|'receipt_written'|'quarantined'|'failed'|'recovery_required'|'reconciled';
type OperationStatus='reserved'|'stored'|'quarantined'|'failed'|'recovery_required';
const states:Record<EventKind,OperationStatus>={
  reserved:'reserved',object_written:'stored',receipt_written:'stored',
  quarantined:'quarantined',failed:'failed',recovery_required:'recovery_required',reconciled:'quarantined',
};
const rootPool = process.env.PREBA_LEDGER_DATABASE_URL
  ? new Pool({connectionString:process.env.PREBA_LEDGER_DATABASE_URL,max:5,
      ssl:process.env.PREBA_LEDGER_DB_SSL==='true'?{rejectUnauthorized:true}:undefined})
  : null;

function pool():Pool {
  if(process.env.PREBA_LEDGER_ENABLED!=='true'||!rootPool)
    throw new Error('Ledger transacional não habilitado/configurado.');
  return rootPool;
}
function digest(value:string) { return createHash('sha256').update(value,'utf8').digest('hex'); }
function checkId(value:string){ if(!/^[a-zA-Z0-9_.-]{4,128}$/.test(value)) throw new Error('Identificador inválido.'); }
function checkUuid(value:string){if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value)) throw new Error('UUID inválido.');}
export type LedgerReservation={operationId:string;requestId:string;packageId:string;actorId:string;sha256:string};

async function appendLocked(client:PoolClient, operationId:string,actorId:string,event:EventKind, detail:Record<string,string>={}) {
  const latest=await client.query<{event_hash:string}>(
    'SELECT event_hash FROM preba_intake_events WHERE operation_id=$1 ORDER BY event_seq DESC LIMIT 1',[operationId]);
  const previous=latest.rows[0]?.event_hash??null;
  // Canonical hash does not depend on DB timestamps or JSON object ordering.
  const canon=JSON.stringify([operationId,actorId,event,Object.keys(detail).sort().map(k=>[k,detail[k]]),previous]);
  const hash=digest(canon);
  await client.query(
    'INSERT INTO preba_intake_events (operation_id,event_type,actor_id,detail,previous_hash,event_hash) VALUES ($1,$2,$3,$4,$5,$6)',
    [operationId,event,actorId,JSON.stringify(detail),previous,hash]);
}
async function transaction<T>(work:(client:PoolClient)=>Promise<T>):Promise<T> {
  const client=await pool().connect();
  try{
    await client.query('BEGIN');
    const result=await work(client);
    await client.query('COMMIT');
    return result;
  }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
}
export async function reserveIntake(x:LedgerReservation):Promise<'reserved'|'existing'> {
  checkUuid(x.operationId);checkId(x.requestId);checkId(x.packageId);checkId(x.actorId);
  if(!/^[a-f0-9]{64}$/.test(x.sha256))throw new Error('SHA inválido.');
  return transaction(async client=>{
    const result=await client.query(
      'INSERT INTO preba_intake_operations (operation_id,request_id,package_id,actor_id,document_sha256) VALUES($1,$2,$3,$4,$5) ON CONFLICT (operation_id) DO NOTHING RETURNING operation_id',
      [x.operationId,x.requestId,x.packageId,x.actorId,x.sha256]);
    await client.query('SELECT operation_id FROM preba_intake_operations WHERE operation_id=$1 FOR UPDATE',[x.operationId]);
    if(!result.rowCount){
      const check=await client.query<{request_id:string;package_id:string;actor_id:string;document_sha256:string}>(
        'SELECT request_id,package_id,actor_id,document_sha256 FROM preba_intake_operations WHERE operation_id=$1',[x.operationId]);
      const r=check.rows[0];
      if(!r||r.request_id!==x.requestId||r.package_id!==x.packageId||r.actor_id!==x.actorId||r.document_sha256!==x.sha256)
        throw new Error('Conflito de chave de idempotência.');
      return 'existing';
    }
    await appendLocked(client,x.operationId,x.actorId,'reserved');
    return 'reserved';
  });
}
export async function recordIntakeTransition(input:{
 operationId:string;actorId:string;event:Exclude<EventKind,'reserved'>;path?:string;
}):Promise<void>{
  checkUuid(input.operationId);checkId(input.actorId);
  if(input.path&&(!input.path.startsWith('private/preba-intake/')||input.path.length>350))
    throw new Error('Caminho não autorizado.');
  await transaction(async client=>{
    const q=await client.query<{actor_id:string;status:OperationStatus}>(
      'SELECT actor_id,status FROM preba_intake_operations WHERE operation_id=$1 FOR UPDATE',[input.operationId]);
    const current=q.rows[0];
    if(!current||current.actor_id!==input.actorId)throw new Error('Operação/operador inválido.');
    if(['quarantined','failed'].includes(current.status)&&input.event!=='recovery_required')
      throw new Error('Transição terminal não permitida.');
    if(input.event==='object_written'&&current.status!=='reserved')throw new Error('Objeto fora de ordem.');
    if(input.event==='receipt_written'&&current.status!=='stored')throw new Error('Recibo fora de ordem.');
    if(input.event==='quarantined'&&current.status!=='stored')throw new Error('Quarentena fora de ordem.');
    if(input.event==='reconciled'&&current.status!=='recovery_required')throw new Error('Reconciliação fora de ordem.');
    if(input.event==='failed'&&current.status==='quarantined')throw new Error('Transição inválida.');
    await client.query('UPDATE preba_intake_operations SET status=$2,storage_path=COALESCE($3,storage_path),updated_at=clock_timestamp() WHERE operation_id=$1',
      [input.operationId,states[input.event],input.path??null]);
    await appendLocked(client,input.operationId,input.actorId,input.event,input.path?{path:input.path}:{});
  });
}
