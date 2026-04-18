/**
 * GET|POST /api/cron/territory/expire-pending
 *
 * Auth: requires `Authorization: Bearer $CRON_SECRET` OR
 *       `x-cron-secret: $CRON_SECRET`. Returns 401 otherwise.
 *
 * Invokes territory.expire_pending_seats() which:
 *   - flips any seat with state='pending' AND pending_until<now() back to
 *     'available' (clearing pending_until + current_application_id)
 *   - marks the associated application as status='expired'
 *
 * Runs every 15 minutes via vercel.json crons entry.
 */

import { NextRequest, NextResponse } from 'next/server';
import { expirePendingSeats } from '@/lib/territory/queries';

export const runtime = 'nodejs';

function isAuthorised(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get('authorization');
  if (auth && auth === `Bearer ${secret}`) return true;
  const alt = request.headers.get('x-cron-secret');
  if (alt && alt === secret) return true;
  return false;
}

async function handle(request: NextRequest) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const expiredCount = await expirePendingSeats();
    console.log(`[cron/territory/expire-pending] expired ${expiredCount} seat(s)`);
    return NextResponse.json({ ok: true, expiredCount });
  } catch (err) {
    console.error('[cron/territory/expire-pending] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
