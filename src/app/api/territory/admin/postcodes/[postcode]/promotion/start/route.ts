import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminAuthenticated } from '@/lib/territory/admin-session';
import { writeAuditLog } from '@/lib/territory/auditLog';
import { getPostcodeDisplayStateUncached } from '@/lib/territory/postcodePricing';
import { revalidateTerritoryPublicCache } from '@/lib/territory/revalidateTerritory';
import {
  getActivePromotionForPostcode,
  insertPostcodePromotion,
} from '@/lib/territory/queries';

export const runtime = 'nodejs';

const Body = z.object({
  promotionalMonthlyPriceGbp: z.number().positive(),
  promotionalSetupFeeGbp: z.number().nonnegative().nullable().optional(),
  durationHours: z.number().int().min(1),
  headline: z.string().max(80),
  description: z.string().max(280),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postcode: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { postcode: raw } = await params;
  const postcode = decodeURIComponent(raw ?? '').trim();
  if (!postcode) {
    return NextResponse.json({ error: 'Invalid postcode' }, { status: 400 });
  }
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
  try {
    const active = await getActivePromotionForPostcode(postcode);
    if (active) {
      return NextResponse.json(
        { error: 'An active promotion already exists for this postcode' },
        { status: 409 },
      );
    }
    const state = await getPostcodeDisplayStateUncached(postcode);
    if (!state) {
      return NextResponse.json({ error: 'Territory not found' }, { status: 404 });
    }
    if (state.isPromotional) {
      return NextResponse.json(
        { error: 'Postcode already has an active promotion' },
        { status: 409 },
      );
    }
    if (state.baseMonthlyPriceGbp <= 0) {
      return NextResponse.json(
        { error: 'Set a positive base monthly price before starting a promotion' },
        { status: 400 },
      );
    }
    if (parsed.data.promotionalMonthlyPriceGbp >= state.baseMonthlyPriceGbp) {
      return NextResponse.json(
        {
          error:
            'Promotional monthly price must be less than the current base monthly price',
        },
        { status: 400 },
      );
    }
    const promoSetup =
      parsed.data.promotionalSetupFeeGbp === undefined
        ? null
        : parsed.data.promotionalSetupFeeGbp;
    const inserted = await insertPostcodePromotion({
      postcode: state.postcode,
      promotionalMonthlyPriceGbp: parsed.data.promotionalMonthlyPriceGbp,
      promotionalSetupFeeGbp: promoSetup,
      originTier: state.tier,
      originMonthlyPriceGbp: state.baseMonthlyPriceGbp,
      originSetupFeeGbp: state.baseSetupFeeGbp,
      headline: parsed.data.headline.trim() || null,
      description: parsed.data.description.trim() || null,
      durationHours: parsed.data.durationHours,
      createdBy: 'territory_admin',
    });
    if (!inserted) {
      return NextResponse.json({ error: 'Could not create promotion' }, { status: 500 });
    }
    await writeAuditLog({
      actionType: 'postcode_promotion_start',
      entityId: inserted.id,
      payload: {
        postcode: state.postcode,
        promotionalMonthlyPriceGbp: parsed.data.promotionalMonthlyPriceGbp,
        durationHours: parsed.data.durationHours,
      },
      performedBy: 'territory_admin',
    });
    revalidateTerritoryPublicCache();
    return NextResponse.json({ ok: true, promotionId: inserted.id });
  } catch (err) {
    console.error('[admin/postcodes/promotion/start]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
