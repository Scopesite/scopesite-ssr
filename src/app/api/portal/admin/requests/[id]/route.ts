/**
 * Admin Request Management API
 * 
 * DELETE /api/portal/admin/requests/[id] - Delete a request (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  getChangeRequestById,
  deleteChangeRequest,
  logActivity,
  getClientById
} from '@/lib/portal-db';

const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').map(id => id.trim());

function isAdmin(userId: string): boolean {
  return ADMIN_CLERK_IDS.includes(userId);
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isAdmin(userId)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const requestId = resolvedParams.id;

    // Get the request first to log the deletion
    const changeRequest = await getChangeRequestById(requestId);
    
    if (!changeRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    // Log the deletion before deleting
    await logActivity({
      client_id: changeRequest.client_id,
      action_type: 'status_changed',
      description: `Request "${changeRequest.title}" was deleted by admin`,
      actor_type: 'admin',
      actor_name: 'Admin',
    });

    // Delete the request
    const deleted = await deleteChangeRequest(requestId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to delete request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
