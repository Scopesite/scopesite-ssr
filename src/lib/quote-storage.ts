/**
 * Quote Progress Storage
 * 
 * Simple file-based storage for MVP. Replace with real DB (Prisma, Supabase, etc.) for production.
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

import fs from 'fs';
import path from 'path';
import { QuoteRequest } from '@/types/pricing';

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
  };
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

export interface QuoteDatabase {
  quotes: Record<string, StoredQuote>;
}

// ============================================
// STORAGE PATH
// ============================================

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_PATH = path.join(DATA_DIR, 'quotes.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ============================================
// DATABASE OPERATIONS
// ============================================

function readDatabase(): QuoteDatabase {
  ensureDataDir();
  
  if (!fs.existsSync(DB_PATH)) {
    return { quotes: {} };
  }
  
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    console.error('Error reading quote database, starting fresh');
    return { quotes: {} };
  }
}

function writeDatabase(db: QuoteDatabase): void {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// ============================================
// QUOTE TOKEN GENERATION
// ============================================

function generateQuoteToken(): string {
  // Generate a URL-safe token: 8 chars alphanumeric
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
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
}

/**
 * Count submitted quotes for an email
 */
export function getSubmittedQuoteCount(email: string): number {
  const db = readDatabase();
  return Object.values(db.quotes).filter(
    q => q.email === email && q.status === 'submitted'
  ).length;
}

/**
 * Create a new quote when email is submitted
 * Returns limitExceeded: true if email has already used 2 quotes
 */
export function createQuote(email: string): CreateQuoteResult {
  const db = readDatabase();
  
  // Check if email already has an in-progress quote
  const existingQuote = Object.values(db.quotes).find(
    q => q.email === email && (q.status === 'started' || q.status === 'in_progress')
  );
  
  if (existingQuote) {
    // Return existing quote instead of creating new one
    const submittedCount = getSubmittedQuoteCount(email);
    return { 
      quote: existingQuote, 
      limitExceeded: false,
      quotesUsed: submittedCount,
    };
  }
  
  // Count how many quotes this email has already submitted
  const submittedCount = getSubmittedQuoteCount(email);
  
  if (submittedCount >= MAX_QUOTES_PER_EMAIL) {
    console.log(`[Quote] Email ${email} has exceeded quote limit (${submittedCount}/${MAX_QUOTES_PER_EMAIL})`);
    return { 
      quote: null, 
      limitExceeded: true,
      quotesUsed: submittedCount,
    };
  }
  
  const now = new Date().toISOString();
  const quote: StoredQuote = {
    id: generateQuoteToken(),
    email,
    status: 'started',
    currentStep: 1,
    selections: {
      scope: {
        pageCount: 5,
        ecommerce: 'none',
        webApp: 'none',
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
      },
      paymentPreference: 'twelve',
    },
    contact: {
      name: '',
      phone: '',
      company: '',
      message: '',
    },
    createdAt: now,
    updatedAt: now,
  };
  
  db.quotes[quote.id] = quote;
  writeDatabase(db);
  
  console.log(`[Quote] Created new quote ${quote.id} for ${email} (${submittedCount + 1}/${MAX_QUOTES_PER_EMAIL} quotes used)`);
  return { 
    quote, 
    limitExceeded: false,
    quotesUsed: submittedCount,
  };
}

/**
 * Get a quote by its token
 */
export function getQuote(id: string): StoredQuote | null {
  const db = readDatabase();
  return db.quotes[id] || null;
}

/**
 * Update quote progress
 */
export function updateQuoteProgress(
  id: string,
  updates: {
    currentStep?: number;
    selections?: Partial<Omit<QuoteRequest, 'contact'>>;
    contact?: Partial<StoredQuote['contact']>;
    status?: QuoteStatus;
  }
): StoredQuote | null {
  const db = readDatabase();
  const quote = db.quotes[id];
  
  if (!quote) {
    return null;
  }
  
  const now = new Date().toISOString();
  
  if (updates.currentStep !== undefined) {
    quote.currentStep = updates.currentStep;
    // Auto-update status based on progress
    if (updates.currentStep > 1 && quote.status === 'started') {
      quote.status = 'in_progress';
    }
  }
  
  if (updates.selections) {
    quote.selections = {
      ...quote.selections,
      ...updates.selections,
    };
  }
  
  if (updates.contact) {
    quote.contact = {
      ...quote.contact,
      ...updates.contact,
    };
  }
  
  if (updates.status) {
    quote.status = updates.status;
    if (updates.status === 'submitted') {
      quote.submittedAt = now;
    }
  }
  
  quote.updatedAt = now;
  
  db.quotes[id] = quote;
  writeDatabase(db);
  
  console.log(`[Quote] Updated quote ${id} - Step ${quote.currentStep}, Status: ${quote.status}`);
  return quote;
}

/**
 * Mark quote as submitted
 */
export function submitQuote(id: string): StoredQuote | null {
  return updateQuoteProgress(id, { status: 'submitted' });
}

/**
 * Get all quotes for analytics/admin (optional)
 */
export function getAllQuotes(): StoredQuote[] {
  const db = readDatabase();
  return Object.values(db.quotes);
}

/**
 * Get abandoned quotes (for Brevo integration)
 * Returns quotes that are 'started' or 'in_progress' and older than specified minutes
 */
export function getAbandonedQuotes(olderThanMinutes: number = 30): StoredQuote[] {
  const db = readDatabase();
  const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000).toISOString();
  
  return Object.values(db.quotes).filter(
    q => 
      (q.status === 'started' || q.status === 'in_progress') &&
      q.updatedAt < cutoff
  );
}

