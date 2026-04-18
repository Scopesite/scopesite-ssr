/**
 * Territory Command migration 0003 - sectors taxonomy columns.
 *
 * Adds sub_category, sic_2007_code, recognition_score (+ CHECK) to
 * territory.sectors and two triage indexes. Idempotent.
 *
 * Mirror of the migration 0002 pattern: dotenv + neon serverless,
 * one statement per round-trip, pre-flight existence check.
 *
 * Usage:
 *   npx tsx scripts/territory-migrate-0003.mjs [--dry-run]
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
  // Pre-flight: territory.sectors must exist.
  const exists = await sql`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema='territory' AND table_name='sectors'
    ) AS exists
  `;
  if (!exists[0]?.exists) {
    console.error('territory.sectors does not exist. Base schema required first.');
    process.exit(1);
  }

  console.log('Pre-flight OK. Ready to migrate 0003.');
  if (dryRun) {
    console.log('--dry-run: no writes.');
    return;
  }

  await sql`ALTER TABLE territory.sectors ADD COLUMN IF NOT EXISTS sub_category TEXT`;
  console.log('  [ok] sub_category column');

  await sql`ALTER TABLE territory.sectors ADD COLUMN IF NOT EXISTS sic_2007_code TEXT`;
  console.log('  [ok] sic_2007_code column');

  await sql`ALTER TABLE territory.sectors ADD COLUMN IF NOT EXISTS recognition_score SMALLINT`;
  console.log('  [ok] recognition_score column');

  await sql`ALTER TABLE territory.sectors DROP CONSTRAINT IF EXISTS sectors_recognition_score_chk`;
  await sql`
    ALTER TABLE territory.sectors
      ADD CONSTRAINT sectors_recognition_score_chk
      CHECK (recognition_score IS NULL OR (recognition_score BETWEEN 1 AND 5))
  `;
  console.log('  [ok] sectors_recognition_score_chk constraint');

  await sql`CREATE INDEX IF NOT EXISTS idx_sectors_category ON territory.sectors(category)`;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_sectors_sub_category
      ON territory.sectors(sub_category)
      WHERE sub_category IS NOT NULL
  `;
  console.log('  [ok] indexes');

  const cols = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema='territory' AND table_name='sectors'
      AND column_name IN ('sub_category','sic_2007_code','recognition_score')
    ORDER BY column_name
  `;
  const checks = await sql`
    SELECT conname, pg_get_constraintdef(oid) AS def
    FROM pg_constraint
    WHERE conrelid='territory.sectors'::regclass
      AND conname = 'sectors_recognition_score_chk'
  `;
  const idx = await sql`
    SELECT indexname FROM pg_indexes
    WHERE schemaname='territory' AND tablename='sectors'
      AND indexname IN ('idx_sectors_category','idx_sectors_sub_category')
    ORDER BY indexname
  `;
  console.log('\nFinal state:');
  console.log('  columns:    ', cols);
  console.log('  constraint: ', checks);
  console.log('  indexes:    ', idx);
  console.log('\nMigration 0003 applied.');
}

main().catch((err) => {
  console.error('\nMigration failed:', err);
  process.exit(1);
});
