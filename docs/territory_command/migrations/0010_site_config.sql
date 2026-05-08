-- Territory Command migration 0010 — site-wide /territory banner (singleton) + audit types.
-- Run after 0009. Idempotent where possible.

BEGIN;

CREATE TABLE IF NOT EXISTS territory.site_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  banner_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  banner_headline TEXT,
  banner_description TEXT,
  banner_cta_label TEXT,
  banner_cta_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT
);

INSERT INTO territory.site_config (id, banner_enabled)
VALUES (1, FALSE)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE territory.admin_audit_log
  DROP CONSTRAINT IF EXISTS admin_audit_log_action_type_check;

ALTER TABLE territory.admin_audit_log
  ADD CONSTRAINT admin_audit_log_action_type_check
  CHECK (action_type IN (
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
    'waitlist_remove',
    'site_banner_update',
    'site_banner_toggle'
  ));

COMMIT;
