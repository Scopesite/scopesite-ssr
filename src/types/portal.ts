/**
 * Portal Types
 *
 * TypeScript interfaces for the Client Portal system
 */

// ============================================
// DATABASE ROW TYPES
// ============================================

/**
 * Client record - links Clerk user to client data
 */
export interface ClientRow {
  id: string; // UUID
  clerk_user_id: string; // From Clerk (empty until user signs up)
  company_name: string;
  primary_contact_name: string;
  email: string;
  phone: string | null;
  hourly_rate: number | null; // Default rate: 45/60/90/120/200
  trello_label_id: string | null; // Label ID for this client on shared board
  trello_list_id: string | null; // Trello list ID for this client's cards
  created_at: Date;
  updated_at: Date;
  status: 'active' | 'inactive' | 'pending_invite';
}

/**
 * Project record - optional grouping for change requests
 */
export interface ProjectRow {
  id: string; // UUID
  client_id: string; // FK to clients
  name: string;
  type: 'ssr' | 'clientManaged' | 'visibility' | 'webapp' | 'ongoing';
  status: 'active' | 'on_hold' | 'complete' | 'cancelled';
  start_date: Date | null;
  target_launch_date: Date | null;
  trello_label_id: string | null; // Can have project-specific label
  created_at: Date;
  updated_at: Date;
}

/**
 * Change request / Job record
 */
export interface ChangeRequestRow {
  id: string; // UUID
  client_id: string; // FK to clients
  project_id: string | null; // FK to projects (optional)
  trello_card_id: string | null; // Trello card ID for sync

  // From client submission
  title: string;
  description: string;
  type_of_work: ChangeRequestType;
  commence_work_by: CommenceWorkBy; // Urgency - determines rate

  // Set by admin (synced from Trello)
  progress: ChangeRequestProgress;

  // Estimate fields
  hours_estimated: number | null;
  hours_worked: number | null;
  rate_charged: number | null; // 45/60/90/120/200
  one_off_payment: number | null; // For fixed-price jobs
  visual_progress: number | null; // 0-100 percentage complete
  is_complete: boolean; // Trello COMPLETE checkbox
  is_rejected: boolean; // Trello REJECTED checkbox - work halted

  // Approval
  estimate_approved_at: Date | null;
  estimate_rejected_at: Date | null;
  estimate_rejected_reason: string | null;

  // Invoice
  invoice_number: string | null;
  invoice_url: string | null; // Link to invoice PDF

  // Dates
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Comment record - synced with Trello
 */
export interface CommentRow {
  id: string; // UUID
  change_request_id: string; // FK to change_requests
  trello_comment_id: string | null; // For sync
  user_type: 'client' | 'admin';
  user_name: string;
  user_id: string; // Clerk user ID or admin ID
  message: string;
  created_at: Date;
}

/**
 * File record - metadata for Vercel Blob files
 */
export interface FileRow {
  id: string; // UUID
  client_id: string; // FK to clients
  change_request_id: string | null; // FK to change_requests (optional)
  file_name: string;
  file_type: string; // MIME type
  file_size: number; // Bytes
  blob_url: string; // Vercel Blob URL
  folder_category: FileFolderCategory;
  uploaded_by: 'client' | 'admin';
  visible_to_client: boolean;
  created_at: Date;
}

/**
 * Activity log record - audit trail
 */
export interface ActivityRow {
  id: string; // UUID
  client_id: string; // FK to clients
  change_request_id: string | null;
  action_type: ActivityActionType;
  description: string;
  actor_type: 'client' | 'admin' | 'system';
  actor_name: string;
  metadata: Record<string, unknown> | null; // Additional data as JSON
  created_at: Date;
}

// ============================================
// ENUM TYPES
// ============================================

export type ChangeRequestType =
  | 'change_request'
  | 'new_project'
  | 'error_found'
  | 'general_message';

export type CommenceWorkBy =
  | 'emergency'        // Emergency (Right Now) - £120ph
  | 'out_of_hours'     // Now and out of hours - £200ph
  | '24_hours'         // 24 Hours - £90ph
  | '48_hours'         // 48 Hours - £60ph
  | '3_5_days'         // 3 - 5 days - £45ph
  | null;

/**
 * Mapping from urgency to hourly rate
 */
export const URGENCY_RATES: Record<Exclude<CommenceWorkBy, null>, number> = {
  emergency: 120,
  out_of_hours: 200,
  '24_hours': 90,
  '48_hours': 60,
  '3_5_days': 45,
};

/**
 * Urgency display labels
 */
export const URGENCY_LABELS: Record<Exclude<CommenceWorkBy, null>, string> = {
  emergency: 'Emergency (Right Now) - £120/hr',
  out_of_hours: 'Now and out of hours - £200/hr',
  '24_hours': '24 Hours - £90/hr',
  '48_hours': '48 Hours - £60/hr',
  '3_5_days': '3 - 5 days - £45/hr',
};

export type ChangeRequestProgress =
  | 'not_seen_yet'
  | 'submission_viewed'
  | 'estimate_added'
  | 'awaiting_approval'
  | 'approved'
  | 'in_progress'
  | 'awaiting_client_info'
  | 'in_review'
  | 'invoice_sent'
  | 'invoice_paid';

export type FileFolderCategory =
  | 'brand_assets'
  | 'content'
  | 'designs'
  | 'documents'
  | 'deliverables'
  | 'change_requests';

export type ActivityActionType =
  | 'request_submitted'
  | 'status_changed'
  | 'estimate_added'
  | 'estimate_approved'
  | 'estimate_rejected'
  | 'file_uploaded'
  | 'comment_added'
  | 'invoice_sent'
  | 'invoice_paid'
  | 'client_created'
  | 'client_invited';

export type ProjectType = 'ssr' | 'clientManaged' | 'visibility' | 'webapp' | 'ongoing';
export type ProjectStatus = 'active' | 'on_hold' | 'complete' | 'cancelled';
export type ClientStatus = 'active' | 'inactive' | 'pending_invite';

// ============================================
// INPUT TYPES (for creating/updating)
// ============================================

export interface NewClient {
  email: string;
  company_name: string;
  primary_contact_name: string;
  phone?: string;
  hourly_rate?: number;
  trello_list_id?: string;
}

export interface NewProject {
  client_id: string;
  name: string;
  type: ProjectType;
  start_date?: Date;
  target_launch_date?: Date;
}

export interface NewChangeRequest {
  client_id: string;
  project_id?: string;
  title: string;
  description: string;
  type_of_work: ChangeRequestType;
  commence_work_by?: CommenceWorkBy;
}

export interface NewComment {
  change_request_id: string;
  user_type: 'client' | 'admin';
  user_name: string;
  user_id: string;
  message: string;
  trello_comment_id?: string;
}

export interface NewFile {
  client_id: string;
  change_request_id?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  blob_url: string;
  folder_category: FileFolderCategory;
  uploaded_by: 'client' | 'admin';
  visible_to_client?: boolean;
}

export interface NewActivity {
  client_id: string;
  change_request_id?: string;
  action_type: ActivityActionType;
  description: string;
  actor_type: 'client' | 'admin' | 'system';
  actor_name: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// UPDATE TYPES
// ============================================

export interface UpdateClient {
  company_name?: string;
  primary_contact_name?: string;
  email?: string;
  phone?: string | null;
  hourly_rate?: number | null;
  trello_label_id?: string | null;
  trello_list_id?: string | null;
  status?: ClientStatus;
  clerk_user_id?: string;
}

export interface UpdateChangeRequest {
  title?: string;
  description?: string;
  type_of_work?: ChangeRequestType;
  commence_work_by?: CommenceWorkBy;
  progress?: ChangeRequestProgress;
  hours_estimated?: number | null;
  hours_worked?: number | null;
  rate_charged?: number | null;
  one_off_payment?: number | null;
  visual_progress?: number | null;
  is_complete?: boolean;
  is_rejected?: boolean;
  estimate_approved_at?: Date | null;
  estimate_rejected_at?: Date | null;
  estimate_rejected_reason?: string | null;
  invoice_number?: string | null;
  invoice_url?: string | null;
  due_date?: Date | null;
  trello_card_id?: string | null;
}

// ============================================
// DISPLAY / COMPUTED TYPES
// ============================================

/**
 * Progress status with display labels - exact Trello terminology
 */
export const PROGRESS_LABELS: Record<ChangeRequestProgress, string> = {
  not_seen_yet: 'Not Seen Yet',
  submission_viewed: 'Submission Viewed',
  estimate_added: 'Estimate Added',
  awaiting_approval: 'Awaiting Approval',
  approved: 'Approved',
  in_progress: 'In Progress',
  awaiting_client_info: 'Awaiting Information From Client',
  in_review: 'In Review',
  invoice_sent: 'Invoice Sent',
  invoice_paid: 'Invoice Paid',
};

/**
 * Progress status colors for UI - Traffic Light System
 * Gray = Not started
 * Red = Client action required / Blocked
 * Amber = Under review / Pending decision  
 * Green = Active work / Complete
 */
export const PROGRESS_COLORS: Record<ChangeRequestProgress, string> = {
  not_seen_yet: 'bg-gray-100 text-gray-700',
  submission_viewed: 'bg-amber-100 text-amber-800',
  estimate_added: 'bg-amber-100 text-amber-800',
  awaiting_approval: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  in_progress: 'bg-emerald-100 text-emerald-800',
  awaiting_client_info: 'bg-red-100 text-red-800',
  in_review: 'bg-amber-100 text-amber-800',
  invoice_sent: 'bg-emerald-100 text-emerald-800',
  invoice_paid: 'bg-emerald-100 text-emerald-800',
};

/**
 * Traffic light dot colors for status indicators
 */
export const TRAFFIC_LIGHT_DOTS: Record<ChangeRequestProgress, string> = {
  not_seen_yet: 'bg-gray-400',
  submission_viewed: 'bg-amber-500',
  estimate_added: 'bg-amber-500',
  awaiting_approval: 'bg-amber-500',
  approved: 'bg-emerald-500',
  in_progress: 'bg-emerald-500',
  awaiting_client_info: 'bg-red-500 animate-pulse',
  in_review: 'bg-amber-500',
  invoice_sent: 'bg-emerald-500',
  invoice_paid: 'bg-emerald-500',
};

/**
 * Type of work labels
 */
export const TYPE_OF_WORK_LABELS: Record<ChangeRequestType, string> = {
  change_request: 'Change Request',
  new_project: 'New Project',
  error_found: 'Bug / Error Report',
  general_message: 'General Message',
};

/**
 * Cost display for a change request
 */
export interface CostDisplay {
  type: 'fixed' | 'hourly' | 'pending';
  total: number | null;
  hours?: number;
  rate?: number;
  display: string;
}

/**
 * Calculate cost display from a change request
 */
export function getCostDisplay(request: ChangeRequestRow): CostDisplay {
  // One-off payment takes precedence
  if (request.one_off_payment) {
    return {
      type: 'fixed',
      total: request.one_off_payment,
      display: `Fixed Price: £${request.one_off_payment.toLocaleString()}`,
    };
  }

  // Hourly calculation
  if (request.hours_estimated && request.rate_charged) {
    const total = request.hours_estimated * request.rate_charged;
    return {
      type: 'hourly',
      total,
      hours: request.hours_estimated,
      rate: request.rate_charged,
      display: `${request.hours_estimated} hours × £${request.rate_charged}/hr = £${total.toLocaleString()}`,
    };
  }

  // No estimate yet
  return {
    type: 'pending',
    total: null,
    display: 'Quote pending',
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface PortalApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// DASHBOARD STATS
// ============================================

export interface ClientDashboardStats {
  totalRequests: number;
  openRequests: number;
  awaitingApproval: number;
  inProgress: number;
  completed: number;
}

export interface AdminDashboardStats {
  totalClients: number;
  activeClients: number;
  totalRequests: number;
  openRequests: number;
  awaitingApproval: number;
  revenueThisMonth: number;
}
