import type { Metadata } from 'next';
import Link from 'next/link';
import { listAuditLogPage } from '@/lib/territory/queries';

export const metadata: Metadata = {
  title: 'Territory Admin - Activity',
  robots: { index: false, follow: false },
};

const PAGE = 50;

interface Props {
  searchParams: Promise<{ offset?: string }>;
}

function summarisePayload(payload: Record<string, unknown>): string {
  try {
    const s = JSON.stringify(payload);
    return s.length > 140 ? `${s.slice(0, 140)}…` : s;
  } catch {
    return '—';
  }
}

export default async function TerritoryAdminActivityPage({ searchParams }: Props) {
  const p = await searchParams;
  const offset = Math.max(parseInt(p.offset || '0', 10) || 0, 0);
  const rows = await listAuditLogPage({ limit: PAGE + 1, offset });
  const hasMore = rows.length > PAGE;
  const visible = hasMore ? rows.slice(0, PAGE) : rows;

  const moreHref = hasMore
    ? `/territory/admin/activity?offset=${encodeURIComponent(String(offset + PAGE))}`
    : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl text-brand-navy">Activity</h1>
        <p className="mt-1 text-sm text-slate-600">
          Recent admin and system actions (newest first).
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Action</th>
              <th className="px-3 py-2 font-medium">Entity</th>
              <th className="px-3 py-2 font-medium">Payload</th>
              <th className="px-3 py-2 font-medium">By</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 align-top">
                <td className="px-3 py-2 whitespace-nowrap text-slate-700">
                  {new Date(r.created_at).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-brand-navy">{r.action_type}</td>
                <td className="px-3 py-2 font-mono text-xs break-all text-slate-700">
                  {r.entity_id ?? '—'}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-slate-600 break-all">
                  {summarisePayload(r.payload)}
                </td>
                <td className="px-3 py-2 text-slate-700">{r.performed_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && moreHref ? (
        <p className="text-sm">
          <Link href={moreHref} className="text-brand-navy link-navy font-medium hover:underline">
            Load more
          </Link>
        </p>
      ) : null}
    </div>
  );
}
