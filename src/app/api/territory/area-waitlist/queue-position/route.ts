/**
 * GET /api/territory/area-waitlist/queue-position?postcode=XXX
 *
 * Returns the live queue size for a postcode district (or full postcode)
 * so the AreaWaitlistForm can show "you will be position #(N+1)" before
 * the user submits. Position is live data so we never cache.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAreaWaitlistQueueSize } from '@/lib/territory/queries';
import { isPlausibleUkPostcode, normalisePostcode } from '@/lib/territory/postcode';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Query = z.object({
  postcode: z.string().trim().min(1).max(12),
});

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = Query.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const normalised = normalisePostcode(parsed.data.postcode);
  if (!isPlausibleUkPostcode(normalised)) {
    return NextResponse.json({ error: 'Invalid postcode' }, { status: 400 });
  }

  try {
    const currentQueueSize = await getAreaWaitlistQueueSize(normalised);
    return NextResponse.json(
      { ok: true, currentQueueSize, postcode: normalised },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      },
    );
  } catch (err) {
    console.error('[territory/area-waitlist/queue-position] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
