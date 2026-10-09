import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const r=read('data/investigation/fm03-pncp-linked-contracts-2026-10-08.json');
const originals=read('data/investigation/fm03-pncp-official-snapshots-2026-10-08.json');
const targets=read('preservation/targets.json').targets;
assert.equal(r.targets.length,2);
assert.equal(r.counts.verifiedSupplierPayments,0);
assert.equal(r.counts.newCentralCE,0);
assert.equal(new Set(r.targets.map(x=>x.caseId)).size,2);
for(const row of r.targets){
 assert(row.source.endpoint===`https://pncp.gov.br/api/pncp/v1/orgaos/${row.source.cnpjOrgao}/contratos/contratacao/${row.source.anoContratacao}/${row.source.sequencialContratacao}`);
 const target=targets.find(t=>t.id===row.source.targetId);
 assert(target&&target.url===row.source.endpoint&&target.preserveRaw===true);
 assert(originals.entries.some(e=>e.caseId===row.caseId&&e.pncpControlNumber===row.pncpControlNumber));
 assert.deepEqual(read(`data/evidence/fm03/procurement/${row.id}.json`),row);
 assert.equal(row.resultEvidence.verifiedFinancialDisbursements,0);
}
console.log('PASS FM-03 linked contracts: 2 official PNCP contract endpoints match canonical procurement IDs; no unverified supplier payments or new CE.');
