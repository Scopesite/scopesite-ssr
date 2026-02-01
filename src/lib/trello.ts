/**
 * Trello API Integration
 * 
 * Helper functions for interacting with the Trello API.
 * Uses a shared board with client labels for organization.
 */

const TRELLO_API_KEY = process.env.TRELLO_API_KEY!;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN!;
const TRELLO_BOARD_ID = process.env.TRELLO_BOARD_ID!;
const BASE_URL = 'https://api.trello.com/1';

// Cache for board data
let cachedLists: { id: string; name: string }[] | null = null;
let cachedCustomFields: { id: string; name: string; type: string; options?: { id: string; value: { text: string } }[] }[] | null = null;

/**
 * Make authenticated request to Trello API
 */
async function trelloFetch<T = unknown>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('key', TRELLO_API_KEY);
  url.searchParams.set('token', TRELLO_TOKEN);

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Trello API error ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Check if Trello is configured
 */
export function isTrelloConfigured(): boolean {
  return !!(TRELLO_API_KEY && TRELLO_TOKEN && TRELLO_BOARD_ID);
}

/**
 * Get lists on the board
 */
export async function getBoardLists(): Promise<{ id: string; name: string }[]> {
  if (cachedLists) return cachedLists;
  
  cachedLists = await trelloFetch<{ id: string; name: string }[]>(
    `/boards/${TRELLO_BOARD_ID}/lists`
  );
  
  return cachedLists;
}

/**
 * Create a new list on the board (for a new client)
 */
export async function createList(name: string): Promise<{ id: string; name: string }> {
  const result = await trelloFetch<{ id: string; name: string }>('/lists', {
    method: 'POST',
    body: JSON.stringify({
      name,
      idBoard: TRELLO_BOARD_ID,
      pos: 'bottom',
    }),
  });

  // Invalidate the cached lists
  cachedLists = null;

  return result;
}

/**
 * Get custom fields on the board
 */
export async function getCustomFields(): Promise<typeof cachedCustomFields> {
  if (cachedCustomFields) return cachedCustomFields;
  
  cachedCustomFields = await trelloFetch(
    `/boards/${TRELLO_BOARD_ID}/customFields`
  );
  
  return cachedCustomFields;
}

/**
 * Find a custom field by name
 */
async function findCustomField(fieldName: string) {
  const fields = await getCustomFields();
  if (!fields) return null;
  
  // Normalize field name for comparison
  const normalizedName = fieldName.toLowerCase().replace(/[\s_-]+/g, '');
  
  return fields.find(f => {
    const normalized = f.name.toLowerCase().replace(/[\s_-]+/g, '');
    return normalized === normalizedName;
  });
}

/**
 * Create a new card on the board
 */
export async function createCard(params: {
  name: string;
  desc: string;
  listId?: string; // Direct list ID (preferred for client-specific lists)
  listName?: string; // Fallback: find list by name
  labelId?: string;
  portalRequestId?: string;
  typeOfWork?: string; // Custom field value: Change Request, New Project, etc.
}): Promise<{ id: string; url: string }> {
  let targetListId = params.listId;

  // If no direct listId, find by name
  if (!targetListId) {
    const lists = await getBoardLists();
    const targetListName = params.listName || 'Incoming';
    let targetList = lists.find(l => l.name.toLowerCase().includes(targetListName.toLowerCase()));
    
    if (!targetList) {
      targetList = lists[0];
    }

    if (!targetList) {
      throw new Error('No lists found on board');
    }
    
    targetListId = targetList.id;
  }

  // Create the card
  const card = await trelloFetch<{ id: string; shortUrl: string }>('/cards', {
    method: 'POST',
    body: JSON.stringify({
      idList: targetListId,
      name: params.name,
      desc: params.desc,
      idLabels: params.labelId ? [params.labelId] : undefined,
    }),
  });

  // Set initial custom fields
  const fieldPromises: Promise<void>[] = [
    setCustomField(card.id, 'progress', 'Not Seen Yet'),
  ];

  if (params.portalRequestId) {
    fieldPromises.push(setCustomField(card.id, 'portal_request_id', params.portalRequestId));
  }

  if (params.typeOfWork) {
    fieldPromises.push(setCustomField(card.id, 'type_of_work', params.typeOfWork));
  }

  await Promise.all(fieldPromises);

  return {
    id: card.id,
    url: card.shortUrl,
  };
}

/**
 * Set a custom field value on a card
 */
export async function setCustomField(
  cardId: string,
  fieldName: string,
  value: string | number
): Promise<void> {
  const field = await findCustomField(fieldName);
  
  if (!field) {
    console.warn(`Custom field "${fieldName}" not found on board`);
    return;
  }

  let body: Record<string, unknown>;

  if (field.type === 'list' && field.options) {
    // For dropdown fields, find the option ID
    const normalizedValue = value.toString().toLowerCase().replace(/[\s_-]+/g, '');
    const option = field.options.find(o => {
      const normalizedOption = o.value.text.toLowerCase().replace(/[\s_-]+/g, '');
      return normalizedOption === normalizedValue;
    });
    
    if (!option) {
      console.warn(`Option "${value}" not found for field "${fieldName}"`);
      return;
    }
    
    body = { idValue: option.id };
  } else if (field.type === 'number') {
    body = { value: { number: value.toString() } };
  } else {
    // Text field
    body = { value: { text: value.toString() } };
  }

  await trelloFetch(`/cards/${cardId}/customField/${field.id}/item`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * Add a comment to a card
 */
export async function addComment(cardId: string, text: string, fromPortal = true): Promise<void> {
  const prefix = fromPortal ? '[From Portal] ' : '';
  const commentText = `${prefix}${text}`;
  
  // Direct API call - Trello comments need text as query param without JSON content-type
  const url = `https://api.trello.com/1/cards/${cardId}/actions/comments?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_TOKEN}&text=${encodeURIComponent(commentText)}`;
  
  const response = await fetch(url, { method: 'POST' });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Trello comment error ${response.status}: ${errorText}`);
  }
}

/**
 * Get a card with its custom fields
 */
export async function getCard(cardId: string): Promise<{
  id: string;
  name: string;
  desc: string;
  customFieldItems: { idCustomField: string; value?: { text?: string; number?: string }; idValue?: string }[];
}> {
  return trelloFetch(`/cards/${cardId}?customFieldItems=true`);
}

/**
 * Get comments on a card
 */
export async function getCardComments(cardId: string): Promise<{
  id: string;
  data: { text: string };
  memberCreator: { fullName: string; id: string };
  date: string;
}[]> {
  return trelloFetch(`/cards/${cardId}/actions?filter=commentCard`);
}

/**
 * Update card name or description
 */
export async function updateCard(
  cardId: string, 
  updates: { name?: string; desc?: string }
): Promise<void> {
  await trelloFetch(`/cards/${cardId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

/**
 * Get all labels on the board
 */
export async function getBoardLabels(): Promise<{ id: string; name: string; color: string }[]> {
  return trelloFetch(`/boards/${TRELLO_BOARD_ID}/labels`);
}

/**
 * Create a new label on the board
 */
export async function createLabel(name: string, color: string): Promise<{ id: string }> {
  return trelloFetch('/labels', {
    method: 'POST',
    body: JSON.stringify({
      name,
      color,
      idBoard: TRELLO_BOARD_ID,
    }),
  });
}

/**
 * Register a webhook for the board
 */
export async function registerWebhook(callbackUrl: string): Promise<{ id: string }> {
  return trelloFetch('/webhooks', {
    method: 'POST',
    body: JSON.stringify({
      callbackURL: callbackUrl,
      idModel: TRELLO_BOARD_ID,
      description: 'ScopeSite Portal Webhook',
    }),
  });
}

/**
 * Delete a webhook
 */
export async function deleteWebhook(webhookId: string): Promise<void> {
  await trelloFetch(`/webhooks/${webhookId}`, {
    method: 'DELETE',
  });
}

/**
 * List all webhooks
 */
export async function listWebhooks(): Promise<{ id: string; idModel: string; callbackURL: string }[]> {
  return trelloFetch(`/tokens/${TRELLO_TOKEN}/webhooks`);
}

/**
 * Parse custom field value from card data
 */
export function parseCustomFieldValue(
  card: { customFieldItems: { idCustomField: string; value?: { text?: string; number?: string }; idValue?: string }[] },
  fieldId: string,
  fieldOptions?: { id: string; value: { text: string } }[]
): string | number | null {
  const item = card.customFieldItems.find(i => i.idCustomField === fieldId);
  
  if (!item) return null;
  
  if (item.value?.text) return item.value.text;
  if (item.value?.number) return parseFloat(item.value.number);
  if (item.idValue && fieldOptions) {
    const option = fieldOptions.find(o => o.id === item.idValue);
    return option?.value.text || null;
  }
  
  return null;
}

/**
 * Map Trello progress value to database progress value
 */
export function mapTrelloProgressToDb(trelloProgress: string): string {
  const mapping: Record<string, string> = {
    'not seen yet': 'not_seen_yet',
    'notyetviewed': 'not_seen_yet',
    'submission viewed': 'submission_viewed',
    'submissionviewed': 'submission_viewed',
    'estimate added': 'estimate_added',
    'estimateadded': 'estimate_added',
    'awaiting approval': 'awaiting_approval',
    'awaitingapproval': 'awaiting_approval',
    'approved': 'approved',
    'in progress': 'in_progress',
    'inprogress': 'in_progress',
    'awaiting information from client': 'awaiting_client_info',
    'awaitingclientinfo': 'awaiting_client_info',
    'in review': 'in_review',
    'inreview': 'in_review',
    'invoice sent': 'invoice_sent',
    'invoicesent': 'invoice_sent',
    'invoice paid': 'invoice_paid',
    'invoicepaid': 'invoice_paid',
  };

  const normalized = trelloProgress.toLowerCase().replace(/[\s_-]+/g, '');
  return mapping[normalized] || trelloProgress.toLowerCase().replace(/\s+/g, '_');
}
