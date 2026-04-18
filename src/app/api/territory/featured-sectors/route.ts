/**
 * GET /api/territory/featured-sectors
 *
 * Response: { sectors: SectorTile[] }
 * Edge cache: s-maxage=60, stale-while-revalidate=300
 */

import { NextResponse } from 'next/server';
import { getFeaturedSectors } from '@/lib/territory/queries';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sectors = await getFeaturedSectors();
    return NextResponse.json(
      { ok: true, sectors },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    );
  } catch (err) {
    console.error('[territory/featured-sectors] error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 },
    );
  }
}
