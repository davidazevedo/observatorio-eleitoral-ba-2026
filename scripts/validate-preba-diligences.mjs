import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read=(path)=>JSON.parse(readFileSync(path,'utf8'));
const index=read('data/investigation/preba-packages-index-2026-10-07.json');
const tracker=read('data/investigation/preba-diligence-tracker-2026-10-08.json');
assert.equal(tracker.schemaVersion,1);
assert.equal(tracker.requests.length,20);
assert.equal(new Set(tracker.requests.map(r=>r.requestId)).size,tracker.requests.length);
assert.equal(index.packages.length,4);
const ids=new Set(index.packages.map(p=>p.packageId));
const statuses=new Set(tracker.statuses);
const gates=new Set(tracker.gateStates);
for(const p of index.packages) assert.equal(p.protocolReady,false,'Package must remain gated: '+p.packageId);
for(const r of tracker.requests){
  assert.ok(ids.has(r.packageId),'Unknown package '+r.packageId);
  assert.ok(statuses.has(r.status),'Invalid state '+r.requestId);
  assert.equal(r.status,'not_requested','Unexpected solicitation status');
  assert.equal(r.requestSentAt,null);
  assert.equal(r.responseReceivedAt,null);
  assert.equal(r.artifactSha256,null);
  assert.equal(Object.keys(r.gates).length,7);
  for(const [key,value] of Object.entries(r.gates)){
    assert.match(key,/^G[0-6]$/);
    assert.ok(gates.has(value));
    assert.equal(value,'pending');
  }
}
const client=readFileSync('app/privado/PrivateDashboardClient.tsx','utf8');
const server=readFileSync('lib/private-data.ts','utf8');
const page=readFileSync('app/privado/page.tsx','utf8');
assert.ok(server.includes('prebaDiligenceTracker,'));
assert.ok(client.includes("id: 'diligences'"));
assert.ok(client.includes("tab === 'diligences'"));
assert.ok(client.includes('Controle documental de diligências PRE-BA'));
assert.ok(page.includes('verifyPrivateSessionToken(token)'));
assert.ok(page.includes("redirect('/privado/login')"));
console.log('PASS PRE-BA 6C: 20 unique requests, four known packages, seven pending gates, read-only cockpit wired, authenticated page preserved.');
