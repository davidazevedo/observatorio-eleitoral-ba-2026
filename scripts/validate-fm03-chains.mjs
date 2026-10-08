import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const idx=read('data/investigation/fm03-financial-chain-baseline-2026-10-08.json');
const base=read('data/investigation/fm02-fiplan-primary-rows-2026-10-08.json');
assert.equal(idx.chains.length,4);
assert.equal(new Set(idx.chains.map(x=>x.caseId)).size,4);
let sum=0,revenue=0;
for (const row of idx.caseFiles){
 const file=read(row.path),item=idx.chains.find(x=>x.caseId===row.caseId);
 assert.deepEqual(file,item);
 const original=base.records.find(x=>x.caseId===item.caseId);
 assert.equal(item.bankOrder,original.paymentNobFormatted);
 assert.equal(item.observedStateDisbursementBRL,original.paymentValueBRL);
 assert.equal(item.integrity.sourceCsvGzipSha256,base.source.sha256Gzip);
 assert.equal(item.steps.length,5);
 assert.equal(item.steps[0].state,'verified_primary_extract');
 assert.equal(item.steps[0].sourcePath,base.source.path);
 for(const missing of item.steps.slice(2)){
  assert.equal(missing.state,'not_documented');
  assert.equal(missing.amountBRL,null);
 }
 if(item.steps[1].state==='corroborated_public_revenue_label')revenue++;
 sum+=item.observedStateDisbursementBRL;
}
assert.equal(revenue,1);
assert.equal(idx.counting.bankIngressFullyReconciled,0);
assert.equal(idx.counting.verifiedSupplierPayments,0);
assert.equal(idx.counting.newCentralCE,0);
assert.equal(Number(sum.toFixed(2)),idx.counting.totalStateDisbursementsBRL);
console.log('PASS FM-03 4 chains from FIPLAN, 1 municipal revenue label, 0 unverified supplier edges or new CE.');
