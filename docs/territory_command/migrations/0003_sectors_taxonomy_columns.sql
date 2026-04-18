-- Territory Command migration 0003 - sectors taxonomy columns.
--
-- Adds the three nullable columns the Gemini CSV (data/all_jobs.md) brings
-- in but that the current territory.sectors schema doesn't have:
--
--   sub_category       TEXT     free-text secondary taxonomy level
--   sic_2007_code      TEXT     single UK SIC 2007 code
--   recognition_score  SMALLINT 1..5 heuristic for triage (constraint-checked)
--
-- Does NOT touch the existing sic_codes TEXT[] array column - that stays
-- for backward compat. The new sic_2007_code holds the single canonical
-- code from the CSV. Future backfill can populate sic_codes from
-- sic_2007_code if needed; not required for this amendment.
--
-- Idempotent: ADD COLUMN IF NOT EXISTS + DROP/ADD CHECK pattern + CREATE
-- INDEX IF NOT EXISTS. Safe to re-run.
--
-- Runner: scripts/territory-migrate-0003.mjs (preserves the migration 0002
-- pattern: dotenv + neon serverless + sequential single-statement calls).
--
-- Forward-only. No down-migration.

BEGIN;

ALTER TABLE territory.sectors
  ADD COLUMN IF NOT EXISTS sub_category TEXT,
  ADD COLUMN IF NOT EXISTS sic_2007_code TEXT,
  ADD COLUMN IF NOT EXISTS recognition_score SMALLINT;

-- Drop + add the CHECK so rerunning is safe.
ALTER TABLE territory.sectors
  DROP CONSTRAINT IF EXISTS sectors_recognition_score_chk;

ALTER TABLE territory.sectors
  ADD CONSTRAINT sectors_recognition_score_chk
  CHECK (recognition_score IS NULL OR (recognition_score BETWEEN 1 AND 5));

-- Indexes for admin browse / triage queries.
CREATE INDEX IF NOT EXISTS idx_sectors_category
  ON territory.sectors(category);

CREATE INDEX IF NOT EXISTS idx_sectors_sub_category
  ON territory.sectors(sub_category)
  WHERE sub_category IS NOT NULL;

COMMIT;
