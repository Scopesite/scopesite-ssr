/**
 * Admin: sync an existing portal request to Trello
 *
 * POST /api/portal/admin/requests/[id]/sync-trello
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
  getChangeRequestById,
  getClientById,
  updateChangeRequest,
  logActivity,
} from '@/lib/portal-db';
import { isPortalAdmin } from '@/lib/portal-auth';
import { syncRequestToTrello } from '@/lib/portal-trello';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    const client = await getClientById(changeRequest.client_id);

    if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const user = await currentUser();
    const adminName =
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
      user?.emailAddresses[0]?.emailAddress ||
      'Admin';

    const trelloSync = await syncRequestToTrello(changeRequest, client, {
      submittedByName: adminName,
      createdOnBehalf: changeRequest.created_on_behalf_of ?? false,
      commenceWorkBy: changeRequest.commence_work_by,
    });

    if (!trelloSync.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            trelloSync.error ||
            trelloSync.reason ||
            'Could not create Trello card',
        },
        { status: 502 }
      );
    }

    if (trelloSync.trelloCardId && !changeRequest.trello_card_id) {
      await updateChangeRequest(changeRequest.id, {
        trello_card_id: trelloSync.trelloCardId,
      });
    }

    await logActivity({
      client_id: client.id,
      change_request_id: changeRequest.id,
      action_type: 'status_changed',
      description: `Request synced to Trello (${trelloSync.trelloCardId || changeRequest.trello_card_id})`,
      actor_type: 'admin',
      actor_name: adminName,
    });

    return NextResponse.json({
      success: true,
      trelloCardId: trelloSync.trelloCardId || changeRequest.trello_card_id,
      trelloUrl: trelloSync.trelloUrl,
      message: trelloSync.reason || 'Trello card created',
    });
  } catch (error) {
    console.error('sync-trello error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync to Trello' },
      { status: 500 }
    );
  }
}
