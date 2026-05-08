import { getDb } from './db';

export type AuditActionType =
  | 'postcode_price_change'
  | 'postcode_tier_change'
  | 'postcode_promotion_start'
  | 'postcode_promotion_expire'
  | 'postcode_promotion_cancel'
  | 'postcode_promotion_edit_copy'
  | 'postcode_active_change'
  | 'sector_toggle_active'
  | 'sector_toggle_featured'
  | 'application_status_change'
  | 'waitlist_notify'
  | 'waitlist_remove'
  | 'site_banner_update'
  | 'site_banner_toggle';

export async function writeAuditLog(args: {
  actionType: AuditActionType;
  entityId?: string;
  payload?: Record<string, unknown>;
  performedBy?: string;
}): Promise<void> {
  const sql = getDb();
  const payload = args.payload ?? {};
  const performedBy = args.performedBy ?? 'admin';
  await sql`
    INSERT INTO territory.admin_audit_log (action_type, entity_id, payload, performed_by)
    VALUES (
      ${args.actionType},
      ${args.entityId ?? null},
      ${JSON.stringify(payload)}::jsonb,
      ${performedBy}
    )
  `;
}
