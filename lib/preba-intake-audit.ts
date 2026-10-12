import { list, get } from '@vercel/blob';
import tracker from '@/data/investigation/preba-diligence-tracker-2026-10-08.json';

const validRequests = new Map(tracker.requests.map(r => [r.requestId, r.packageId]));
const ROOT='private/preba-intake/';

export type IntakeAuditItem = {
  receiptId:string;
  requestId:string;
  packageId:string;
  hasOriginal:boolean;
  hasReceipt:boolean;
  state:'complete_quarantined'|'orphan_original'|'orphan_receipt';
};

export async function listIntakeAudit():Promise<IntakeAuditItem[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Armazenamento privado não configurado.');
  const names:string[]=[];
  let cursor:string|undefined;
  do {
    const page=await list({prefix:ROOT,limit:1000,cursor});
    for (const entry of page.blobs) names.push(entry.pathname);
    cursor=page.hasMore?page.cursor:undefined;
  } while(cursor);

  const entries=new Map<string,IntakeAuditItem>();
  for(const path of names) {
    const relative=path.slice(ROOT.length).split('/');
    if(relative.length!==4) continue;
    const [packageId,requestId,receiptId,filename]=relative;
    if(validRequests.get(requestId)!==packageId || !/^[0-9a-f-]{36}$/.test(receiptId)) continue;
    if(filename!=='receipt.json' && !/^original\.(pdf|png|jpg)$/.test(filename)) continue;
    const key=packageId+'/'+requestId+'/'+receiptId;
    const current=entries.get(key)||{receiptId,requestId,packageId,hasOriginal:false,hasReceipt:false,state:'orphan_original' as const};
    if(filename==='receipt.json') current.hasReceipt=true;
    else current.hasOriginal=true;
    entries.set(key,current);
  }
  const result: IntakeAuditItem[]=[];
  for(const item of entries.values()) {
    item.state=item.hasOriginal&&item.hasReceipt?'complete_quarantined':item.hasOriginal?'orphan_original':'orphan_receipt';
    result.push(item);
  }
  return result.sort((a,b)=>a.packageId.localeCompare(b.packageId)||a.requestId.localeCompare(b.requestId)||a.receiptId.localeCompare(b.receiptId));
}

export async function verifyIntakeReceipt(item:IntakeAuditItem) {
  if(item.state!=='complete_quarantined') return { ...item, receiptConsistent:false };
  const path=ROOT+item.packageId+'/'+item.requestId+'/'+item.receiptId+'/receipt.json';
  const response=await get(path,{access:'private',useCache:false});
  if(!response || response.statusCode!==200) return {...item,receiptConsistent:false};
  let receipt:Record<string,unknown>;
  try { receipt=JSON.parse(await new Response(response.stream).text()); }
  catch { return {...item,receiptConsistent:false}; }
  const expectedPrefix=ROOT+item.packageId+'/'+item.requestId+'/'+item.receiptId+'/original.';
  const valid=receipt.receiptId===item.receiptId && receipt.requestId===item.requestId &&
    receipt.packageId===item.packageId && receipt.status==='received_unverified' &&
    receipt.security!==null && typeof receipt.security==='object' &&
    (receipt.security as Record<string,unknown>).protocolReady===false &&
    typeof receipt.documentPath==='string' && receipt.documentPath.startsWith(expectedPrefix) &&
    typeof receipt.sha256==='string' && /^[a-f0-9]{64}$/.test(receipt.sha256);
  return {...item,receiptConsistent:valid};
}
