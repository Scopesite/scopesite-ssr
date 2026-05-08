import 'server-only';

import { unstable_cache } from 'next/cache';
import { getDb } from './db';
import {
  buildPostcodeDisplayState,
  priceLockFromDisplayState,
  type PostcodeDisplayState,
  toNumberGbp,
} from './postcodePricingLogic';
import {
  mapQueryRowToAdminPostcodeListRow,
  type AdminPostcodeListRow,
  type AdminPostcodeQueryRow,
} from './postcodeAdminRows';

export type { PostcodeDisplayState };
export type { AdminPostcodeListRow, AdminPostcodeQueryRow };
export { mapQueryRowToAdminPostcodeListRow };

export async function getPostcodeDisplayStateUncached(
  postcode: string,
): Promise<PostcodeDisplayState | null> {
  return fetchPostcodeDisplayStateRaw(postcode.trim().toUpperCase());
}

async function fetchPostcodeDisplayStateRaw(
  postcodeKey: string,
): Promise<PostcodeDisplayState | null> {
  const sql = getDb();
  const key = postcodeKey.trim().toUpperCase();
  const rows = (await sql`
    SELECT
      t.postcode,
      t.tier::text AS tier,
      t.monthly_price_gbp,
      t.setup_fee_gbp,
      p.id AS promo_id,
      p.promotional_monthly_price_gbp,
      p.promotional_setup_fee_gbp,
      p.headline,
      p.description,
      p.expires_at::text AS expires_at,
      p.origin_tier::text AS origin_tier
    FROM territory.territories t
    LEFT JOIN LATERAL (
      SELECT *
      FROM territory.postcode_promotions pr
      WHERE pr.postcode = t.postcode
        AND pr.expired = FALSE
        AND pr.cancelled = FALSE
        AND pr.expires_at > NOW()
        AND pr.starts_at <= NOW()
      ORDER BY pr.starts_at DESC
      LIMIT 1
    ) p ON TRUE
    WHERE UPPER(t.postcode) = ${key}
       OR UPPER(t.postcode_district) = ${key}
    ORDER BY LENGTH(t.postcode) ASC
    LIMIT 1
  `) as Array<{
    postcode: string;
    tier: string;
    monthly_price_gbp: unknown;
    setup_fee_gbp: unknown | null;
    promo_id: string | null;
    promotional_monthly_price_gbp: unknown | null;
    promotional_setup_fee_gbp: unknown | null;
    headline: string | null;
    description: string | null;
    expires_at: string | null;
    origin_tier: string | null;
  }>;

  const r = rows[0];
  if (!r) return null;

  const promotion =
    r.promo_id && r.expires_at
      ? {
          id: r.promo_id,
          promotional_monthly_price_gbp: r.promotional_monthly_price_gbp,
          promotional_setup_fee_gbp: r.promotional_setup_fee_gbp,
          headline: r.headline,
          description: r.description,
          expires_at: r.expires_at,
          origin_tier: r.origin_tier ?? 'standard',
        }
      : null;

  return buildPostcodeDisplayState({
    postcode: r.postcode,
    tier: r.tier === 'premium' ? 'premium' : 'standard',
    monthlyPriceGbp: r.monthly_price_gbp,
    setupFeeGbp: r.setup_fee_gbp,
    promotion,
  });
}

export async function getPostcodeDisplayState(
  postcode: string,
): Promise<PostcodeDisplayState | null> {
  const key = postcode.trim().toUpperCase();
  const cached = unstable_cache(
    () => fetchPostcodeDisplayStateRaw(key),
    ['territory-postcode-display', key],
    { revalidate: 60, tags: ['territory'] },
  );
  return cached();
}

async function fetchCheapestActiveMonthlyRaw(): Promise<number> {
  const sql = getDb();
  const rows = (await sql`
    WITH areas AS (
      SELECT
        t.postcode,
        t.monthly_price_gbp,
        t.setup_fee_gbp,
        (
          SELECT pr.promotional_monthly_price_gbp
          FROM territory.postcode_promotions pr
          WHERE pr.postcode = t.postcode
            AND pr.expired = FALSE
            AND pr.cancelled = FALSE
            AND pr.expires_at > NOW()
            AND pr.starts_at <= NOW()
          ORDER BY pr.starts_at DESC
          LIMIT 1
        ) AS promo_monthly
      FROM territory.territories t
      WHERE t.is_active = TRUE
        AND t.postcode = t.postcode_area
    )
    SELECT MIN(
      COALESCE(promo_monthly, monthly_price_gbp)
    )::numeric AS min_monthly
    FROM areas
  `) as Array<{ min_monthly: unknown | null }>;
  const v = rows[0]?.min_monthly;
  const n = toNumberGbp(v);
  return n > 0 ? Math.floor(n) : 500;
}

export async function getCheapestActiveMonthlyPrice(): Promise<number> {
  const cached = unstable_cache(
    fetchCheapestActiveMonthlyRaw,
    ['territory-cheapest-monthly'],
    { revalidate: 60, tags: ['territory'] },
  );
  return cached();
}

/** Price snapshot for application INSERT (no cache — submission-time truth). */
export async function resolvePriceLockForPostcode(
  postcodeDistrict: string,
): Promise<{
  lockedMonthlyPriceGbp: number;
  lockedSetupFeeGbp: number | null;
  lockedPromotionId: string | null;
}> {
  const state = await fetchPostcodeDisplayStateRaw(postcodeDistrict.trim().toUpperCase());
  if (!state) {
    return {
      lockedMonthlyPriceGbp: 500,
      lockedSetupFeeGbp: 750,
      lockedPromotionId: null,
    };
  }
  return priceLockFromDisplayState(state);
}

// ---------------------------------------------------------------------------
// ADMIN: postcodes list (single query + display-state mapping)
// ---------------------------------------------------------------------------

export async function getAdminPostcodeRows(filters: {
  q?: string;
  tier?: 'all' | 'standard' | 'premium';
  promotion?: 'all' | 'active' | 'none';
  limit?: number;
  offset?: number;
}): Promise<AdminPostcodeListRow[]> {
  const sql = getDb();
  const limit = Math.min(Math.max(filters.limit ?? 200, 1), 500);
  const offset = Math.max(filters.offset ?? 0, 0);
  const q = (filters.q ?? '').trim();
  const tier = filters.tier ?? 'all';
  const prom = filters.promotion ?? 'all';

  const rows = (await sql`
    SELECT
      t.id,
      t.postcode,
      t.postcode_area,
      t.postcode_district,
      t.town_name,
      t.county,
      t.tier::text AS tier,
      t.is_active,
      t.monthly_price_gbp,
      t.setup_fee_gbp,
      (p.id IS NOT NULL) AS has_active_promotion,
      p.expires_at::text AS promotion_expires_at,
      p.id::text AS active_promotion_id,
      p.headline AS promotion_headline,
      p.description AS promotion_description,
      p.promotional_monthly_price_gbp,
      p.origin_monthly_price_gbp,
      p.promotional_setup_fee_gbp,
      p.origin_setup_fee_gbp,
      p.origin_tier::text AS promotion_origin_tier
    FROM territory.territories t
    LEFT JOIN LATERAL (
      SELECT *
      FROM territory.postcode_promotions pr
      WHERE pr.postcode = t.postcode
        AND pr.expired = FALSE
        AND pr.cancelled = FALSE
        AND pr.expires_at > NOW()
        AND pr.starts_at <= NOW()
      ORDER BY pr.starts_at DESC
      LIMIT 1
    ) p ON TRUE
    WHERE t.postcode = t.postcode_area
      AND (${tier} = 'all' OR t.tier::text = ${tier})
      AND (
        ${prom} = 'all'
        OR (${prom} = 'active' AND p.id IS NOT NULL)
        OR (${prom} = 'none' AND p.id IS NULL)
      )
      AND (
        ${q} = ''
        OR UPPER(t.postcode) LIKE ${'%' + q.toUpperCase().replace(/%/g, '\\%').replace(/_/g, '\\_') + '%'}
        OR UPPER(COALESCE(t.town_name, '')) LIKE ${'%' + q.toUpperCase().replace(/%/g, '\\%').replace(/_/g, '\\_') + '%'}
        OR UPPER(COALESCE(t.county, '')) LIKE ${'%' + q.toUpperCase().replace(/%/g, '\\%').replace(/_/g, '\\_') + '%'}
      )
    ORDER BY t.postcode ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `) as AdminPostcodeQueryRow[];

  return rows.map(mapQueryRowToAdminPostcodeListRow);
}
