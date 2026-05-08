import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/territory/admin-session';
import { writeAuditLog } from '@/lib/territory/auditLog';
import { revalidateTerritoryPublicCache } from '@/lib/territory/revalidateTerritory';
import { cancelPostcodePromotion } from '@/lib/territory/queries';

export const runtime = 'nodejs';

export async function POST(
  _request: NextRequest,
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
  try {
    const promotionId = await cancelPostcodePromotion(postcode);
    if (!promotionId) {
      return NextResponse.json({ error: 'No active promotion to cancel' }, { status: 404 });
    }
    await writeAuditLog({
      actionType: 'postcode_promotion_cancel',
      entityId: promotionId,
      payload: { postcode },
      performedBy: 'territory_admin',
    });
    revalidateTerritoryPublicCache();
    return NextResponse.json({ ok: true, promotionId });
  } catch (err) {
    console.error('[admin/postcodes/promotion/cancel]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
