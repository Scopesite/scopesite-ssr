/**
 * Admin: create a new Trello list for a client and assign future requests to it
 *
 * POST /api/portal/admin/clients/[id]/trello-list
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getClientById, logActivity } from '@/lib/portal-db';
import { isPortalAdmin } from '@/lib/portal-auth';
import {
  getClientTrelloListStatus,
  recreateClientTrelloList,
} from '@/lib/portal-trello';
import { isTrelloConfigured } from '@/lib/trello';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId || !isPortalAdmin(userId)) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const client = await getClientById(id);

    if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const status = await getClientTrelloListStatus(client);

    return NextResponse.json({ success: true, data: status });
  } catch (error) {
    console.error('trello-list status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load Trello list status' },
      { status: 500 }
    );
  }
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!isPortalAdmin(userId)) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    if (!isTrelloConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Trello is not configured on this environment' },
        { status: 503 }
      );
    }

    const { id } = await params;
    const client = await getClientById(id);

    if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const before = await getClientTrelloListStatus(client);
    const { client: updated, listId, listName } = await recreateClientTrelloList(client);

    const user = await currentUser();
    const adminName =
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
      user?.emailAddresses[0]?.emailAddress ||
      'Admin';

    await logActivity({
      client_id: client.id,
      action_type: 'status_changed',
      description: `New Trello list "${listName}" assigned for future requests${
        before.listName ? ` (replaced ${before.listName})` : ''
      }`,
      actor_type: 'admin',
      actor_name: adminName,
    });

    const status = await getClientTrelloListStatus(updated);

    return NextResponse.json({
      success: true,
      data: {
        client: updated,
        listId,
        listName,
        status,
        message: `New list "${listName}" created. All new portal requests for this client will use it.`,
      },
    });
  } catch (error) {
    console.error('trello-list create error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create Trello list',
      },
      { status: 500 }
    );
  }
}
