import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminAuthenticated } from '@/lib/territory/admin-session';
import { revalidateTerritoryPublicCache } from '@/lib/territory/revalidateTerritory';
import {
  bulkActivateSectors,
  bulkDeactivateSectors,
  bulkFeatureSectors,
  bulkUnfeatureSectors,
  backfillMissingSeatsForSectorSlugs,
  type BulkSectorScope,
} from '@/lib/territory/queries';

export const runtime = 'nodejs';

const ScopeSchema = z.union([
  z.literal('all'),
  z.object({ category: z.string().min(1).max(200) }),
]);

const Body = z.object({
  action: z.enum(['activate', 'deactivate', 'feature', 'unfeature']),
  scope: ScopeSchema,
});

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const scope: BulkSectorScope =
    parsed.data.scope === 'all' ? 'all' : { category: parsed.data.scope.category };

  try {
    let result: { affectedSlugs: string[]; skippedSlugs: string[] };
    let seatsCreated = 0;
    switch (parsed.data.action) {
      case 'activate':
        result = await bulkActivateSectors(scope);
        seatsCreated = await backfillMissingSeatsForSectorSlugs(result.affectedSlugs);
        break;
      case 'deactivate':
        result = await bulkDeactivateSectors(scope);
        break;
      case 'feature':
        result = await bulkFeatureSectors(scope);
        break;
      case 'unfeature':
        result = await bulkUnfeatureSectors(scope);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    revalidateTerritoryPublicCache();

    const updated = result.affectedSlugs.length;
    const skipped = result.skippedSlugs.length;

    return NextResponse.json({
      ok: true,
      updated,
      skipped,
      seatsCreated: parsed.data.action === 'activate' ? seatsCreated : undefined,
      affectedSlugs: result.affectedSlugs,
      skippedSlugs: result.skippedSlugs,
    });
  } catch (err) {
    console.error('[admin/sectors/bulk]', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
