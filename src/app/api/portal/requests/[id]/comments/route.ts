/**
 * Portal Request Comments API
 * 
 * GET /api/portal/requests/[id]/comments - Get all comments for a request
 * POST /api/portal/requests/[id]/comments - Add a new comment
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  getClientByClerkId, 
  getChangeRequestById,
  getCommentsByRequestId,
  createComment,
  logActivity 
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
        { success: false, error: 'Not authorized' },
        { status: 403 }
      );
    }

    const comments = await getCommentsByRequestId(resolvedParams.id);

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
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
        { success: false, error: 'Not authorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create the comment
    const comment = await createComment({
      change_request_id: resolvedParams.id,
      user_type: 'client',
      user_name: client.primary_contact_name,
      user_id: userId,
      message: message.trim(),
    });

    // Log activity
    await logActivity({
      client_id: client.id,
      change_request_id: resolvedParams.id,
      action_type: 'comment_added',
      description: `Comment added on "${changeRequest.title}"`,
      actor_type: 'client',
      actor_name: client.primary_contact_name,
    });

    // TODO: Add comment to Trello card with [From Portal] prefix (Phase 4)
    // TODO: Send admin notification (Phase 6)

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
