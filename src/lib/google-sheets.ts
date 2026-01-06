/**
 * Google Sheets Integration
 * 
 * Sends quote data to a Google Sheets webhook (e.g., via Make/Zapier/Apps Script)
 * Supports full lifecycle tracking with Status column
 */

/**
 * Create a new quote row when user starts (Step 1)
 */
export async function createQuoteInSheet(quoteId: string, email: string): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK;
  if (!webhookUrl) {
    console.warn('GOOGLE_SHEETS_WEBHOOK not configured, skipping sheet create');
    return;
  }

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create',
      quoteId,
      email,
      status: 'Started',
      timestamp: new Date().toISOString(),
    }),
  }).catch((err) => console.error('Sheets create failed:', err));
}

export interface QuoteSheetData {
  quoteId: string;
  email: string;
  fullName: string;
  phone: string;
  company: string;
  message: string;
  projectType: string;
  websiteType?: 'clientManaged' | 'ssr'; // NEW: Which website tier
  pages: number;
  ecommerce: string;
  headlessEcommerce?: string; // NEW: For SSR projects
  webApp: string;
  ssrWebApp?: string; // NEW: For SSR projects
  hasBlog: boolean;
  hasComplexForms: boolean;
  hasAutomation: boolean;
  // Standard add-ons
  voice: boolean;
  branding: boolean;
  research: boolean;
  videoLong: number;
  videoShortBundle: boolean;
  imageLibrary: boolean;
  // SSR-specific add-ons
  ssrAnimations?: boolean;
  ssrCustomerPortal?: boolean;
  ssrDatabase?: boolean;
  ssrAuthentication?: boolean;
  ssrApiIntegrations?: number;
  ssrMultilanguage?: boolean;
  ssrRealtime?: boolean;
  ssrAnalytics?: boolean;
  ssrScalability?: boolean;
  // Payment
  paymentType: string;
  total: number;
  monthly: number | null;
  quoteUrl: string;
}

/**
 * Update quote row when user completes submission
 */
export async function updateQuoteInSheet(data: QuoteSheetData): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK;
  if (!webhookUrl) {
    console.warn('GOOGLE_SHEETS_WEBHOOK not configured, skipping sheet update');
    return;
  }

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'update',
      status: 'Completed',
      ...data,
      timestamp: new Date().toISOString(),
    }),
  }).catch((err) => console.error('Sheets update failed:', err));
}
