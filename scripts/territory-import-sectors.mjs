/**
 * Territory Command sector import - Phases 2 through 5.
 *
 *   Phase 2: parse + validate data/all_jobs.md (621 rows).
 *   Phase 3: merge into territory.sectors via one multi-row INSERT with
 *            ON CONFLICT (slug) DO NOTHING. Preserves is_active/is_featured
 *            on the 32 overlapping slugs.
 *   Phase 4: cross-join seed territory.seats with state='not_active',
 *            ON CONFLICT (territory_id, sector_id) DO NOTHING.
 *   Phase 5: post-import verification.
 *
 * Phases 3 + 4 run inside a single transaction via neon(url, { fullResults:
 * true }).transaction([...]). In-transaction assertions abort+rollback on
 * any unexpected value. Captured phase3_start timestamp is reported on
 * success for downstream rollback reference.
 *
 * Usage:
 *   npx tsx scripts/territory-import-sectors.mjs --dry-run    (Phase 2 only)
 *   npx tsx scripts/territory-import-sectors.mjs --confirm    (all phases)
 */

import * as dotenv from 'dotenv';
import { neon, Client } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';

dotenv.config({ path: '.env.local' });

const url = process.env.POSTGRES_URL_NON_POOLING
  || process.env.DATABASE_URL_UNPOOLED
  || process.env.POSTGRES_URL
  || process.env.DATABASE_URL;

if (!url) {
  console.error('No POSTGRES_URL/DATABASE_URL in .env.local');
  process.exit(1);
}

const dryRun = process.argv.includes('--dry-run');
const confirm = process.argv.includes('--confirm');
if (!dryRun && !confirm) {
  console.error(
    'Specify --dry-run (Phase 2 validation only) or --confirm (run all phases).',
  );
  process.exit(1);
}

const CSV_PATH = 'data/all_jobs.md';

// ---------------------------------------------------------------------------
// Phase 2: parse + validate
// ---------------------------------------------------------------------------

/**
 * RFC-4180-ish single-line splitter. Fields may be unquoted (no comma, no
 * quote) or quoted with "..." and embedded double-quote via "". No embedded
 * newlines expected in our CSV. Returns an array of field strings.
 */
function splitCsvLine(line) {
  const out = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      // quoted field
      i += 1;
      let v = '';
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          v += '"';
          i += 2;
          continue;
        }
        if (line[i] === '"') {
          i += 1;
          break;
        }
        v += line[i];
        i += 1;
      }
      out.push(v);
      if (line[i] === ',') i += 1;
    } else {
      let j = i;
      while (j < line.length && line[j] !== ',') j += 1;
      out.push(line.slice(i, j));
      i = j + 1;
      if (j === line.length) break;
    }
  }
  // Trailing comma case.
  if (line.endsWith(',')) out.push('');
  return out;
}

const SLUG_RX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseCsv() {
  const raw = readFileSync(CSV_PATH, 'utf8');
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  const header = lines.shift();
  const expectedHeader = 'slug,label,category,sub_category,sic_2007_code,recognition_score';
  if (header !== expectedHeader) {
    throw new Error(`Unexpected CSV header:\n  got:      ${header}\n  expected: ${expectedHeader}`);
  }

  const rows = [];
  const seenSlugs = new Set();
  for (let n = 0; n < lines.length; n += 1) {
    const lineNo = n + 2; // 1-indexed + header
    const fields = splitCsvLine(lines[n]);
    if (fields.length !== 6) {
      throw new Error(`Line ${lineNo}: expected 6 columns, got ${fields.length}: ${JSON.stringify(lines[n])}`);
    }
    const [slug, label, category, sub_category, sic_2007_code, recognition_score_raw] = fields.map((f) => f.trim());
    if (!SLUG_RX.test(slug)) {
      throw new Error(`Line ${lineNo}: bad slug "${slug}"`);
    }
    if (seenSlugs.has(slug)) {
      throw new Error(`Line ${lineNo}: duplicate slug "${slug}"`);
    }
    seenSlugs.add(slug);
    if (!label) throw new Error(`Line ${lineNo}: empty label`);
    if (!category) throw new Error(`Line ${lineNo}: empty category`);
    const score = Number(recognition_score_raw);
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      throw new Error(`Line ${lineNo}: bad recognition_score "${recognition_score_raw}" for slug "${slug}"`);
    }
    rows.push({
      slug,
      label,
      category,
      sub_category: sub_category || null,
      sic_2007_code: sic_2007_code || null,
      recognition_score: score,
    });
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const sqlReadonly = neon(url);

async function main() {
  console.log(`=== Phase 2: parse + validate ${CSV_PATH} ===`);
  const rows = parseCsv();
  const categories = new Map();
  for (const r of rows) categories.set(r.category, (categories.get(r.category) || 0) + 1);
  console.log(`parsed rows: ${rows.length}`);
  console.log(`distinct categories: ${categories.size}`);
  for (const [cat, n] of [...categories.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat.padEnd(36)} ${n}`);
  }

  // Projected delta against existing sectors (read-only pre-flight).
  const existingRows = await sqlReadonly`SELECT slug FROM territory.sectors`;
  const existingSlugs = new Set(existingRows.map((r) => r.slug));
  const csvSlugs = new Set(rows.map((r) => r.slug));
  const overlap = [...existingSlugs].filter((s) => csvSlugs.has(s));
  const newInserts = [...csvSlugs].filter((s) => !existingSlugs.has(s));
  const untouchedExisting = [...existingSlugs].filter((s) => !csvSlugs.has(s));
  console.log(`\n=== Phase 2: projected delta ===`);
  console.log(`existing sectors:       ${existingSlugs.size}`);
  console.log(`csv slugs:              ${csvSlugs.size}`);
  console.log(`overlap (skipped):      ${overlap.length}`);
  console.log(`new inserts:            ${newInserts.length}`);
  console.log(`existing-only kept:     ${untouchedExisting.length}`);
  console.log(`final sectors target:   ${existingSlugs.size + newInserts.length}`);
  const territoriesN = (await sqlReadonly`SELECT COUNT(*)::int AS n FROM territory.territories`)[0].n;
  const expectedSectorsTotal = existingSlugs.size + newInserts.length;
  const finalSeats = territoriesN * expectedSectorsTotal;
  const existingSeats = (await sqlReadonly`SELECT COUNT(*)::int AS n FROM territory.seats`)[0].n;
  console.log(`final seats target:     ${finalSeats} (${finalSeats - existingSeats} new)`);

  if (dryRun) {
    console.log('\n--dry-run: stopping before any DB writes.');
    return;
  }

  if (!confirm) {
    console.error('Missing --confirm flag. Aborting.');
    process.exit(1);
  }

  console.log(`\n=== Opening interactive transaction (Phases 3 + 4 atomic) ===`);

  // Interactive transaction via WebSocket Client. Any throw below this
  // point reaches the catch block which issues ROLLBACK before rethrowing.
  const client = new Client(url);
  await client.connect();

  let phase3StartIso;

  try {
    await client.query('BEGIN');

    // Capture phase3_start for rollback reference.
    const startRes = await client.query('SELECT NOW() AS ts');
    const phase3Start = startRes.rows[0].ts;
    phase3StartIso = phase3Start.toISOString ? phase3Start.toISOString() : String(phase3Start);
    console.log(`phase3_start = ${phase3StartIso}`);

    console.log(`\n=== Phase 3: merge ${rows.length} rows into territory.sectors ===`);

    // Build parameterised multi-row INSERT.
    const valuesSql = [];
    const params = [];
    for (let i = 0; i < rows.length; i += 1) {
      const base = i * 6;
      valuesSql.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, FALSE, FALSE, 0)`);
      const r = rows[i];
      params.push(r.slug, r.label, r.category, r.sub_category, r.sic_2007_code, r.recognition_score);
    }
    const insertSectorsSql = `
      INSERT INTO territory.sectors (
        slug, label, category, sub_category, sic_2007_code, recognition_score,
        is_active, is_featured, display_order
      )
      VALUES ${valuesSql.join(',\n')}
      ON CONFLICT (slug) DO NOTHING
      RETURNING slug
    `;
    const inserted = await client.query(insertSectorsSql, params);
    console.log(`inserted ${inserted.rows.length} new sectors (overlap skipped)`);

    // Post-Phase-3 assertions (still inside the transaction).
    const sectorCount = (await client.query('SELECT COUNT(*)::int AS n FROM territory.sectors')).rows[0].n;
    const newCount = (await client.query(
      'SELECT COUNT(*)::int AS n FROM territory.sectors WHERE created_at >= $1',
      [phase3Start],
    )).rows[0].n;
    const activeNow = (await client.query(
      'SELECT slug FROM territory.sectors WHERE is_active = true ORDER BY slug',
    )).rows;
    console.log(`sector count: ${sectorCount} (expected ${expectedSectorsTotal})`);
    console.log(`new sectors created since phase3_start: ${newCount} (expected ${newInserts.length})`);
    console.log(`active sectors: ${activeNow.map((r) => r.slug).join(', ')}`);

    if (sectorCount !== expectedSectorsTotal) {
      throw new Error(`Phase 3 sector count mismatch: ${sectorCount} vs expected ${expectedSectorsTotal}`);
    }
    if (newCount !== newInserts.length) {
      throw new Error(`Phase 3 new-sectors count mismatch: ${newCount} vs expected ${newInserts.length}`);
    }
    if (activeNow.length !== 4) {
      throw new Error(`Phase 3 active-sector count changed: ${activeNow.length} (expected 4)`);
    }
    const expectedActive = new Set(['accountants', 'dental-practices', 'estate-agents', 'solicitors']);
    for (const r of activeNow) {
      if (!expectedActive.has(r.slug)) {
        throw new Error(`Phase 3 unexpected active sector: ${r.slug}`);
      }
    }
    console.log('Phase 3 assertions: OK');

    console.log(`\n=== Phase 4: cross-join seed territory.seats ===`);

    const seatInserted = await client.query(`
      INSERT INTO territory.seats (territory_id, sector_id, state)
      SELECT t.id, s.id, 'not_active'
      FROM territory.territories t
      CROSS JOIN territory.sectors s
      ON CONFLICT (territory_id, sector_id) DO NOTHING
      RETURNING id
    `);
    console.log(`inserted ${seatInserted.rows.length} new seats`);

    // Post-Phase-4 assertions.
    const seatCount = (await client.query('SELECT COUNT(*)::int AS n FROM territory.seats')).rows[0].n;
    const seatStates = (await client.query(
      'SELECT state, COUNT(*)::int AS n FROM territory.seats GROUP BY state ORDER BY state',
    )).rows;
    console.log(`seat count: ${seatCount} (expected ${finalSeats})`);
    console.log('seat states:', seatStates);

    if (seatCount !== finalSeats) {
      throw new Error(`Phase 4 seat count mismatch: ${seatCount} vs expected ${finalSeats}`);
    }

    // Spot check: BA11 + solicitors was 'available' pre-import. Must stay.
    const spot = (await client.query(`
      SELECT s.state
      FROM territory.seats s
      JOIN territory.sectors se ON se.id = s.sector_id
      JOIN territory.territories t ON t.id = s.territory_id
      WHERE UPPER(t.postcode_district) = 'BA11' AND se.slug = 'solicitors'
    `)).rows;
    console.log(`spot-check BA11 x solicitors state: ${spot[0]?.state}`);
    if (spot.length !== 1) {
      throw new Error(`Phase 4 spot-check: expected 1 row, got ${spot.length}`);
    }
    if (spot[0].state !== 'available') {
      throw new Error(`Phase 4 spot-check state regressed: BA11 x solicitors now '${spot[0].state}' (was 'available')`);
    }

    // Uniqueness invariant (the exclusivity guarantee).
    const dupes = (await client.query(`
      SELECT territory_id, sector_id, COUNT(*)::int AS n
      FROM territory.seats
      GROUP BY territory_id, sector_id
      HAVING COUNT(*) > 1
    `)).rows;
    if (dupes.length > 0) {
      throw new Error(`Phase 4 duplicate seats detected: ${dupes.length}`);
    }
    console.log('Phase 4 assertions: OK');

    await client.query('COMMIT');
    console.log('\n=== COMMIT OK - Phases 3+4 persisted ===');
  } catch (err) {
    try {
      await client.query('ROLLBACK');
      console.error('\nRolled back. No changes persisted.');
    } catch (rbErr) {
      console.error('ROLLBACK itself failed:', rbErr);
    }
    await client.end();
    throw err;
  }

  await client.end();

  // -------------------------------------------------------------------------
  // Phase 5: final verification (post-commit, read-only via neon http)
  // -------------------------------------------------------------------------

  console.log(`\n=== Phase 5: post-commit verification ===`);

  const badSlugs = await sqlReadonly`
    SELECT slug FROM territory.sectors
    WHERE slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  `;
  console.log(`slug URL-safety violations: ${badSlugs.length} (expect 0)`);

  const agriCount = (await sqlReadonly`
    SELECT COUNT(*)::int AS n FROM territory.sectors
    WHERE category = 'Agriculture Pets & Veterinary'
  `)[0].n;
  console.log(`Agriculture Pets & Veterinary rows: ${agriCount} (expect 30)`);

  const exclusivity = await sqlReadonly`
    SELECT s.state, se.slug AS sector, t.postcode_district AS territory
    FROM territory.seats s
    JOIN territory.sectors se ON se.id = s.sector_id
    JOIN territory.territories t ON t.id = s.territory_id
    WHERE UPPER(t.postcode_district) = 'BA11'
      AND se.slug IN ('chiropractors', 'veterinary-practices')
    ORDER BY se.slug
  `;
  console.log('exclusivity proof (BA11 x chiropractors + veterinary-practices):');
  console.dir(exclusivity, { depth: null });

  const activeFinal = await sqlReadonly`SELECT slug FROM territory.sectors WHERE is_active = true ORDER BY slug`;
  console.log(`active sectors final: ${activeFinal.map((r) => r.slug).join(', ')}`);

  console.log(`\n=== ROLLBACK REFERENCE ===`);
  console.log(`phase3_start = ${phase3StartIso}`);
  console.log(`Rollback SQL (run manually if required):`);
  console.log(`  BEGIN;`);
  console.log(`  DELETE FROM territory.seats`);
  console.log(`    WHERE sector_id IN (SELECT id FROM territory.sectors WHERE created_at >= '${phase3StartIso}');`);
  console.log(`  DELETE FROM territory.seats`);
  console.log(`    WHERE territory_id IN (SELECT id FROM territory.territories WHERE is_active = false);`);
  console.log(`  DELETE FROM territory.sectors WHERE created_at >= '${phase3StartIso}';`);
  console.log(`  COMMIT;`);
}

main().catch((err) => {
  console.error('\nImport FAILED:', err);
  console.error('Transaction auto-rolled back. Re-run after diagnosing.');
  process.exit(1);
});
