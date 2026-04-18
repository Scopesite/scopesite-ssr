/**
 * GET /api/territory/typeahead?q=...
 *
 * Response: { sectors: SectorTile[] } (max 10, min 2 chars)
 * No per-IP rate limiting in Phase A.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSectorsByTypeahead } from '@/lib/territory/queries';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim();
  if (q.length < 2) {
    return NextResponse.json({ ok: true, sectors: [] });
  }
  // Sanitise: keep letters, digits, spaces, ampersands, hyphens, forward slashes.
  const safeQ = q.replace(/[^\p{L}\p{N}\s&\-/]/gu, '').slice(0, 50);
  if (safeQ.length < 2) {
    return NextResponse.json({ ok: true, sectors: [] });
  }

  try {
    const sectors = await getSectorsByTypeahead(safeQ);
    return NextResponse.json({ ok: true, sectors });
  } catch (err) {
    console.error('[territory/typeahead] error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 },
    );
  }
}
