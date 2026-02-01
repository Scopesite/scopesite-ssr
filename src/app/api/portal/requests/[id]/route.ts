/**
 * Portal Request Detail API
 * 
 * GET /api/portal/requests/[id] - Get request details
 * PATCH /api/portal/requests/[id] - Update request (client can only update certain fields)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  getClientByClerkId, 
  getChangeRequestById,
  updateChangeRequest 
} from '@/lib/portal-db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const resolvedParams = await params;
    const changeRequest = await getChangeRequestById(resolvedParams.id);

    if (!changeRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    // Verify request belongs to this client
    if (changeRequest.client_id !== client.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to view this request' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: changeRequest,
    });
  } catch (error) {
    console.error('Error fetching request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch request' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const resolvedParams = await params;
    const changeRequest = await getChangeRequestById(resolvedParams.id);

    if (!changeRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    // Verify request belongs to this client
    if (changeRequest.client_id !== client.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this request' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Clients can only update title and description, and only if not yet in progress
    const allowedStatuses = ['not_seen_yet', 'submission_viewed'];
    if (!allowedStatuses.includes(changeRequest.progress)) {
      return NextResponse.json(
        { success: false, error: 'Cannot edit request after work has begun' },
        { status: 400 }
      );
    }

    const updates: { title?: string; description?: string } = {};

    if (body.title && typeof body.title === 'string') {
      updates.title = body.title.trim();
    }

    if (body.description && typeof body.description === 'string') {
      updates.description = body.description.trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid updates provided' },
        { status: 400 }
      );
    }

    const updatedRequest = await updateChangeRequest(resolvedParams.id, updates);

    return NextResponse.json({
      success: true,
      data: updatedRequest,
    });
  } catch (error) {
    console.error('Error updating request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update request' },
      { status: 500 }
    );
  }
}
