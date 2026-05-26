/**
 * Portal auth helpers (Clerk + ADMIN_CLERK_IDS)
 */

export function getAdminClerkIds(): string[] {
  return (process.env.ADMIN_CLERK_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

export function isPortalAdmin(userId: string): boolean {
  return getAdminClerkIds().includes(userId);
}
