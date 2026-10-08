import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const idx=read('data/evidence/fm02/index-2026-10-08.json');
const primary=read('data/investigation/fm02-fiplan-primary-rows-2026-10-08.json');
const ledger=read('data/investigation/fm02-documentary-ledger-2026-10-08.json');
assert.equal(idx.entries.length,19);
assert.equal(idx.countPrimaryRows,4);
assert.equal(idx.countSourceReferences,15);
assert.equal(idx.countNewCentralCE,0);
assert.equal(new Set(idx.entries.map(e=>e.id)).size,19);
for (const ref of idx.entries){
 const v=read(ref.path);
 assert.equal(v.itemId,ref.id);
 if(ref.kind==='original_filtered_payment_row'){
  assert.deepEqual(v.fact,primary.records.find(r=>r.evidenceSliceId===ref.id));
  assert.equal(v.sourceGzipSha256,primary.source.sha256Gzip);
 }else{
  assert.deepEqual(v.source,ledger.sources.find(x=>x.sourceId===ref.id));
  assert.equal(v.rawBytesInThisFile,false);
 }
}
console.log('PASS FM-02 individual provenance: 4 primary payment slices + 15 source references with stable IDs and no inflated CE count.');
