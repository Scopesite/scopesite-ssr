/**
 * Portal Request Approval API
 * 
 * POST /api/portal/requests/[id]/approve - Approve or reject an estimate
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  getClientByClerkId, 
  getChangeRequestById,
  updateChangeRequest,
  logActivity 
} from '@/lib/portal-db';
import { sendEstimateApprovedNotification } from '@/lib/portal-notifications';
import { getCostDisplay } from '@/types/portal';

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

    // Check if request can be approved/rejected
    const approvableStatuses = ['estimate_added', 'awaiting_approval'];
    if (!approvableStatuses.includes(changeRequest.progress)) {
      return NextResponse.json(
        { success: false, error: 'This request is not awaiting approval' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, reason } = body;

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Approve the estimate
      const updated = await updateChangeRequest(resolvedParams.id, {
        progress: 'approved',
        estimate_approved_at: new Date(),
      });

      // Log activity
      await logActivity({
        client_id: client.id,
        change_request_id: resolvedParams.id,
        action_type: 'estimate_approved',
        description: `Estimate approved for "${changeRequest.title}"`,
        actor_type: 'client',
        actor_name: client.primary_contact_name,
      });

      // Send admin notification (non-blocking)
      const cost = getCostDisplay(changeRequest);
      sendEstimateApprovedNotification({
        clientName: client.primary_contact_name,
        companyName: client.company_name,
        requestTitle: changeRequest.title,
        requestId: changeRequest.id,
        costDisplay: cost.display,
        trelloCardId: changeRequest.trello_card_id || undefined,
      }).catch(err => console.error('Failed to send approval notification:', err));

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Estimate approved successfully',
      });
    } else {
      // Reject/query the estimate
      if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: 'Please provide a reason for querying the estimate' },
          { status: 400 }
        );
      }

      const updated = await updateChangeRequest(resolvedParams.id, {
        progress: 'awaiting_client_info',
        estimate_rejected_at: new Date(),
        estimate_rejected_reason: reason.trim(),
      });

      // Log activity
      await logActivity({
        client_id: client.id,
        change_request_id: resolvedParams.id,
        action_type: 'estimate_rejected',
        description: `Estimate queried: "${reason.trim()}"`,
        actor_type: 'client',
        actor_name: client.primary_contact_name,
        metadata: { reason: reason.trim() },
      });

      // TODO: Add comment to Trello card (Phase 4)
      // TODO: Send admin notification (Phase 6)

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Query submitted successfully',
      });
    }
  } catch (error) {
    console.error('Error processing approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process approval' },
      { status: 500 }
    );
  }
}
