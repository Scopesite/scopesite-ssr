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
  logActivity,
  getChangeRequestById
} from '@/lib/portal-db';
import { mapTrelloProgressToDb, getCustomFields } from '@/lib/trello';
import { 
  sendEstimateReadyNotification,
  sendNewCommentNotification,
  sendInvoiceReadyNotification 
} from '@/lib/portal-notifications';
import type { ChangeRequestProgress, UpdateChangeRequest, CommenceWorkBy } from '@/types/portal';
import { getCostDisplay as calculateCostDisplay, URGENCY_RATES } from '@/types/portal';

/**
 * Map Trello "Commence Work By" values to database values
 */
function mapTrelloUrgencyToDb(trelloUrgency: string): CommenceWorkBy {
  const mapping: Record<string, CommenceWorkBy> = {
    'emergency (right now)': 'emergency',
    'emergency': 'emergency',
    'now and out of hours': 'out_of_hours',
    'outofhours': 'out_of_hours',
    '24 hours': '24_hours',
    '24hours': '24_hours',
    '48 hours': '48_hours',
    '48hours': '48_hours',
    '3 - 5 days': '3_5_days',
    '3-5 days': '3_5_days',
    '35days': '3_5_days',
  };
  
  const normalized = trelloUrgency.toLowerCase().replace(/[£\d]+ph/g, '').trim();
  return mapping[normalized] || null;
}

// Trello sends HEAD request to verify webhook URL
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    // Trello verification - they send empty body initially
    if (!body || body === '{}') {
      console.log('[Trello Webhook] Empty body - verification request');
      return NextResponse.json({ ok: true });
    }

    const payload = JSON.parse(body);
    const action = payload.action;

    console.log('[Trello Webhook] Received action:', action?.type, '| Card:', action?.data?.card?.id);

    if (!action) {
      console.log('[Trello Webhook] No action in payload');
      return NextResponse.json({ ok: true });
    }

    const cardId = action.data?.card?.id;

    if (!cardId) {
      console.log('[Trello Webhook] No card ID in action');
      return NextResponse.json({ ok: true });
    }

    // Find the change request by Trello card ID
    const changeRequest = await getChangeRequestByTrelloId(cardId);

    if (!changeRequest) {
      // Card not linked to a portal request - ignore
      console.log('[Trello Webhook] Card not linked to portal request:', cardId);
      return NextResponse.json({ ok: true });
    }

    console.log('[Trello Webhook] Found change request:', changeRequest.id, '| Action:', action.type);

    const client = await getClientById(changeRequest.client_id);
    const actorName = action.memberCreator?.fullName || 'Admin';

    if (!client) {
      console.warn(`Client not found for change request ${changeRequest.id}`);
      return NextResponse.json({ ok: true });
    }

    // Handle different action types
    switch (action.type) {
      case 'updateCustomFieldItem':
        await handleCustomFieldUpdate(changeRequest, action, client);
        break;

      case 'commentCard':
        await handleNewComment(changeRequest, action, actorName, client);
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
  request: { id: string; client_id: string; hours_estimated: number | null; rate_charged: number | null; progress: string; title: string; one_off_payment: number | null; trello_card_id: string | null },
  action: {
    data?: {
      customField?: { name: string; options?: { id: string; value: { text: string } }[] };
      customFieldItem?: { value?: { text?: string; number?: string }; idValue?: string };
    };
    memberCreator?: { fullName: string };
  },
  client: { id: string; email: string; primary_contact_name: string; company_name: string }
) {
  const fieldName = action.data?.customField?.name;
  const newValue = action.data?.customFieldItem;

  console.log('[Trello Webhook] Custom field update - Field:', fieldName, '| Value:', JSON.stringify(newValue));

  if (!fieldName || !newValue) {
    console.log('[Trello Webhook] Missing field name or value');
    return;
  }

  // Normalize field name
  const normalizedFieldName = fieldName.toLowerCase().replace(/[\s_-]+/g, '');

  // Extract value based on type
  let value: string | number | undefined;

  if (newValue.value?.text) {
    value = newValue.value.text;
  } else if (newValue.value?.number) {
    value = parseFloat(newValue.value.number);
  } else if (newValue.idValue) {
    // Dropdown - need to look up option text
    // First try from webhook payload
    if (action.data?.customField?.options) {
      const option = action.data.customField.options.find(o => o.id === newValue.idValue);
      value = option?.value.text;
    }
    
    // If not in payload, fetch from Trello API
    if (!value) {
      console.log('[Trello Webhook] Options not in payload, fetching from Trello API...');
      try {
        const customFields = await getCustomFields();
        const field = customFields?.find(f => f.name.toLowerCase().replace(/[\s_-]+/g, '') === normalizedFieldName);
        if (field?.options) {
          const option = field.options.find(o => o.id === newValue.idValue);
          value = option?.value.text;
          console.log('[Trello Webhook] Found option value from API:', value);
        }
      } catch (err) {
        console.error('[Trello Webhook] Failed to fetch custom fields:', err);
      }
    }
  }

  if (value === undefined) {
    console.log('[Trello Webhook] Could not extract value from:', JSON.stringify(newValue));
    return;
  }

  console.log('[Trello Webhook] Extracted value:', value, '| Normalized field:', normalizedFieldName);

  // Map Trello field to DB field
  const updates: UpdateChangeRequest = {};
  let actionDescription = '';

  switch (normalizedFieldName) {
    case 'progress':
    case 'workingprogress':
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
      // Strip £ symbol from rate (Trello dropdowns have £45, £60, etc.)
      const rateStr = value.toString().replace(/[£,]/g, '');
      updates.rate_charged = parseInt(rateStr, 10);
      actionDescription = `Rate charged set to £${updates.rate_charged}/hr`;
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
    case 'commenceworkby':
    case 'urgency':
      // Map urgency to DB value and auto-set rate
      const urgency = mapTrelloUrgencyToDb(value as string);
      if (urgency) {
        updates.commence_work_by = urgency;
        // Auto-set the rate based on urgency
        updates.rate_charged = URGENCY_RATES[urgency];
        actionDescription = `Urgency set to "${value}" (Rate: £${updates.rate_charged}/hr)`;
      } else {
        console.log('[Trello Webhook] Could not map urgency value:', value);
        return;
      }
      break;
    case 'ratechargedperhour':
      // Handle "Rate Charged Per Hour" field name variant
      const ratePerHourStr = value.toString().replace(/[£,]/g, '');
      updates.rate_charged = parseInt(ratePerHourStr, 10);
      actionDescription = `Rate charged set to £${updates.rate_charged}/hr`;
      break;
    case 'visualprogress':
    case 'progress%':
    case 'percentcomplete':
      // Visual progress percentage (0-100)
      const progressValue = Math.min(100, Math.max(0, Math.round(value as number)));
      updates.visual_progress = progressValue;
      actionDescription = `Progress updated to ${progressValue}%`;
      break;
    case 'complete':
    case 'completed':
    case 'iscomplete':
      // COMPLETE checkbox - marks project as complete
      // Trello checkboxes send 'true'/'false' as strings or the value might be truthy
      const isComplete = String(value).toLowerCase() === 'true' || String(value) === 'checked' || value === 1;
      updates.is_complete = isComplete;
      if (isComplete) {
        updates.visual_progress = 100; // Auto-set progress to 100%
      }
      actionDescription = isComplete ? 'Project marked as COMPLETE' : 'Project completion removed';
      break;
    case 'rejected':
    case 'isrejected':
    case 'halted':
      // REJECTED checkbox - marks project as halted/rejected
      const isRejected = String(value).toLowerCase() === 'true' || String(value) === 'checked' || value === 1;
      updates.is_rejected = isRejected;
      actionDescription = isRejected ? 'Project marked as REJECTED/HALTED' : 'Project rejection removed';
      break;
    default:
      // Unknown field - ignore
      console.log('[Trello Webhook] Unknown field, ignoring:', normalizedFieldName);
      return;
  }

  if (Object.keys(updates).length === 0) {
    console.log('[Trello Webhook] No updates to apply');
    return;
  }

  console.log('[Trello Webhook] Updating request:', request.id, '| Updates:', JSON.stringify(updates));

  // Update database
  await updateChangeRequest(request.id, updates);

  console.log('[Trello Webhook] Database updated successfully');

  // Log activity
  await logActivity({
    client_id: request.client_id,
    change_request_id: request.id,
    action_type: 'status_changed',
    description: actionDescription,
    actor_type: 'admin',
    actor_name: action.memberCreator?.fullName || 'Admin',
  });

  // Get the latest request data to check for notifications
  const updatedRequest = await getChangeRequestById(request.id);
  if (!updatedRequest) return;

  // Check if estimate is now complete (both hours and rate set) - auto-progress
  if (
    (normalizedFieldName === 'hoursestimated' || normalizedFieldName === 'ratecharged') &&
    request.progress === 'submission_viewed'
  ) {
    if (updatedRequest.hours_estimated && updatedRequest.rate_charged) {
      // Auto-update progress to estimate_added
      await updateChangeRequest(request.id, { progress: 'estimate_added' });
      
      // Send estimate ready notification to client
      const costDisplay = calculateCostDisplay(updatedRequest);
      sendEstimateReadyNotification({
        clientEmail: client.email,
        clientName: client.primary_contact_name,
        requestTitle: request.title,
        requestId: request.id,
        costDisplay: costDisplay.display,
      }).catch(err => console.error('Failed to send estimate notification:', err));
    }
  }

  // Send notifications for specific status changes
  if (normalizedFieldName === 'progress') {
    const newProgress = updates.progress;
    
    // Estimate added - send notification if we have estimate values
    if (newProgress === 'estimate_added') {
      const hasEstimate = (updatedRequest.hours_estimated && updatedRequest.rate_charged) || updatedRequest.one_off_payment;
      if (hasEstimate) {
        const costDisplay = calculateCostDisplay(updatedRequest);
        sendEstimateReadyNotification({
          clientEmail: client.email,
          clientName: client.primary_contact_name,
          requestTitle: request.title,
          requestId: request.id,
          costDisplay: costDisplay.display,
        }).catch(err => console.error('Failed to send estimate notification:', err));
      }
    }

    // Invoice sent - send notification
    if (newProgress === 'invoice_sent') {
      const costDisplay = calculateCostDisplay(updatedRequest);
      const totalAmount = costDisplay.total || 0;
      sendInvoiceReadyNotification({
        clientEmail: client.email,
        clientName: client.primary_contact_name,
        requestTitle: request.title,
        requestId: request.id,
        invoiceNumber: updatedRequest.invoice_number || 'N/A',
        totalAmount,
        invoiceUrl: updatedRequest.invoice_url || undefined,
      }).catch(err => console.error('Failed to send invoice notification:', err));
    }
  }
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
  actorName: string,
  client: { id: string; email: string; primary_contact_name: string; company_name: string }
) {
  const commentText = action.data?.text;
  const trelloCommentId = action.id;

  if (!commentText) return;

  // Check if this comment already exists (prevent duplicates)
  const existing = await getCommentByTrelloId(trelloCommentId);
  if (existing) return;

  // Skip comments that came FROM the portal
  // Portal comments start with [email@domain]: pattern OR legacy [From Portal] marker
  const portalEmailPattern = /^\[[\w.+-]+@[\w.-]+\]:/;
  if (commentText.includes('[From Portal]') || portalEmailPattern.test(commentText)) return;

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

  // Notify client of new comment
  sendNewCommentNotification({
    recipientEmail: client.email,
    recipientName: client.primary_contact_name,
    authorName: actorName,
    requestTitle: request.title,
    requestId: request.id,
    comment: commentText,
    isToAdmin: false,
  }).catch(err => console.error('Failed to send comment notification:', err));
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
