import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const registry=read('data/investigation/fm03-pncp-items-history-watch-2026-10-08.json');
const targets=read('preservation/targets.json').targets;
const originals=read('data/investigation/fm03-pncp-official-snapshots-2026-10-08.json');
assert.equal(registry.accessPoints.length,4);
assert.equal(new Set(registry.accessPoints.map(x=>x.id)).size,4);
assert.equal(new Set(registry.accessPoints.map(x=>x.caseId)).size,2);
assert.equal(registry.metrics.verifiedSupplierPayments,0);
assert.equal(registry.metrics.newCentralCE,0);
assert.equal(registry.sourceMonitor.followUpItemResultLookup,'defer_until_item_numbers_verified_in_official_items_response');
for(const q of registry.accessPoints){
  const target=targets.find(t=>t.id===q.id);
  assert(target, 'Target missing '+q.id);
  assert.equal(target.url,q.sourceUrl);
  assert.equal(target.preserveRaw,true);
  assert(target.maxRawBytes<=2000000);
  assert(/^https:\/\/pncp\.gov\.br\/api\/pncp\/v1\/orgaos\/\d{14}\/compras\/2026\/\d+\/(itens|historico)$/.test(q.sourceUrl));
  assert.equal(q.originalBytesPreserved,false);
  assert.equal(q.sha256,null);
  assert(originals.entries.some(e=>e.caseId===q.caseId));
}
console.log('PASS FM-03 PNCP follow-up: 4 official GET targets, 2 cases, no inferred supplier payment or unverified item result.');
