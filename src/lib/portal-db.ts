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
  ClientContactRow,
  ClientNoteRow,
  NewClient,
  NewProject,
  NewChangeRequest,
  NewComment,
  NewFile,
  NewActivity,
  NewClientContact,
  NewClientNote,
  UpdateClient,
  UpdateChangeRequest,
  UpdateClientContact,
  ClientDashboardStats,
  AdminDashboardStats,
  ChangeRequestProgress,
  BrandProfileRow,
  UpsertBrandProfile,
  BrandPaletteSwatch,
  BrandFontEntry,
  BrandSocialHandle,
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
      commence_work_by VARCHAR(50),
      progress VARCHAR(50) DEFAULT 'not_seen_yet',
      hours_estimated DECIMAL(10,2),
      hours_worked DECIMAL(10,2),
      rate_charged INTEGER,
      one_off_payment DECIMAL(10,2),
      visual_progress INTEGER DEFAULT 0,
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

  // Migration: Add commence_work_by column if it doesn't exist
  await sql`
    ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS commence_work_by VARCHAR(50)
  `;

  // Migration: Add visual_progress column if it doesn't exist
  await sql`
    ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS visual_progress INTEGER DEFAULT 0
  `;

  // Migration: Add is_complete and is_rejected columns
  await sql`
    ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS is_complete BOOLEAN DEFAULT false
  `;
  await sql`
    ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS is_rejected BOOLEAN DEFAULT false
  `;

  await sql`
    ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS created_by_user_id VARCHAR(255)
  `;
  await sql`
    ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS created_on_behalf_of BOOLEAN DEFAULT false
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

  // Client Contacts table - multiple contacts per client
  await sql`
    CREATE TABLE IF NOT EXISTS client_contacts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      role VARCHAR(100),
      is_primary BOOLEAN DEFAULT false,
      can_access_portal BOOLEAN DEFAULT false,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Client Notes table - internal admin memos
  await sql`
    CREATE TABLE IF NOT EXISTS client_notes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_by VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS brand_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id UUID NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
      palette JSONB DEFAULT '[]'::jsonb,
      fonts JSONB DEFAULT '[]'::jsonb,
      tone_voice TEXT,
      banned_words TEXT[] DEFAULT ARRAY[]::TEXT[],
      social_handles JSONB DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      updated_by VARCHAR(255)
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
  await sql`CREATE INDEX IF NOT EXISTS idx_files_category ON files(folder_category)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_activity_client ON activity_log(client_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_activity_request ON activity_log(change_request_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_contacts_client ON client_contacts(client_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_notes_client ON client_notes(client_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_brand_profiles_client ON brand_profiles(client_id)`;

  // Migration: Copy primary contact from clients to client_contacts (if not already migrated)
  // This ensures each client has at least one contact entry
  await sql`
    INSERT INTO client_contacts (client_id, name, email, phone, is_primary, can_access_portal)
    SELECT id, primary_contact_name, email, phone, true, true
    FROM clients
    WHERE NOT EXISTS (
      SELECT 1 FROM client_contacts WHERE client_contacts.client_id = clients.id
    )
  `;
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
      commence_work_by,
      progress,
      created_by_user_id,
      created_on_behalf_of
    ) VALUES (
      ${data.client_id},
      ${data.project_id || null},
      ${data.title},
      ${data.description},
      ${data.type_of_work},
      ${data.commence_work_by || null},
      'not_seen_yet',
      ${data.created_by_user_id || null},
      ${data.created_on_behalf_of ?? false}
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
      commence_work_by = COALESCE(${updates.commence_work_by ?? null}, commence_work_by),
      progress = COALESCE(${updates.progress ?? null}, progress),
      hours_estimated = COALESCE(${updates.hours_estimated}, hours_estimated),
      hours_worked = COALESCE(${updates.hours_worked}, hours_worked),
      rate_charged = COALESCE(${updates.rate_charged}, rate_charged),
      one_off_payment = COALESCE(${updates.one_off_payment}, one_off_payment),
      visual_progress = COALESCE(${updates.visual_progress}, visual_progress),
      is_complete = COALESCE(${updates.is_complete}, is_complete),
      is_rejected = COALESCE(${updates.is_rejected}, is_rejected),
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

/**
 * Delete a change request (admin only)
 */
export async function deleteChangeRequest(id: string): Promise<boolean> {
  const sql = getDb();
  const result = await sql`
    DELETE FROM change_requests WHERE id = ${id}
    RETURNING id
  ` as { id: string }[];
  return result.length > 0;
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

/**
 * Get file by ID
 */
export async function getFileById(id: string): Promise<FileRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM files WHERE id = ${id}
  ` as FileRow[];

  return result[0] || null;
}

/**
 * Delete a file by ID
 */
export async function deleteFile(id: string): Promise<boolean> {
  const sql = getDb();
  const result = await sql`
    DELETE FROM files WHERE id = ${id}
    RETURNING id
  ` as { id: string }[];
  
  return result.length > 0;
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
// CLIENT CONTACTS OPERATIONS
// ============================================

/**
 * Create a new client contact
 */
export async function createClientContact(data: NewClientContact): Promise<ClientContactRow> {
  const sql = getDb();

  // If this is marked as primary, unset any existing primary
  if (data.is_primary) {
    await sql`
      UPDATE client_contacts 
      SET is_primary = false, updated_at = NOW()
      WHERE client_id = ${data.client_id} AND is_primary = true
    `;
  }

  const result = await sql`
    INSERT INTO client_contacts (
      client_id,
      name,
      email,
      phone,
      role,
      is_primary,
      can_access_portal,
      notes
    ) VALUES (
      ${data.client_id},
      ${data.name},
      ${data.email || null},
      ${data.phone || null},
      ${data.role || null},
      ${data.is_primary ?? false},
      ${data.can_access_portal ?? false},
      ${data.notes || null}
    )
    RETURNING *
  ` as ClientContactRow[];

  return result[0];
}

/**
 * Get contacts by client ID
 */
export async function getContactsByClientId(clientId: string): Promise<ClientContactRow[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM client_contacts
    WHERE client_id = ${clientId}
    ORDER BY is_primary DESC, created_at ASC
  `;

  return result as ClientContactRow[];
}

/**
 * Get contact by ID
 */
export async function getContactById(id: string): Promise<ClientContactRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM client_contacts WHERE id = ${id}
  ` as ClientContactRow[];

  return result[0] || null;
}

/**
 * Update a client contact
 */
export async function updateClientContact(
  id: string,
  updates: UpdateClientContact
): Promise<ClientContactRow | null> {
  const sql = getDb();

  // If setting as primary, unset others first
  if (updates.is_primary) {
    const contact = await getContactById(id);
    if (contact) {
      await sql`
        UPDATE client_contacts 
        SET is_primary = false, updated_at = NOW()
        WHERE client_id = ${contact.client_id} AND is_primary = true AND id != ${id}
      `;
    }
  }

  const result = await sql`
    UPDATE client_contacts SET
      updated_at = NOW(),
      name = COALESCE(${updates.name ?? null}, name),
      email = COALESCE(${updates.email}, email),
      phone = COALESCE(${updates.phone}, phone),
      role = COALESCE(${updates.role}, role),
      is_primary = COALESCE(${updates.is_primary ?? null}, is_primary),
      can_access_portal = COALESCE(${updates.can_access_portal ?? null}, can_access_portal),
      notes = COALESCE(${updates.notes}, notes)
    WHERE id = ${id}
    RETURNING *
  ` as ClientContactRow[];

  return result[0] || null;
}

/**
 * Delete a client contact
 */
export async function deleteClientContact(id: string): Promise<boolean> {
  const sql = getDb();
  const result = await sql`
    DELETE FROM client_contacts WHERE id = ${id}
    RETURNING id
  ` as { id: string }[];
  
  return result.length > 0;
}

// ============================================
// CLIENT NOTES OPERATIONS
// ============================================

/**
 * Create a new client note
 */
export async function createClientNote(data: NewClientNote): Promise<ClientNoteRow> {
  const sql = getDb();
  const result = await sql`
    INSERT INTO client_notes (
      client_id,
      content,
      created_by
    ) VALUES (
      ${data.client_id},
      ${data.content},
      ${data.created_by}
    )
    RETURNING *
  ` as ClientNoteRow[];

  return result[0];
}

/**
 * Get notes by client ID
 */
export async function getNotesByClientId(clientId: string): Promise<ClientNoteRow[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM client_notes
    WHERE client_id = ${clientId}
    ORDER BY created_at DESC
  `;

  return result as ClientNoteRow[];
}

/**
 * Get note by ID
 */
export async function getNoteById(id: string): Promise<ClientNoteRow | null> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM client_notes WHERE id = ${id}
  ` as ClientNoteRow[];

  return result[0] || null;
}

/**
 * Update a client note
 */
export async function updateClientNote(
  id: string,
  content: string
): Promise<ClientNoteRow | null> {
  const sql = getDb();
  const result = await sql`
    UPDATE client_notes SET
      content = ${content},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  ` as ClientNoteRow[];

  return result[0] || null;
}

/**
 * Delete a client note
 */
export async function deleteClientNote(id: string): Promise<boolean> {
  const sql = getDb();
  const result = await sql`
    DELETE FROM client_notes WHERE id = ${id}
    RETURNING id
  ` as { id: string }[];
  
  return result.length > 0;
}

// ============================================
// BRAND PROFILE OPERATIONS
// ============================================

function mapBrandProfileRow(row: BrandProfileRow): BrandProfileRow {
  return {
    ...row,
    palette: (row.palette as BrandPaletteSwatch[]) ?? [],
    fonts: (row.fonts as BrandFontEntry[]) ?? [],
    tone_voice: row.tone_voice ?? null,
    banned_words: row.banned_words ?? [],
    social_handles: (row.social_handles as BrandSocialHandle[]) ?? [],
  };
}

function emptyBrandProfile(clientId: string): BrandProfileRow {
  return {
    id: '',
    client_id: clientId,
    palette: [],
    fonts: [],
    tone_voice: null,
    banned_words: [],
    social_handles: [],
    updated_at: new Date(),
    updated_by: null,
  };
}

/**
 * Get brand profile for a client (returns empty defaults if none saved yet)
 */
export async function getBrandProfile(clientId: string): Promise<BrandProfileRow> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM brand_profiles WHERE client_id = ${clientId}
  ` as BrandProfileRow[];

  if (!result[0]) {
    return emptyBrandProfile(clientId);
  }

  return mapBrandProfileRow(result[0]);
}

/**
 * Create or update brand profile for a client
 */
export async function upsertBrandProfile(
  clientId: string,
  data: UpsertBrandProfile,
  updatedBy: string
): Promise<BrandProfileRow> {
  const sql = getDb();
  const existing = await getBrandProfile(clientId);

  const palette = data.palette ?? existing.palette;
  const fonts = data.fonts ?? existing.fonts;
  const toneVoice = data.tone_voice !== undefined ? data.tone_voice : existing.tone_voice;
  const bannedWords = data.banned_words ?? existing.banned_words;
  const socialHandles = data.social_handles ?? existing.social_handles;

  const result = await sql`
    INSERT INTO brand_profiles (
      client_id,
      palette,
      fonts,
      tone_voice,
      banned_words,
      social_handles,
      updated_by
    ) VALUES (
      ${clientId},
      ${JSON.stringify(palette)}::jsonb,
      ${JSON.stringify(fonts)}::jsonb,
      ${toneVoice},
      ${bannedWords},
      ${JSON.stringify(socialHandles)}::jsonb,
      ${updatedBy}
    )
    ON CONFLICT (client_id) DO UPDATE SET
      palette = EXCLUDED.palette,
      fonts = EXCLUDED.fonts,
      tone_voice = EXCLUDED.tone_voice,
      banned_words = EXCLUDED.banned_words,
      social_handles = EXCLUDED.social_handles,
      updated_by = EXCLUDED.updated_by,
      updated_at = NOW()
    RETURNING *
  ` as BrandProfileRow[];

  return mapBrandProfileRow(result[0]);
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
