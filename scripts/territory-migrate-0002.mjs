/**
 * Territory Command migration 0002 - freeform application parity.
 *
 * Adds:
 *   - entry_type enum (territory.application_entry_type)
 *   - entry_type column on territory.applications (NOT NULL, default 'seat'
 *     during backfill, then default DROPPED so new inserts must supply)
 *   - nullable seat_id and sector_slug
 *   - requested_postcode_district VARCHAR(10) NULL
 *   - freeform_industry VARCHAR(120) NULL
 *   - shape CHECK constraint
 *   - two indexes
 *
 * Forward-only. No down-migration. Idempotent at statement level where
 * possible (IF NOT EXISTS on ADD COLUMN / CREATE INDEX).
 *
 * Usage:
 *   npx tsx scripts/territory-migrate-0002.mjs [--dry-run]
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

async function main() {
  // 0. Pre-flight: does territory.applications exist?
  const existsRows = await sql`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'territory' AND table_name = 'applications'
    ) AS exists
  `;
  if (!existsRows[0]?.exists) {
    console.error(
      '\nterritory.applications does not exist on this DB. Run the base schema '
      + '(docs/territory_command/03_NEON_SCHEMA.sql) first, then re-run this migration.',
    );
    process.exit(1);
  }

  // 1. Pre-flight: existing rows must all conform to the new shape constraint
  //    BEFORE we add it. Every existing row is expected to be seat-typed with
  //    seat_id NOT NULL. If any row has seat_id NULL, abort.
  const bad = await sql`
    SELECT COUNT(*)::int AS n
    FROM territory.applications
    WHERE seat_id IS NULL
  `;
  if ((bad[0]?.n ?? 0) > 0) {
    console.error(
      `\n${bad[0].n} existing applications have NULL seat_id. `
      + `Migration cannot proceed - manual cleanup required.`,
    );
    process.exit(1);
  }

  console.log('Pre-flight OK. Ready to migrate.');
  if (dryRun) {
    console.log('--dry-run: no writes.');
    return;
  }

  // Each statement runs as its own round-trip. Neon serverless driver does
  // NOT support multi-statement per call, so we sequence them.

  // 2. Make seat_id nullable.
  await sql`
    ALTER TABLE territory.applications
      ALTER COLUMN seat_id DROP NOT NULL
  `;
  console.log('  [ok] seat_id nullable');

  // 3. Make sector_slug nullable (freeform rows have no sector slug).
  await sql`
    ALTER TABLE territory.applications
      ALTER COLUMN sector_slug DROP NOT NULL
  `;
  console.log('  [ok] sector_slug nullable');

  // 4. entry_type enum (idempotent guard via DO block).
  await sql`
    DO $$ BEGIN
      CREATE TYPE territory.application_entry_type AS ENUM ('seat', 'freeform');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `;
  console.log('  [ok] enum application_entry_type');

  // 5. entry_type column with default so existing rows backfill to 'seat'.
  await sql`
    ALTER TABLE territory.applications
      ADD COLUMN IF NOT EXISTS entry_type territory.application_entry_type
      NOT NULL DEFAULT 'seat'
  `;
  console.log('  [ok] entry_type column added (default seat)');

  // 6. Drop the default so new inserts must explicitly supply entry_type.
  await sql`
    ALTER TABLE territory.applications
      ALTER COLUMN entry_type DROP DEFAULT
  `;
  console.log('  [ok] entry_type default dropped');

  // 7. Target-territory + freeform-industry columns.
  await sql`
    ALTER TABLE territory.applications
      ADD COLUMN IF NOT EXISTS requested_postcode_district VARCHAR(10)
  `;
  await sql`
    ALTER TABLE territory.applications
      ADD COLUMN IF NOT EXISTS freeform_industry VARCHAR(120)
  `;
  console.log('  [ok] requested_postcode_district + freeform_industry columns');

  // 8. Shape CHECK constraint - enforces the seat/freeform invariant.
  //    Drop + add so rerunning is safe.
  await sql`
    ALTER TABLE territory.applications
      DROP CONSTRAINT IF EXISTS applications_entry_shape_chk
  `;
  await sql`
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
      )
  `;
  console.log('  [ok] applications_entry_shape_chk constraint');

  // 9. Admin triage indexes.
  await sql`
    CREATE INDEX IF NOT EXISTS idx_applications_entry_type
      ON territory.applications(entry_type)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_applications_requested_postcode_district
      ON territory.applications(requested_postcode_district)
      WHERE requested_postcode_district IS NOT NULL
  `;
  console.log('  [ok] indexes');

  // 10. Verify.
  const shape = await sql`
    SELECT column_name, is_nullable, data_type
    FROM information_schema.columns
    WHERE table_schema = 'territory'
      AND table_name = 'applications'
      AND column_name IN ('seat_id', 'sector_slug', 'entry_type',
                          'requested_postcode_district', 'freeform_industry')
    ORDER BY column_name
  `;
  console.log('\nFinal column shape:');
  for (const r of shape) {
    console.log(`  ${r.column_name.padEnd(32)} ${r.data_type.padEnd(20)} nullable=${r.is_nullable}`);
  }

  console.log('\nMigration 0002 applied.');
}

main().catch((err) => {
  console.error('\nMigration failed:', err);
  process.exit(1);
});
