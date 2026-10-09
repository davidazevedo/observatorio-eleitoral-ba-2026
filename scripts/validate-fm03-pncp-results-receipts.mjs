import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(readFileSync(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const index=read('data/investigation/fm03-pncp-item-results-receipts-2026-10-08.json');
const src=read('data/investigation/fm03-pncp-item-history-evidence-2026-10-08.json');
assert.equal(index.receipts.length,2);
assert.equal(index.newCentralCE,0);
assert.equal(index.verifiedSupplierPayments,0);
assert.equal(index.officialResultsReturnedWithData,0);
for(const r of index.receipts){
 const item=read(r.path),manifest=read(item.manifestPath);
 const history=manifest.history.find(h=>h.rawPath===r.rawCapturePath&&h.sha256===r.sha256);
 assert(history&&history.httpStatus===204&&history.available===true);
 const bytes=readFileSync(r.rawCapturePath);
 assert.equal(bytes.length,0);
 assert.equal(sha(bytes),'e3b0c44298fc1c149afbf4c8996fb934ca495991b7852b855');
 assert.equal(item.httpStatus,204);
 assert.equal(item.bodyBytes,0);
 assert.equal(item.resultRecordsObserved,null);
 assert.equal(item.supplierPaymentVerified,false);
 assert.equal(item.newCentralCE,false);
 const q=src.batches.find(x=>x.caseId===r.caseId)?.resultQuery;
 assert(q&&q.httpStatus===204&&q.resultRecordsAvailableToAnalyze===false);
}
assert.equal(src.counts.resultQueriesCollected,2);
assert.equal(src.counts.resultQueriesWithHttp204,2);
console.log('PASS FM-03 PNCP results: 2 archived HTTP 204 zero-byte responses with SHA; no invented award, supplier payment, or new CE.');
