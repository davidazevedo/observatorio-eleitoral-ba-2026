import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const idx=read('data/investigation/fm03-evidence-timelines-2026-10-08.json');
const fiplan=read('data/investigation/fm02-fiplan-primary-rows-2026-10-08.json');
const originals=read('data/investigation/fm03-pncp-official-snapshots-2026-10-08.json');
const pncp=read('data/investigation/fm03-pncp-item-history-evidence-2026-10-08.json');
const linked=read('data/investigation/fm03-pncp-linked-contracts-2026-10-08.json');
assert.equal(idx.counts.cases,4);
assert.equal(idx.counts.statePayments,4);
assert.equal(idx.counts.pncpDetails,2);
assert.equal(idx.counts.pncpHistory,5);
assert.equal(idx.counts.pncpItemSnapshots,2);
assert.equal(idx.counts.noContentOrHttpErrors,4);
assert.equal(idx.counts.independentMunicipalRevenueCorroborations,1);
assert.equal(idx.counts.supplierPayments,0);
assert.equal(idx.counts.centralCEAdded,0);
assert.equal(new Set(idx.timelines.flatMap(x=>x.events.map(e=>e.id))).size,idx.counts.events);
for(const file of idx.casePaths){
 const t=read(file.path);
 assert.deepEqual(t,idx.timelines.find(x=>x.caseId===file.caseId));
 const pay=fiplan.records.find(x=>x.caseId===file.caseId);
 const pe=t.events.find(e=>e.kind==='verified_financial_record');
 assert.equal(pe.amountBRL,pay.paymentValueBRL);
 assert.equal(pe.recordKeys.nob,pay.paymentNobFormatted);
 assert.equal(pe.source.sha256,fiplan.source.sha256Gzip);
 assert.equal(pe.occurredOn,pay.paymentDateDDMMYYYY.split('/').reverse().join('-'));
 assert(t.events.every(e=>e.criminalInference===false));
 assert(t.events.every(e=>!e.source.sha256||/^[0-9a-f]{64}$/.test(e.source.sha256)));
 const original=originals.entries.find(x=>x.caseId===file.caseId);
 if(!original)continue;
 const source=pncp.batches.find(x=>x.caseId===file.caseId);
 const link=linked.targets.find(x=>x.caseId===file.caseId);
 const publication=t.events.find(e=>e.kind==='pncp_procurement_publication');
 assert.equal(publication.amountBRL,original.estimatedValueBRL);
 assert.equal(publication.source.sha256,original.sourceSha256);
 assert.equal(publication.occurredAt,original.publicationDateTime);
 assert(existsSync(publication.source.path));
 const detail=read(publication.source.path);
 assert.equal(detail.numeroControlePNCP,original.pncpControlNumber);
 assert.equal(detail.valorTotalEstimado,publication.amountBRL);
 const history=read(source.history.source.rawSnapshotPath);
 for(const event of t.events.filter(e=>e.kind==='pncp_history_event')){
  const raw=history[event.recordKeys.historyIndex];
  assert.equal(raw.logManutencaoDataInclusao,event.occurredAt);
  assert.equal(raw.documentoTitulo,event.recordKeys.documentTitle);
 }
 const itemEvents=t.events.filter(e=>e.kind==='pncp_item_snapshot');
 const items=read(source.items.source.rawSnapshotPath);
 for(const event of itemEvents){
  const raw=items.find(i=>i.numeroItem===event.recordKeys.itemNumber);
  assert.equal(raw.valorTotal,event.amountBRL);
  assert.equal(raw.temResultado,event.recordKeys.itemHasResultInSnapshot);
 }
 assert(t.events.some(e=>e.kind==='pncp_http_receipt'&&e.recordKeys.httpStatus===204));
 assert(t.events.some(e=>e.kind==='pncp_http_receipt'&&e.recordKeys.httpStatus===400));
 assert.equal(link.capture.available,false);
}
assert.equal(idx.counts.events,idx.timelines.reduce((n,t)=>n+t.events.length,0));
console.log('PASS FM-03 timelines: 4/4 cases, '+idx.counts.events+' source-linked events, no invented supplier, status or criminal conclusion.');
