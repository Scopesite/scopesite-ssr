'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { AdminSectorRow } from '@/lib/territory/queries';
import { sectorAllowsDeactivation } from '@/lib/territory/postcodePricingLogic';
import { shouldPromptBulkSectorConfirm } from '@/lib/territory/sectorBulkConfirm';
import { Button } from '@/components/ui/button';
import { AdminBulkConfirmDialog } from '@/components/territory/admin/AdminBulkConfirmDialog';

interface Props {
  grouped: Record<string, AdminSectorRow[]>;
}

type BulkAction = 'activate' | 'deactivate' | 'feature' | 'unfeature';
type BulkScope = 'all' | { category: string };

type PendingConfirm = {
  action: BulkAction;
  scope: BulkScope;
  count: number;
  scopeLabel: string;
};

async function parseJson(res: Response): Promise<{
  error?: string;
  pendingOrClaimedSeats?: number;
  ok?: boolean;
  updated?: number;
  skipped?: number;
}> {
  return (await res.json().catch(() => ({}))) as {
    error?: string;
    pendingOrClaimedSeats?: number;
    ok?: boolean;
    updated?: number;
    skipped?: number;
  };
}

function describeConfirmBody(action: BulkAction, count: number, scopeLabel: string): string {
  const segment =
    scopeLabel === 'all sectors'
      ? `${count} sector${count === 1 ? '' : 's'}`
      : `${count} sector${count === 1 ? '' : 's'} in ${scopeLabel}`;

  switch (action) {
    case 'activate':
      return `Activate ${segment}? This will make them visible on the public map.`;
    case 'deactivate':
      return `Deactivate ${segment}? They will be hidden on the public map where applicable. Sectors with pending or claimed seats will be skipped automatically.`;
    case 'feature':
      return `Feature ${segment}? This will show them in featured territory lists where applicable.`;
    case 'unfeature':
      return `Remove featured flag from ${segment}?`;
    default:
      return '';
  }
}

export function SectorsAdminGrid({ grouped }: Props) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [busyBulk, setBusyBulk] = useState(false);
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null);

  const categoryEntries = useMemo(
    () =>
      Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b, 'en-GB')),
    [grouped],
  );

  const patch = async (slug: string, body: Record<string, boolean>) => {
    setMsg(null);
    setBusy(slug);
    try {
      const res = await fetch(`/api/territory/admin/sectors/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await parseJson(res);
      if (!res.ok) {
        throw new Error(j.error || 'Update failed');
      }
      setMsg({ kind: 'ok', text: `Updated ${slug}.` });
      router.refresh();
    } catch (e) {
      setMsg({
        kind: 'err',
        text: e instanceof Error ? e.message : 'Update failed.',
      });
    } finally {
      setBusy(null);
    }
  };

  const runBulk = async (action: BulkAction, scope: BulkScope) => {
    setMsg(null);
    setBusyBulk(true);
    try {
      const res = await fetch('/api/territory/admin/sectors/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, scope }),
      });
      const j = await parseJson(res);
      if (!res.ok || !j.ok) {
        throw new Error(j.error || 'Bulk update failed');
      }
      const updated = j.updated ?? 0;
      const skipped = j.skipped ?? 0;
      const parts = [`Updated ${updated} sector${updated === 1 ? '' : 's'}.`];
      if (skipped > 0) {
        parts.push(`Skipped ${skipped} with pending or claimed seats.`);
      }
      setMsg({ kind: 'ok', text: parts.join(' ') });
      setConfirm(null);
      router.refresh();
    } catch (e) {
      setMsg({
        kind: 'err',
        text: e instanceof Error ? e.message : 'Bulk update failed.',
      });
    } finally {
      setBusyBulk(false);
    }
  };

  const tryBulk = (action: BulkAction, scope: BulkScope, count: number, scopeLabel: string) => {
    if (count <= 0) {
      setMsg({ kind: 'ok', text: 'No matching sectors to update.' });
      return;
    }
    if (shouldPromptBulkSectorConfirm(count)) {
      setConfirm({ action, scope, count, scopeLabel });
      return;
    }
    void runBulk(action, scope);
  };

  const countInCategory = (rows: AdminSectorRow[], pred: (r: AdminSectorRow) => boolean) =>
    rows.filter(pred).length;

  const allRows = useMemo(
    () => categoryEntries.flatMap(([, rows]) => rows),
    [categoryEntries],
  );

  const countAllInactive = allRows.filter((r) => !r.is_active).length;
  const countAllActive = allRows.filter((r) => r.is_active).length;
  const countAllNotFeatured = allRows.filter((r) => !r.is_featured).length;
  const countAllFeatured = allRows.filter((r) => r.is_featured).length;

  const bulkDisabled = busy !== null || busyBulk;

  return (
    <div className="space-y-6">
      <AdminBulkConfirmDialog
        open={confirm !== null}
        onOpenChange={(v) => {
          if (!v && !busyBulk) setConfirm(null);
        }}
        title="Confirm bulk change"
        description={
          confirm
            ? describeConfirmBody(confirm.action, confirm.count, confirm.scopeLabel)
            : ''
        }
        confirmLabel="Confirm"
        busy={busyBulk}
        onConfirm={async () => {
          if (!confirm) return;
          await runBulk(confirm.action, confirm.scope);
        }}
      />

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Bulk actions — all sectors
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="brandOutline"
            size="sm"
            disabled={bulkDisabled}
            onClick={() => tryBulk('activate', 'all', countAllInactive, 'all sectors')}
          >
            Activate all
          </Button>
          <Button
            type="button"
            variant="brandOutline"
            size="sm"
            disabled={bulkDisabled}
            onClick={() => tryBulk('deactivate', 'all', countAllActive, 'all sectors')}
          >
            Deactivate all
          </Button>
          <Button
            type="button"
            variant="brandOutline"
            size="sm"
            disabled={bulkDisabled}
            onClick={() => tryBulk('feature', 'all', countAllNotFeatured, 'all sectors')}
          >
            Feature all
          </Button>
          <Button
            type="button"
            variant="brandOutline"
            size="sm"
            disabled={bulkDisabled}
            onClick={() => tryBulk('unfeature', 'all', countAllFeatured, 'all sectors')}
          >
            Unfeature all
          </Button>
        </div>
      </div>

      {msg ? (
        <p
          className={
            msg.kind === 'ok'
              ? 'text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2'
              : 'text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2'
          }
        >
          {msg.text}
        </p>
      ) : null}

      {categoryEntries.map(([category, rows]) => {
        const nInactive = countInCategory(rows, (r) => !r.is_active);
        const nActive = countInCategory(rows, (r) => r.is_active);
        return (
          <section
            key={category}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {category}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-brand-navy"
                  disabled={bulkDisabled}
                  onClick={() =>
                    tryBulk('activate', { category }, nInactive, category)
                  }
                >
                  Activate all in category
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-brand-navy"
                  disabled={bulkDisabled}
                  onClick={() =>
                    tryBulk('deactivate', { category }, nActive, category)
                  }
                >
                  Deactivate all in category
                </Button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {rows.map((row) => {
                const canOff = sectorAllowsDeactivation(row.pending_or_claimed_seats);
                const inactiveDisabled = row.is_active && !canOff;
                const tip = inactiveDisabled
                  ? 'Cannot deactivate while this sector has pending or claimed seats.'
                  : undefined;
                return (
                  <div
                    key={row.id}
                    className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-brand-navy">{row.label}</p>
                      <p className="text-xs font-mono text-slate-500">{row.slug}</p>
                      {row.pending_or_claimed_seats > 0 ? (
                        <p className="mt-1 text-xs text-amber-800">
                          {row.pending_or_claimed_seats} pending or claimed seat(s)
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-slate-700" title={tip}>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300"
                          checked={row.is_active}
                          disabled={busy === row.slug || inactiveDisabled || busyBulk}
                          onChange={(e) => {
                            if (!e.target.checked && !canOff) return;
                            void patch(row.slug, { isActive: e.target.checked });
                          }}
                        />
                        Active
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300"
                          checked={row.is_featured}
                          disabled={busy === row.slug || busyBulk}
                          onChange={(e) => void patch(row.slug, { isFeatured: e.target.checked })}
                        />
                        Featured
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
