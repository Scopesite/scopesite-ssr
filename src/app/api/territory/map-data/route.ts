/**
 * GET /api/territory/map-data
 *
 * Combines pin metadata from pin-coordinates.ts with live aggregate state
 * per postcode from the seats table.
 *
 * Response: { ok: true, points: MapDataPoint[] }
 * Edge cache: s-maxage=60, stale-while-revalidate=300
 *
 * Note: The /territory landing page calls buildMapPoints() directly from
 * the server component, so pins are in the first HTML and no skeleton is
 * shown. This HTTP route is retained for programmatic access.
 */

import { NextResponse } from 'next/server';
import { buildMapPoints } from '@/lib/territory/map-builder';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const points = await buildMapPoints();
    return NextResponse.json(
      { ok: true, points },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    );
  } catch (err) {
    console.error('[territory/map-data] error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 },
    );
  }
}
