-- Territory Command migration 0004 - 3-way application entry type.
--
-- Adds 'sector' as a third value on the application_entry_type enum so
-- that applications for a KNOWN sector in an ACTIVE pilot postcode can
-- bypass the seat-hold CTE (no seats.state flip) and still keep the
-- sector_slug populated. Previously the DB only understood 'seat' (with
-- a 48h hold) and 'freeform' (no sector row at all). The new 'sector'
-- path fills the gap: sector exists in our taxonomy, territory exists
-- in the pilot, but we do not want to hold a specific seat - typical
-- case is the PilotCheckerModal for not-yet-active sectors in active
-- postcodes after the bulk import expanded territory.sectors to 651
-- rows.
--
-- Shape matrix after this migration:
--
--   entry_type  seat_id  sector_slug  requested_postcode_district  freeform_industry
--   --------    -------  -----------  ---------------------------  -----------------
--   seat        NN       NN           NULL                         NULL
--   sector      NULL     NN           NN                           NULL
--   freeform    NULL     NULL         NN                           NN
--
-- IMPORTANT: `ALTER TYPE ... ADD VALUE` cannot run inside a transaction
-- that later references the new value. Postgres requires the enum add
-- to be committed before the value can be used in a CHECK expression.
-- The runner (scripts/territory-migrate-0004.mjs) therefore issues the
-- ADD VALUE as its own auto-commit statement, then applies the CHECK
-- drop + re-add in a subsequent call. This file is human-readable SQL;
-- treat the `-- STEP` markers as explicit round-trip boundaries.
--
-- Forward-only. No down-migration (territory is pre-launch).

-- STEP 1 (outside transaction, own round-trip): extend the enum.
ALTER TYPE territory.application_entry_type ADD VALUE IF NOT EXISTS 'sector';

-- STEP 2 (own round-trip): drop the existing 2-way shape constraint.
ALTER TABLE territory.applications
  DROP CONSTRAINT IF EXISTS applications_entry_shape_chk;

-- STEP 3 (own round-trip): re-add the 3-way shape invariant.
ALTER TABLE territory.applications
  ADD CONSTRAINT applications_entry_shape_chk CHECK (
    (entry_type = 'seat'
      AND seat_id IS NOT NULL
      AND sector_slug IS NOT NULL
      AND requested_postcode_district IS NULL
      AND freeform_industry IS NULL)
    OR
    (entry_type = 'sector'
      AND seat_id IS NULL
      AND sector_slug IS NOT NULL
      AND requested_postcode_district IS NOT NULL
      AND freeform_industry IS NULL)
    OR
    (entry_type = 'freeform'
      AND seat_id IS NULL
      AND sector_slug IS NULL
      AND requested_postcode_district IS NOT NULL
      AND freeform_industry IS NOT NULL)
  );
