import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync,readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const sha=v=>createHash('sha256').update(v).digest('hex');
const targets=[
 'fm02-lajedo-sudesb-term','fm02-aracas-sudesb-term','fm02-sudesb-equipamentos-index',
 'fm02-lajedo-pncp-detail','fm02-aracas-pncp-detail','fm02-belo-campo-previa',
 'fm02-belo-campo-pos','fm02-jaguaquara-receita'
];
let archived=0,hashOnly=0,failed=0;
for (const id of targets){
 const m=read('preservation/manifests/'+id+'.json'),last=m.history.at(-1);
 assert.equal(m.sourceId,id);assert(last,'missing latest collection event '+id);
 if (!last.available) {assert(last.error,'failed source needs error: '+id);failed++;continue;}
 assert(/^[a-f0-9]{64}$/.test(last.sha256),'missing 64-char digest '+id);
 if(last.rawPreserved){
  assert(last.rawPath&&existsSync(last.rawPath),'missing stored bytes '+id);
  const raw=readFileSync(last.rawPath);
  assert.equal(raw.length,last.size,'file size mismatched '+id);
  assert.equal(sha(raw),last.sha256,'file digest mismatch '+id);
  archived++;
 } else {
  assert(!last.rawPath,'hash-only record improperly has rawPath '+id);
  hashOnly++;
 }
}
console.log('PASS FM-02 archives: '+archived+' raw SHA matches, '+hashOnly+' hash-only, '+failed+' failed with reason (8 tracked sources).');
