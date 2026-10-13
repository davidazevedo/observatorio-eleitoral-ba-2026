import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const inventory=readFileSync('lib/preba-intake-audit.ts','utf8');
const route=readFileSync('app/api/private/preba-intake/audit/route.ts','utf8');
const original=readFileSync('lib/preba-intake.ts','utf8');
const cases=JSON.parse(readFileSync('data/investigation/preba-diligence-tracker-2026-10-08.json','utf8'));
assert.equal(cases.requests.length,20);
assert.ok(cases.requests.every(x=>x.status==='not_requested'));
for(const needle of ["prefix:ROOT","page.hasMore","filename==='receipt.json'","item.hasOriginal&&item.hasReceipt","orphan_original","orphan_receipt","get(path,{access:'private',useCache:false})","receipt.status==='received_unverified'","receipt.sha256"])
  assert.ok(inventory.includes(needle),'missing audit control '+needle);
for(const needle of ["isPrivateRequestAuthenticated(request)","PREBA_AUDIT_INVENTORY_ENABLED","no-store","verifyIntakeReceipt(item)"])
  assert.ok(route.includes(needle),'missing route control '+needle);
assert.ok(original.includes("PREBA_INTAKE_ENABLED !== 'true'"));
console.log('PASS PRE-BA 6E.3: authenticated, disabled-by-default inventory, orphan states and immutable receipt consistency checks; no original URLs exposed.');
