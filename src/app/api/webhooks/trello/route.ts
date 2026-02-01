/**
 * Trello Webhook Handler
 * 
 * Receives webhook events from Trello and syncs changes to the portal database.
 * 
 * Events handled:
 * - updateCustomFieldItem: Sync progress, hours, rates to DB
 * - commentCard: Sync comments from Trello to portal
 * - updateCard: Sync title/description changes
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getChangeRequestByTrelloId,
  updateChangeRequest,
  createComment,
  getCommentByTrelloId,
  getClientById,
  logActivity
} from '@/lib/portal-db';
import { getCustomFields, mapTrelloProgressToDb } from '@/lib/trello';
import type { ChangeRequestProgress, UpdateChangeRequest } from '@/types/portal';

// Trello sends HEAD request to verify webhook URL
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    // Trello verification - they send empty body initially
    if (!body || body === '{}') {
      return NextResponse.json({ ok: true });
    }

    const payload = JSON.parse(body);
    const action = payload.action;

    if (!action) {
      return NextResponse.json({ ok: true });
    }

    const cardId = action.data?.card?.id;

    if (!cardId) {
      return NextResponse.json({ ok: true });
    }

    // Find the change request by Trello card ID
    const changeRequest = await getChangeRequestByTrelloId(cardId);

    if (!changeRequest) {
      // Card not linked to a portal request - ignore
      return NextResponse.json({ ok: true });
    }

    const client = await getClientById(changeRequest.client_id);
    const actorName = action.memberCreator?.fullName || 'Admin';

    // Handle different action types
    switch (action.type) {
      case 'updateCustomFieldItem':
        await handleCustomFieldUpdate(changeRequest, action, client?.primary_contact_name || 'Client');
        break;

      case 'commentCard':
        await handleNewComment(changeRequest, action, actorName);
        break;

      case 'updateCard':
        await handleCardUpdate(changeRequest, action, actorName);
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Trello webhook error:', error);
    // Still return 200 to prevent Trello from retrying
    return NextResponse.json({ ok: true, error: 'Error processing webhook' });
  }
}

/**
 * Handle custom field updates from Trello
 */
async function handleCustomFieldUpdate(
  request: { id: string; client_id: string; hours_estimated: number | null; rate_charged: number | null; progress: string },
  action: {
    data?: {
      customField?: { name: string; options?: { id: string; value: { text: string } }[] };
      customFieldItem?: { value?: { text?: string; number?: string }; idValue?: string };
    };
    memberCreator?: { fullName: string };
  },
  clientName: string
) {
  const fieldName = action.data?.customField?.name;
  const newValue = action.data?.customFieldItem;

  if (!fieldName || !newValue) return;

  // Normalize field name
  const normalizedFieldName = fieldName.toLowerCase().replace(/[\s_-]+/g, '');

  // Extract value based on type
  let value: string | number | undefined;

  if (newValue.value?.text) {
    value = newValue.value.text;
  } else if (newValue.value?.number) {
    value = parseFloat(newValue.value.number);
  } else if (newValue.idValue && action.data?.customField?.options) {
    // Dropdown - find option text
    const option = action.data.customField.options.find(o => o.id === newValue.idValue);
    value = option?.value.text;
  }

  if (value === undefined) return;

  // Map Trello field to DB field
  const updates: UpdateChangeRequest = {};
  let actionDescription = '';

  switch (normalizedFieldName) {
    case 'progress':
      updates.progress = mapTrelloProgressToDb(value as string) as ChangeRequestProgress;
      actionDescription = `Status changed to "${value}"`;
      break;
    case 'hoursestimated':
    case 'estimatedhours':
      updates.hours_estimated = value as number;
      actionDescription = `Hours estimated set to ${value}`;
      break;
    case 'hoursworked':
      updates.hours_worked = value as number;
      actionDescription = `Hours worked updated to ${value}`;
      break;
    case 'ratecharged':
    case 'hourlyrate':
      updates.rate_charged = value as number;
      actionDescription = `Rate charged set to £${value}/hr`;
      break;
    case 'oneoffpayment':
    case 'fixedprice':
      updates.one_off_payment = value as number;
      actionDescription = `Fixed price set to £${value}`;
      break;
    case 'invoicenumber':
    case 'invoicenumberissued':
      updates.invoice_number = value as string;
      actionDescription = `Invoice number set to ${value}`;
      break;
    default:
      // Unknown field - ignore
      return;
  }

  if (Object.keys(updates).length === 0) return;

  // Update database
  await updateChangeRequest(request.id, updates);

  // Log activity
  await logActivity({
    client_id: request.client_id,
    change_request_id: request.id,
    action_type: 'status_changed',
    description: actionDescription,
    actor_type: 'admin',
    actor_name: action.memberCreator?.fullName || 'Admin',
  });

  // Check if estimate is now complete (both hours and rate set)
  if (
    (normalizedFieldName === 'hoursestimated' || normalizedFieldName === 'ratecharged') &&
    request.progress === 'submission_viewed'
  ) {
    // Refresh to get latest values
    const updatedRequest = await getChangeRequestByTrelloId(request.id);
    if (updatedRequest?.hours_estimated && updatedRequest?.rate_charged) {
      // Auto-update progress to estimate_added
      await updateChangeRequest(request.id, { progress: 'estimate_added' });
      
      // TODO: Send client notification (Phase 6)
    }
  }

  // TODO: Send notifications for certain status changes (Phase 6)
}

/**
 * Handle new comments from Trello
 */
async function handleNewComment(
  request: { id: string; client_id: string; title: string },
  action: {
    id: string;
    data?: { text?: string };
    memberCreator?: { fullName: string; id: string };
  },
  actorName: string
) {
  const commentText = action.data?.text;
  const trelloCommentId = action.id;

  if (!commentText) return;

  // Check if this comment already exists (prevent duplicates)
  const existing = await getCommentByTrelloId(trelloCommentId);
  if (existing) return;

  // Skip comments that came FROM the portal (they have a marker)
  if (commentText.includes('[From Portal]')) return;

  // Save comment to DB
  await createComment({
    change_request_id: request.id,
    trello_comment_id: trelloCommentId,
    user_type: 'admin',
    user_name: actorName,
    user_id: action.memberCreator?.id || 'admin',
    message: commentText,
  });

  // Log activity
  await logActivity({
    client_id: request.client_id,
    change_request_id: request.id,
    action_type: 'comment_added',
    description: `New comment from ${actorName}`,
    actor_type: 'admin',
    actor_name: actorName,
  });

  // TODO: Notify client of new comment (Phase 6)
}

/**
 * Handle card title/description updates from Trello
 */
async function handleCardUpdate(
  request: { id: string; client_id: string },
  action: {
    data?: {
      old?: { name?: string; desc?: string };
      card?: { name?: string; desc?: string };
    };
    memberCreator?: { fullName: string };
  },
  actorName: string
) {
  const oldData = action.data?.old;
  const newData = action.data?.card;

  if (!oldData || !newData) return;

  const updates: UpdateChangeRequest = {};

  // Check if name changed
  if (oldData.name !== undefined && newData.name && oldData.name !== newData.name) {
    updates.title = newData.name;
  }

  // Check if description changed
  if (oldData.desc !== undefined && newData.desc !== undefined && oldData.desc !== newData.desc) {
    updates.description = newData.desc;
  }

  if (Object.keys(updates).length === 0) return;

  // Update database
  await updateChangeRequest(request.id, updates);

  // Log activity
  const changedFields = Object.keys(updates).join(', ');
  await logActivity({
    client_id: request.client_id,
    change_request_id: request.id,
    action_type: 'status_changed',
    description: `Request ${changedFields} updated`,
    actor_type: 'admin',
    actor_name: actorName,
  });
}
