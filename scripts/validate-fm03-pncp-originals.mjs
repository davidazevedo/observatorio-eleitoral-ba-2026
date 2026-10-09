import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(readFileSync(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const idx=read('data/investigation/fm03-pncp-official-snapshots-2026-10-08.json');
assert.equal(idx.count,2);assert.equal(idx.newCentralCE,0);
for(const ref of idx.entries){
 const original=readFileSync(ref.rawSnapshotPath),data=JSON.parse(original);
 assert.equal(sha(original),ref.sourceSha256);
 assert.equal(original.length,ref.contentByteSize);
 assert.equal(data.numeroControlePNCP,ref.pncpControlNumber);
 assert.equal(data.valorTotalEstimado,ref.estimatedValueBRL);
 assert.equal(data.dataPublicacaoPncp,ref.publicationDateTime);
 assert.equal(data.existeResultado,false);
 assert.equal(data.valorTotalHomologado,null);
 assert.equal(ref.supplierPaymentVerified,false);
 assert.equal(ref.factStatus,'verified_official_procurement_publication_only');
 const file=read('data/evidence/fm03/procurement/'+ref.id+'.json');assert.deepEqual(file,ref);
 const man=read(ref.sourceManifestPath);assert(man.history.some(h=>h.rawPath===ref.rawSnapshotPath&&h.sha256===ref.sourceSha256));
}
console.log('PASS FM-03 PNCP: 2 raw official JSON snapshots hashed and linked; result-not-reported does NOT imply no award or supplier payment.');
