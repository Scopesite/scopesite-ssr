/**
 * GET|POST /api/cron/territory/expire-promotions
 *
 * Auth: Bearer CRON_SECRET or x-cron-secret header.
 * Calls territory.expire_promotions() and revalidates public territory cache.
 */

import { NextRequest, NextResponse } from 'next/server';
import { expirePromotions } from '@/lib/territory/queries';
import { revalidateTerritoryPublicCache } from '@/lib/territory/revalidateTerritory';

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
    const expiredCount = await expirePromotions();
    revalidateTerritoryPublicCache();
    return NextResponse.json({ ok: true, expiredCount });
  } catch (err) {
    console.error('[cron/territory/expire-promotions]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
