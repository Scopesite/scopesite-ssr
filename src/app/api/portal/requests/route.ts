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
import { isTrelloConfigured, createCard, addComment, setCustomField } from '@/lib/trello';
import { sendRequestSubmittedNotification } from '@/lib/portal-notifications';
import type { ChangeRequestType, CommenceWorkBy } from '@/types/portal';
import { TYPE_OF_WORK_LABELS, URGENCY_LABELS, URGENCY_RATES } from '@/types/portal';

// Validation
function validateRequest(body: unknown): { valid: true; data: { title: string; description: string; type_of_work: ChangeRequestType; commence_work_by?: Exclude<CommenceWorkBy, null>; project_id?: string; file_urls?: string[] } } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { title, description, type_of_work, commence_work_by, project_id, file_urls } = body as Record<string, unknown>;

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

  // Validate commence_work_by if provided
  const validUrgencies: Exclude<CommenceWorkBy, null>[] = ['emergency', 'out_of_hours', '24_hours', '48_hours', '3_5_days'];
  let validatedUrgency: Exclude<CommenceWorkBy, null> | undefined;
  if (commence_work_by && validUrgencies.includes(commence_work_by as Exclude<CommenceWorkBy, null>)) {
    validatedUrgency = commence_work_by as Exclude<CommenceWorkBy, null>;
  }

  return {
    valid: true,
    data: {
      title: title.trim(),
      description: description.trim(),
      type_of_work: type_of_work as ChangeRequestType,
      commence_work_by: validatedUrgency,
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
      commence_work_by: validation.data.commence_work_by,
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
        // Map DB type to Trello dropdown label
        const typeOfWorkLabel = TYPE_OF_WORK_LABELS[validation.data.type_of_work] || validation.data.type_of_work;
        
        const trelloCard = await createCard({
          name: `[${client.company_name}] ${validation.data.title}`,
          desc: `**Type:** ${typeOfWorkLabel}\n**Client:** ${client.company_name}\n**Submitted by:** ${client.primary_contact_name}\n\n---\n\n${validation.data.description}`,
          listId: client.trello_list_id || undefined, // Use client's list
          labelId: client.trello_label_id || undefined,
          portalRequestId: changeRequest.id,
          typeOfWork: typeOfWorkLabel, // Set the custom field
        });

        // Update request with Trello card ID
        await updateChangeRequest(changeRequest.id, {
          trello_card_id: trelloCard.id,
        });

        // Set the Commence Work By custom field and rate if provided
        if (validation.data.commence_work_by) {
          const urgencyLabel = URGENCY_LABELS[validation.data.commence_work_by];
          await setCustomField(trelloCard.id, 'commence_work_by', urgencyLabel);
          // Also set the rate based on urgency
          const rate = URGENCY_RATES[validation.data.commence_work_by];
          await setCustomField(trelloCard.id, 'rate_charged', `£${rate}`);
        }

        // Add file attachment comments to Trello card
        if (validation.data.file_urls && validation.data.file_urls.length > 0) {
          for (const fileUrl of validation.data.file_urls) {
            // Extract filename from URL
            const filename = fileUrl.split('/').pop() || 'file';
            await addComment(trelloCard.id, `📎 File uploaded by client: ${filename} - ${fileUrl}`);
          }
        }
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
