/**
 * POST /api/territory/check
 *
 * Request: { postcode: string, sectorSlug: string }
 * Response: AvailabilityResult (discriminated union) with `ok: true`
 *           or { ok: false, error: '...' } on validation failure.
 *
 * No per-IP rate limiting in Phase A.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkAvailability } from '@/lib/territory/queries';
import { normalisePostcode, isPlausibleUkPostcode } from '@/lib/territory/postcode';

export const runtime = 'nodejs';

const Body = z.object({
  postcode: z.string().min(2).max(12),
  sectorSlug: z.string().min(1).max(100),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid input', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const postcode = normalisePostcode(parsed.data.postcode);
  if (!isPlausibleUkPostcode(postcode)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_postcode' },
      { status: 400 },
    );
  }

  try {
    const result = await checkAvailability(postcode, parsed.data.sectorSlug);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error('[territory/check] error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 },
    );
  }
}
