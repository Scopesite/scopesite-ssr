import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminAuthenticated } from '@/lib/territory/admin-session';
import { writeAuditLog } from '@/lib/territory/auditLog';
import { revalidateTerritoryPublicCache } from '@/lib/territory/revalidateTerritory';
import { updateTerritoryTier } from '@/lib/territory/queries';

export const runtime = 'nodejs';

const Body = z.object({
  tier: z.enum(['standard', 'premium']),
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
    const ok = await updateTerritoryTier(postcode, parsed.data.tier);
    if (!ok) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    await writeAuditLog({
      actionType: 'postcode_tier_change',
      entityId: postcode,
      payload: { tier: parsed.data.tier },
      performedBy: 'territory_admin',
    });
    revalidateTerritoryPublicCache();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/postcodes/tier]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
