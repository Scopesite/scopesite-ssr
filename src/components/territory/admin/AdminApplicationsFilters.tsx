'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  status: 'all' | 'received' | 'qualified' | 'declined' | 'converted' | 'expired';
  entryType: 'all' | 'seat' | 'sector' | 'freeform';
  q: string;
}

const STATUS_LABELS: Record<Props['status'], string> = {
  all: 'All statuses',
  received: 'New',
  qualified: 'Qualified',
  declined: 'Declined',
  converted: 'Converted',
  expired: 'Expired',
};

const ENTRY_LABELS: Record<Props['entryType'], string> = {
  all: 'All entry types',
  seat: 'Seat (48h hold)',
  sector: 'Sector (no hold)',
  freeform: 'Freeform',
};

export function AdminApplicationsFilters({ status, entryType, q }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(q);

  const pushWith = (patch: Partial<Props>) => {
    const sp = new URLSearchParams();
    const merged: Record<string, string> = {
      ...(status !== 'all' ? { status } : {}),
      ...(entryType !== 'all' ? { entryType } : {}),
      ...(q ? { q } : {}),
    };
    for (const [k, v] of Object.entries(patch)) {
      if (v === 'all' || v === '' || v == null) delete merged[k];
      else merged[k] = v as string;
    }
    for (const [k, v] of Object.entries(merged)) sp.set(k, v);
    const qs = sp.toString();
    router.push(qs ? `/territory/admin/applications?${qs}` : '/territory/admin/applications');
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    pushWith({ q: query.trim() });
  };

  const fieldClass =
    'rounded-md border border-slate-300 bg-white text-brand-navy px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40';

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label
          htmlFor="admin-status"
          className="block text-xs uppercase tracking-wide text-slate-500 mb-1"
        >
          Status
        </label>
        <select
          id="admin-status"
          value={status}
          onChange={(e) => pushWith({ status: e.target.value as Props['status'] })}
          className={fieldClass}
        >
          {(Object.keys(STATUS_LABELS) as Array<Props['status']>).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="admin-entry-type"
          className="block text-xs uppercase tracking-wide text-slate-500 mb-1"
        >
          Entry type
        </label>
        <select
          id="admin-entry-type"
          value={entryType}
          onChange={(e) =>
            pushWith({ entryType: e.target.value as Props['entryType'] })
          }
          className={fieldClass}
        >
          {(Object.keys(ENTRY_LABELS) as Array<Props['entryType']>).map((s) => (
            <option key={s} value={s}>
              {ENTRY_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={onSearch} className="flex items-end gap-2">
        <div>
          <label
            htmlFor="admin-q"
            className="block text-xs uppercase tracking-wide text-slate-500 mb-1"
          >
            Search
          </label>
          <input
            id="admin-q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Firm, name, email, postcode..."
            className={`${fieldClass} min-w-[220px]`}
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-brand-navy text-white px-3 py-2 text-sm font-semibold hover:bg-brand-navy/90"
        >
          Search
        </button>
      </form>
    </div>
  );
}
