import type { Metadata } from 'next';
import Link from 'next/link';
import { getApplicationsList } from '@/lib/territory/queries';
import type {
  ApplicationEntryType,
  ApplicationStatus,
} from '@/lib/territory/types';
import { ApplicationStatusBadge } from '@/components/territory/admin/ApplicationStatusBadge';
import { AdminApplicationsFilters } from '@/components/territory/admin/AdminApplicationsFilters';

export const metadata: Metadata = {
  title: 'Territory Admin - Applications',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{
    status?: string;
    entryType?: string;
    q?: string;
    offset?: string;
  }>;
}

const VALID_STATUSES: ApplicationStatus[] = [
  'received',
  'qualified',
  'declined',
  'converted',
  'expired',
];
const VALID_ENTRY_TYPES: ApplicationEntryType[] = ['seat', 'sector', 'freeform'];
const PAGE_SIZE = 50;

export default async function TerritoryAdminApplicationsPage({
  searchParams,
}: Props) {
  const p = await searchParams;
  const status =
    p.status && VALID_STATUSES.includes(p.status as ApplicationStatus)
      ? (p.status as ApplicationStatus)
      : 'all';
  const entryType =
    p.entryType &&
    VALID_ENTRY_TYPES.includes(p.entryType as ApplicationEntryType)
      ? (p.entryType as ApplicationEntryType)
      : 'all';
  const q = (p.q || '').trim();
  const offset = Math.max(parseInt(p.offset || '0', 10) || 0, 0);

  const rows = await getApplicationsList({
    status,
    entryType,
    q: q || undefined,
    limit: PAGE_SIZE + 1,
    offset,
  });
  const hasMore = rows.length > PAGE_SIZE;
  const visible = hasMore ? rows.slice(0, PAGE_SIZE) : rows;

  const buildHref = (patch: Record<string, string | null>) => {
    const sp = new URLSearchParams();
    const base: Record<string, string | null> = {
      status: status === 'all' ? null : status,
      entryType: entryType === 'all' ? null : entryType,
      q: q || null,
      offset: offset ? String(offset) : null,
    };
    const merged = { ...base, ...patch };
    for (const [k, v] of Object.entries(merged)) {
      if (v !== null && v !== undefined && v !== '') sp.set(k, v);
    }
    const qs = sp.toString();
    return qs
      ? `/territory/admin/applications?${qs}`
      : '/territory/admin/applications';
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl sm:text-3xl text-brand-navy">
          Applications
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {offset ? `Showing ${offset + 1}–${offset + visible.length}` : `Latest ${visible.length}`}
          {visible.length === 0 ? '' : visible.length === 1 ? ' application' : ' applications'}.
        </p>
      </header>

      <AdminApplicationsFilters
        status={status}
        entryType={entryType}
        q={q}
      />

      {visible.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No applications match these filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Submitted</th>
                <th className="px-3 py-2 text-left">Firm / Contact</th>
                <th className="px-3 py-2 text-left">Territory</th>
                <th className="px-3 py-2 text-left">Entry</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                    {new Date(a.created_at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/territory/admin/applications/${a.id}`}
                      className="text-brand-navy font-medium link-navy hover:underline"
                    >
                      {a.firm_name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {a.contact_name} &middot; {a.contact_email}
                    </p>
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {a.territory_label}
                  </td>
                  <td className="px-3 py-2 text-xs uppercase tracking-wide text-slate-500">
                    {a.entry_type}
                  </td>
                  <td className="px-3 py-2">
                    <ApplicationStatusBadge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav
        aria-label="Pagination"
        className="flex items-center justify-between text-sm"
      >
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
