'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  notified: 'all' | 'pending' | 'done';
  q: string;
}

const LABELS: Record<Props['notified'], string> = {
  all: 'All',
  pending: 'To notify',
  done: 'Notified',
};

export function AdminWaitlistFilters({ notified, q }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(q);

  const pushWith = (patch: Partial<Props>) => {
    const sp = new URLSearchParams();
    const merged: Record<string, string> = {
      ...(notified !== 'all' ? { notified } : {}),
      ...(q ? { q } : {}),
    };
    for (const [k, v] of Object.entries(patch)) {
      if (v === 'all' || v === '' || v == null) delete merged[k];
      else merged[k] = v as string;
    }
    for (const [k, v] of Object.entries(merged)) sp.set(k, v);
    const qs = sp.toString();
    router.push(qs ? `/territory/admin/waitlist?${qs}` : '/territory/admin/waitlist');
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
          htmlFor="admin-notified"
          className="block text-xs uppercase tracking-wide text-slate-500 mb-1"
        >
          Status
        </label>
        <select
          id="admin-notified"
          value={notified}
          onChange={(e) =>
            pushWith({ notified: e.target.value as Props['notified'] })
          }
          className={fieldClass}
        >
          {(Object.keys(LABELS) as Array<Props['notified']>).map((s) => (
            <option key={s} value={s}>
              {LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={onSearch} className="flex items-end gap-2">
        <div>
          <label
            htmlFor="admin-waitlist-q"
            className="block text-xs uppercase tracking-wide text-slate-500 mb-1"
          >
            Search
          </label>
          <input
            id="admin-waitlist-q"
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
