/**
 * Territory Command - map pin builder.
 *
 * Produces MapDataPoint[] by joining static pin metadata from
 * pin-coordinates.ts with live aggregate state from the seats table.
 *
 * Used by both:
 *   - the /territory server component (direct call, renders into first HTML)
 *   - GET /api/territory/map-data (HTTP route for programmatic access)
 */

import 'server-only';
import { PILOT_PINS } from './pin-coordinates';
import { getMapData } from './queries';
import type { MapDataPoint } from './types';

export async function buildMapPoints(): Promise<MapDataPoint[]> {
  const dbRows = await getMapData();
  const byDistrict = new Map(dbRows.map((r) => [r.postcodeDistrict, r]));

  return PILOT_PINS.map((pin) => {
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
