import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { Pool } from 'pg';

process.env.PREBA_LEDGER_ENABLED='true';
process.env.PREBA_LEDGER_DATABASE_URL ||= 'postgresql://preba_qa:preba_qa@localhost:5432/preba_qa';
async function main(){
const {reserveIntake,recordIntakeTransition}=await import('../lib/preba-ledger-postgres');
const db=new Pool({connectionString:process.env.PREBA_LEDGER_DATABASE_URL});
const sha=createHash('sha256').update('synthetic-QA-payload').digest('hex');
const make=()=>({operationId:randomUUID(),requestId:'PREBA-QA-REQUEST-1',packageId:'PREBA-QA-PACKAGE-1',actorId:'qa_operator_01',sha256:sha});
async function operation(id:string){
  const {rows}=await db.query('SELECT * FROM preba_intake_operations WHERE operation_id=$1',[id]);return rows[0];
}
async function events(id:string){
  const {rows}=await db.query('SELECT * FROM preba_intake_events WHERE operation_id=$1 ORDER BY event_seq',[id]);return rows;
}
async function run(){
  const a=make();
  assert.equal(await reserveIntake(a),'reserved');
  assert.equal(await reserveIntake(a),'existing');
  assert.equal((await events(a.operationId)).length,1);
  await assert.rejects(reserveIntake({...a,actorId:'qa_operator_02'}),/Conflito/);
  assert.equal((await operation(a.operationId)).actor_id,a.actorId);
  await assert.rejects(recordIntakeTransition({operationId:a.operationId,actorId:a.actorId,event:'quarantined'}),/fora de ordem/);
  assert.equal((await operation(a.operationId)).status,'reserved');
  assert.equal((await events(a.operationId)).length,1);
  const path='private/preba-intake/qa/original.pdf';
  await recordIntakeTransition({operationId:a.operationId,actorId:a.actorId,event:'object_written',path});
  await recordIntakeTransition({operationId:a.operationId,actorId:a.actorId,event:'receipt_written'});
  await recordIntakeTransition({operationId:a.operationId,actorId:a.actorId,event:'quarantined'});
  assert.equal((await operation(a.operationId)).status,'quarantined');
  const stream=await events(a.operationId);
  assert.deepEqual(stream.map(x=>x.event_type),['reserved','object_written','receipt_written','quarantined']);
  for(let i=0;i<stream.length;i++){
    const e=stream[i],prev=i?stream[i-1].event_hash:null;
    assert.equal(e.previous_hash,prev);
    const detail=e.detail as Record<string,string>;
    const canonical=JSON.stringify([a.operationId,a.actorId,e.event_type,Object.keys(detail).sort().map(k=>[k,detail[k]]),prev]);
    assert.equal(e.event_hash,createHash('sha256').update(canonical).digest('hex'));
  }
  await assert.rejects(db.query('DELETE FROM preba_intake_events WHERE operation_id=$1',[a.operationId]),/append-only/);
  await assert.rejects(db.query('UPDATE preba_intake_events SET detail=$1 WHERE operation_id=$2',['{}',a.operationId]),/append-only/);
  const b=make();
  const results=await Promise.allSettled(Array.from({length:12},()=>reserveIntake(b)));
  assert.equal(results.filter(r=>r.status==='fulfilled'&&r.value==='reserved').length,1);
  assert.equal(results.filter(r=>r.status==='fulfilled'&&r.value==='existing').length,11);
  assert.equal((await events(b.operationId)).length,1);
  const c=make();await reserveIntake(c);
  const cPath='private/preba-intake/qa/'+c.operationId+'/original.pdf';
  const raced=await Promise.allSettled([
    recordIntakeTransition({operationId:c.operationId,actorId:c.actorId,event:'object_written',path:cPath}),
    recordIntakeTransition({operationId:c.operationId,actorId:c.actorId,event:'object_written',path:cPath}),
  ]);
  assert.equal(raced.filter(r=>r.status==='fulfilled').length,1);
  assert.equal((await events(c.operationId)).length,2);
  await recordIntakeTransition({operationId:c.operationId,actorId:c.actorId,event:'recovery_required'});
  assert.equal((await operation(c.operationId)).status,'recovery_required');
  assert.equal((await events(c.operationId)).at(-1)?.event_type,'recovery_required');
  const d=make();await reserveIntake(d);
  await recordIntakeTransition({operationId:d.operationId,actorId:d.actorId,event:'failed'});
  assert.equal((await operation(d.operationId)).status,'failed');
  // Inject a DB failure after a row update is attempted; the transaction must roll back.
  const e=make();await reserveIntake(e);
  await assert.rejects(recordIntakeTransition({operationId:e.operationId,actorId:e.actorId,
    event:'object_written',path}),/duplicate key value/);
  assert.equal((await operation(e.operationId)).status,'reserved');
  assert.equal((await operation(e.operationId)).storage_path,null);
  assert.deepEqual((await events(e.operationId)).map(x=>x.event_type),['reserved']);
  await recordIntakeTransition({operationId:e.operationId,actorId:e.actorId,event:'recovery_required'});
  assert.equal((await operation(e.operationId)).status,'recovery_required');
  assert.deepEqual((await events(e.operationId)).map(x=>x.event_type),['reserved','recovery_required']);
  // The event chain remains intact after the rejected, rolled-back transaction.
  const recoveredEvents=await events(e.operationId);
  assert.equal(recoveredEvents[1].previous_hash,recoveredEvents[0].event_hash);
  console.log('PASS PRE-BA PostgreSQL QA: real migration, idempotence (12 requests), concurrent row locking, valid/invalid transitions, integrity hashes, immutable events, rollback on unique-path conflict, recovery state.');
}
try{await run();}finally{await db.end();}

}
main().catch(error=>{console.error(error);process.exitCode=1;});
