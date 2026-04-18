# Territory Command — seed data

## `all_jobs.md` — sector taxonomy (621 rows)

A CSV masquerading as Markdown (Gemini export artefact — extension kept as-is
for fidelity with the original Gemini Deep Research run). Contents are
strict RFC-4180 CSV with a single header row and 621 data rows.

### Schema

| column | type | notes |
|---|---|---|
| `slug` | text | URL-safe sector id. Must match `^[a-z0-9]+(-[a-z0-9]+)*$`. Unique. |
| `label` | text | Human-readable display name. |
| `category` | text | Top-level taxonomy bucket. 18 distinct values. |
| `sub_category` | text | Free-text secondary bucket. |
| `sic_2007_code` | text | Single UK SIC 2007 code (5 digits). |
| `recognition_score` | smallint | 1..5 triage heuristic (higher = more recognisable). |

### Source / provenance

- Original Gemini Deep Research export, April 2026.
- 621 UK business sectors spanning 18 categories.
- One known data cleanup already applied: the CSV shipped with
  `"Agriculture, Pets & Veterinary"` as a category containing an unescaped
  comma, which broke strict 6-column parsing. Replaced with
  `"Agriculture Pets & Veterinary"` across all 30 affected rows. The original
  is preserved in `all_jobs.md.bak`.

### When it was imported

- Imported into `territory.sectors` on 2026-04-18 via
  `scripts/territory-import-sectors.mjs --confirm`.
- Captured `phase3_start` timestamp for rollback reference:
  **`2026-04-18T23:07:39.771Z`**.
- Merged under `ON CONFLICT (slug) DO NOTHING`: 32 existing slugs were
  preserved with their prior `is_active` / `is_featured` / `display_order`
  values; 589 new sectors inserted with all three flags off.
- Cross-joined to seed `territory.seats`: 6,076 new seat rows created for
  every `(territory, sector)` pair not already present, state
  `'not_active'`. Existing 434 seats left untouched.

### Re-running the import

The import is **idempotent**. Safe to re-run if the CSV changes or new
rows are appended — `ON CONFLICT DO NOTHING` on both the sectors merge and
the seats cross-join prevents duplicates.

```powershell
# 1) Validate only (no writes)
npx tsx scripts/territory-import-sectors.mjs --dry-run

# 2) Execute (wraps Phases 3+4 in a single interactive transaction;
#    aborts and rolls back if any in-transaction assertion fails).
npx tsx scripts/territory-import-sectors.mjs --confirm
```

The Phase 1 column migration lives separately:

```powershell
npx tsx scripts/territory-migrate-0003.mjs
```

Idempotent via `ADD COLUMN IF NOT EXISTS` + `DROP CONSTRAINT IF EXISTS`.

### Rollback

The script prints a `phase3_start` timestamp on success. To undo the
import (seats + sectors created since that timestamp, plus the seat rows
for reserve territories that had zero seats pre-import):

```sql
BEGIN;
DELETE FROM territory.seats
  WHERE sector_id IN (
    SELECT id FROM territory.sectors
    WHERE created_at >= '<phase3_start>'
  );
DELETE FROM territory.seats
  WHERE territory_id IN (
    SELECT id FROM territory.territories WHERE is_active = false
  );
DELETE FROM territory.sectors
  WHERE created_at >= '<phase3_start>';
COMMIT;
```

Returns the DB to `sectors=62`, `seats=434`, matching the pre-import
baseline.

### Exclusivity invariant

Territory Command exclusivity is **per `(territory, sector)`**, never per
territory alone. Enforced at the database layer by
`territory.seats.UNIQUE (territory_id, sector_id)` — confirmed present on
the live DB. A firm holding `(BA11, Chiropractor)` does not lock out a
different firm holding `(BA11, Scuba Instructor)` or `(BA11, Solicitor)`.
Every row in this CSV becomes one independent sector that interacts with
every territory as its own seat.
