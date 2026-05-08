'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { AdminSectorRow } from '@/lib/territory/queries';
import { sectorAllowsDeactivation } from '@/lib/territory/postcodePricingLogic';

interface Props {
  grouped: Record<string, AdminSectorRow[]>;
}

async function parseJson(res: Response): Promise<{ error?: string; pendingOrClaimedSeats?: number }> {
  return (await res.json().catch(() => ({}))) as {
    error?: string;
    pendingOrClaimedSeats?: number;
  };
}

export function SectorsAdminGrid({ grouped }: Props) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
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

      {Object.entries(grouped).map(([category, rows]) => (
        <section key={category} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-200">
            {category}
          </h2>
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
                        disabled={busy === row.slug || inactiveDisabled}
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
                        disabled={busy === row.slug}
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
      ))}
    </div>
  );
}
