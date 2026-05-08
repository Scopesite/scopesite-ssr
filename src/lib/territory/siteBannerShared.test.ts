import { describe, expect, it } from 'vitest';
import { assertValidBannerCtaUrl, DEFAULT_SITE_BANNER_ROW } from './siteBannerShared';

describe('DEFAULT_SITE_BANNER_ROW', () => {
  it('is disabled with empty copy', () => {
    expect(DEFAULT_SITE_BANNER_ROW.bannerEnabled).toBe(false);
    expect(DEFAULT_SITE_BANNER_ROW.bannerHeadline).toBeNull();
    expect(DEFAULT_SITE_BANNER_ROW.bannerCtaUrl).toBeNull();
  });
});

describe('assertValidBannerCtaUrl', () => {
  it('allows null and blank', () => {
    expect(() => assertValidBannerCtaUrl(null)).not.toThrow();
    expect(() => assertValidBannerCtaUrl('  ')).not.toThrow();
  });

  it('allows https URLs', () => {
    expect(() => assertValidBannerCtaUrl('https://scopesite.co.uk/foo')).not.toThrow();
  });

  it('rejects non-http schemes', () => {
    expect(() => assertValidBannerCtaUrl('javascript:alert(1)')).toThrow();
  });

  it('rejects malformed URLs', () => {
    expect(() => assertValidBannerCtaUrl('not a url')).toThrow();
  });
});
