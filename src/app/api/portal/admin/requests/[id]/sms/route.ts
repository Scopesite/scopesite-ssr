/**
 * Admin manual SMS for a request's client
 *
 * POST /api/portal/admin/requests/[id]/sms
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
  getChangeRequestById,
  getClientById,
  logActivity,
} from '@/lib/portal-db';
import { isPortalAdmin } from '@/lib/portal-auth';
import { sendSms } from '@/lib/brevo-sms';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isPortalAdmin(userId)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id: requestId } = await params;
    const changeRequest = await getChangeRequestById(requestId);

    if (!changeRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    const client = await getClientById(changeRequest.client_id);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    if (!client.sms_opt_in) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client has not opted in to SMS updates. They can enable this in Settings.',
        },
        { status: 400 }
      );
    }

    if (!client.phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client has no phone number on file.',
        },
        { status: 400 }
      );
    }

    const body = (await request.json()) as { message?: string };
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > 320) {
      return NextResponse.json(
        { success: false, error: 'Message must be 320 characters or fewer' },
        { status: 400 }
      );
    }

    const result = await sendSms({
      to: client.phone,
      body: `ScopeSite: ${message}`,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send SMS' },
        { status: 502 }
      );
    }

    const user = await currentUser();
    const adminName =
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
      user?.emailAddresses[0]?.emailAddress ||
      'Admin';

    await logActivity({
      client_id: client.id,
      change_request_id: changeRequest.id,
      action_type: 'comment_added',
      description: `Admin sent SMS: ${message.slice(0, 80)}${message.length > 80 ? '…' : ''}`,
      actor_type: 'admin',
      actor_name: adminName,
      metadata: { sms_body: message, sent_to: client.phone },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending manual SMS:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send SMS' },
      { status: 500 }
    );
  }
}
