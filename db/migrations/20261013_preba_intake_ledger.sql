-- PRE-BA 6E.3: PostgreSQL transactional ledger. Migration only; runtime adapter not enabled.
-- Never store original document bytes or secrets in this database.
BEGIN;
CREATE TABLE IF NOT EXISTS preba_intake_operations (
  operation_id uuid PRIMARY KEY,
  request_id text NOT NULL,
  package_id text NOT NULL,
  actor_id text NOT NULL,
  document_sha256 char(64) NOT NULL CHECK (document_sha256 ~ '^[a-f0-9]{64}$'),
  storage_path text UNIQUE,
  status text NOT NULL DEFAULT 'reserved'
    CHECK (status IN ('reserved','stored','quarantined','failed','recovery_required')),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK (length(actor_id) BETWEEN 6 AND 64)
);
CREATE TABLE IF NOT EXISTS preba_intake_events (
  event_seq bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  operation_id uuid NOT NULL REFERENCES preba_intake_operations(operation_id),
  event_type text NOT NULL
    CHECK (event_type IN ('reserved','object_written','receipt_written','quarantined','failed','recovery_required','reconciled')),
  actor_id text NOT NULL,
  event_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  previous_hash char(64),
  event_hash char(64) NOT NULL CHECK (event_hash ~ '^[a-f0-9]{64}$'),
  UNIQUE(operation_id,event_hash)
);
CREATE INDEX IF NOT EXISTS idx_preba_intake_events_operation_seq ON preba_intake_events(operation_id,event_seq);
CREATE INDEX IF NOT EXISTS idx_preba_intake_operations_status ON preba_intake_operations(status,created_at);
-- Append-only enforcement. No UPDATE or DELETE on events, including by application role.
CREATE OR REPLACE FUNCTION preba_reject_audit_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'PREBA audit events are append-only';
END;
$$;
DROP TRIGGER IF EXISTS preba_audit_immutable ON preba_intake_events;
CREATE TRIGGER preba_audit_immutable BEFORE UPDATE OR DELETE ON preba_intake_events
  FOR EACH ROW EXECUTE FUNCTION preba_reject_audit_mutation();
COMMIT;
