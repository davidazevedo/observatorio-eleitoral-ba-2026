import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const tracker = JSON.parse(readFileSync('data/investigation/preba-diligence-tracker-2026-10-08.json', 'utf8'));
const source = readFileSync('lib/preba-intake.ts', 'utf8');
const route = readFileSync('app/api/private/preba-intake/route.ts', 'utf8');
const packages = JSON.parse(readFileSync('data/investigation/preba-packages-index-2026-10-07.json', 'utf8'));

assert.equal(tracker.requests.length, 20);
assert.ok(tracker.requests.every(item => item.status === 'not_requested'));
assert.ok(packages.packages.every(item => item.protocolReady === false));

const requiredControls = [
  [route, 'isPrivateRequestAuthenticated(request)'],
  [route, "origin !== new URL(request.url).origin"],
  [route, 'MAX_REQUEST_BYTES'],
  [route, 'upload.size>8*1024*1024'],
  [source, "request.status !== 'requested'"],
  [source, "process.env.PREBA_INTAKE_ENABLED !== 'true'"],
  [source, "process.env.BLOB_READ_WRITE_TOKEN"],
  [source, 'typeFromBytes(input.bytes)'],
  [source, 'request.packageId !== input.packageId'],
  [source, "createHash('sha256')"],
  [source, "access:'private'"],
  [source, 'allowOverwrite:false'],
  [source, "status:'received_unverified'"],
  [source, "humanReview:'pending'"],
  [source, 'protocolReady:false'],
];
for (const [content, invariant] of requiredControls) {
  assert.ok(content.includes(invariant), 'Missing invariant: ' + invariant);
}
assert.ok(!route.includes('document.url'));
console.log('PASS PRE-BA 6E: baseline 20 unrequested requests, protocol closed, intake fails closed and private quarantine controls present.');
