/**
 * Pure helpers for postcode display / hero pricing (unit-testable).
 * DB adapters live in postcodePricing.ts.
 */

export type Tier = 'standard' | 'premium';

export type PostcodeDisplayState = {
  postcode: string;
  tier: Tier;
  baseMonthlyPriceGbp: number;
  baseSetupFeeGbp: number | null;
  isPromotional: boolean;
  promotion?: {
    id: string;
    promotionalMonthlyPriceGbp: number;
    promotionalSetupFeeGbp: number | null;
    headline: string | null;
    description: string | null;
    expiresAt: string;
    originTier: Tier;
  };
};

export function toNumberGbp(v: unknown): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === 'number') return v;
  const n = Number.parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

export function buildPostcodeDisplayState(input: {
  postcode: string;
  tier: Tier;
  monthlyPriceGbp: unknown;
  setupFeeGbp: unknown | null;
  promotion: null | {
    id: string;
    promotional_monthly_price_gbp: unknown;
    promotional_setup_fee_gbp: unknown | null;
    headline: string | null;
    description: string | null;
    expires_at: string;
    origin_tier: string;
  };
}): PostcodeDisplayState {
  const baseMonthly = toNumberGbp(input.monthlyPriceGbp);
  const baseSetup =
    input.setupFeeGbp === null || input.setupFeeGbp === undefined
      ? null
      : toNumberGbp(input.setupFeeGbp);
  const p = input.promotion;
  if (!p) {
    return {
      postcode: input.postcode,
      tier: input.tier,
      baseMonthlyPriceGbp: baseMonthly,
      baseSetupFeeGbp: baseSetup,
      isPromotional: false,
    };
  }
  const originTier: Tier = p.origin_tier === 'premium' ? 'premium' : 'standard';
  return {
    postcode: input.postcode,
    tier: input.tier,
    baseMonthlyPriceGbp: baseMonthly,
    baseSetupFeeGbp: baseSetup,
    isPromotional: true,
    promotion: {
      id: p.id,
      promotionalMonthlyPriceGbp: toNumberGbp(p.promotional_monthly_price_gbp),
      promotionalSetupFeeGbp:
        p.promotional_setup_fee_gbp === null || p.promotional_setup_fee_gbp === undefined
          ? null
          : toNumberGbp(p.promotional_setup_fee_gbp),
      headline: p.headline,
      description: p.description,
      expiresAt: p.expires_at,
      originTier,
    },
  };
}

export function effectiveMonthlyGbp(state: PostcodeDisplayState): number {
  if (state.isPromotional && state.promotion) {
    return state.promotion.promotionalMonthlyPriceGbp;
  }
  return state.baseMonthlyPriceGbp;
}

export function effectiveSetupGbp(state: PostcodeDisplayState): number | null {
  if (state.isPromotional && state.promotion) {
    return state.promotion.promotionalSetupFeeGbp;
  }
  return state.baseSetupFeeGbp;
}

/** Snapshot used when inserting an application (submission-time lock). */
export function priceLockFromDisplayState(state: PostcodeDisplayState): {
  lockedMonthlyPriceGbp: number;
  lockedSetupFeeGbp: number | null;
  lockedPromotionId: string | null;
} {
  return {
    lockedMonthlyPriceGbp: effectiveMonthlyGbp(state),
    lockedSetupFeeGbp: effectiveSetupGbp(state),
    lockedPromotionId: state.isPromotional && state.promotion ? state.promotion.id : null,
  };
}

/** True when `is_active` may be set to false (no pending or claimed seats). */
export function sectorAllowsDeactivation(pendingOrClaimedSeatCount: number): boolean {
  return pendingOrClaimedSeatCount === 0;
}

/** Map aggregate counts + flags to polygon status (matches SQL ordering intent). */
export function deriveAreaAvailabilityStatus(input: {
  totalCount: number;
  claimedCount: number;
  pendingCount: number;
  availableCount: number;
  territoryTier: Tier;
  hasActivePromotion: boolean;
}): 'available' | 'premium' | 'pending' | 'claimed' | 'none' | 'promotional' {
  const {
    totalCount,
    claimedCount,
    pendingCount,
    availableCount,
    territoryTier,
    hasActivePromotion,
  } = input;
  if (totalCount === 0) return 'none';
  if (claimedCount === totalCount) return 'claimed';
  if (pendingCount > 0) return 'pending';
  if (hasActivePromotion) return 'promotional';
  if (availableCount > 0 && territoryTier === 'premium') return 'premium';
  if (availableCount > 0) return 'available';
  return 'none';
}
