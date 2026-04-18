/**
 * POST /api/territory/waitlist
 *
 * Request: { seatId, contactName, contactEmail, firmName? }
 * Response: { waitlistId, position }
 *
 * Side effects:
 *  - Zod validate
 *  - Insert waitlist row (idempotent per seat+email via UNIQUE constraint)
 *  - Send confirmation email to joiner
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createWaitlistEntry, getSeatFullById } from '@/lib/territory/queries';
import { sendTerritoryWaitlistConfirmation } from '@/lib/email';

export const runtime = 'nodejs';

const Body = z.object({
  seatId: z.string().uuid(),
  contactName: z.string().trim().min(1).max(200),
  contactEmail: z.string().trim().toLowerCase().email().max(320),
  firmName: z.string().trim().max(200).optional().nullable(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  try {
    const result = await createWaitlistEntry({
      seatId: data.seatId,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      firmName: data.firmName ?? null,
    });

    const seatFull = await getSeatFullById(data.seatId);
    if (seatFull) {
      sendTerritoryWaitlistConfirmation({
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        firmName: data.firmName ?? null,
        postcodeDistrict: seatFull.postcode_district,
        sectorLabel: seatFull.sector_label,
        position: result.position,
        waitlistId: result.waitlistId,
      }).catch((e) =>
        console.error('[territory/waitlist] email failed:', e),
      );
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('[territory/waitlist] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
