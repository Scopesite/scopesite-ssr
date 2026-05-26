/**
 * Portal Me API
 *
 * GET /api/portal/me - Get current client profile
 * PATCH /api/portal/me - Update phone and SMS opt-in
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getClientByClerkId, updateClient, logActivity } from '@/lib/portal-db';
import { normalizePhoneE164 } from '@/lib/phone';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await getClientByClerkId(userId);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: client.id,
        company_name: client.company_name,
        primary_contact_name: client.primary_contact_name,
        email: client.email,
        phone: client.phone,
        sms_opt_in: client.sms_opt_in ?? false,
        status: client.status,
      },
    });
  } catch (error) {
    console.error('Error fetching client profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await getClientByClerkId(userId);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const body = (await request.json()) as {
      phone?: string | null;
      sms_opt_in?: boolean;
    };

    const patch: { phone?: string | null; sms_opt_in?: boolean } = {};

    if (body.phone !== undefined) {
      if (body.phone === null || body.phone === '') {
        patch.phone = null;
      } else {
        const normalized = normalizePhoneE164(body.phone);
        if (!normalized) {
          return NextResponse.json(
            { success: false, error: 'Invalid phone number. Use UK format or E.164 (+44...).' },
            { status: 400 }
          );
        }
        patch.phone = normalized;
      }
    }

    if (typeof body.sms_opt_in === 'boolean') {
      if (body.sms_opt_in) {
        const effectivePhone =
          patch.phone !== undefined ? patch.phone : client.phone;
        if (!effectivePhone) {
          return NextResponse.json(
            { success: false, error: 'Add a phone number before enabling SMS updates' },
            { status: 400 }
          );
        }
      }
      patch.sms_opt_in = body.sms_opt_in;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updated = await updateClient(client.id, patch);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    await logActivity({
      client_id: client.id,
      action_type: 'status_changed',
      description: 'Account settings updated (phone / SMS preferences)',
      actor_type: 'client',
      actor_name: client.primary_contact_name,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        phone: updated.phone,
        sms_opt_in: updated.sms_opt_in ?? false,
      },
    });
  } catch (error) {
    console.error('Error updating client profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
