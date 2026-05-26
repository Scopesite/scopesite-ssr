/**
 * Brand profile API
 * GET /api/portal/brand?clientId= — load profile (admin may pass clientId)
 * PATCH /api/portal/brand?clientId= — save profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getClientByClerkId, getClientById, getBrandProfile, upsertBrandProfile, logActivity } from '@/lib/portal-db';
import { isPortalAdmin } from '@/lib/portal-auth';
import type { UpsertBrandProfile, BrandPaletteSwatch, BrandFontEntry, BrandSocialHandle } from '@/types/portal';

async function resolveTargetClientId(
  userId: string,
  clientIdParam: string | null
): Promise<{ clientId: string } | { error: string; status: number }> {
  const admin = isPortalAdmin(userId);

  if (admin && clientIdParam) {
    const target = await getClientById(clientIdParam);
    if (!target) {
      return { error: 'Client not found', status: 404 };
    }
    return { clientId: target.id };
  }

  const client = await getClientByClerkId(userId);
  if (!client) {
    return { error: 'Client not found', status: 404 };
  }

  if (admin && !clientIdParam) {
    return { error: 'clientId query parameter is required for admin', status: 400 };
  }

  return { clientId: client.id };
}

function parsePatchBody(body: unknown): UpsertBrandProfile | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const patch: UpsertBrandProfile = {};

  if (Array.isArray(b.palette)) {
    patch.palette = b.palette.filter(
      (s): s is BrandPaletteSwatch =>
        typeof s === 'object' &&
        s !== null &&
        typeof (s as BrandPaletteSwatch).name === 'string' &&
        typeof (s as BrandPaletteSwatch).hex === 'string'
    );
  }

  if (Array.isArray(b.fonts)) {
    patch.fonts = b.fonts.filter(
      (f): f is BrandFontEntry =>
        typeof f === 'object' &&
        f !== null &&
        typeof (f as BrandFontEntry).name === 'string' &&
        typeof (f as BrandFontEntry).role === 'string'
    );
  }

  if (typeof b.tone_voice === 'string' || b.tone_voice === null) {
    patch.tone_voice = b.tone_voice as string | null;
  }

  if (Array.isArray(b.banned_words)) {
    patch.banned_words = b.banned_words.filter((w): w is string => typeof w === 'string');
  } else if (typeof b.banned_words === 'string') {
    patch.banned_words = b.banned_words
      .split(/[,\n]/)
      .map((w) => w.trim())
      .filter(Boolean);
  }

  if (Array.isArray(b.social_handles)) {
    patch.social_handles = b.social_handles.filter(
      (h): h is BrandSocialHandle =>
        typeof h === 'object' &&
        h !== null &&
        typeof (h as BrandSocialHandle).platform === 'string' &&
        typeof (h as BrandSocialHandle).handle === 'string'
    );
  }

  return patch;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const clientIdParam = request.nextUrl.searchParams.get('clientId');
    const resolved = await resolveTargetClientId(userId, clientIdParam);
    if ('error' in resolved) {
      return NextResponse.json({ success: false, error: resolved.error }, { status: resolved.status });
    }

    const profile = await getBrandProfile(resolved.clientId);

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching brand profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch brand profile' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const clientIdParam = request.nextUrl.searchParams.get('clientId');
    const resolved = await resolveTargetClientId(userId, clientIdParam);
    if ('error' in resolved) {
      return NextResponse.json({ success: false, error: resolved.error }, { status: resolved.status });
    }

    const body = await request.json();
    const patch = parsePatchBody(body);
    if (!patch) {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }

    const user = await currentUser();
    const updatedBy =
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
      user?.emailAddresses[0]?.emailAddress ||
      userId;

    const profile = await upsertBrandProfile(resolved.clientId, patch, updatedBy);

    await logActivity({
      client_id: resolved.clientId,
      action_type: 'status_changed',
      description: 'Brand profile updated',
      actor_type: isPortalAdmin(userId) ? 'admin' : 'client',
      actor_name: updatedBy,
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error updating brand profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to update brand profile' }, { status: 500 });
  }
}
