import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminAuthenticated } from '@/lib/territory/admin-session';
import { writeAuditLog } from '@/lib/territory/auditLog';
import { revalidateTerritoryPublicCache } from '@/lib/territory/revalidateTerritory';
import {
  backfillMissingSeatsForSectorSlugs,
  getSectorBySlug,
  getSectorOccupiedSeatCount,
  updateSectorFlags,
} from '@/lib/territory/queries';
import { sectorAllowsDeactivation } from '@/lib/territory/postcodePricingLogic';

export const runtime = 'nodejs';

const Body = z
  .object({
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  })
  .refine((b) => b.isActive !== undefined || b.isFeatured !== undefined, {
    message: 'Provide isActive and/or isFeatured',
  });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw ?? '').trim().toLowerCase();
  if (!slug) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
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
  const activating = parsed.data.isActive === true;
  let wasInactive = false;
  if (activating) {
    const sector = await getSectorBySlug(slug);
    if (!sector) {
      return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
    }
    wasInactive = !sector.is_active;
  }
  if (parsed.data.isActive === false) {
    const occupied = await getSectorOccupiedSeatCount(slug);
    if (!sectorAllowsDeactivation(occupied)) {
      return NextResponse.json(
        {
          error:
            'Cannot deactivate: this sector has pending or claimed seats. Free those seats first.',
          pendingOrClaimedSeats: occupied,
        },
        { status: 409 },
      );
    }
  }
  try {
    const ok = await updateSectorFlags(slug, {
      ...(parsed.data.isActive !== undefined ? { is_active: parsed.data.isActive } : {}),
      ...(parsed.data.isFeatured !== undefined
        ? { is_featured: parsed.data.isFeatured }
        : {}),
    });
    if (!ok) {
      return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
    }
    if (parsed.data.isActive !== undefined) {
      await writeAuditLog({
        actionType: 'sector_toggle_active',
        entityId: slug,
        payload: { isActive: parsed.data.isActive },
        performedBy: 'territory_admin',
      });
    }
    if (parsed.data.isFeatured !== undefined) {
      await writeAuditLog({
        actionType: 'sector_toggle_featured',
        entityId: slug,
        payload: { isFeatured: parsed.data.isFeatured },
        performedBy: 'territory_admin',
      });
    }
    let seatsCreated: number | undefined;
    if (activating && wasInactive) {
      seatsCreated = await backfillMissingSeatsForSectorSlugs([slug]);
    }
    revalidateTerritoryPublicCache();
    return NextResponse.json({
      ok: true,
      ...(seatsCreated !== undefined ? { seatsCreated } : {}),
    });
  } catch (err) {
    console.error('[admin/sectors]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
