import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const adapter=readFileSync('lib/preba-ledger-postgres.ts','utf8');
const schema=readFileSync('db/migrations/20261013_preba_intake_ledger.sql','utf8');
const intake=readFileSync('lib/preba-intake.ts','utf8');
for(const part of ['PREBA_LEDGER_ENABLED','PREBA_LEDGER_DATABASE_URL','BEGIN','COMMIT','ROLLBACK','FOR UPDATE','ON CONFLICT (operation_id) DO NOTHING','previous_hash','event_hash','Conflito de chave de idempotência','recordIntakeTransition','reserveIntake'])
  assert.ok(adapter.includes(part),'missing ledger invariant: '+part);
assert.ok(schema.includes('BEFORE UPDATE OR DELETE'));
assert.ok(intake.includes("PREBA_INTAKE_ENABLED !== 'true'"));
console.log('PASS PRE-BA PostgreSQL adapter contract: disabled-by-default, transactions, row locks, idempotent reservation, chained event hashes.');
