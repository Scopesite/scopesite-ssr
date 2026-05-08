import { describe, expect, it } from 'vitest';
import {
  buildPostcodeDisplayState,
  deriveAreaAvailabilityStatus,
  priceLockFromDisplayState,
  sectorAllowsDeactivation,
} from './postcodePricingLogic';

describe('buildPostcodeDisplayState', () => {
  it('returns base-only state when no promotion', () => {
    const s = buildPostcodeDisplayState({
      postcode: 'BA1',
      tier: 'standard',
      monthlyPriceGbp: 500,
      setupFeeGbp: 100,
      promotion: null,
    });
    expect(s.isPromotional).toBe(false);
    expect(s.baseMonthlyPriceGbp).toBe(500);
    expect(s.baseSetupFeeGbp).toBe(100);
    expect(s.promotion).toBeUndefined();
  });

  it('returns premium tier base', () => {
    const s = buildPostcodeDisplayState({
      postcode: 'SW1',
      tier: 'premium',
      monthlyPriceGbp: 750,
      setupFeeGbp: null,
      promotion: null,
    });
    expect(s.tier).toBe('premium');
    expect(s.baseSetupFeeGbp).toBeNull();
  });

  it('maps active promotion (origin standard)', () => {
    const s = buildPostcodeDisplayState({
      postcode: 'BA1',
      tier: 'standard',
      monthlyPriceGbp: 500,
      setupFeeGbp: 50,
      promotion: {
        id: 'p1',
        promotional_monthly_price_gbp: 400,
        promotional_setup_fee_gbp: 25,
        headline: 'H',
        description: 'D',
        expires_at: '2030-01-01T00:00:00.000Z',
        origin_tier: 'standard',
      },
    });
    expect(s.isPromotional).toBe(true);
    expect(s.promotion?.promotionalMonthlyPriceGbp).toBe(400);
    expect(s.promotion?.originTier).toBe('standard');
  });

  it('maps active promotion (origin premium)', () => {
    const s = buildPostcodeDisplayState({
      postcode: 'SW1',
      tier: 'premium',
      monthlyPriceGbp: 900,
      setupFeeGbp: null,
      promotion: {
        id: 'p2',
        promotional_monthly_price_gbp: 700,
        promotional_setup_fee_gbp: null,
        headline: null,
        description: null,
        expires_at: '2030-01-01T00:00:00.000Z',
        origin_tier: 'premium',
      },
    });
    expect(s.promotion?.originTier).toBe('premium');
  });

  it('treats cancelled/expired rows as absent (caller passes null)', () => {
    const s = buildPostcodeDisplayState({
      postcode: 'BA1',
      tier: 'standard',
      monthlyPriceGbp: 500,
      setupFeeGbp: null,
      promotion: null,
    });
    expect(s.isPromotional).toBe(false);
  });
});

describe('priceLockFromDisplayState', () => {
  it('locks base prices when not promotional', () => {
    const state = buildPostcodeDisplayState({
      postcode: 'BA1',
      tier: 'standard',
      monthlyPriceGbp: 520,
      setupFeeGbp: 80,
      promotion: null,
    });
    expect(priceLockFromDisplayState(state)).toEqual({
      lockedMonthlyPriceGbp: 520,
      lockedSetupFeeGbp: 80,
      lockedPromotionId: null,
    });
  });

  it('locks promotional prices and promotion id', () => {
    const state = buildPostcodeDisplayState({
      postcode: 'BA1',
      tier: 'standard',
      monthlyPriceGbp: 520,
      setupFeeGbp: 80,
      promotion: {
        id: 'promo-uuid',
        promotional_monthly_price_gbp: 400,
        promotional_setup_fee_gbp: 20,
        headline: 'x',
        description: 'y',
        expires_at: '2030-01-01T00:00:00.000Z',
        origin_tier: 'standard',
      },
    });
    expect(priceLockFromDisplayState(state)).toEqual({
      lockedMonthlyPriceGbp: 400,
      lockedSetupFeeGbp: 20,
      lockedPromotionId: 'promo-uuid',
    });
  });
});

describe('deriveAreaAvailabilityStatus', () => {
  const base = {
    totalCount: 4,
    claimedCount: 0,
    pendingCount: 0,
    availableCount: 4,
    territoryTier: 'standard' as const,
    hasActivePromotion: false,
  };

  it('pending wins over promotional when any seat is pending', () => {
    expect(
      deriveAreaAvailabilityStatus({
        ...base,
        pendingCount: 1,
        availableCount: 3,
        hasActivePromotion: true,
      }),
    ).toBe('pending');
  });

  it('promotional when promotion active and no pending', () => {
    expect(
      deriveAreaAvailabilityStatus({
        ...base,
        hasActivePromotion: true,
      }),
    ).toBe('promotional');
  });

  it('claimed when all seats claimed', () => {
    expect(
      deriveAreaAvailabilityStatus({
        ...base,
        claimedCount: 4,
        availableCount: 0,
      }),
    ).toBe('claimed');
  });
});

describe('sectorAllowsDeactivation', () => {
  it('allows when no occupied seats', () => {
    expect(sectorAllowsDeactivation(0)).toBe(true);
  });
  it('blocks when pending or claimed seats exist', () => {
    expect(sectorAllowsDeactivation(3)).toBe(false);
  });
});
