-- Territory Command migration 0002 - freeform application parity.
--
-- Adds entry_type discriminator, nullable seat_id/sector_slug, and the
-- columns needed to persist freeform-industry applications alongside
-- the existing seat-bound application rows. The CHECK constraint makes
-- the two shapes mutually exclusive at the DB layer.
--
-- Runner: scripts/territory-migrate-0002.mjs (idempotent, checks
-- preconditions). This .sql file is the human-reviewable source of
-- truth; the runner executes the same statements via
-- @neondatabase/serverless one round-trip at a time.
--
-- Forward-only. No down-migration (territory is pre-launch).

BEGIN;

-- 1. Relax seat_id so freeform applications (no seat row) can be persisted.
ALTER TABLE territory.applications
  ALTER COLUMN seat_id DROP NOT NULL;

-- 2. Relax sector_slug as well - freeform rows have no sector slug.
ALTER TABLE territory.applications
  ALTER COLUMN sector_slug DROP NOT NULL;

-- 3. Entry-type discriminator.
CREATE TYPE territory.application_entry_type AS ENUM ('seat', 'freeform');

-- 4. Add entry_type with a default so existing rows backfill to 'seat',
--    then drop the default so new inserts must be explicit.
ALTER TABLE territory.applications
  ADD COLUMN entry_type territory.application_entry_type NOT NULL DEFAULT 'seat';

ALTER TABLE territory.applications
  ALTER COLUMN entry_type DROP DEFAULT;

-- 5. Freeform-specific columns. Target district stored explicitly because
--    freeform rows have no seats->territories FK to resolve it from.
ALTER TABLE territory.applications
  ADD COLUMN requested_postcode_district VARCHAR(10),
  ADD COLUMN freeform_industry VARCHAR(120);

-- 6. Shape invariant: exactly one of {seat, freeform} is populated.
ALTER TABLE territory.applications
  ADD CONSTRAINT applications_entry_shape_chk CHECK (
    (entry_type = 'seat'
      AND seat_id IS NOT NULL
      AND sector_slug IS NOT NULL
      AND requested_postcode_district IS NULL
      AND freeform_industry IS NULL)
    OR
    (entry_type = 'freeform'
      AND seat_id IS NULL
      AND sector_slug IS NULL
      AND requested_postcode_district IS NOT NULL
      AND freeform_industry IS NOT NULL)
  );

-- 7. Admin triage indexes.
CREATE INDEX idx_applications_entry_type
  ON territory.applications(entry_type);

CREATE INDEX idx_applications_requested_postcode_district
  ON territory.applications(requested_postcode_district)
  WHERE requested_postcode_district IS NOT NULL;

COMMIT;
