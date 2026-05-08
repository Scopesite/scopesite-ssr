-- Territory Command migration 0008 — application price lock (grandfathering).

BEGIN;

ALTER TABLE territory.applications
  ADD COLUMN IF NOT EXISTS locked_monthly_price_gbp NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS locked_setup_fee_gbp NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS locked_promotion_id UUID REFERENCES territory.postcode_promotions (id),
  ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ;

COMMIT;
