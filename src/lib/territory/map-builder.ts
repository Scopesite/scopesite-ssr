/**
 * Territory Command - map data builder.
 *
 * Two producers:
 *   - buildAreaAvailability(): the /territory page consumer. Returns a
 *     per-postcode-area status map driving the region-zoom polygon fill
 *     colours.
 *   - buildMapPoints(): LEGACY pin-based builder, retained for the
 *     /api/territory/map-data endpoint. The /territory map no longer
 *     renders pins.
 *
 * LEGACY: pilot terminology retained in code (PILOT_PINS, AREA_PINS),
 * not user-facing.
 */

import 'server-only';
// LEGACY: PILOT_PINS/AREA_PINS feed the map-data API route only; the
// /territory map stopped rendering pins in the UX rework.
import { PILOT_PINS } from './pin-coordinates';
import { AREA_PINS } from './area-pins';
import { getAreaAvailability, getMapData } from './queries';
import type { AreaStatus, MapDataPoint } from './types';

/** Per-area availability keyed by postcode area. */
export async function buildAreaAvailability(): Promise<Record<string, AreaStatus>> {
  const rows = await getAreaAvailability();
  const out: Record<string, AreaStatus> = {};
  for (const r of rows) out[r.area] = r;
  return out;
}

/** LEGACY pin-based map data. Retained for /api/territory/map-data. */
export async function buildMapPoints(): Promise<MapDataPoint[]> {
  const dbRows = await getMapData();
  const byDistrict = new Map(dbRows.map((r) => [r.postcodeDistrict, r]));

  return [...PILOT_PINS, ...AREA_PINS].map((pin) => {
    const row = byDistrict.get(pin.postcode);
    const available = row?.availableSectorCount ?? 0;
    const pending = row?.pendingSectorCount ?? 0;
    const claimed = row?.claimedSectorCount ?? 0;
    const total = row?.totalSectorCount ?? 0;

    let aggregateState: MapDataPoint['aggregateState'];
    if (pin.isReserve) aggregateState = 'reserve';
    else if (available > 0) aggregateState = 'available';
    else if (pending > 0) aggregateState = 'pending';
    else if (claimed > 0) aggregateState = 'claimed';
    else aggregateState = 'reserve';

    return {
      postcode: pin.postcode,
      postcodeDistrict: pin.postcode,
      svgX: pin.svgX,
      svgY: pin.svgY,
      town: pin.town,
      tier: pin.tier,
      isReserve: pin.isReserve,
      isHome: pin.isHome ?? false,
      aggregateState,
      availableSectorCount: available,
      pendingSectorCount: pending,
      claimedSectorCount: claimed,
      totalSectorCount: total || 4,
    };
  });
}
