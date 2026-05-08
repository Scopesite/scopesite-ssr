-- Territory Command migration 0005 — move monthly/setup pricing from seats to territories.
-- Run after 0004. Forward-only.
--
-- Preconditions:
--   - territory.seats has monthly_price_gbp, setup_fee_gbp (Phase A)
--   - territory.v_seats_full reads those columns from seats
--
-- Post state:
--   - territory.territories owns monthly_price_gbp + setup_fee_gbp (NUMERIC)
--   - territory.v_seats_full reads pricing from territories
--   - territory.seats no longer has price columns

BEGIN;

ALTER TABLE territory.territories
  ADD COLUMN IF NOT EXISTS monthly_price_gbp NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS setup_fee_gbp NUMERIC(10, 2);

-- Most common price per territory (ties: higher monthly wins, then setup).
WITH freq AS (
  SELECT
    s.territory_id,
    s.monthly_price_gbp::numeric AS mp,
    s.setup_fee_gbp::numeric AS sp,
    COUNT(*)::bigint AS c
  FROM territory.seats s
  WHERE s.monthly_price_gbp IS NOT NULL
  GROUP BY s.territory_id, s.monthly_price_gbp, s.setup_fee_gbp
),
ranked AS (
  SELECT
    territory_id,
    mp AS monthly_price_gbp,
    sp AS setup_fee_gbp,
    ROW_NUMBER() OVER (
      PARTITION BY territory_id
      ORDER BY c DESC, mp DESC, sp DESC
    ) AS rn
  FROM freq
)
UPDATE territory.territories t
SET
  monthly_price_gbp = r.monthly_price_gbp,
  setup_fee_gbp = r.setup_fee_gbp
FROM ranked r
WHERE t.id = r.territory_id
  AND r.rn = 1;

-- Safe default so public pricing never reads NULL before admin fine-tunes.
UPDATE territory.territories
SET monthly_price_gbp = COALESCE(monthly_price_gbp, 500),
    setup_fee_gbp = COALESCE(setup_fee_gbp, 750)
WHERE monthly_price_gbp IS NULL
   OR setup_fee_gbp IS NULL;

-- Recreate view: pricing columns come from territories; tier display uses territory tier.
DROP VIEW IF EXISTS territory.v_seats_full;

CREATE OR REPLACE VIEW territory.v_seats_full AS
SELECT
  s.id AS seat_id,
  s.state,
  t.tier AS tier,
  t.monthly_price_gbp,
  t.setup_fee_gbp,
  s.pending_until,
  s.claimed_at,
  t.id AS territory_id,
  t.postcode,
  t.postcode_district,
  t.town_name,
  t.county,
  t.tier AS territory_tier,
  t.is_active AS territory_is_active,
  sec.id AS sector_id,
  sec.slug AS sector_slug,
  sec.label AS sector_label,
  sec.category AS sector_category,
  sec.is_active AS sector_is_active,
  sec.is_featured AS sector_is_featured,
  ai.firm_count AS area_firm_count,
  ai.ai_visible_count AS area_ai_visible_count,
  ai.average_voice_score AS area_average_voice_score
FROM territory.seats s
JOIN territory.territories t ON s.territory_id = t.id
JOIN territory.sectors sec ON s.sector_id = sec.id
LEFT JOIN territory.area_intelligence ai
  ON ai.territory_id = t.id AND ai.sector_id = sec.id;

COMMENT ON VIEW territory.v_seats_full IS 'Denormalised seat view; monthly/setup pricing and tier come from territory row.';

ALTER TABLE territory.seats
  DROP COLUMN IF EXISTS monthly_price_gbp,
  DROP COLUMN IF EXISTS setup_fee_gbp;

COMMIT;

-- Log line for operators (run manually after migrate to inspect drift):
-- SELECT postcode, town_name, monthly_price_gbp, setup_fee_gbp FROM territory.territories ORDER BY postcode;
