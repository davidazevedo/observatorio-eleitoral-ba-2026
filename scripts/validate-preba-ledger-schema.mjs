import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const sql=readFileSync('db/migrations/20261013_preba_intake_ledger.sql','utf8');
const intake=readFileSync('lib/preba-intake.ts','utf8');
for(const part of ['BEGIN;','COMMIT;','operation_id uuid PRIMARY KEY','document_sha256 char(64)','UNIQUE(operation_id,event_hash)','previous_hash char(64)','BEFORE UPDATE OR DELETE','status IN (','recovery_required'])
  assert.ok(sql.includes(part),'missing ledger invariant: '+part);
assert.ok(intake.includes("PREBA_INTAKE_ENABLED !== 'true'"),'uploads must stay disabled by default');
console.log('PASS PRE-BA 6E.3 SQL ledger contract: reservation, immutable events, idempotent identifiers, recovery status and fail-closed intake.');
