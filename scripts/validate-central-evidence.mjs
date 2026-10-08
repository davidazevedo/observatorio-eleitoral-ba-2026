import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { join } from 'node:path';

const root=process.cwd();
const read=path=>JSON.parse(readFileSync(join(root,path),'utf8'));
const index=read('data/evidence/central/index-2026-10-08.json');
const waves=[
  'preservation/manifests/central-evidence-wave-01-50.json',
  'preservation/manifests/central-evidence-wave-02-critical-p0.json',
  'preservation/manifests/central-evidence-wave-03-aracas-jaguaquara.json',
];
const original=new Map();
const refs=new Map();
for(const path of waves){
  const manifest=read(path);
  for(const item of manifest.items){
    assert(!original.has(item.id), 'Duplicate original CE: '+item.id);
    original.set(item.id,item);
    refs.set(item.id,path);
  }
}
assert.equal(original.size,57);
assert.equal(index.entries.length,57);
assert.equal(index.totalUniqueFacts,57);
assert.equal(new Set(index.entries.map(item=>item.evidenceId)).size,57);
for(let n=1;n<=57;n++){
  const id='CE-'+String(n).padStart(3,'0');
  const entry=index.entries.find(item=>item.evidenceId===id);
  assert(entry,'Missing index '+id);
  assert.equal(entry.canonicalPath,'data/evidence/central/'+id+'.json');
  const file=read(entry.canonicalPath);
  assert.deepEqual(file,entry,'Independent file differs from registry: '+id);
  assert.deepEqual(file.documentedFact,original.get(id),'Manifest fact mutated: '+id);
  assert.equal(file.provenance.sourceManifestPath,refs.get(id));
  assert.match(file.provenance.sourceManifestGitBlobSha,/^[a-f0-9]{40}$/);
  assert.equal(file.provenance.originalDocumentBundledHere,false);
  assert.equal(file.analysis.criminalConclusion,'none');
  assert.equal(file.analysis.campaignFundingConclusion,'none');
}
console.log('PASS: 57/57 CE unique, source manifests intact, 57 individual files match index, no criminal conclusion.');
