/**
 * Portal Requests API
 * 
 * GET /api/portal/requests - List all requests for current client
 * POST /api/portal/requests - Create new request
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  getClientByClerkId, 
  getChangeRequestsByClientId,
  createChangeRequest,
  updateChangeRequest,
  logActivity 
} from '@/lib/portal-db';
import { isTrelloConfigured, createCard } from '@/lib/trello';
import { sendRequestSubmittedNotification } from '@/lib/portal-notifications';
import type { ChangeRequestType } from '@/types/portal';
import { TYPE_OF_WORK_LABELS } from '@/types/portal';

// Validation
function validateRequest(body: unknown): { valid: true; data: { title: string; description: string; type_of_work: ChangeRequestType; project_id?: string; file_urls?: string[] } } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { title, description, type_of_work, project_id, file_urls } = body as Record<string, unknown>;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return { valid: false, error: 'Description is required' };
  }

  const validTypes: ChangeRequestType[] = ['change_request', 'new_project', 'error_found', 'general_message'];
  if (!type_of_work || !validTypes.includes(type_of_work as ChangeRequestType)) {
    return { valid: false, error: 'Invalid type of work' };
  }

  return {
    valid: true,
    data: {
      title: title.trim(),
      description: description.trim(),
      type_of_work: type_of_work as ChangeRequestType,
      project_id: typeof project_id === 'string' ? project_id : undefined,
      file_urls: Array.isArray(file_urls) ? file_urls.filter(u => typeof u === 'string') : undefined,
    },
  };
}

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

    const requests = await getChangeRequestsByClientId(client.id);

    return NextResponse.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validation = validateRequest(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Create the change request
    const changeRequest = await createChangeRequest({
      client_id: client.id,
      project_id: validation.data.project_id,
      title: validation.data.title,
      description: validation.data.description,
      type_of_work: validation.data.type_of_work,
    });

    // Log activity
    await logActivity({
      client_id: client.id,
      change_request_id: changeRequest.id,
      action_type: 'request_submitted',
      description: `New request submitted: "${changeRequest.title}"`,
      actor_type: 'client',
      actor_name: client.primary_contact_name,
    });

    // Create Trello card (non-blocking)
    if (isTrelloConfigured()) {
      try {
        const trelloCard = await createCard({
          name: `[${client.company_name}] ${validation.data.title}`,
          desc: `**Type:** ${validation.data.type_of_work}\n**Client:** ${client.company_name}\n**Submitted by:** ${client.primary_contact_name}\n\n---\n\n${validation.data.description}`,
          labelId: client.trello_label_id || undefined,
          portalRequestId: changeRequest.id,
        });

        // Update request with Trello card ID
        await updateChangeRequest(changeRequest.id, {
          trello_card_id: trelloCard.id,
        });
      } catch (trelloError) {
        // Log but don't fail the request
        console.error('Failed to create Trello card:', trelloError);
      }
    }

    // Send admin notification (non-blocking)
    sendRequestSubmittedNotification({
      clientName: client.primary_contact_name,
      companyName: client.company_name,
      requestTitle: changeRequest.title,
      requestType: TYPE_OF_WORK_LABELS[changeRequest.type_of_work] || changeRequest.type_of_work,
      requestId: changeRequest.id,
      description: changeRequest.description || '',
    }).catch(err => console.error('Failed to send admin notification:', err));

    return NextResponse.json({
      success: true,
      data: changeRequest,
    });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create request' },
      { status: 500 }
    );
  }
}
