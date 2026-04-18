/**
 * Territory Command - Core DB query functions.
 *
 * RULES:
 * - Every table/view/function is referenced with its fully-qualified name
 *   (e.g. `territory.seats`, `territory.v_seats_full`).
 * - No `SET search_path` anywhere. Avoids connection-pool leakage in
 *   serverless Neon.
 * - Multi-statement writes use CTEs (one atomic SQL statement).
 */

import { getDb } from './db';
import { normalisePostcode, toPostcodeDistrict } from './postcode';
import type {
  AvailabilityResult,
  MapDataPoint,
  SectorTile,
  Sector,
  SeatFull,
  Application,
  WaitlistEntry,
  AreaWaitlistEntry,
  ApplicationInsert,
  FreeformApplicationInsert,
  WaitlistInsert,
  AreaWaitlistInsert,
} from './types';

// ---------------------------------------------------------------------------
// AVAILABILITY CHECK
// ---------------------------------------------------------------------------

/**
 * Look up a seat by postcode + sector slug. Returns a discriminated union.
 * Postcode input is case-insensitive; we match on the postcode_district column.
 */
export async function checkAvailability(
  postcode: string,
  sectorSlug: string,
): Promise<AvailabilityResult> {
  const sql = getDb();
  const district = toPostcodeDistrict(postcode);
  const slug = sectorSlug.trim().toLowerCase();

  const rows = (await sql`
    SELECT
      v.seat_id,
      v.state,
      v.tier,
      v.monthly_price_gbp,
      v.setup_fee_gbp,
      v.pending_until,
      v.territory_id,
      v.postcode,
      v.postcode_district,
      v.town_name,
      v.sector_id,
      v.sector_slug,
      v.sector_label,
      v.area_firm_count,
      v.area_ai_visible_count,
      v.area_average_voice_score,
      ai.top_competitor_count
    FROM territory.v_seats_full v
    LEFT JOIN territory.area_intelligence ai
      ON ai.territory_id = v.territory_id AND ai.sector_id = v.sector_id
    WHERE UPPER(v.postcode_district) = UPPER(${district})
      AND v.sector_slug = ${slug}
    LIMIT 1
  `) as Array<{
    seat_id: string;
    state: AvailabilityResult extends { state: infer S } ? S : never;
    tier: 'standard' | 'premium';
    monthly_price_gbp: number;
    setup_fee_gbp: number;
    pending_until: string | null;
    territory_id: string;
    postcode: string;
    postcode_district: string;
    town_name: string | null;
    sector_id: string;
    sector_slug: string;
    sector_label: string;
    area_firm_count: number | null;
    area_ai_visible_count: number | null;
    area_average_voice_score: number | null;
    top_competitor_count: number | null;
  }>;

  if (rows.length === 0) {
    // Differentiate territory vs sector misses to inform area-waitlist flow.
    const territoryRows = (await sql`
      SELECT 1 FROM territory.territories
      WHERE UPPER(postcode_district) = UPPER(${district})
      LIMIT 1
    `) as Array<{ '?column?': number }>;
    if (territoryRows.length === 0) {
      return { state: 'territory_not_found' };
    }
    const sectorRows = (await sql`
      SELECT 1 FROM territory.sectors WHERE slug = ${slug} LIMIT 1
    `) as Array<{ '?column?': number }>;
    if (sectorRows.length === 0) {
      return { state: 'sector_not_found' };
    }
    // Territory exists + sector exists but no seat: treat as not_active.
    return { state: 'territory_not_found' };
  }

  const r = rows[0];
  return {
    state: r.state,
    tier: r.tier,
    seatId: r.seat_id,
    territoryId: r.territory_id,
    sectorId: r.sector_id,
    postcode: r.postcode,
    postcodeDistrict: r.postcode_district,
    townName: r.town_name,
    sectorSlug: r.sector_slug,
    sectorLabel: r.sector_label,
    monthlyPriceGbp: r.monthly_price_gbp,
    setupFeeGbp: r.setup_fee_gbp,
    pendingUntil: r.pending_until,
    areaIntelligence:
      r.area_firm_count === null
        ? null
        : {
            firmCount: r.area_firm_count,
            aiVisibleCount: r.area_ai_visible_count ?? 0,
            averageVoiceScore: r.area_average_voice_score,
            topCompetitorCount: r.top_competitor_count ?? 0,
          },
  };
}

// ---------------------------------------------------------------------------
// SECTOR QUERIES (Layer 1 featured + Layer 2 typeahead + Layer 3 browse)
// ---------------------------------------------------------------------------

/** Active + featured sectors with live per-sector available count. */
export async function getFeaturedSectors(): Promise<SectorTile[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      s.id,
      s.slug,
      s.label,
      s.category,
      s.is_active,
      s.is_featured,
      COALESCE(counts.available_count, 0)::int AS available_count
    FROM territory.sectors s
    LEFT JOIN (
      SELECT sector_id, COUNT(*)::int AS available_count
      FROM territory.seats
      WHERE state = 'available'
      GROUP BY sector_id
    ) counts ON counts.sector_id = s.id
    WHERE s.is_active = true AND s.is_featured = true
    ORDER BY s.display_order ASC
  `) as Array<{
    id: string;
    slug: string;
    label: string;
    category: string;
    is_active: boolean;
    is_featured: boolean;
    available_count: number;
  }>;
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    label: r.label,
    category: r.category,
    availableCount: r.available_count,
    isActive: r.is_active,
    isFeatured: r.is_featured,
  }));
}

/** All sectors grouped by category for the browse-all modal. */
export async function getAllSectorsForBrowse(): Promise<
  Record<string, SectorTile[]>
> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      s.id,
      s.slug,
      s.label,
      s.category,
      s.is_active,
      s.is_featured,
      COALESCE(counts.available_count, 0)::int AS available_count
    FROM territory.sectors s
    LEFT JOIN (
      SELECT sector_id, COUNT(*)::int AS available_count
      FROM territory.seats
      WHERE state = 'available'
      GROUP BY sector_id
    ) counts ON counts.sector_id = s.id
    ORDER BY s.category ASC, s.display_order ASC
  `) as Array<{
    id: string;
    slug: string;
    label: string;
    category: string;
    is_active: boolean;
    is_featured: boolean;
    available_count: number;
  }>;

  const grouped: Record<string, SectorTile[]> = {};
  for (const r of rows) {
    const tile: SectorTile = {
      id: r.id,
      slug: r.slug,
      label: r.label,
      category: r.category,
      availableCount: r.available_count,
      isActive: r.is_active,
      isFeatured: r.is_featured,
    };
    (grouped[r.category] ||= []).push(tile);
  }
  return grouped;
}

/** Typeahead search for sectors. Minimum 2 chars, max 10 results. */
export async function getSectorsByTypeahead(query: string): Promise<SectorTile[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const sql = getDb();
  const like = `%${q.replace(/[%_]/g, '\\$&')}%`;
  const rows = (await sql`
    SELECT
      s.id,
      s.slug,
      s.label,
      s.category,
      s.is_active,
      s.is_featured,
      COALESCE(counts.available_count, 0)::int AS available_count
    FROM territory.sectors s
    LEFT JOIN (
      SELECT sector_id, COUNT(*)::int AS available_count
      FROM territory.seats
      WHERE state = 'available'
      GROUP BY sector_id
    ) counts ON counts.sector_id = s.id
    WHERE s.label ILIKE ${like} OR s.slug ILIKE ${like}
    ORDER BY s.is_active DESC, s.display_order ASC
    LIMIT 10
  `) as Array<{
    id: string;
    slug: string;
    label: string;
    category: string;
    is_active: boolean;
    is_featured: boolean;
    available_count: number;
  }>;
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    label: r.label,
    category: r.category,
    availableCount: r.available_count,
    isActive: r.is_active,
    isFeatured: r.is_featured,
  }));
}

export async function getSectorBySlug(slug: string): Promise<Sector | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM territory.sectors WHERE slug = ${slug.trim().toLowerCase()} LIMIT 1
  `) as Sector[];
  return rows[0] || null;
}

// ---------------------------------------------------------------------------
// SEAT + MAP QUERIES
// ---------------------------------------------------------------------------

export async function getSeatFullById(seatId: string): Promise<SeatFull | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM territory.v_seats_full WHERE seat_id = ${seatId} LIMIT 1
  `) as SeatFull[];
  return rows[0] || null;
}

/**
 * Resolve a seat from the combination of postcode district and sector slug.
 * Used by /territory/apply when the user arrives via the PilotCheckerModal
 * (which only knows postcode + sector, not a seat id).
 */
export async function getSeatFullByPostcodeAndSector(
  postcodeDistrict: string,
  sectorSlug: string,
): Promise<SeatFull | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM territory.v_seats_full
    WHERE UPPER(postcode_district) = UPPER(${postcodeDistrict})
      AND sector_slug = ${sectorSlug}
    LIMIT 1
  `) as SeatFull[];
  return rows[0] || null;
}

/** Aggregate state per active territory postcode for the UK map. */
export async function getMapData(): Promise<
  Array<Pick<MapDataPoint, 'postcode' | 'postcodeDistrict' | 'tier'> & {
    townName: string | null;
    isReserve: boolean;
    availableSectorCount: number;
    pendingSectorCount: number;
    claimedSectorCount: number;
    totalSectorCount: number;
  }>
> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      t.postcode,
      t.postcode_district,
      t.town_name,
      t.tier,
      (t.is_active = false) AS is_reserve,
      COUNT(s.id) FILTER (WHERE s.state = 'available')::int AS available_count,
      COUNT(s.id) FILTER (WHERE s.state = 'pending')::int AS pending_count,
      COUNT(s.id) FILTER (WHERE s.state = 'claimed')::int AS claimed_count,
      COUNT(s.id)::int AS total_count
    FROM territory.territories t
    LEFT JOIN territory.seats s ON s.territory_id = t.id
    GROUP BY t.id, t.postcode, t.postcode_district, t.town_name, t.tier, t.is_active
    ORDER BY t.is_active DESC, t.postcode ASC
  `) as Array<{
    postcode: string;
    postcode_district: string;
    town_name: string | null;
    tier: 'standard' | 'premium';
    is_reserve: boolean;
    available_count: number;
    pending_count: number;
    claimed_count: number;
    total_count: number;
  }>;
  return rows.map((r) => ({
    postcode: r.postcode,
    postcodeDistrict: r.postcode_district,
    townName: r.town_name,
    tier: r.tier,
    isReserve: r.is_reserve,
    availableSectorCount: r.available_count,
    pendingSectorCount: r.pending_count,
    claimedSectorCount: r.claimed_count,
    totalSectorCount: r.total_count,
  }));
}

// ---------------------------------------------------------------------------
// APPLICATIONS
// ---------------------------------------------------------------------------

/**
 * Email dedup precondition. Returns true if an active application from this
 * email exists in the last 24 hours. Query is cheap - email column is indexed.
 */
export async function hasRecentApplicationByEmail(email: string): Promise<boolean> {
  const sql = getDb();
  const rows = (await sql`
    SELECT 1
    FROM territory.applications
    WHERE LOWER(contact_email) = LOWER(${email})
      AND created_at > NOW() - INTERVAL '24 hours'
      AND status IN ('received', 'qualified')
    LIMIT 1
  `) as Array<{ '?column?': number }>;
  return rows.length > 0;
}

/**
 * Atomically insert a seat-bound application and flip the seat to pending
 * for 48h. Runs as a single SQL statement via CTE. Returns null if the
 * seat was not actually 'available' at write time (race with another
 * applicant).
 *
 * `entry_type = 'seat'` is written explicitly - the CHECK constraint on
 * territory.applications requires it alongside seat_id + sector_slug.
 */
export async function createApplication(
  input: ApplicationInsert,
): Promise<{ applicationId: string; pendingUntil: string } | null> {
  const sql = getDb();
  const rows = (await sql`
    WITH checked AS (
      SELECT id FROM territory.seats
      WHERE id = ${input.seatId} AND state = 'available'
      FOR UPDATE
    ),
    new_app AS (
      INSERT INTO territory.applications (
        entry_type, seat_id, firm_name, contact_name, contact_role,
        contact_email, contact_phone, website_url, firm_postcode,
        sector_slug, ai_visibility_approach, additional_context, status
      )
      SELECT
        'seat', ${input.seatId}, ${input.firmName}, ${input.contactName},
        ${input.contactRole}, ${input.contactEmail}, ${input.contactPhone},
        ${input.websiteUrl}, ${input.firmPostcode}, ${input.sectorSlug},
        ${input.aiVisibilityApproach}, ${input.additionalContext}, 'received'
      FROM checked
      RETURNING id, created_at
    ),
    seat_update AS (
      UPDATE territory.seats
      SET state = 'pending',
          pending_until = NOW() + INTERVAL '48 hours',
          current_application_id = (SELECT id FROM new_app),
          updated_at = NOW()
      WHERE id = ${input.seatId}
        AND EXISTS (SELECT 1 FROM new_app)
      RETURNING id, pending_until
    )
    SELECT
      na.id AS application_id,
      su.pending_until
    FROM new_app na
    JOIN seat_update su ON true
  `) as Array<{ application_id: string; pending_until: string }>;

  if (rows.length === 0) return null;
  return {
    applicationId: rows[0].application_id,
    pendingUntil: rows[0].pending_until,
  };
}

/**
 * Insert a freeform (seat-less) application. No CTE - there is no seat row
 * to flip. Freeform rows are genuinely seat-less until Dan activates the
 * requested sector in a later phase.
 *
 * The CHECK constraint on territory.applications enforces: seat_id NULL,
 * sector_slug NULL, requested_postcode_district + freeform_industry NOT
 * NULL when entry_type = 'freeform'.
 */
export async function createFreeformApplication(
  input: FreeformApplicationInsert,
): Promise<{ applicationId: string }> {
  const sql = getDb();
  const rows = (await sql`
    INSERT INTO territory.applications (
      entry_type, seat_id,
      firm_name, contact_name, contact_role, contact_email,
      contact_phone, website_url, firm_postcode,
      sector_slug,
      requested_postcode_district, freeform_industry,
      ai_visibility_approach, additional_context, status
    ) VALUES (
      'freeform', NULL,
      ${input.firmName}, ${input.contactName}, ${input.contactRole},
      ${input.contactEmail}, ${input.contactPhone}, ${input.websiteUrl},
      ${input.firmPostcode},
      NULL,
      ${input.requestedPostcodeDistrict}, ${input.freeformIndustry},
      ${input.aiVisibilityApproach}, ${input.additionalContext}, 'received'
    )
    RETURNING id
  `) as Array<{ id: string }>;
  return { applicationId: rows[0].id };
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM territory.applications WHERE id = ${id} LIMIT 1
  `) as Application[];
  return rows[0] || null;
}

// ---------------------------------------------------------------------------
// SEAT WAITLIST (for pending/claimed/not_active seats on the public page)
// ---------------------------------------------------------------------------

export async function createWaitlistEntry(
  input: WaitlistInsert,
): Promise<{ waitlistId: string; position: number }> {
  const sql = getDb();
  const rows = (await sql`
    WITH next_pos AS (
      SELECT COALESCE(MAX(waitlist_position), 0) + 1 AS position
      FROM territory.waitlist
      WHERE seat_id = ${input.seatId}
    )
    INSERT INTO territory.waitlist
      (seat_id, contact_name, contact_email, firm_name, waitlist_position)
    SELECT
      ${input.seatId},
      ${input.contactName},
      ${input.contactEmail},
      ${input.firmName},
      (SELECT position FROM next_pos)
    ON CONFLICT (seat_id, contact_email) DO UPDATE
      SET contact_name = EXCLUDED.contact_name,
          firm_name = EXCLUDED.firm_name
    RETURNING id, waitlist_position
  `) as Array<{ id: string; waitlist_position: number }>;
  return {
    waitlistId: rows[0].id,
    position: rows[0].waitlist_position,
  };
}

export async function getWaitlistEntryById(id: string): Promise<WaitlistEntry | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM territory.waitlist WHERE id = ${id} LIMIT 1
  `) as WaitlistEntry[];
  return rows[0] || null;
}

// ---------------------------------------------------------------------------
// AREA WAITLIST (for regions/postcodes not in active pilot)
// ---------------------------------------------------------------------------

export async function createAreaWaitlistEntry(
  input: AreaWaitlistInsert,
): Promise<{ areaWaitlistId: string; assignedPosition: number | null }> {
  const sql = getDb();
  const rows = (await sql`
    INSERT INTO territory.area_waitlist (
      firm_name, contact_name, contact_email,
      requested_postcode, requested_region, requested_sector_slug,
      entry_source
    )
    VALUES (
      ${input.firmName}, ${input.contactName}, ${input.contactEmail},
      ${input.requestedPostcode}, ${input.requestedRegion},
      ${input.requestedSectorSlug}, ${input.entrySource}
    )
    RETURNING id
  `) as Array<{ id: string }>;
  const id = rows[0].id;

  // Position = 1 + count of older un-notified rows for the same postcode.
  // Null when the entry is region-level (no postcode) since position is
  // only meaningful within a single district queue.
  let assignedPosition: number | null = null;
  if (input.requestedPostcode) {
    const positionRows = (await sql`
      SELECT COUNT(*)::int AS pos
      FROM territory.area_waitlist
      WHERE requested_postcode = ${input.requestedPostcode}
        AND notified_at IS NULL
        AND created_at <= (
          SELECT created_at FROM territory.area_waitlist WHERE id = ${id}
        )
    `) as Array<{ pos: number }>;
    assignedPosition = positionRows[0]?.pos ?? null;
  }
  return { areaWaitlistId: id, assignedPosition };
}

/**
 * Current queue size for a postcode district (or full postcode), counting
 * only entries that have not yet been notified. Used by the public area
 * waitlist form to show "you will be position #(N+1)" before submission.
 */
export async function getAreaWaitlistQueueSize(
  requestedPostcode: string,
): Promise<number> {
  const sql = getDb();
  const rows = (await sql`
    SELECT COUNT(*)::int AS n
    FROM territory.area_waitlist
    WHERE requested_postcode = ${requestedPostcode}
      AND notified_at IS NULL
  `) as Array<{ n: number }>;
  return rows[0]?.n ?? 0;
}

export async function getAreaWaitlistEntryById(
  id: string,
): Promise<AreaWaitlistEntry | null> {
  const sql = getDb();
  const rows = (await sql`
    SELECT * FROM territory.area_waitlist WHERE id = ${id} LIMIT 1
  `) as AreaWaitlistEntry[];
  return rows[0] || null;
}

// ---------------------------------------------------------------------------
// CRON: expire pending seats
// ---------------------------------------------------------------------------

export async function expirePendingSeats(): Promise<number> {
  const sql = getDb();
  const rows = (await sql`
    SELECT expired_seat_id, expired_application_id
    FROM territory.expire_pending_seats()
  `) as Array<{ expired_seat_id: string; expired_application_id: string | null }>;
  return rows.length;
}

// ---------------------------------------------------------------------------
// UTILITY (used by TerritoryChecker auto-prefill from map pin click)
// ---------------------------------------------------------------------------

export { normalisePostcode, toPostcodeDistrict };
