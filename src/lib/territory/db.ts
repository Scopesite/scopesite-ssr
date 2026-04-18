/**
 * Territory Command - Database client wrapper.
 *
 * Re-exports the existing Neon serverless SQL function from src/lib/db.ts.
 * Every query in this module tree uses fully-qualified `territory.<table>`
 * names. Nothing ever calls SET search_path - that would leak across
 * pooled serverless connections on Neon.
 *
 * Multi-statement writes use CTEs (WITH ... AS ...) so they run as a
 * single atomic SQL statement without needing a transaction helper.
 */

import { getDb as getBaseDb } from '@/lib/db';

export function getDb() {
  return getBaseDb();
}
