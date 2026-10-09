import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const tracker=JSON.parse(readFileSync('data/investigation/preba-diligence-tracker-2026-10-08.json','utf8'));
const packageIndex=JSON.parse(readFileSync('data/investigation/preba-packages-index-2026-10-07.json','utf8'));
const ids=new Set(tracker.requests.map(x=>x.requestId));
const packages=new Set(packageIndex.packages.map(x=>x.packageId));
const allowedKinds=new Set(['requested','received','gate_reviewed','rejected','not_located','not_applicable']);
const allowedGates=new Set(['G0','G1','G2','G3','G4','G5','G6']);
function canonical(v) {
  if (Array.isArray(v)) return '['+v.map(canonical).join(',')+']';
  if (v!==null && typeof v==='object') return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';
  return JSON.stringify(v);
}
function digest(body){return createHash('sha256').update(canonical(body)).digest('hex');}
function validateEvents(events) {
  assert.ok(Array.isArray(events));
  const seenIds=new Map(), lastHash=new Map(), phases=new Map();
  for(const event of events) {
    assert.ok(ids.has(event.requestId),'unknown request');
    assert.ok(packages.has(event.packageId),'unknown package');
    assert.equal(tracker.requests.find(r=>r.requestId===event.requestId).packageId,event.packageId,'cross-package link');
    assert.ok(allowedKinds.has(event.kind),'unknown event kind');
    assert.match(event.eventId,/^[A-Za-z0-9:_-]{8,128}$/);
    assert.ok(event.actorId && event.reason && Number.isFinite(Date.parse(event.createdAt)));
    const {eventHash,...body}=event;
    assert.equal(eventHash,digest(body),'tampered event hash');
    const original=seenIds.get(event.eventId);
    if(original) {assert.equal(original,eventHash,'event ID collision'); continue;}
    seenIds.set(event.eventId,eventHash);
    assert.equal(event.previousEventHash??null,lastHash.get(event.requestId)??null,'broken chain');
    const phase=phases.get(event.requestId)??'not_requested';
    if(event.kind==='requested') assert.equal(phase,'not_requested','invalid request transition');
    if(event.kind==='received') {
      assert.equal(phase,'requested','unrequested receipt');
      assert.match(event.sha256,/^[a-f0-9]{64}$/);
      assert.ok(event.blobPath && event.mimeType && event.sizeBytes>0 && event.retrievedAt && event.publisher);
    }
    if(event.kind==='gate_reviewed') {
      assert.ok(['received_unverified','verified'].includes(phase),'review before receipt');
      assert.ok(allowedGates.has(event.gate) && ['pass','fail','not_applicable'].includes(event.decision) && event.reviewerId);
    }
    if(event.kind==='requested') phases.set(event.requestId,'requested');
    if(event.kind==='received') phases.set(event.requestId,'received_unverified');
    if(event.kind==='rejected') phases.set(event.requestId,'rejected');
    if(event.kind==='not_located') phases.set(event.requestId,'not_located');
    if(event.kind==='not_applicable') phases.set(event.requestId,'not_applicable');
    lastHash.set(event.requestId,eventHash);
  }
  return {events:seenIds.size,requests:phases.size};
}
const valid=[
  {eventId:'event-request-001',requestId:'LAJ-01',packageId:'PREBA-01-LAJEDO-TABOCAL-2026',kind:'requested',createdAt:'2026-10-08T20:00:00Z',actorId:'qa',reason:'fixture only',previousEventHash:null}
];
valid[0].eventHash=digest(valid[0]);
assert.deepEqual(validateEvents(valid),{events:1,requests:1});
function fails(fn){assert.throws(fn);}
fails(()=>validateEvents([{...valid[0],reason:'tampered'}]));
const wrongPackage={...valid[0],packageId:'PREBA-02-BELO-CAMPO-2026'};
const {eventHash:ignoredHash,...wrongBody}=wrongPackage;
wrongPackage.eventHash=digest(wrongBody);
fails(()=>validateEvents([wrongPackage]));
const unrequested={eventId:'event-receipt-001',requestId:'LAJ-02',packageId:'PREBA-01-LAJEDO-TABOCAL-2026',kind:'received',createdAt:'2026-10-08T21:00:00Z',actorId:'qa',reason:'fixture only',previousEventHash:null,sha256:'a'.repeat(64),blobPath:'private/example',mimeType:'application/pdf',sizeBytes:100,retrievedAt:'2026-10-08T20:59:00Z',publisher:'qa'};
unrequested.eventHash=digest(unrequested);
fails(()=>validateEvents([unrequested]));
assert.ok(packageIndex.packages.every(p=>p.protocolReady===false),'protocol flags must remain closed');
console.log('PASS PRE-BA 6D: deterministic fixture, hash tampering rejected, cross-package mismatch rejected, unsolicited evidence rejected; no real events written.');
