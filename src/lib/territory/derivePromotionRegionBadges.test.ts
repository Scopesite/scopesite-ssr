import { describe, expect, it } from 'vitest';
import { derivePromotionRegionBadges } from './derivePromotionRegionBadges';
import type { AreaStatus } from './types';

function promoArea(
  area: string,
  expiresAt: string,
  tier: 'standard' | 'premium' = 'standard',
): AreaStatus {
  return {
    area,
    tier,
    townName: null,
    status: 'promotional',
    availableCount: 0,
    pendingCount: 0,
    claimedCount: 0,
    totalCount: 0,
    promotionExpiresAt: expiresAt,
    promotionOriginTier: 'standard',
    promotionHeadline: null,
    promotionDescription: null,
    promotionMonthlyPriceGbp: 250,
    promotionOriginMonthlyPriceGbp: 500,
  };
}

describe('derivePromotionRegionBadges', () => {
  it('returns empty when no promotional areas', () => {
    const areas: Record<string, AreaStatus> = {
      WV: {
        area: 'WV',
        tier: 'standard',
        townName: null,
        status: 'available',
        availableCount: 1,
        pendingCount: 0,
        claimedCount: 0,
        totalCount: 1,
      },
    };
    expect(derivePromotionRegionBadges(areas)).toEqual([]);
  });

  it('maps a promotional area to its UK region', () => {
    const areas: Record<string, AreaStatus> = {
      WV: promoArea('WV', '2030-06-01T00:00:00.000Z'),
    };
    const badges = derivePromotionRegionBadges(areas);
    expect(badges).toHaveLength(1);
    expect(badges[0]).toEqual({ region: 'west_midlands', areaCode: 'WV' });
  });

  it('returns one badge per region; different regions both appear', () => {
    const areas: Record<string, AreaStatus> = {
      WV: promoArea('WV', '2030-12-01T00:00:00.000Z'),
      BS: promoArea('BS', '2030-01-01T00:00:00.000Z'),
    };
    const badges = derivePromotionRegionBadges(areas);
    expect(badges).toHaveLength(2);
    expect(badges.map((b) => b.region).sort()).toEqual(['south_west', 'west_midlands']);
  });

  it('collapses two promotional areas in the same region to one badge', () => {
    const areas: Record<string, AreaStatus> = {
      WV: promoArea('WV', '2030-12-01T00:00:00.000Z'),
      B: promoArea('B', '2030-01-01T00:00:00.000Z'),
    };
    const badges = derivePromotionRegionBadges(areas);
    expect(badges).toHaveLength(1);
    expect(badges[0]?.region).toBe('west_midlands');
    expect(badges[0]?.areaCode).toBe('B');
  });

  it('picks earliest expires_at when two areas share a region', () => {
    const areas: Record<string, AreaStatus> = {
      WV: promoArea('WV', '2030-12-01T00:00:00.000Z'),
      DY: promoArea('DY', '2030-03-01T00:00:00.000Z'),
    };
    const badges = derivePromotionRegionBadges(areas);
    expect(badges.filter((b) => b.region === 'west_midlands')).toHaveLength(1);
    expect(badges.find((b) => b.region === 'west_midlands')?.areaCode).toBe('DY');
  });

  it('ties on expires_at by alphabetical area code', () => {
    const t = '2030-01-01T00:00:00.000Z';
    const areas: Record<string, AreaStatus> = {
      WV: promoArea('WV', t),
      DY: promoArea('DY', t),
    };
    const badges = derivePromotionRegionBadges(areas);
    expect(badges.find((b) => b.region === 'west_midlands')?.areaCode).toBe('DY');
  });
});
