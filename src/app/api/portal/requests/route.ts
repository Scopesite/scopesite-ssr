/**
 * Portal Requests API
 *
 * GET /api/portal/requests - List all requests for current client
 * POST /api/portal/requests - Create new request (client or admin on behalf)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
  getClientByClerkId,
  getClientById,
  getChangeRequestsByClientId,
  createChangeRequest,
  updateChangeRequest,
  logActivity,
} from '@/lib/portal-db';
import { isPortalAdmin } from '@/lib/portal-auth';
import { syncRequestToTrello } from '@/lib/portal-trello';
import {
  sendRequestSubmittedNotification,
  sendRequestOnBehalfNotification,
} from '@/lib/portal-notifications';
import { sendSms } from '@/lib/brevo-sms';
import type { ChangeRequestType, CommenceWorkBy } from '@/types/portal';
import { TYPE_OF_WORK_LABELS, URGENCY_LABELS } from '@/types/portal';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scopesite.co.uk';

function validateRequest(
  body: unknown
):
  | {
      valid: true;
      data: {
        title: string;
        description: string;
        type_of_work: ChangeRequestType;
        commence_work_by?: Exclude<CommenceWorkBy, null>;
        project_id?: string;
        file_urls?: string[];
        on_behalf_client_id?: string;
      };
    }
  | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const {
    title,
    description,
    type_of_work,
    commence_work_by,
    project_id,
    file_urls,
    on_behalf_client_id,
  } = body as Record<string, unknown>;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return { valid: false, error: 'Description is required' };
  }

  const validTypes: ChangeRequestType[] = [
    'change_request',
    'new_project',
    'error_found',
    'general_message',
  ];
  if (!type_of_work || !validTypes.includes(type_of_work as ChangeRequestType)) {
    return { valid: false, error: 'Invalid type of work' };
  }

  const validUrgencies: Exclude<CommenceWorkBy, null>[] = [
    'emergency',
    'out_of_hours',
    '24_hours',
    '48_hours',
    '3_5_days',
  ];
  let validatedUrgency: Exclude<CommenceWorkBy, null> | undefined;
  if (
    commence_work_by &&
    validUrgencies.includes(commence_work_by as Exclude<CommenceWorkBy, null>)
  ) {
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
      file_urls: Array.isArray(file_urls)
        ? file_urls.filter((u) => typeof u === 'string')
        : undefined,
      on_behalf_client_id:
        typeof on_behalf_client_id === 'string' ? on_behalf_client_id : undefined,
    },
  };
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const client = await getClientByClerkId(userId);

    if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const requests = await getChangeRequestsByClientId(client.id);

    return NextResponse.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to fetch requests: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateRequest(body);

    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const admin = isPortalAdmin(userId);
    let client = await getClientByClerkId(userId);
    let createdOnBehalf = false;
    let adminActorName = 'Admin';

    if (admin && validation.data.on_behalf_client_id) {
      const targetClient = await getClientById(validation.data.on_behalf_client_id);
      if (!targetClient) {
        return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
      }
      client = targetClient;
      createdOnBehalf = true;
      const user = await currentUser();
      adminActorName =
        [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
        user?.emailAddresses[0]?.emailAddress ||
        'ScopeSite';
    } else if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const changeRequest = await createChangeRequest({
      client_id: client.id,
      project_id: validation.data.project_id,
      title: validation.data.title,
      description: validation.data.description,
      type_of_work: validation.data.type_of_work,
      commence_work_by: validation.data.commence_work_by,
      created_by_user_id: userId,
      created_on_behalf_of: createdOnBehalf,
    });

    if (createdOnBehalf) {
      await logActivity({
        client_id: client.id,
        change_request_id: changeRequest.id,
        action_type: 'request_submitted',
        description: `Request created by ${adminActorName} on behalf of ${client.primary_contact_name}: "${changeRequest.title}"`,
        actor_type: 'admin',
        actor_name: adminActorName,
        metadata: {
          on_behalf_of: client.id,
          created_by_clerk_id: userId,
        },
      });
    } else {
      await logActivity({
        client_id: client.id,
        change_request_id: changeRequest.id,
        action_type: 'request_submitted',
        description: `New request submitted: "${changeRequest.title}"`,
        actor_type: 'client',
        actor_name: client.primary_contact_name,
        metadata: { created_by_clerk_id: userId },
      });
    }

    let trelloWarning: string | undefined;
    const trelloSync = await syncRequestToTrello(changeRequest, client, {
      submittedByName: createdOnBehalf ? adminActorName : client.primary_contact_name,
      createdOnBehalf,
      commenceWorkBy: validation.data.commence_work_by,
      fileUrls: validation.data.file_urls,
    });

    if (trelloSync.success && trelloSync.trelloCardId) {
      await updateChangeRequest(changeRequest.id, {
        trello_card_id: trelloSync.trelloCardId,
      });
      changeRequest.trello_card_id = trelloSync.trelloCardId;
    } else if (!trelloSync.skipped) {
      trelloWarning =
        trelloSync.error ||
        'Request saved in the portal but Trello card could not be created. Use Sync to Trello on the request page.';
      console.error('Trello sync failed for request', changeRequest.id, trelloSync);
    }

    sendRequestSubmittedNotification({
      clientName: client.primary_contact_name,
      companyName: client.company_name,
      requestTitle: changeRequest.title,
      requestType: TYPE_OF_WORK_LABELS[changeRequest.type_of_work] || changeRequest.type_of_work,
      requestId: changeRequest.id,
      description: changeRequest.description || '',
    }).catch((err) => console.error('Failed to send admin notification:', err));

    const adminPhone = process.env.ADMIN_PHONE;
    if (adminPhone) {
      const urgency =
        changeRequest.commence_work_by &&
        URGENCY_LABELS[changeRequest.commence_work_by as Exclude<CommenceWorkBy, null>]
          ? URGENCY_LABELS[changeRequest.commence_work_by as Exclude<CommenceWorkBy, null>]
          : 'unspecified';
      const titleShort = changeRequest.title.slice(0, 60);
      sendSms({
        to: adminPhone,
        body: `ScopeSite: new request from ${client.company_name} — ${titleShort}. Urgency: ${urgency}. View: ${BASE_URL}/portal/requests/${changeRequest.id}`,
      }).catch((err) => console.error('Admin SMS failed:', err));
    }

    if (createdOnBehalf) {
      sendRequestOnBehalfNotification({
        clientEmail: client.email,
        clientName: client.primary_contact_name,
        requestTitle: changeRequest.title,
        requestId: changeRequest.id,
        createdByName: adminActorName,
      }).catch((err) => console.error('Failed to send on-behalf notification:', err));
    }

    return NextResponse.json({
      success: true,
      data: changeRequest,
      trelloWarning,
      trelloCardId: changeRequest.trello_card_id ?? undefined,
    });
  } catch (error) {
    console.error('Error creating request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to create request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
