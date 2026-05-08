import 'server-only';

import { unstable_cache } from 'next/cache';
import { getDb } from './db';
import {
  assertValidBannerCtaUrl,
  DEFAULT_SITE_BANNER_ROW,
  type SiteBannerRow,
} from './siteBannerShared';

export type { SiteBannerRow };
export { assertValidBannerCtaUrl, DEFAULT_SITE_BANNER_ROW };
function rowFromDb(r: {
  banner_enabled: boolean;
  banner_headline: string | null;
  banner_description: string | null;
  banner_cta_label: string | null;
  banner_cta_url: string | null;
  updated_at: string;
  updated_by: string | null;
}): SiteBannerRow {
  return {
    bannerEnabled: r.banner_enabled,
    bannerHeadline: r.banner_headline,
    bannerDescription: r.banner_description,
    bannerCtaLabel: r.banner_cta_label,
    bannerCtaUrl: r.banner_cta_url,
    updatedAt: r.updated_at,
    updatedBy: r.updated_by,
  };
}

/** Direct read for admin (no request cache). */
export async function getSiteBannerUncached(): Promise<SiteBannerRow> {
  return fetchSiteBannerRaw();
}

async function fetchSiteBannerRaw(): Promise<SiteBannerRow> {
  const sql = getDb();
  const rows = (await sql`
    SELECT
      banner_enabled,
      banner_headline,
      banner_description,
      banner_cta_label,
      banner_cta_url,
      updated_at::text AS updated_at,
      updated_by
    FROM territory.site_config
    WHERE id = 1
    LIMIT 1
  `) as Array<{
    banner_enabled: boolean;
    banner_headline: string | null;
    banner_description: string | null;
    banner_cta_label: string | null;
    banner_cta_url: string | null;
    updated_at: string;
    updated_by: string | null;
  }>;
  const r = rows[0];
  if (!r) {
    return DEFAULT_SITE_BANNER_ROW;
  }
  return rowFromDb(r);
}

export async function getSiteBanner(): Promise<SiteBannerRow> {
  const cached = unstable_cache(
    () => fetchSiteBannerRaw(),
    ['territory-site-banner'],
    { revalidate: 60, tags: ['territory'] },
  );
  return cached();
}

export type SiteBannerUpdateInput = {
  bannerEnabled: boolean;
  bannerHeadline: string | null;
  bannerDescription: string | null;
  bannerCtaLabel: string | null;
  bannerCtaUrl: string | null;
  updatedBy?: string;
};

function normaliseOptionalText(v: string | null | undefined, maxLen: number): string | null {
  const t = (v ?? '').trim();
  if (!t) return null;
  return t.length > maxLen ? t.slice(0, maxLen) : t;
}

export async function updateSiteBanner(input: SiteBannerUpdateInput): Promise<SiteBannerRow> {
  const headline = normaliseOptionalText(input.bannerHeadline, 100);
  const description = normaliseOptionalText(input.bannerDescription, 280);
  const ctaLabel = normaliseOptionalText(input.bannerCtaLabel, 30);
  const ctaUrl = normaliseOptionalText(input.bannerCtaUrl, 2000);
  assertValidBannerCtaUrl(ctaUrl);

  const sql = getDb();
  const rows = (await sql`
    INSERT INTO territory.site_config (
      id,
      banner_enabled,
      banner_headline,
      banner_description,
      banner_cta_label,
      banner_cta_url,
      updated_at,
      updated_by
    )
    VALUES (
      1,
      ${input.bannerEnabled},
      ${headline},
      ${description},
      ${ctaLabel},
      ${ctaUrl},
      NOW(),
      ${input.updatedBy ?? null}
    )
    ON CONFLICT (id) DO UPDATE SET
      banner_enabled = EXCLUDED.banner_enabled,
      banner_headline = EXCLUDED.banner_headline,
      banner_description = EXCLUDED.banner_description,
      banner_cta_label = EXCLUDED.banner_cta_label,
      banner_cta_url = EXCLUDED.banner_cta_url,
      updated_at = NOW(),
      updated_by = EXCLUDED.updated_by
    RETURNING
      banner_enabled,
      banner_headline,
      banner_description,
      banner_cta_label,
      banner_cta_url,
      updated_at::text AS updated_at,
      updated_by
  `) as Array<{
    banner_enabled: boolean;
    banner_headline: string | null;
    banner_description: string | null;
    banner_cta_label: string | null;
    banner_cta_url: string | null;
    updated_at: string;
    updated_by: string | null;
  }>;
  const r = rows[0];
  if (!r) {
    throw new Error('site_config upsert returned no row');
  }
  return rowFromDb(r);
}
