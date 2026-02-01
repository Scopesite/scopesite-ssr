/**
 * Portal Database Functions
 *
 * Database operations for the Client Portal system.
 * Uses the existing Neon Postgres connection from db.ts.
 */

import { getDb } from './db';
import type {
  ClientRow,
  ProjectRow,
  ChangeRequestRow,
  CommentRow,
  FileRow,
  ActivityRow,
  NewClient,
  NewProject,
  NewChangeRequest,
  NewComment,
  NewFile,
  NewActivity,
  UpdateClient,
  UpdateChangeRequest,
  ClientDashboardStats,
  AdminDashboardStats,
  ChangeRequestProgress,
} from '@/types/portal';

// ============================================
// TABLE INITIALIZATION
// ============================================

/**
 * Initialize all portal tables
 */
export async function initializePortalTables(): Promise<void> {
  const sql = getDb();

  // Clients table
  await sql`
    CREATE TABLE IF NOT EXISTS clients (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_user_id VARCHAR(255) DEFAULT '',
      company_name VARCHAR(255) NOT NULL,
      primary_contact_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      hourly_rate INTEGER,
      trello_label_id VARCHAR(50),
      trello_list_id VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      status VARCHAR(50) DEFAULT 'pending_invite'
    )
  `;

  // Migration: Add trello_list_id column if it doesn't exist
  await sql`
    ALTER TABLE clients ADD COLUMN IF NOT EXISTS trello_list_id VARCHAR(50)
  `;

  // Projects table
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      start_date DATE,
      target_launch_date DATE,
      trello_label_id VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Change Requests table
  await sql`
    CREATE TABLE IF NOT EXISTS change_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
      trello_card_id VARCHAR(50),
      title VARCHAR(500) NOT NULL,
      description TEXT,
      type_of_work VARCHAR(50) NOT NULL,
      progress VARCHAR(50) DEFAULT 'not_seen_yet',
      hours_estimated DECIMAL(10,2),
      hours_worked DECIMAL(10,2),
      rate_charged INTEGER,
      one_off_payment DECIMAL(10,2),
      estimate_approved_at TIMESTAMPTZ,
      estimate_rejected_at TIMESTAMPTZ,
      estimate_rejected_reason TEXT,
      invoice_number VARCHAR(100),
      invoice_url TEXT,
      due_date DATE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Comments table
  await sql`
    CREATE TABLE IF NOT EXISTS comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      change_request_id UUID NOT NULL REFERENCES change_requests(id) ON DELETE CASCADE,
      trello_comment_id VARCHAR(50),
      user_type VARCHAR(20) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Files table
  await sql`
    CREATE TABLE IF NOT EXISTS files (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      change_request_id UUID REFERENCES change_requests(id) ON DELETE SET NULL,
      file_name VARCHAR(500) NOT NULL,
      file_type VARCHAR(100),
      file_size INTEGER,
      blob_url TEXT NOT NULL,
      folder_category VARCHAR(50) NOT NULL,
      uploaded_by VARCHAR(20) NOT NULL,
      visible_to_client BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Activity Log table
  await sql`
    CREATE TABLE IF NOT EXISTS activity_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      change_request_id UUID REFERENCES change_requests(id) ON DELETE SET NULL,
      action_type VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      actor_type VARCHAR(20) NOT NULL,
      actor_name VARCHAR(255) NOT NULL,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Create indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_clients_clerk_user ON clients(clerk_user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_change_requests_client ON change_requests(client_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_change_requests_trello ON change_requests(trello_card_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_change_requests_progress ON change_requests(progress)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_comments_request ON comments(change_request_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_comments_trello ON comments(trello_comment_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_files_client ON files(client_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_files_request ON files(change_request_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_activity_client ON activity_log(client_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_activity_request ON activity_log(change_request_id)`;
}

// ============================================
// CLIENT OPERATIONS
// ============================================

/**
 * Create a new client
 */
export async function createClient(data: NewClient): Promise<ClientRow> {
  const sql = getDb();
  const result = await sql`
    INSERT INTO clients (
      company_name,
      primary_contact_name,
      email,
      phone,
      hourly_rate,
      trello_list_id,
      status
    ) VALUES (
      ${data.company_name},
      ${data.primary_contact_name},
      ${data.email},
      ${data.phone || null},
      ${data.hourly_rate || null},
      ${data.trello_list_id || null},
      'pending_invite'
    )
    RETURNING *
  ` as ClientRow[];

  return result[0];
}

/**
 * Get client by ID
 */
export async function getClientById(id: string): Promise<ClientRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM clients WHERE id = ${id}
  ` as ClientRow[];

  return result[0] || null;
}

/**
 * Get client by Clerk user ID
 */
export async function getClientByClerkId(clerkUserId: string): Promise<ClientRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM clients WHERE clerk_user_id = ${clerkUserId}
  ` as ClientRow[];

  return result[0] || null;
}

/**
 * Get client by email
 */
export async function getClientByEmail(email: string): Promise<ClientRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM clients WHERE email = ${email}
  ` as ClientRow[];

  return result[0] || null;
}

/**
 * Get all clients
 */
export async function getAllClients(): Promise<ClientRow[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM clients ORDER BY company_name ASC
  `;

  return result as ClientRow[];
}

/**
 * Update a client
 */
export async function updateClient(
  id: string,
  updates: UpdateClient
): Promise<ClientRow | null> {
  const sql = getDb();
  const result = await sql`
    UPDATE clients SET
      updated_at = NOW(),
      company_name = COALESCE(${updates.company_name ?? null}, company_name),
      primary_contact_name = COALESCE(${updates.primary_contact_name ?? null}, primary_contact_name),
      email = COALESCE(${updates.email ?? null}, email),
      phone = COALESCE(${updates.phone}, phone),
      hourly_rate = COALESCE(${updates.hourly_rate}, hourly_rate),
      trello_label_id = COALESCE(${updates.trello_label_id}, trello_label_id),
      trello_list_id = COALESCE(${updates.trello_list_id}, trello_list_id),
      status = COALESCE(${updates.status ?? null}, status),
      clerk_user_id = COALESCE(${updates.clerk_user_id ?? null}, clerk_user_id)
    WHERE id = ${id}
    RETURNING *
  ` as ClientRow[];

  return result[0] || null;
}

/**
 * Link Clerk user to client (on first sign-in)
 */
export async function linkClerkUserToClient(
  email: string,
  clerkUserId: string
): Promise<ClientRow | null> {
  const sql = getDb();
  const result = await sql`
    UPDATE clients SET
      clerk_user_id = ${clerkUserId},
      status = 'active',
      updated_at = NOW()
    WHERE email = ${email} AND (clerk_user_id = '' OR clerk_user_id IS NULL)
    RETURNING *
  ` as ClientRow[];

  return result[0] || null;
}

// ============================================
// PROJECT OPERATIONS
// ============================================

/**
 * Create a new project
 */
export async function createProject(data: NewProject): Promise<ProjectRow> {
  const sql = getDb();
  const result = await sql`
    INSERT INTO projects (
      client_id,
      name,
      type,
      start_date,
      target_launch_date
    ) VALUES (
      ${data.client_id},
      ${data.name},
      ${data.type},
      ${data.start_date || null},
      ${data.target_launch_date || null}
    )
    RETURNING *
  ` as ProjectRow[];

  return result[0];
}

/**
 * Get projects by client ID
 */
export async function getProjectsByClientId(clientId: string): Promise<ProjectRow[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM projects
    WHERE client_id = ${clientId}
    ORDER BY created_at DESC
  `;

  return result as ProjectRow[];
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<ProjectRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM projects WHERE id = ${id}
  ` as ProjectRow[];

  return result[0] || null;
}

// ============================================
// CHANGE REQUEST OPERATIONS
// ============================================

/**
 * Create a new change request
 */
export async function createChangeRequest(
  data: NewChangeRequest
): Promise<ChangeRequestRow> {
  const sql = getDb();
  const result = await sql`
    INSERT INTO change_requests (
      client_id,
      project_id,
      title,
      description,
      type_of_work,
      progress
    ) VALUES (
      ${data.client_id},
      ${data.project_id || null},
      ${data.title},
      ${data.description},
      ${data.type_of_work},
      'not_seen_yet'
    )
    RETURNING *
  ` as ChangeRequestRow[];

  return result[0];
}

/**
 * Get change request by ID
 */
export async function getChangeRequestById(
  id: string
): Promise<ChangeRequestRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM change_requests WHERE id = ${id}
  ` as ChangeRequestRow[];

  return result[0] || null;
}

/**
 * Get change request by Trello card ID
 */
export async function getChangeRequestByTrelloId(
  trelloCardId: string
): Promise<ChangeRequestRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM change_requests WHERE trello_card_id = ${trelloCardId}
  ` as ChangeRequestRow[];

  return result[0] || null;
}

/**
 * Get change requests by client ID
 */
export async function getChangeRequestsByClientId(
  clientId: string,
  limit?: number
): Promise<ChangeRequestRow[]> {
  const sql = getDb();

  if (limit) {
    const result = await sql`
      SELECT * FROM change_requests
      WHERE client_id = ${clientId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return result as ChangeRequestRow[];
  }

  const result = await sql`
    SELECT * FROM change_requests
    WHERE client_id = ${clientId}
    ORDER BY created_at DESC
  `;

  return result as ChangeRequestRow[];
}

/**
 * Get all change requests (for admin)
 */
export async function getAllChangeRequests(limit?: number): Promise<ChangeRequestRow[]> {
  const sql = getDb();

  if (limit) {
    const result = await sql`
      SELECT * FROM change_requests
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return result as ChangeRequestRow[];
  }

  const result = await sql`
    SELECT * FROM change_requests ORDER BY created_at DESC
  `;

  return result as ChangeRequestRow[];
}

/**
 * Update a change request
 */
export async function updateChangeRequest(
  id: string,
  updates: UpdateChangeRequest
): Promise<ChangeRequestRow | null> {
  const sql = getDb();

  const result = await sql`
    UPDATE change_requests SET
      updated_at = NOW(),
      title = COALESCE(${updates.title ?? null}, title),
      description = COALESCE(${updates.description ?? null}, description),
      type_of_work = COALESCE(${updates.type_of_work ?? null}, type_of_work),
      progress = COALESCE(${updates.progress ?? null}, progress),
      hours_estimated = COALESCE(${updates.hours_estimated}, hours_estimated),
      hours_worked = COALESCE(${updates.hours_worked}, hours_worked),
      rate_charged = COALESCE(${updates.rate_charged}, rate_charged),
      one_off_payment = COALESCE(${updates.one_off_payment}, one_off_payment),
      estimate_approved_at = COALESCE(${updates.estimate_approved_at?.toISOString() ?? null}, estimate_approved_at),
      estimate_rejected_at = COALESCE(${updates.estimate_rejected_at?.toISOString() ?? null}, estimate_rejected_at),
      estimate_rejected_reason = COALESCE(${updates.estimate_rejected_reason}, estimate_rejected_reason),
      invoice_number = COALESCE(${updates.invoice_number}, invoice_number),
      invoice_url = COALESCE(${updates.invoice_url}, invoice_url),
      due_date = COALESCE(${updates.due_date?.toISOString().split('T')[0] ?? null}, due_date),
      trello_card_id = COALESCE(${updates.trello_card_id}, trello_card_id)
    WHERE id = ${id}
    RETURNING *
  ` as ChangeRequestRow[];

  return result[0] || null;
}

/**
 * Get requests by progress status
 */
export async function getChangeRequestsByProgress(
  progress: ChangeRequestProgress
): Promise<ChangeRequestRow[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM change_requests
    WHERE progress = ${progress}
    ORDER BY created_at DESC
  `;

  return result as ChangeRequestRow[];
}

// ============================================
// COMMENT OPERATIONS
// ============================================

/**
 * Create a new comment
 */
export async function createComment(data: NewComment): Promise<CommentRow> {
  const sql = getDb();
  const result = await sql`
    INSERT INTO comments (
      change_request_id,
      trello_comment_id,
      user_type,
      user_name,
      user_id,
      message
    ) VALUES (
      ${data.change_request_id},
      ${data.trello_comment_id || null},
      ${data.user_type},
      ${data.user_name},
      ${data.user_id},
      ${data.message}
    )
    RETURNING *
  ` as CommentRow[];

  return result[0];
}

/**
 * Get comments by change request ID
 */
export async function getCommentsByRequestId(
  changeRequestId: string
): Promise<CommentRow[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM comments
    WHERE change_request_id = ${changeRequestId}
    ORDER BY created_at ASC
  `;

  return result as CommentRow[];
}

/**
 * Get comment by Trello comment ID
 */
export async function getCommentByTrelloId(
  trelloCommentId: string
): Promise<CommentRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM comments WHERE trello_comment_id = ${trelloCommentId}
  ` as CommentRow[];

  return result[0] || null;
}

// ============================================
// FILE OPERATIONS
// ============================================

/**
 * Create a new file record
 */
export async function createFile(data: NewFile): Promise<FileRow> {
  const sql = getDb();
  const result = await sql`
    INSERT INTO files (
      client_id,
      change_request_id,
      file_name,
      file_type,
      file_size,
      blob_url,
      folder_category,
      uploaded_by,
      visible_to_client
    ) VALUES (
      ${data.client_id},
      ${data.change_request_id || null},
      ${data.file_name},
      ${data.file_type},
      ${data.file_size},
      ${data.blob_url},
      ${data.folder_category},
      ${data.uploaded_by},
      ${data.visible_to_client ?? true}
    )
    RETURNING *
  ` as FileRow[];

  return result[0];
}

/**
 * Get files by client ID
 */
export async function getFilesByClientId(
  clientId: string,
  visibleOnly = true
): Promise<FileRow[]> {
  const sql = getDb();

  if (visibleOnly) {
    const result = await sql`
      SELECT * FROM files
      WHERE client_id = ${clientId} AND visible_to_client = true
      ORDER BY created_at DESC
    `;
    return result as FileRow[];
  }

  const result = await sql`
    SELECT * FROM files
    WHERE client_id = ${clientId}
    ORDER BY created_at DESC
  `;

  return result as FileRow[];
}

/**
 * Get files by change request ID
 */
export async function getFilesByRequestId(
  changeRequestId: string
): Promise<FileRow[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM files
    WHERE change_request_id = ${changeRequestId}
    ORDER BY created_at DESC
  `;

  return result as FileRow[];
}

// ============================================
// ACTIVITY LOG OPERATIONS
// ============================================

/**
 * Log an activity
 */
export async function logActivity(data: NewActivity): Promise<ActivityRow> {
  const sql = getDb();
  const result = await sql`
    INSERT INTO activity_log (
      client_id,
      change_request_id,
      action_type,
      description,
      actor_type,
      actor_name,
      metadata
    ) VALUES (
      ${data.client_id},
      ${data.change_request_id || null},
      ${data.action_type},
      ${data.description},
      ${data.actor_type},
      ${data.actor_name},
      ${data.metadata ? JSON.stringify(data.metadata) : null}
    )
    RETURNING *
  ` as ActivityRow[];

  return result[0];
}

/**
 * Get activity feed for a client
 */
export async function getActivityByClientId(
  clientId: string,
  limit = 20
): Promise<ActivityRow[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM activity_log
    WHERE client_id = ${clientId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return result as ActivityRow[];
}

/**
 * Get recent activity across all clients (for admin)
 */
export async function getRecentActivity(limit = 50): Promise<ActivityRow[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM activity_log
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return result as ActivityRow[];
}

// ============================================
// DASHBOARD STATS
// ============================================

/**
 * Get dashboard stats for a client
 */
export async function getClientDashboardStats(
  clientId: string
): Promise<ClientDashboardStats> {
  const sql = getDb();

  const result = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE progress NOT IN ('invoice_sent', 'invoice_paid')) as open,
      COUNT(*) FILTER (WHERE progress IN ('estimate_added', 'awaiting_approval')) as awaiting_approval,
      COUNT(*) FILTER (WHERE progress = 'in_progress') as in_progress,
      COUNT(*) FILTER (WHERE progress IN ('invoice_sent', 'invoice_paid')) as completed
    FROM change_requests
    WHERE client_id = ${clientId}
  ` as { total: string; open: string; awaiting_approval: string; in_progress: string; completed: string }[];

  const stats = result[0];

  return {
    totalRequests: parseInt(stats.total, 10),
    openRequests: parseInt(stats.open, 10),
    awaitingApproval: parseInt(stats.awaiting_approval, 10),
    inProgress: parseInt(stats.in_progress, 10),
    completed: parseInt(stats.completed, 10),
  };
}

/**
 * Get dashboard stats for admin
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const sql = getDb();

  // Get client counts
  const clientStats = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'active') as active
    FROM clients
  ` as { total: string; active: string }[];

  // Get request counts
  const requestStats = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE progress NOT IN ('invoice_sent', 'invoice_paid')) as open,
      COUNT(*) FILTER (WHERE progress IN ('estimate_added', 'awaiting_approval')) as awaiting_approval
    FROM change_requests
  ` as { total: string; open: string; awaiting_approval: string }[];

  // Get revenue this month (from approved/completed requests)
  const revenueStats = await sql`
    SELECT COALESCE(SUM(
      CASE
        WHEN one_off_payment IS NOT NULL THEN one_off_payment
        WHEN hours_estimated IS NOT NULL AND rate_charged IS NOT NULL THEN hours_estimated * rate_charged
        ELSE 0
      END
    ), 0) as revenue
    FROM change_requests
    WHERE progress IN ('invoice_sent', 'invoice_paid')
    AND updated_at >= date_trunc('month', CURRENT_DATE)
  ` as { revenue: string }[];

  return {
    totalClients: parseInt(clientStats[0].total, 10),
    activeClients: parseInt(clientStats[0].active, 10),
    totalRequests: parseInt(requestStats[0].total, 10),
    openRequests: parseInt(requestStats[0].open, 10),
    awaitingApproval: parseInt(requestStats[0].awaiting_approval, 10),
    revenueThisMonth: parseFloat(revenueStats[0].revenue),
  };
}
