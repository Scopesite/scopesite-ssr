/**
 * Database Utility
 * 
 * Provides a reusable Neon Postgres connection using @neondatabase/serverless.
 * Configured for serverless environments with connection pooling.
 */

import { neon, neonConfig } from '@neondatabase/serverless';

// Configure for serverless environment
neonConfig.fetchConnectionCache = true;

// Lazy-loaded SQL connection
let _sql: ReturnType<typeof neon> | null = null;

/**
 * Get the SQL query function (lazy initialization)
 */
export function getDb() {
  if (!_sql) {
    const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error('POSTGRES_URL or DATABASE_URL environment variable is not set');
    }
    
    _sql = neon(DATABASE_URL);
  }
  return _sql;
}

// Type for brief submissions
export interface Brief {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  project_type: string;
  budget_range: string | null;
  timeline: string | null;
  description: string;
  file_urls: string[] | null;
  referral_source: string | null;
  created_at: Date;
  status: string;
}

// Type for quote storage (database row)
export interface QuoteRow {
  id: string;              // Quote token (primary key)
  email: string;
  status: string;          // 'started' | 'in_progress' | 'submitted' | 'abandoned'
  current_step: number;
  selections: Record<string, unknown>;  // JSONB - projectType, scope, addOns, paymentPreference
  contact: Record<string, unknown>;     // JSONB - name, phone, company, message
  created_at: Date;
  updated_at: Date;
  submitted_at: Date | null;
}

// Type for new brief submission (without auto-generated fields)
export interface NewBrief {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  project_type: string;
  budget_range?: string;
  timeline?: string;
  description: string;
  file_urls?: string[];
  referral_source?: string;
}

/**
 * Insert a new brief into the database
 */
export async function insertBrief(brief: NewBrief): Promise<Brief> {
  const sql = getDb();
  const result = await sql`
    INSERT INTO briefs (
      name,
      email,
      company,
      phone,
      project_type,
      budget_range,
      timeline,
      description,
      file_urls,
      referral_source
    ) VALUES (
      ${brief.name},
      ${brief.email},
      ${brief.company || null},
      ${brief.phone || null},
      ${brief.project_type},
      ${brief.budget_range || null},
      ${brief.timeline || null},
      ${brief.description},
      ${brief.file_urls || null},
      ${brief.referral_source || null}
    )
    RETURNING *
  ` as Brief[];
  
  return result[0];
}

/**
 * Get all briefs (for admin use)
 */
export async function getAllBriefs(): Promise<Brief[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM briefs
    ORDER BY created_at DESC
  `;
  
  return result as Brief[];
}

/**
 * Update brief status
 */
export async function updateBriefStatus(id: number, status: string): Promise<Brief | null> {
  const sql = getDb();
  const result = await sql`
    UPDATE briefs
    SET status = ${status}
    WHERE id = ${id}
    RETURNING *
  ` as Brief[];
  
  return result[0] || null;
}

/**
 * Check database connection
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const sql = getDb();
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Initialize the briefs table
 */
export async function initializeBriefsTable(): Promise<void> {
  const sql = getDb();
  
  await sql`
    CREATE TABLE IF NOT EXISTS briefs (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      phone VARCHAR(50),
      project_type VARCHAR(100) NOT NULL,
      budget_range VARCHAR(100),
      timeline VARCHAR(100),
      description TEXT NOT NULL,
      file_urls TEXT[],
      referral_source VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'new'
    )
  `;
  
  // Create index on email for faster lookups
  await sql`
    CREATE INDEX IF NOT EXISTS idx_briefs_email ON briefs(email)
  `;
  
  // Create index on status for filtering
  await sql`
    CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status)
  `;
  
  // Create index on created_at for sorting
  await sql`
    CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC)
  `;
}

/**
 * Initialize the quotes table
 */
export async function initializeQuotesTable(): Promise<void> {
  const sql = getDb();
  
  await sql`
    CREATE TABLE IF NOT EXISTS quotes (
      id VARCHAR(16) PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'started',
      current_step INTEGER NOT NULL DEFAULT 1,
      selections JSONB NOT NULL DEFAULT '{}',
      contact JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      submitted_at TIMESTAMP
    )
  `;
  
  // Create index on email for faster lookups
  await sql`
    CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email)
  `;
  
  // Create index on status for filtering
  await sql`
    CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status)
  `;
  
  // Create index on updated_at for abandoned quote queries
  await sql`
    CREATE INDEX IF NOT EXISTS idx_quotes_updated_at ON quotes(updated_at)
  `;
}

/**
 * Initialize all database tables
 */
export async function initializeDatabase(): Promise<void> {
  await initializeBriefsTable();
  await initializeQuotesTable();
}

// ============================================
// QUOTE OPERATIONS
// ============================================

/**
 * Create a new quote
 */
export async function createQuoteRow(
  id: string,
  email: string,
  selections: Record<string, unknown>,
  contact: Record<string, unknown>
): Promise<QuoteRow> {
  const sql = getDb();
  const result = await sql`
    INSERT INTO quotes (id, email, selections, contact)
    VALUES (${id}, ${email}, ${JSON.stringify(selections)}, ${JSON.stringify(contact)})
    RETURNING *
  ` as QuoteRow[];
  
  return result[0];
}

/**
 * Get a quote by ID (token)
 */
export async function getQuoteRow(id: string): Promise<QuoteRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM quotes WHERE id = ${id}
  ` as QuoteRow[];
  
  return result[0] || null;
}

/**
 * Find an in-progress quote by email
 */
export async function findInProgressQuoteByEmail(email: string): Promise<QuoteRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM quotes 
    WHERE email = ${email} 
    AND status IN ('started', 'in_progress')
    ORDER BY created_at DESC
    LIMIT 1
  ` as QuoteRow[];
  
  return result[0] || null;
}

/**
 * Count submitted quotes for an email
 */
export async function countSubmittedQuotes(email: string): Promise<number> {
  const sql = getDb();
  const result = await sql`
    SELECT COUNT(*) as count FROM quotes 
    WHERE email = ${email} AND status = 'submitted'
  ` as { count: string }[];
  
  return parseInt(result[0]?.count || '0', 10);
}

/**
 * Update a quote
 */
export async function updateQuoteRow(
  id: string,
  updates: {
    status?: string;
    current_step?: number;
    selections?: Record<string, unknown>;
    contact?: Record<string, unknown>;
    submitted_at?: Date;
  }
): Promise<QuoteRow | null> {
  const sql = getDb();
  
  // Build dynamic update
  const setClauses: string[] = ['updated_at = CURRENT_TIMESTAMP'];
  
  if (updates.status !== undefined) {
    setClauses.push(`status = '${updates.status}'`);
  }
  if (updates.current_step !== undefined) {
    setClauses.push(`current_step = ${updates.current_step}`);
  }
  if (updates.selections !== undefined) {
    setClauses.push(`selections = '${JSON.stringify(updates.selections)}'::jsonb`);
  }
  if (updates.contact !== undefined) {
    setClauses.push(`contact = '${JSON.stringify(updates.contact)}'::jsonb`);
  }
  if (updates.submitted_at !== undefined) {
    setClauses.push(`submitted_at = CURRENT_TIMESTAMP`);
  }
  
  // Use a simpler approach with individual conditional updates
  const result = await sql`
    UPDATE quotes SET
      updated_at = CURRENT_TIMESTAMP,
      status = COALESCE(${updates.status ?? null}, status),
      current_step = COALESCE(${updates.current_step ?? null}, current_step),
      selections = COALESCE(${updates.selections ? JSON.stringify(updates.selections) : null}::jsonb, selections),
      contact = COALESCE(${updates.contact ? JSON.stringify(updates.contact) : null}::jsonb, contact),
      submitted_at = CASE WHEN ${updates.submitted_at !== undefined} THEN CURRENT_TIMESTAMP ELSE submitted_at END
    WHERE id = ${id}
    RETURNING *
  ` as QuoteRow[];
  
  return result[0] || null;
}

/**
 * Get all quotes (for admin/analytics)
 */
export async function getAllQuoteRows(): Promise<QuoteRow[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM quotes ORDER BY created_at DESC
  `;
  
  return result as QuoteRow[];
}

/**
 * Get abandoned quotes (started/in_progress and not updated recently)
 */
export async function getAbandonedQuoteRows(olderThanMinutes: number = 30): Promise<QuoteRow[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM quotes 
    WHERE status IN ('started', 'in_progress')
    AND updated_at < NOW() - (${olderThanMinutes} * INTERVAL '1 minute')
    ORDER BY updated_at DESC
  `;
  
  return result as QuoteRow[];
}
