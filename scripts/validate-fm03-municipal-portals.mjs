import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=p=>JSON.parse(readFileSync(p,'utf8'));
const reg=load('data/investigation/fm03-municipal-source-register-2026-10-08.json');
const targets=load('preservation/targets.json').targets;
const chain=load('data/investigation/fm03-financial-chain-baseline-2026-10-08.json');
assert.equal(reg.sources.length,9);
const qa=load('data/investigation/fm03-source-capture-quality-2026-10-08.json');
assert.equal(qa.count.registered,9);
assert.equal(qa.count.receivedHttp200,9);
assert.equal(qa.count.semanticValidations,0);
assert.equal(qa.count.verifiedMunicipalSupplierPayments,0);
assert.equal(qa.count.newCentralEvidenceIds,0);
assert(qa.count.crossDomainDuplicatedSources>=4,'Cross-domain generic response signal missing');
for(const capture of qa.captures){
 const source=reg.sources.find(x=>x.id===capture.id);
 assert(source&&source.preservation.sha256===capture.sha256);
 const archive=load(source.preservation.githubManifestPath);
 assert(archive.history.some(h=>h.sha256===capture.sha256&&h.available===true));
 assert.equal(capture.rawContentPreservedInPublicGit,false);
}

assert.equal(reg.totalMunicipalities,4);
assert.equal(reg.cases.length,4);
assert.equal(reg.newCentralCE,0);
assert.equal(reg.verifiedSupplierPaymentsFoundInThisStage,0);
assert.equal(new Set(reg.sources.map(x=>x.id)).size,9);
assert.equal(new Set(reg.sources.map(x=>x.caseId)).size,4);
for(const source of reg.sources){
 assert(/^https:\/\//.test(source.url));
 const target=targets.find(x=>x.id===source.preservation.targetId);
 assert(target,'Missing automatic target '+source.id);
 assert.equal(target.url,source.url);
 assert.equal(target.preserveRaw,false,'Protected finance portal may not be duplicated into public Git');
 assert.equal(source.supplierPaymentVerified,false);
 assert.equal(source.notASeparateCentralEvidence,true);
 assert.deepEqual(load('data/evidence/fm03/municipal-portals/'+source.id+'.json'),source);
}
assert.equal(chain.counting.verifiedSupplierPayments,0);
assert.equal(chain.counting.chains,4);
for(const item of reg.cases){
 assert(item.associatedPortalIds.length>0);
 assert.equal(item.requestStatus,'draft_prepared_not_submitted');
 assert.equal(item.proofStatus,'no_new_verified_municipal_spending');
}
console.log('PASS FM-03 portal registry: 9 sources/4 cases; safe metadata-only capture, 4 draft requests, 0 fictional supplier payments.');
