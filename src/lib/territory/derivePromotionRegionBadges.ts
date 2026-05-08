/**
 * Derive UK map region badges for active postcode-level promotions.
 * Client-safe: uses only AreaStatus + static area→region map.
 */

import type { RegionKey } from '@/lib/territory/map-regions';
import type { AreaStatus } from '@/lib/territory/types';
import { UK_POSTCODE_AREA_TO_REGION } from '@/lib/territory/uk-postcode-area-regions';

export type PromotionRegionBadge = {
  region: RegionKey;
  /** Representative postcode area for label copy (one promo per region). */
  areaCode: string;
};

/**
 * One badge per region. When multiple areas in a region have promotions,
 * pick the area with the earliest `promotionExpiresAt` (ties: alphabetically
 * by area code) so the label reflects the offer ending soonest.
 */
export function derivePromotionRegionBadges(
  areas: Record<string, AreaStatus>,
): PromotionRegionBadge[] {
  const winners = new Map<RegionKey, { areaCode: string; expiresAt: string }>();

  for (const [areaCode, st] of Object.entries(areas)) {
    if (st.status !== 'promotional' || !st.promotionExpiresAt) continue;
    const region = UK_POSTCODE_AREA_TO_REGION[areaCode];
    if (!region) continue;

    const next = { areaCode, expiresAt: st.promotionExpiresAt };
    const prev = winners.get(region);
    if (!prev) {
      winners.set(region, next);
      continue;
    }
    const cmp = next.expiresAt.localeCompare(prev.expiresAt);
    if (cmp < 0 || (cmp === 0 && next.areaCode < prev.areaCode)) {
      winners.set(region, next);
    }
  }

  return Array.from(winners.entries())
    .map(([region, v]) => ({ region, areaCode: v.areaCode }))
    .sort((a, b) => a.region.localeCompare(b.region));
}
