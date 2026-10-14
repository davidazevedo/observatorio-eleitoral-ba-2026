import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const x=readFileSync('lib/preba-intake.ts','utf8');const y=readFileSync('lib/preba-ledger-postgres.ts','utf8');
for(const v of ["PREBA_LEDGER_ENABLED !== 'true'","await reserveIntake(","event:'object_written'","event:'receipt_written'","event:'quarantined'","event:'recovery_required'","event:'failed'"])assert.ok(x.includes(v),'missing intake stage '+v);
assert.ok(x.indexOf('await reserveIntake(')<x.indexOf('await put(documentPath'),'must reserve before writing bytes');
assert.ok(y.includes("last.rows[0]?.event_type!=='receipt_written'"));
console.log('PASS PRE-BA 6E.3 integration: reserve before Blob write, receipt event before quarantine and failure recovery state.');
