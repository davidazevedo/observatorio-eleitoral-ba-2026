import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const registry=read('data/investigation/fm03-pncp-linked-contracts-2026-10-08.json');
const receipt=read('data/investigation/fm03-pncp-linked-contracts-http400-2026-10-08.json');
assert.equal(registry.targets.length,2);
assert.equal(registry.counts.officialHttp400,2);
assert.equal(receipt.responseStates.length,2);
assert.equal(receipt.outcomes.linkedContractsIdentified,0);
assert.equal(receipt.outcomes.supplierPaymentsVerified,0);
for(const e of registry.targets){
 const m=read(e.source.expectedManifest);
 const h=m.history.find(v=>v.retrievedAt===e.capture.retrievedAtUTC&&v.error===e.capture.httpError);
 assert(h&&h.available===false);
 assert.match(h.error,/HTTP Error 400/);
 assert.equal(e.status,'http_400_no_official_contract_payload_at_capture');
 assert.equal(e.resultEvidence.bodySha256,null);
 assert.equal(e.resultEvidence.verifiedFinancialDisbursements,0);
 assert.deepEqual(read('data/evidence/fm03/procurement/'+e.id+'.json'),e);
}
console.log('PASS FM-03 PNCP contracts: 2 recorded HTTP 400 with manifest linkage, no hallucinated contract, supplier or payment.');
