export type SiteBannerRow = {
  bannerEnabled: boolean;
  bannerHeadline: string | null;
  bannerDescription: string | null;
  bannerCtaLabel: string | null;
  bannerCtaUrl: string | null;
  updatedAt: string;
  updatedBy: string | null;
};

/** Fallback when `site_config` has no row (pre-migration or empty DB). */
export const DEFAULT_SITE_BANNER_ROW: SiteBannerRow = {
  bannerEnabled: false,
  bannerHeadline: null,
  bannerDescription: null,
  bannerCtaLabel: null,
  bannerCtaUrl: null,
  updatedAt: new Date(0).toISOString(),
  updatedBy: null,
};

/** Require http(s) URL when non-empty. */
export function assertValidBannerCtaUrl(url: string | null): void {
  if (url === null || url.trim() === '') return;
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    throw new Error('CTA URL must be a valid http or https URL.');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('CTA URL must use http or https.');
  }
}
