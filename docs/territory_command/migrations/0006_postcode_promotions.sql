-- Territory Command migration 0006 — postcode-level promotions (gold window).
-- Run after 0005. Requires territory.territories.postcode UNIQUE.

BEGIN;

CREATE TABLE IF NOT EXISTS territory.postcode_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postcode TEXT NOT NULL REFERENCES territory.territories (postcode) ON DELETE CASCADE,
  promotional_monthly_price_gbp NUMERIC(10, 2) NOT NULL,
  promotional_setup_fee_gbp NUMERIC(10, 2),
  origin_tier TEXT NOT NULL CHECK (origin_tier IN ('standard', 'premium')),
  origin_monthly_price_gbp NUMERIC(10, 2) NOT NULL,
  origin_setup_fee_gbp NUMERIC(10, 2),
  headline TEXT,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  expired BOOLEAN NOT NULL DEFAULT FALSE,
  cancelled BOOLEAN NOT NULL DEFAULT FALSE,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (expires_at > starts_at)
);

CREATE INDEX IF NOT EXISTS idx_promotions_postcode_active
  ON territory.postcode_promotions (postcode)
  WHERE expired = FALSE AND cancelled = FALSE;

CREATE INDEX IF NOT EXISTS idx_promotions_expiry_sweep
  ON territory.postcode_promotions (expires_at)
  WHERE expired = FALSE AND cancelled = FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_promotion_per_postcode
  ON territory.postcode_promotions (postcode)
  WHERE expired = FALSE AND cancelled = FALSE;

COMMIT;
