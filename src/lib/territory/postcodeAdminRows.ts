import {
  buildPostcodeDisplayState,
  effectiveMonthlyGbp,
  toNumberGbp,
} from './postcodePricingLogic';

export interface AdminPostcodeListRow {
  id: string;
  postcode: string;
  postcode_area: string;
  postcode_district: string;
  town_name: string | null;
  county: string | null;
  tier: 'standard' | 'premium';
  is_active: boolean;
  monthly_price_gbp: number | null;
  setup_fee_gbp: number | null;
  has_active_promotion: boolean;
  promotion_expires_at: string | null;
  active_promotion_id: string | null;
  promotion_headline: string | null;
  promotion_description: string | null;
  promotional_monthly_price_gbp: number | null;
  origin_monthly_price_gbp: number | null;
  liveDisplayedMonthlyGbp: number;
}

/** Raw shape from `getAdminPostcodeRows` SQL (for unit tests). */
export type AdminPostcodeQueryRow = {
  id: string;
  postcode: string;
  postcode_area: string;
  postcode_district: string;
  town_name: string | null;
  county: string | null;
  tier: string;
  is_active: boolean;
  monthly_price_gbp: unknown;
  setup_fee_gbp: unknown | null;
  has_active_promotion: boolean;
  promotion_expires_at: string | null;
  active_promotion_id: string | null;
  promotion_headline: string | null;
  promotion_description: string | null;
  promotional_monthly_price_gbp: unknown | null;
  origin_monthly_price_gbp: unknown | null;
  promotional_setup_fee_gbp: unknown | null;
  origin_setup_fee_gbp: unknown | null;
  promotion_origin_tier: string | null;
};

export function mapQueryRowToAdminPostcodeListRow(r: AdminPostcodeQueryRow): AdminPostcodeListRow {
  const tier: 'standard' | 'premium' = r.tier === 'premium' ? 'premium' : 'standard';
  const monthlyNull =
    r.monthly_price_gbp === null || r.monthly_price_gbp === undefined
      ? null
      : toNumberGbp(r.monthly_price_gbp);
  const setupNull =
    r.setup_fee_gbp === null || r.setup_fee_gbp === undefined
      ? null
      : toNumberGbp(r.setup_fee_gbp);

  const promotion =
    r.active_promotion_id && r.promotion_expires_at
      ? {
          id: r.active_promotion_id,
          promotional_monthly_price_gbp: r.promotional_monthly_price_gbp,
          promotional_setup_fee_gbp: r.promotional_setup_fee_gbp,
          headline: r.promotion_headline,
          description: r.promotion_description,
          expires_at: r.promotion_expires_at,
          origin_tier: r.promotion_origin_tier ?? 'standard',
        }
      : null;

  const state = buildPostcodeDisplayState({
    postcode: r.postcode,
    tier,
    monthlyPriceGbp: r.monthly_price_gbp,
    setupFeeGbp: r.setup_fee_gbp,
    promotion,
  });

  const promoMonthly =
    r.promotional_monthly_price_gbp === null || r.promotional_monthly_price_gbp === undefined
      ? null
      : toNumberGbp(r.promotional_monthly_price_gbp);
  const originMonthly =
    r.origin_monthly_price_gbp === null || r.origin_monthly_price_gbp === undefined
      ? null
      : toNumberGbp(r.origin_monthly_price_gbp);

  return {
    id: r.id,
    postcode: r.postcode,
    postcode_area: r.postcode_area,
    postcode_district: r.postcode_district,
    town_name: r.town_name,
    county: r.county,
    tier,
    is_active: r.is_active,
    monthly_price_gbp: monthlyNull,
    setup_fee_gbp: setupNull,
    has_active_promotion: r.has_active_promotion,
    promotion_expires_at: r.promotion_expires_at,
    active_promotion_id: r.active_promotion_id,
    promotion_headline: r.promotion_headline,
    promotion_description: r.promotion_description,
    promotional_monthly_price_gbp: r.has_active_promotion ? promoMonthly : null,
    origin_monthly_price_gbp: r.has_active_promotion ? originMonthly : null,
    liveDisplayedMonthlyGbp: effectiveMonthlyGbp(state),
  };
}
