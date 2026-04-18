import type { Metadata } from 'next';
import Link from 'next/link';
import { getAreaWaitlistList } from '@/lib/territory/queries';
import { AdminWaitlistFilters } from '@/components/territory/admin/AdminWaitlistFilters';
import { AdminWaitlistRowActions } from '@/components/territory/admin/AdminWaitlistRowActions';

export const metadata: Metadata = {
  title: 'Territory Admin - Waitlist',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{
    notified?: string;
    q?: string;
    offset?: string;
  }>;
}

const PAGE_SIZE = 50;

export default async function TerritoryAdminWaitlistPage({ searchParams }: Props) {
  const p = await searchParams;
  const notified: 'all' | 'pending' | 'done' =
    p.notified === 'pending' || p.notified === 'done' ? p.notified : 'all';
  const q = (p.q || '').trim();
  const offset = Math.max(parseInt(p.offset || '0', 10) || 0, 0);

  const rows = await getAreaWaitlistList({
    notified,
    q: q || undefined,
    limit: PAGE_SIZE + 1,
    offset,
  });
  const hasMore = rows.length > PAGE_SIZE;
  const visible = hasMore ? rows.slice(0, PAGE_SIZE) : rows;

  const buildHref = (patch: Record<string, string | null>) => {
    const sp = new URLSearchParams();
    const base: Record<string, string | null> = {
      notified: notified === 'all' ? null : notified,
      q: q || null,
      offset: offset ? String(offset) : null,
    };
    const merged = { ...base, ...patch };
    for (const [k, v] of Object.entries(merged)) {
      if (v !== null && v !== undefined && v !== '') sp.set(k, v);
    }
    const qs = sp.toString();
    return qs
      ? `/territory/admin/waitlist?${qs}`
      : '/territory/admin/waitlist';
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl sm:text-3xl text-brand-navy">
          Area waitlist
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Contacts who registered interest in non-pilot regions, postcodes outside the pilot zone, or inactive sectors.
        </p>
      </header>

      <AdminWaitlistFilters notified={notified} q={q} />

      {visible.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No waitlist entries match these filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Submitted</th>
                <th className="px-3 py-2 text-left">Firm / Contact</th>
                <th className="px-3 py-2 text-left">Area</th>
                <th className="px-3 py-2 text-left">Sector</th>
                <th className="px-3 py-2 text-left">Source</th>
                <th className="px-3 py-2 text-left">Notified</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-brand-navy font-medium">{r.firm_name}</p>
                    <p className="text-xs text-slate-500">
                      {r.contact_name} &middot;{' '}
                      <a
                        href={`mailto:${r.contact_email}`}
                        className="link-navy hover:underline"
                      >
                        {r.contact_email}
                      </a>
                    </p>
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {r.requested_postcode || r.requested_region || '—'}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {r.sector_label}
                    {r.is_freeform ? (
                      <span className="ml-2 inline-flex items-center rounded-full border border-brand-gold/40 bg-brand-gold/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-brand-gold-accessible">
                        Freeform
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-xs uppercase tracking-wide text-slate-500">
                    {r.entry_source === 'region_click' ? 'Region' : 'Postcode'}
                  </td>
                  <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                    {r.notified_at
                      ? new Date(r.notified_at).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <AdminWaitlistRowActions
                      id={r.id}
                      firmName={r.firm_name}
                      notifiedAt={r.notified_at}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav aria-label="Pagination" className="flex items-center justify-between text-sm">
        {offset > 0 ? (
          <Link
            href={buildHref({
              offset: String(Math.max(0, offset - PAGE_SIZE)) || null,
            })}
            className="text-brand-navy link-navy hover:underline"
          >
            &larr; Previous
          </Link>
        ) : (
          <span />
        )}
        {hasMore ? (
          <Link
            href={buildHref({ offset: String(offset + PAGE_SIZE) })}
            className="text-brand-navy link-navy hover:underline"
          >
            Next &rarr;
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
