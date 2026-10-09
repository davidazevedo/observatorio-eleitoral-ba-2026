import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(readFileSync(p,'utf8')),sha=x=>createHash('sha256').update(x).digest('hex');
const r=read('data/investigation/fm03-pncp-item-history-evidence-2026-10-08.json');
const watch=read('data/investigation/fm03-pncp-items-history-watch-2026-10-08.json');
const targets=read('preservation/targets.json').targets;
assert.equal(r.counts.originalDocumentsVerifiedByManifest,4);
assert.equal(r.counts.itemsFound,2);assert.equal(r.counts.historyEventsFound,5);
assert.equal(r.counts.resultQueriesRegistered,2);assert.equal(r.counts.supplierPaymentsProven,0);
assert.equal(r.counts.newCentralCE,0);
for(const batch of r.batches){
 for(const a of [batch.items,batch.history]){
  const b=readFileSync(a.source.rawSnapshotPath);
  assert.equal(b.length,a.source.byteLength);
  assert.equal(sha(b),a.source.sha256);
  const parsed=JSON.parse(b);assert.equal(parsed.length,a.count);
  assert.deepEqual(read(a.path).normalizedFacts,a.normalizedFacts);
  const manifest=read(a.source.manifestPath);
  assert(manifest.history.some(h=>h.sha256===a.source.sha256 && h.rawPath===a.source.rawSnapshotPath));
 }
 const original=JSON.parse(readFileSync(batch.items.source.rawSnapshotPath,'utf8'));
 assert.deepEqual(original.map(x=>x.numeroItem),batch.itemNumbersVerified);
 assert.deepEqual(batch.itemNumbersVerified,[1]);
 const target=targets.find(x=>x.id===batch.resultQuery.targetId);
 assert(target);
 assert.equal(target.url,batch.resultQuery.url);
 assert.equal(target.preserveRaw,true);
 assert(batch.resultQuery.url.endsWith('/itens/1/resultados'));
}
assert.equal(watch.metrics.itemsObtained,2);
assert.equal(watch.metrics.historyResponsesObtained,5);
console.log('PASS FM-03 PNCP items/history: 4 SHA-256 verified raw originals; 2 item IDs; 5 historical events; 2 follow-up result queries, no supplier payment.');
