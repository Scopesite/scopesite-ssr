import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminAuthenticated } from '@/lib/territory/admin-session';
import { writeAuditLog } from '@/lib/territory/auditLog';
import { revalidateTerritoryPublicCache } from '@/lib/territory/revalidateTerritory';
import {
  assertValidBannerCtaUrl,
  getSiteBannerUncached,
  updateSiteBanner,
} from '@/lib/territory/siteConfig';

export const runtime = 'nodejs';

const Body = z.object({
  bannerEnabled: z.boolean(),
  bannerHeadline: z.string().max(100).nullable().optional(),
  bannerDescription: z.string().max(280).nullable().optional(),
  bannerCtaLabel: z.string().max(30).nullable().optional(),
  bannerCtaUrl: z.string().max(2000).nullable().optional(),
});

function serialise(row: Awaited<ReturnType<typeof getSiteBannerUncached>>) {
  return {
    bannerEnabled: row.bannerEnabled,
    bannerHeadline: row.bannerHeadline,
    bannerDescription: row.bannerDescription,
    bannerCtaLabel: row.bannerCtaLabel,
    bannerCtaUrl: row.bannerCtaUrl,
    updatedAt: row.updatedAt,
    updatedBy: row.updatedBy,
  };
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const row = await getSiteBannerUncached();
    return NextResponse.json({ ok: true, banner: serialise(row) });
  } catch (err) {
    console.error('[admin/banner GET]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  const headline = parsed.data.bannerHeadline ?? null;
  const description = parsed.data.bannerDescription ?? null;
  const ctaLabel = parsed.data.bannerCtaLabel ?? null;
  const ctaUrl = parsed.data.bannerCtaUrl ?? null;

  try {
    assertValidBannerCtaUrl(ctaUrl);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Invalid CTA URL' },
      { status: 400 },
    );
  }

  try {
    const before = await getSiteBannerUncached();
    const after = await updateSiteBanner({
      bannerEnabled: parsed.data.bannerEnabled,
      bannerHeadline: headline,
      bannerDescription: description,
      bannerCtaLabel: ctaLabel,
      bannerCtaUrl: ctaUrl,
      updatedBy: 'territory_admin',
    });

    const b = serialise(before);
    const a = serialise(after);
    const onlyToggle =
      b.bannerHeadline === a.bannerHeadline &&
      b.bannerDescription === a.bannerDescription &&
      b.bannerCtaLabel === a.bannerCtaLabel &&
      b.bannerCtaUrl === a.bannerCtaUrl &&
      b.bannerEnabled !== a.bannerEnabled;

    await writeAuditLog({
      actionType: onlyToggle ? 'site_banner_toggle' : 'site_banner_update',
      entityId: 'site_config',
      payload: { before: b, after: a },
      performedBy: 'territory_admin',
    });
    revalidateTerritoryPublicCache();
    return NextResponse.json({ ok: true, banner: a });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Internal error';
    if (msg.includes('CTA URL') || msg.includes('http')) {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    console.error('[admin/banner POST]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
