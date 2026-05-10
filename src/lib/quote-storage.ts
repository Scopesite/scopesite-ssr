/**
 * Quote Progress Storage
 * 
 * Persistent storage using Vercel Postgres (Neon) for production.
 * 
 * Schema:
 * - id: Unique quote token (used in URL ?q=)
 * - email: Customer email
 * - status: 'started' | 'in_progress' | 'submitted' | 'abandoned'
 * - currentStep: Last step number (1-6)
 * - selections: Current quote selections (projectType, scope, addOns, paymentPreference)
 * - createdAt: Timestamp when quote started
 * - updatedAt: Timestamp of last update
 * - submittedAt: Timestamp when quote was submitted (if applicable)
 */

import { QuoteRequest } from '@/types/pricing';
import {
  createQuoteRow,
  getQuoteRow,
  findInProgressQuoteByEmail,
  countSubmittedQuotes,
  updateQuoteRow,
  getAllQuoteRows,
  getAbandonedQuoteRows,
  QuoteRow,
} from './db';

// ============================================
// TYPES
// ============================================

export type QuoteStatus = 'started' | 'in_progress' | 'submitted' | 'abandoned';

export interface StoredQuote {
  id: string;
  email: string;
  status: QuoteStatus;
  currentStep: number;
  selections: Partial<Omit<QuoteRequest, 'contact'>>;
  contact: {
    name: string;
    phone: string;
    company: string;
    message: string;
    /**
     * Optional prospect website URL captured in the email capture modal.
     * Dan uses this to run a free Pro Scan for the warm lead.
     * Stored in the existing contact JSONB — no DB migration required.
     */
    websiteUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert database row to StoredQuote format
 */
function rowToStoredQuote(row: QuoteRow): StoredQuote {
  const rawSelections = (row.selections && typeof row.selections === 'object'
    ? row.selections
    : {}) as Record<string, unknown>;

  return {
    id: row.id,
    email: row.email,
    status: row.status as QuoteStatus,
    currentStep: row.current_step,
    selections: migrateLegacyQuoteSelections(rawSelections),
    contact: (row.contact as StoredQuote['contact']) || {
      name: '',
      phone: '',
      company: '',
      message: '',
      websiteUrl: '',
    },
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : undefined,
  };
}

/**
 * Generate a URL-safe quote token
 */
function generateQuoteToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Legacy rows without entityType: infer `limited` when a payment term is already set
 * (spread and one-off were always LTD/LLP-only in the product). Step 0 reconfirmation is Phase 2 UI.
 */
function migrateLegacyQuoteSelections(
  raw: Record<string, unknown>
): StoredQuote['selections'] {
  const s: Record<string, unknown> = { ...raw };
  const entityMissing = s.entityType === undefined || s.entityType === null;
  if (entityMissing) {
    let pp = s.paymentPreference as string | undefined;
    if (pp === 'twentyFour' || pp === 'thirtySix') {
      s.paymentPreference = 'twelve';
      pp = 'twelve';
    }
    if (pp === 'oneOff' || pp === 'six' || pp === 'twelve' || pp === 'waas') {
      s.entityType = 'limited';
    }
  }
  if (s.companyName === undefined) {
    s.companyName = null;
  }
  return s as StoredQuote['selections'];
}

/**
 * Default selections for a new quote
 */
function getDefaultSelections(): StoredQuote['selections'] {
  return {
    entityType: null,
    companyName: null,
    scope: {
      websiteType: undefined,
      pageCount: 5,
      ecommerce: 'none',
      headlessEcommerce: 'none',
      webApp: 'none',
      ssrWebApp: 'none',
      hasBlog: false,
      hasComplexForms: false,
      hasAutomation: false,
    },
    addOns: {
      voice: false,
      branding: false,
      research: false,
      videoLong: 0,
      videoShortBundle: false,
      imageLibrary: false,
      ssrAnimations: false,
      ssrCustomerPortal: false,
      ssrDatabase: false,
      ssrAuthentication: false,
      ssrApiIntegrations: 0,
      ssrMultilanguage: false,
      ssrRealtime: false,
      ssrAnalytics: false,
      ssrScalability: false,
    },
    paymentPreference: 'oneOff',
  } as StoredQuote['selections'];
}

/**
 * Default contact for a new quote
 */
function getDefaultContact(): StoredQuote['contact'] {
  return {
    name: '',
    phone: '',
    company: '',
    message: '',
    websiteUrl: '',
  };
}

// ============================================
// PUBLIC API
// ============================================

// Maximum number of quotes allowed per email
const MAX_QUOTES_PER_EMAIL = 2;

export interface CreateQuoteResult {
  quote: StoredQuote | null;
  limitExceeded: boolean;
  quotesUsed: number;
  /**
   * True when this call created a brand-new quote row.
   * False when an in-progress quote already existed for this email and was returned.
   * Used upstream to gate warm-lead email dispatch so it only fires once per lead.
   */
  isNew: boolean;
}

/**
 * Count submitted quotes for an email
 */
export async function getSubmittedQuoteCount(email: string): Promise<number> {
  return await countSubmittedQuotes(email);
}

/**
 * Create a new quote when email is submitted
 * Returns limitExceeded: true if email has already used 2 quotes
 */
export async function createQuote(email: string): Promise<CreateQuoteResult> {
  try {
    // Check if email already has an in-progress quote
    const existingRow = await findInProgressQuoteByEmail(email);
    
    if (existingRow) {
      // Return existing quote instead of creating new one
      const submittedCount = await countSubmittedQuotes(email);
      return {
        quote: rowToStoredQuote(existingRow),
        limitExceeded: false,
        quotesUsed: submittedCount,
        isNew: false,
      };
    }

    // Count how many quotes this email has already submitted
    const submittedCount = await countSubmittedQuotes(email);

    if (submittedCount >= MAX_QUOTES_PER_EMAIL) {
      console.log(`[Quote] Email ${email} has exceeded quote limit (${submittedCount}/${MAX_QUOTES_PER_EMAIL})`);
      return {
        quote: null,
        limitExceeded: true,
        quotesUsed: submittedCount,
        isNew: false,
      };
    }

    // Create new quote
    const token = generateQuoteToken();
    const selections = getDefaultSelections();
    const contact = getDefaultContact();

    const row = await createQuoteRow(
      token,
      email,
      selections as Record<string, unknown>,
      contact as Record<string, unknown>
    );

    console.log(`[Quote] Created new quote ${token} for ${email} (${submittedCount + 1}/${MAX_QUOTES_PER_EMAIL} quotes used)`);

    return {
      quote: rowToStoredQuote(row),
      limitExceeded: false,
      quotesUsed: submittedCount,
      isNew: true,
    };
  } catch (error) {
    console.error('[Quote] Error creating quote:', error);
    throw error;
  }
}

/**
 * Get a quote by its token
 */
export async function getQuote(id: string): Promise<StoredQuote | null> {
  try {
    const row = await getQuoteRow(id);
    return row ? rowToStoredQuote(row) : null;
  } catch (error) {
    console.error('[Quote] Error getting quote:', error);
    return null;
  }
}

/**
 * Update quote progress
 */
export async function updateQuoteProgress(
  id: string,
  updates: {
    currentStep?: number;
    selections?: Partial<Omit<QuoteRequest, 'contact'>> & Record<string, unknown>;
    contact?: Partial<StoredQuote['contact']>;
    status?: QuoteStatus;
  }
): Promise<StoredQuote | null> {
  try {
    // First get the current quote to merge updates
    const currentRow = await getQuoteRow(id);
    if (!currentRow) {
      return null;
    }
    
    const currentQuote = rowToStoredQuote(currentRow);
    
    // Prepare updates
    const dbUpdates: Parameters<typeof updateQuoteRow>[1] = {};
    
    if (updates.currentStep !== undefined) {
      dbUpdates.current_step = updates.currentStep;
      // Auto-update status based on progress
      if (updates.currentStep > 1 && currentQuote.status === 'started') {
        dbUpdates.status = 'in_progress';
      }
    }
    
    if (updates.selections) {
      dbUpdates.selections = {
        ...currentQuote.selections,
        ...updates.selections,
      } as Record<string, unknown>;
    }
    
    if (updates.contact) {
      dbUpdates.contact = {
        ...currentQuote.contact,
        ...updates.contact,
      } as Record<string, unknown>;
    }
    
    if (updates.status) {
      dbUpdates.status = updates.status;
      if (updates.status === 'submitted') {
        dbUpdates.submitted_at = new Date();
      }
    }
    
    const updatedRow = await updateQuoteRow(id, dbUpdates);
    
    if (!updatedRow) {
      return null;
    }
    
    console.log(`[Quote] Updated quote ${id} - Step ${updatedRow.current_step}, Status: ${updatedRow.status}`);
    return rowToStoredQuote(updatedRow);
  } catch (error) {
    console.error('[Quote] Error updating quote:', error);
    return null;
  }
}

/**
 * Mark quote as submitted
 */
export async function submitQuote(id: string): Promise<StoredQuote | null> {
  return updateQuoteProgress(id, { status: 'submitted' });
}

/**
 * Get all quotes for analytics/admin
 */
export async function getAllQuotes(): Promise<StoredQuote[]> {
  try {
    const rows = await getAllQuoteRows();
    return rows.map(rowToStoredQuote);
  } catch (error) {
    console.error('[Quote] Error getting all quotes:', error);
    return [];
  }
}

/**
 * Get abandoned quotes (for Brevo integration)
 * Returns quotes that are 'started' or 'in_progress' and older than specified minutes
 */
export async function getAbandonedQuotes(olderThanMinutes: number = 30): Promise<StoredQuote[]> {
  try {
    const rows = await getAbandonedQuoteRows(olderThanMinutes);
    return rows.map(rowToStoredQuote);
  } catch (error) {
    console.error('[Quote] Error getting abandoned quotes:', error);
    return [];
  }
}
