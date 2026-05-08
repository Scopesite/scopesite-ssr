import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminAuthenticated } from '@/lib/territory/admin-session';
import { writeAuditLog } from '@/lib/territory/auditLog';
import { revalidateTerritoryPublicCache } from '@/lib/territory/revalidateTerritory';
import { updateTerritoryPrices } from '@/lib/territory/queries';

export const runtime = 'nodejs';

const Body = z.object({
  monthlyPriceGbp: z.number().positive(),
  setupFeeGbp: z.number().nonnegative().nullable().optional(),
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
  const setupFeeGbp =
    parsed.data.setupFeeGbp === undefined ? null : parsed.data.setupFeeGbp;
  try {
    const ok = await updateTerritoryPrices(
      postcode,
      parsed.data.monthlyPriceGbp,
      setupFeeGbp,
    );
    if (!ok) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    await writeAuditLog({
      actionType: 'postcode_price_change',
      entityId: postcode,
      payload: {
        monthlyPriceGbp: parsed.data.monthlyPriceGbp,
        setupFeeGbp: setupFeeGbp,
      },
      performedBy: 'territory_admin',
    });
    revalidateTerritoryPublicCache();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/postcodes/price]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
