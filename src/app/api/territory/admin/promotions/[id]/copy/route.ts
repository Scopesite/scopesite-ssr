import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminAuthenticated } from '@/lib/territory/admin-session';
import { writeAuditLog } from '@/lib/territory/auditLog';
import { revalidateTerritoryPublicCache } from '@/lib/territory/revalidateTerritory';
import { updatePromotionCopy } from '@/lib/territory/queries';

export const runtime = 'nodejs';

const Body = z.object({
  headline: z.string().max(80).nullable(),
  description: z.string().max(280).nullable(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
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
  const headline = parsed.data.headline;
  const description = parsed.data.description;
  try {
    const ok = await updatePromotionCopy(id, headline, description);
    if (!ok) {
      return NextResponse.json(
        { error: 'Promotion not found or not editable' },
        { status: 404 },
      );
    }
    await writeAuditLog({
      actionType: 'postcode_promotion_edit_copy',
      entityId: id,
      payload: { headline, description },
      performedBy: 'territory_admin',
    });
    revalidateTerritoryPublicCache();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/promotions/copy]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
