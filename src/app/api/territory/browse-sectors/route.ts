/**
 * GET /api/territory/browse-sectors
 *
 * Response: { groups: Record<category, SectorTile[]> }
 * Edge cache: s-maxage=60, stale-while-revalidate=300
 */

import { NextResponse } from 'next/server';
import { getAllSectorsForBrowse } from '@/lib/territory/queries';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const groups = await getAllSectorsForBrowse();
    return NextResponse.json(
      { ok: true, groups },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    );
  } catch (err) {
    console.error('[territory/browse-sectors] error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 },
    );
  }
}
