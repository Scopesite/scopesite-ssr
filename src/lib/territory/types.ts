/**
 * Territory Command - Shared TypeScript types
 *
 * Mirrors the `territory` Postgres schema in Neon.
 * No runtime logic. Pure types only.
 */

export type SeatState = 'available' | 'pending' | 'claimed' | 'not_active';
export type Tier = 'standard' | 'premium';
export type ApplicationStatus = 'received' | 'qualified' | 'declined' | 'converted' | 'expired';
export type OperationStatus = 'active' | 'paused' | 'ended' | 'cancelled';
export type OperationType = 'generated' | 'custom';
export type AreaWaitlistSource = 'region_click' | 'postcode_not_in_pilot';

export interface Territory {
  id: string;
  postcode: string;
  postcode_area: string;
  postcode_district: string;
  town_name: string | null;
  county: string | null;
  country: string;
  tier: Tier;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sector {
  id: string;
  slug: string;
  label: string;
  category: string;
  sic_codes: string[] | null;
  description: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Seat {
  id: string;
  territory_id: string;
  sector_id: string;
  state: SeatState;
  tier: Tier;
  contract_months: number;
  claimed_at: string | null;
  pending_until: string | null;
  current_application_id: string | null;
  current_operation_id: string | null;
  created_at: string;
  updated_at: string;
}

/** Discriminator for application rows. Three shapes, enforced by the
 *  applications_entry_shape_chk constraint:
 *    seat     - seat_id + sector_slug populated (48h hold path)
 *    sector   - sector_slug + requested_postcode_district populated,
 *               no seat hold (known sector in active postcode but not
 *               yet in territory.seats as available)
 *    freeform - requested_postcode_district + freeform_industry only,
 *               no sector_slug (user-typed industry text) */
export type ApplicationEntryType = 'seat' | 'sector' | 'freeform';

export interface Application {
  id: string;
  entry_type: ApplicationEntryType;
  /** Populated when entry_type === 'seat'. NULL for sector/freeform. */
  seat_id: string | null;
  firm_name: string;
  contact_name: string;
  contact_role: string | null;
  contact_email: string;
  contact_phone: string | null;
  website_url: string | null;
  firm_postcode: string;
  /** Populated when entry_type === 'seat' or 'sector'. NULL for freeform. */
  sector_slug: string | null;
  /** Populated when entry_type === 'sector' or 'freeform'. NULL for seat. */
  requested_postcode_district: string | null;
  /** Populated when entry_type === 'freeform'. NULL for seat/sector. */
  freeform_industry: string | null;
  ai_visibility_approach: string | null;
  additional_context: string | null;
  status: ApplicationStatus;
  booked_call_at: string | null;
  hubspot_contact_id: string | null;
  hubspot_deal_id: string | null;
  internal_notes: string | null;
  locked_monthly_price_gbp: number | null;
  locked_setup_fee_gbp: number | null;
  locked_promotion_id: string | null;
  locked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FreeformApplicationInsert {
  firmName: string;
  contactName: string;
  contactRole: string | null;
  contactEmail: string;
  contactPhone: string | null;
  websiteUrl: string | null;
  firmPostcode: string;
  requestedPostcodeDistrict: string;
  freeformIndustry: string;
  aiVisibilityApproach: string | null;
  additionalContext: string | null;
  lockedMonthlyPriceGbp: number;
  lockedSetupFeeGbp: number | null;
  lockedPromotionId: string | null;
}

/** Sector-known application (no seat hold). Shape:
 *  entry_type='sector', sector_slug + requested_postcode_district set,
 *  seat_id + freeform_industry null. */
export interface SectorApplicationInsert {
  firmName: string;
  contactName: string;
  contactRole: string | null;
  contactEmail: string;
  contactPhone: string | null;
  websiteUrl: string | null;
  firmPostcode: string;
  sectorSlug: string;
  requestedPostcodeDistrict: string;
  aiVisibilityApproach: string | null;
  additionalContext: string | null;
  lockedMonthlyPriceGbp: number;
  lockedSetupFeeGbp: number | null;
  lockedPromotionId: string | null;
}

export interface WaitlistEntry {
  id: string;
  seat_id: string;
  contact_name: string;
  contact_email: string;
  firm_name: string | null;
  firm_postcode: string | null;
  sector_slug: string | null;
  waitlist_position: number | null;
  notified_at: string | null;
  created_at: string;
}

export interface AreaWaitlistEntry {
  id: string;
  firm_name: string;
  contact_name: string;
  contact_email: string;
  requested_postcode: string | null;
  requested_region: string | null;
  requested_sector_slug: string;
  entry_source: AreaWaitlistSource;
  notified_at: string | null;
  internal_notes: string | null;
  created_at: string;
}

export interface AreaIntelligence {
  id: string;
  territory_id: string;
  sector_id: string;
  firm_count: number;
  ai_visible_count: number;
  average_voice_score: number | null;
  top_competitor_count: number;
  data_source: string;
  last_updated: string;
  created_at: string;
}

/** Joined shape from territory.v_seats_full (denormalised view). */
export interface SeatFull {
  seat_id: string;
  state: SeatState;
  tier: Tier;
  monthly_price_gbp: number;
  setup_fee_gbp: number;
  pending_until: string | null;
  claimed_at: string | null;
  territory_id: string;
  postcode: string;
  postcode_district: string;
  town_name: string | null;
  county: string | null;
  territory_tier: Tier;
  territory_is_active: boolean;
  sector_id: string;
  sector_slug: string;
  sector_label: string;
  sector_category: string;
  sector_is_active: boolean;
  sector_is_featured: boolean;
  area_firm_count: number | null;
  area_ai_visible_count: number | null;
  area_average_voice_score: number | null;
}

/** Discriminated union returned by checkAvailability(). */
export type AvailabilityResult =
  | {
      state: 'available' | 'pending' | 'claimed' | 'not_active';
      tier: Tier;
      seatId: string;
      territoryId: string;
      sectorId: string;
      postcode: string;
      postcodeDistrict: string;
      townName: string | null;
      sectorSlug: string;
      sectorLabel: string;
      monthlyPriceGbp: number;
      setupFeeGbp: number;
      pendingUntil: string | null;
      areaIntelligence: {
        firmCount: number;
        aiVisibleCount: number;
        averageVoiceScore: number | null;
        topCompetitorCount: number;
      } | null;
    }
  | { state: 'territory_not_found' }
  | { state: 'sector_not_found' };

/** Aggregated per-postcode map pin state (for the UK map view).
 *  LEGACY: pin-based map shape, retained for the /api/territory/map-data
 *  endpoint and any external callers. The /territory page itself now uses
 *  AreaStatus (below), driven by buildAreaAvailability(). */
export interface MapDataPoint {
  postcode: string;
  postcodeDistrict: string;
  /** SVG x-coordinate of the pin tip. See pin-coordinates.ts. */
  svgX: number;
  /** SVG y-coordinate of the pin tip. See pin-coordinates.ts. */
  svgY: number;
  town: string;
  tier: Tier;
  isReserve: boolean;
  isHome: boolean;
  aggregateState: 'available' | 'pending' | 'claimed' | 'reserve';
  availableSectorCount: number;
  pendingSectorCount: number;
  claimedSectorCount: number;
  totalSectorCount: number;
}

/** Aggregated per-area availability for the /territory region-zoom polygons. */
export type AreaAvailabilityStatus =
  | 'available'
  | 'premium'
  | 'pending'
  | 'claimed'
  | 'none'
  | 'promotional';

export interface AreaStatus {
  area: string;
  tier: Tier;
  townName: string | null;
  status: AreaAvailabilityStatus;
  availableCount: number;
  pendingCount: number;
  claimedCount: number;
  totalCount: number;
  /** Present when status is `promotional` (active postcode promotion). */
  promotionExpiresAt?: string | null;
  promotionOriginTier?: Tier | null;
  promotionHeadline?: string | null;
  promotionDescription?: string | null;
  promotionMonthlyPriceGbp?: number | null;
  promotionOriginMonthlyPriceGbp?: number | null;
}

/** Public-facing sector tile. */
export interface SectorTile {
  id: string;
  slug: string;
  label: string;
  category: string;
  availableCount: number;
  isActive: boolean;
  isFeatured: boolean;
}

export interface ApplicationInsert {
  seatId: string;
  firmName: string;
  contactName: string;
  contactRole: string | null;
  contactEmail: string;
  contactPhone: string | null;
  websiteUrl: string | null;
  firmPostcode: string;
  sectorSlug: string;
  aiVisibilityApproach: string | null;
  additionalContext: string | null;
  lockedMonthlyPriceGbp: number;
  lockedSetupFeeGbp: number | null;
  lockedPromotionId: string | null;
}

export interface WaitlistInsert {
  seatId: string;
  contactName: string;
  contactEmail: string;
  firmName: string | null;
}

export interface AreaWaitlistInsert {
  firmName: string;
  contactName: string;
  contactEmail: string;
  requestedPostcode: string | null;
  requestedRegion: string | null;
  requestedSectorSlug: string;
  entrySource: AreaWaitlistSource;
}
