/**
 * Portal + Trello setup helpers
 */

import { createList, getListById, isTrelloConfigured } from '@/lib/trello';
import { updateClient } from '@/lib/portal-db';
import type { ClientRow, ChangeRequestRow } from '@/types/portal';
import {
  TYPE_OF_WORK_LABELS,
  URGENCY_LABELS,
  URGENCY_RATES,
  type CommenceWorkBy,
} from '@/types/portal';
import {
  createCard,
  setCustomField,
  addComment,
  getCardPublicUrl,
} from '@/lib/trello';

export interface ClientTrelloListStatus {
  configured: boolean;
  listId: string | null;
  listName: string | null;
  isArchived: boolean;
  needsNewList: boolean;
}

export async function getClientTrelloListStatus(
  client: Pick<ClientRow, 'trello_list_id'>
): Promise<ClientTrelloListStatus> {
  if (!isTrelloConfigured()) {
    return {
      configured: false,
      listId: null,
      listName: null,
      isArchived: false,
      needsNewList: false,
    };
  }

  if (!client.trello_list_id) {
    return {
      configured: true,
      listId: null,
      listName: null,
      isArchived: false,
      needsNewList: true,
    };
  }

  const existing = await getListById(client.trello_list_id);
  if (!existing) {
    return {
      configured: true,
      listId: client.trello_list_id,
      listName: null,
      isArchived: true,
      needsNewList: true,
    };
  }

  return {
    configured: true,
    listId: existing.id,
    listName: existing.name,
    isArchived: existing.closed,
    needsNewList: existing.closed,
  };
}

/**
 * Create a new open Trello list and assign it to the client (all future requests use it).
 */
export async function recreateClientTrelloList(client: ClientRow): Promise<{
  client: ClientRow;
  listId: string;
  listName: string;
}> {
  if (!isTrelloConfigured()) {
    throw new Error('Trello is not configured');
  }

  const trelloList = await createList(client.company_name);
  const updated = await updateClient(client.id, { trello_list_id: trelloList.id });

  const nextClient = updated || { ...client, trello_list_id: trelloList.id };
  return {
    client: nextClient,
    listId: trelloList.id,
    listName: trelloList.name,
  };
}

/**
 * Ensure the client has an open (non-archived) Trello list for new cards.
 */
export async function ensureClientTrelloList(client: ClientRow): Promise<ClientRow> {
  if (!isTrelloConfigured()) {
    return client;
  }

  const status = await getClientTrelloListStatus(client);
  if (!status.needsNewList && status.listId) {
    return client;
  }

  if (status.needsNewList && client.trello_list_id) {
    console.warn(
      `Client ${client.company_name} Trello list needs replacement (${status.listName ?? client.trello_list_id})`
    );
  }

  const { client: updated } = await recreateClientTrelloList(client);
  return updated;
}

export interface SyncRequestToTrelloOptions {
  submittedByName: string;
  createdOnBehalf?: boolean;
  commenceWorkBy?: CommenceWorkBy | null;
  fileUrls?: string[];
}

export interface SyncRequestToTrelloResult {
  success: boolean;
  trelloCardId?: string;
  trelloUrl?: string;
  error?: string;
  skipped?: boolean;
  reason?: string;
}

/**
 * Create a Trello card for a portal request and persist trello_card_id.
 */
export async function syncRequestToTrello(
  request: ChangeRequestRow,
  client: ClientRow,
  options: SyncRequestToTrelloOptions
): Promise<SyncRequestToTrelloResult> {
  if (!isTrelloConfigured()) {
    return {
      success: false,
      skipped: true,
      reason: 'Trello is not configured (missing API env vars)',
    };
  }

  if (request.trello_card_id) {
    const existingUrl = await getCardPublicUrl(request.trello_card_id);
    if (existingUrl) {
      return {
        success: true,
        trelloCardId: request.trello_card_id,
        trelloUrl: existingUrl,
        reason: 'Request already linked to Trello',
      };
    }
    // Stale ID in DB (card deleted or never created) — create a fresh card below
  }

  const clientWithList = await ensureClientTrelloList(client);

  const typeOfWorkLabel =
    TYPE_OF_WORK_LABELS[request.type_of_work] || request.type_of_work;
  const submittedBy = options.createdOnBehalf
    ? `${options.submittedByName} (on behalf of ${client.primary_contact_name})`
    : options.submittedByName;

  try {
    const trelloCard = await createCard({
      name: `[${client.company_name}] ${request.title}`,
      desc: `**Type:** ${typeOfWorkLabel}\n**Client:** ${client.company_name}\n**Submitted by:** ${submittedBy}\n\n---\n\n${request.description}`,
      listId: clientWithList.trello_list_id || undefined,
      labelId: clientWithList.trello_label_id || undefined,
      portalRequestId: request.id,
      typeOfWork: typeOfWorkLabel,
    });

    const commenceWorkBy = options.commenceWorkBy ?? request.commence_work_by;
    if (commenceWorkBy) {
      const urgencyLabel = URGENCY_LABELS[commenceWorkBy as Exclude<CommenceWorkBy, null>];
      if (urgencyLabel) {
        await setCustomField(trelloCard.id, 'commence_work_by', urgencyLabel);
        const rate = URGENCY_RATES[commenceWorkBy as Exclude<CommenceWorkBy, null>];
        if (rate) {
          await setCustomField(trelloCard.id, 'rate_charged', `£${rate}`);
        }
      }
    }

    if (options.fileUrls?.length) {
      for (const fileUrl of options.fileUrls) {
        const filename = fileUrl.split('/').pop() || 'file';
        const uploader = options.createdOnBehalf ? 'staff' : 'client';
        await addComment(
          trelloCard.id,
          `📎 File uploaded by ${uploader}: ${filename} - ${fileUrl}`
        );
      }
    }

    return {
      success: true,
      trelloCardId: trelloCard.id,
      trelloUrl: trelloCard.url,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Trello error';
    console.error('syncRequestToTrello failed:', error);
    return { success: false, error: message };
  }
}
