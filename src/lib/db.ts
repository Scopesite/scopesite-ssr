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
export async function initializeDatabase(): Promise<void> {
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
