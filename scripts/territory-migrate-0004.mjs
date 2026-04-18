/**
 * Territory Command migration 0004 runner.
 *
 * Applies docs/territory_command/migrations/0004_applications_sector_entry_type.sql.
 *
 * Three round-trips:
 *   1. ALTER TYPE ... ADD VALUE 'sector'  (auto-commit; Postgres won't let
 *      a transaction reference an enum value that was added inside it)
 *   2. DROP CONSTRAINT applications_entry_shape_chk
 *   3. ADD CONSTRAINT applications_entry_shape_chk with the 3-way shape
 *
 * Idempotent. Pre-flight asserts that the 2-way constraint from migration
 * 0002 exists, unless the 3-way constraint is already in place.
 *
 *   npx tsx scripts/territory-migrate-0004.mjs [--dry-run]
 */

import * as dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: '.env.local' });

const url = process.env.POSTGRES_URL_NON_POOLING
  || process.env.DATABASE_URL_UNPOOLED
  || process.env.POSTGRES_URL
  || process.env.DATABASE_URL;

if (!url) {
  console.error('No POSTGRES_URL/DATABASE_URL in .env.local');
  process.exit(1);
}

const sql = neon(url);
const dryRun = process.argv.includes('--dry-run');

function constraintHasValue(def, value) {
  return typeof def === 'string' && def.includes(`'${value}'`);
}

async function main() {
  const enumValues = await sql`
    SELECT e.enumlabel AS label
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname='territory' AND t.typname='application_entry_type'
    ORDER BY e.enumsortorder
  `;
  const labels = enumValues.map((r) => r.label);
  console.log('Pre-flight enum values:', labels);

  const existing = await sql`
    SELECT conname, pg_get_constraintdef(oid) AS def
    FROM pg_constraint
    WHERE conrelid='territory.applications'::regclass
      AND conname='applications_entry_shape_chk'
    LIMIT 1
  `;
  const existingDef = existing[0]?.def || null;
  console.log('Pre-flight existing CHECK:', existingDef || '(none)');

  const hasSector = labels.includes('sector');
  const constraintIsThreeWay =
    existingDef !== null && constraintHasValue(existingDef, 'sector');

  if (hasSector && constraintIsThreeWay) {
    console.log('\nMigration 0004 already applied. Nothing to do.');
    return;
  }

  if (dryRun) {
    console.log('\n--dry-run: no writes.');
    console.log('  would run: ALTER TYPE territory.application_entry_type ADD VALUE IF NOT EXISTS \'sector\'');
    console.log('  would run: ALTER TABLE territory.applications DROP CONSTRAINT IF EXISTS applications_entry_shape_chk');
    console.log('  would run: ALTER TABLE territory.applications ADD CONSTRAINT applications_entry_shape_chk CHECK (...)');
    return;
  }

  if (!hasSector) {
    await sql`ALTER TYPE territory.application_entry_type ADD VALUE IF NOT EXISTS 'sector'`;
    console.log('  [ok] ADD VALUE \'sector\' to enum');
  } else {
    console.log('  [skip] enum already has \'sector\'');
  }

  await sql`ALTER TABLE territory.applications DROP CONSTRAINT IF EXISTS applications_entry_shape_chk`;
  console.log('  [ok] dropped old CHECK (if any)');

  await sql`
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
      )
  `;
  console.log('  [ok] new 3-way CHECK added');

  const finalEnum = await sql`
    SELECT e.enumlabel AS label
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname='territory' AND t.typname='application_entry_type'
    ORDER BY e.enumsortorder
  `;
  const finalCheck = await sql`
    SELECT conname, pg_get_constraintdef(oid) AS def
    FROM pg_constraint
    WHERE conrelid='territory.applications'::regclass
      AND conname='applications_entry_shape_chk'
  `;
  console.log('\nFinal state:');
  console.log('  enum values:', finalEnum.map((r) => r.label));
  console.log('  CHECK def:  ', finalCheck[0]?.def);
  console.log('\nMigration 0004 applied.');
}

main().catch((err) => {
  console.error('\nMigration failed:', err);
  process.exit(1);
});
