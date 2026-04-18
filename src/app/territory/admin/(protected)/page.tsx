import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getApplicationStatusCounts,
  getAreaWaitlistStatusCounts,
  getApplicationsList,
} from '@/lib/territory/queries';
import { ApplicationStatusBadge } from '@/components/territory/admin/ApplicationStatusBadge';

export const metadata: Metadata = {
  title: 'Territory Admin - Dashboard',
  robots: { index: false, follow: false },
};

export default async function TerritoryAdminDashboardPage() {
  const [appCounts, waitCounts, recentApps] = await Promise.all([
    getApplicationStatusCounts(),
    getAreaWaitlistStatusCounts(),
    getApplicationsList({ limit: 8 }),
  ]);

  const tiles: Array<{ label: string; value: number; href?: string; tone: 'navy' | 'gold' | 'slate' }> = [
    { label: 'New', value: appCounts.received, href: '/territory/admin/applications?status=received', tone: 'gold' },
    { label: 'Qualified', value: appCounts.qualified, href: '/territory/admin/applications?status=qualified', tone: 'navy' },
    { label: 'Converted', value: appCounts.converted, href: '/territory/admin/applications?status=converted', tone: 'navy' },
    { label: 'Declined', value: appCounts.declined, href: '/territory/admin/applications?status=declined', tone: 'slate' },
    { label: 'Expired', value: appCounts.expired, href: '/territory/admin/applications?status=expired', tone: 'slate' },
    { label: 'Total', value: appCounts.total, href: '/territory/admin/applications', tone: 'slate' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-headline text-2xl sm:text-3xl text-brand-navy">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Summary of applications and area waitlist.
        </p>
      </header>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
          Applications
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {tiles.map((t) => {
            const toneClass =
              t.tone === 'gold'
                ? 'border-brand-gold/60 bg-brand-gold/10'
                : t.tone === 'navy'
                  ? 'border-brand-navy/40 bg-white'
                  : 'border-slate-200 bg-slate-50';
            const content = (
              <div className={`rounded-xl border ${toneClass} p-4`}>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {t.label}
                </p>
                <p className="mt-1 text-2xl font-black text-brand-navy">
                  {t.value}
                </p>
              </div>
            );
            return t.href ? (
              <Link key={t.label} href={t.href} className="no-underline link-navy">
                {content}
              </Link>
            ) : (
              <div key={t.label}>{content}</div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
          Area waitlist
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link
            href="/territory/admin/waitlist?notified=pending"
            className="no-underline link-navy"
          >
            <div className="rounded-xl border border-brand-gold/60 bg-brand-gold/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                To notify
              </p>
              <p className="mt-1 text-2xl font-black text-brand-navy">
                {waitCounts.pending}
              </p>
            </div>
          </Link>
          <Link
            href="/territory/admin/waitlist?notified=done"
            className="no-underline link-navy"
          >
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Notified
              </p>
              <p className="mt-1 text-2xl font-black text-brand-navy">
                {waitCounts.done}
              </p>
            </div>
          </Link>
          <Link
            href="/territory/admin/waitlist"
            className="no-underline link-navy"
          >
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total
              </p>
              <p className="mt-1 text-2xl font-black text-brand-navy">
                {waitCounts.total}
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recent applications
          </h2>
          <Link
            href="/territory/admin/applications"
            className="text-sm text-brand-navy link-navy hover:underline"
          >
            View all
          </Link>
        </div>
        {recentApps.length === 0 ? (
          <p className="text-sm text-slate-500">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Submitted</th>
                  <th className="px-3 py-2 text-left">Firm</th>
                  <th className="px-3 py-2 text-left">Territory</th>
                  <th className="px-3 py-2 text-left">Entry</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentApps.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                      {new Date(a.created_at).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
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
                      <p className="text-xs text-slate-500">{a.contact_name}</p>
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
      </section>
    </div>
  );
}
