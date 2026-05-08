-- Territory Command migration 0007 — admin audit log.

BEGIN;

CREATE TABLE IF NOT EXISTS territory.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL CHECK (action_type IN (
    'postcode_price_change',
    'postcode_tier_change',
    'postcode_promotion_start',
    'postcode_promotion_expire',
    'postcode_promotion_cancel',
    'postcode_promotion_edit_copy',
    'postcode_active_change',
    'sector_toggle_active',
    'sector_toggle_featured',
    'application_status_change',
    'waitlist_notify',
    'waitlist_remove'
  )),
  entity_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  performed_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at
  ON territory.admin_audit_log (created_at DESC);

COMMIT;
