/**
 * Brevo (formerly Sendinblue) API Integration
 * 
 * Handles contact management and list operations
 */

const BREVO_API_URL = 'https://api.brevo.com/v3';

function getApiKey(): string {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY environment variable is not set');
  }
  return apiKey;
}

async function brevoRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
): Promise<Response> {
  const response = await fetch(`${BREVO_API_URL}${endpoint}`, {
    method,
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': getApiKey(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response;
}

/**
 * Create or update a contact in Brevo
 */
export async function createOrUpdateContact(
  email: string,
  attributes?: Record<string, string | number | boolean>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await brevoRequest('/contacts', 'POST', {
      email,
      attributes,
      updateEnabled: true,
    });

    if (response.ok || response.status === 201 || response.status === 204) {
      return { success: true };
    }

    const errorData = await response.json().catch(() => ({}));
    console.error('Brevo create contact error:', errorData);
    return { success: false, error: errorData.message || 'Failed to create contact' };
  } catch (error) {
    console.error('Brevo create contact exception:', error);
    return { success: false, error: 'Failed to connect to Brevo' };
  }
}

/**
 * Add a contact to a specific list
 */
export async function addContactToList(
  email: string,
  listId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // First ensure the contact exists
    await createOrUpdateContact(email);

    const response = await brevoRequest(`/contacts/lists/${listId}/contacts/add`, 'POST', {
      emails: [email],
    });

    if (response.ok || response.status === 201 || response.status === 204) {
      return { success: true };
    }

    const errorData = await response.json().catch(() => ({}));
    console.error('Brevo add to list error:', errorData);
    return { success: false, error: errorData.message || 'Failed to add contact to list' };
  } catch (error) {
    console.error('Brevo add to list exception:', error);
    return { success: false, error: 'Failed to connect to Brevo' };
  }
}

/**
 * Remove a contact from a specific list
 */
export async function removeContactFromList(
  email: string,
  listId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await brevoRequest(`/contacts/lists/${listId}/contacts/remove`, 'POST', {
      emails: [email],
    });

    if (response.ok || response.status === 201 || response.status === 204) {
      return { success: true };
    }

    const errorData = await response.json().catch(() => ({}));
    console.error('Brevo remove from list error:', errorData);
    return { success: false, error: errorData.message || 'Failed to remove contact from list' };
  } catch (error) {
    console.error('Brevo remove from list exception:', error);
    return { success: false, error: 'Failed to connect to Brevo' };
  }
}

/**
 * Update contact attributes in Brevo
 */
export async function updateContactAttributes(
  email: string,
  attributes: Record<string, string | number | boolean | null>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use PUT to update existing contact
    const response = await brevoRequest(`/contacts/${encodeURIComponent(email)}`, 'PUT', {
      attributes,
    });

    if (response.ok || response.status === 204) {
      return { success: true };
    }

    const errorData = await response.json().catch(() => ({}));
    console.error('Brevo update contact error:', errorData);
    return { success: false, error: errorData.message || 'Failed to update contact' };
  } catch (error) {
    console.error('Brevo update contact exception:', error);
    return { success: false, error: 'Failed to connect to Brevo' };
  }
}

/**
 * Get list IDs from environment variables
 */
export const BREVO_LISTS = {
  QUOTE_STARTED: parseInt(process.env.BREVO_LIST_QUOTE_STARTED || '24', 10),
  QUOTE_COMPLETED: parseInt(process.env.BREVO_LIST_QUOTE_COMPLETED || '25', 10),
  QUOTE_ABANDONED: parseInt(process.env.BREVO_LIST_QUOTE_ABANDONED || '26', 10),
} as const;

