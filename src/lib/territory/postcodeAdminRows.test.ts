import { describe, expect, it } from 'vitest';
import {
  mapQueryRowToAdminPostcodeListRow,
  type AdminPostcodeQueryRow,
} from './postcodeAdminRows';

function baseRow(over: Partial<AdminPostcodeQueryRow>): AdminPostcodeQueryRow {
  return {
    id: 't1',
    postcode: 'BA1',
    postcode_area: 'BA1',
    postcode_district: 'BA1',
    town_name: 'Bath',
    county: 'Somerset',
    tier: 'standard',
    is_active: true,
    monthly_price_gbp: 500,
    setup_fee_gbp: 100,
    has_active_promotion: false,
    promotion_expires_at: null,
    active_promotion_id: null,
    promotion_headline: null,
    promotion_description: null,
    promotional_monthly_price_gbp: null,
    origin_monthly_price_gbp: null,
    promotional_setup_fee_gbp: null,
    origin_setup_fee_gbp: null,
    promotion_origin_tier: null,
    ...over,
  };
}

describe('mapQueryRowToAdminPostcodeListRow', () => {
  it('base pricing only: live matches territory monthly', () => {
    const row = mapQueryRowToAdminPostcodeListRow(baseRow({}));
    expect(row.has_active_promotion).toBe(false);
    expect(row.promotional_monthly_price_gbp).toBeNull();
    expect(row.origin_monthly_price_gbp).toBeNull();
    expect(row.liveDisplayedMonthlyGbp).toBe(500);
  });

  it('active promotion: live is promo monthly; summary fields from DB', () => {
    const expires = '2030-06-01T12:00:00.000Z';
    const row = mapQueryRowToAdminPostcodeListRow(
      baseRow({
        has_active_promotion: true,
        promotion_expires_at: expires,
        active_promotion_id: 'promo-1',
        promotion_headline: 'Summer',
        promotion_description: 'Save now',
        promotional_monthly_price_gbp: 350,
        origin_monthly_price_gbp: 500,
        promotional_setup_fee_gbp: 50,
        origin_setup_fee_gbp: 100,
        promotion_origin_tier: 'standard',
      }),
    );
    expect(row.liveDisplayedMonthlyGbp).toBe(350);
    expect(row.promotional_monthly_price_gbp).toBe(350);
    expect(row.origin_monthly_price_gbp).toBe(500);
    expect(row.has_active_promotion).toBe(true);
  });

  it('expired / absent promotion: lateral row clears promo columns', () => {
    const row = mapQueryRowToAdminPostcodeListRow(
      baseRow({
        has_active_promotion: false,
        promotional_monthly_price_gbp: 350,
        origin_monthly_price_gbp: 500,
      }),
    );
    expect(row.has_active_promotion).toBe(false);
    expect(row.promotional_monthly_price_gbp).toBeNull();
    expect(row.origin_monthly_price_gbp).toBeNull();
    expect(row.liveDisplayedMonthlyGbp).toBe(500);
  });
});
