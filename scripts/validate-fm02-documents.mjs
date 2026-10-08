import fs from 'node:fs';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const readJSON=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const a=readJSON('data/investigation/fm02-fiplan-primary-rows-2026-10-08.json');
const register=readJSON('data/investigation/fm02-documentary-ledger-2026-10-08.json');
const gz=fs.readFileSync(a.source.path);
const sha=data=>createHash('sha256').update(data).digest('hex');
assert.equal(sha(gz),a.source.sha256Gzip,'SHA gzip FIPLAN divergente');
const decoded=gunzipSync(gz);
assert.equal(sha(decoded),a.source.sha256Uncompressed,'SHA texto FIPLAN divergente');
const lines=decoded.toString('utf8').replace(/^\uFEFF/,'').trim().split(/\r?\n/);
const header=lines[0].split(';');
const rows=lines.slice(1).map(line=>Object.fromEntries(header.map((k,i)=>[k,line.split(';')[i]])));
assert.equal(rows.length,a.source.totalSourceRows);
assert.equal(a.records.length,4);
assert.equal(register.cases.length,4);
assert.equal(register.totalFinancialPrimaryRows,4);
assert.equal(register.totalSourceReferences, register.sources.length);
for(const record of a.records){
 const row=rows.find(r=>r.num_instrumento_orcamento===record.instrumentRaw);
 assert(row,'Instrumento não localizado: '+record.instrumentRaw);
 for(const [key,value] of Object.entries(record.sourceRow)){
   assert.equal(row[key],value,'Incompatibilidade '+record.caseId+' campo '+key);
 }
 assert.equal(record.paymentNobRaw,row.num_pagto_nob);
 assert.equal(record.paymentNobFormatted,row['Nº do Pagamento Formatado']);
 assert.equal(record.paymentValueBRL, Number(row.val_pagto_nob.replace(',','.')));
 const aCase=register.cases.find(x=>x.caseId===record.caseId);
 assert(aCase,'Caso FM02 ausente: '+record.caseId);
 assert.equal(aCase.primaryFiplanSliceId,record.evidenceSliceId);
}
assert.equal(new Set(register.sources.map(s=>s.sourceId)).size,register.sources.length);
assert.equal(register.verifiedSourceArchiveInThisStage.externalOfficialPdfBinaryCount,0);
console.log('PASS FM-02: arquivo FIPLAN SHA-256 duplo, 51 linhas, 4 extratos originais conferidos; 4 casos e fontes consistentes.');
