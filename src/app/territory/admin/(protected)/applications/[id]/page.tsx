import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getApplicationDetail } from '@/lib/territory/queries';
import { ApplicationStatusBadge } from '@/components/territory/admin/ApplicationStatusBadge';
import { AdminApplicationStatusForm } from '@/components/territory/admin/AdminApplicationStatusForm';

export const metadata: Metadata = {
  title: 'Territory Admin - Application',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function TerritoryAdminApplicationDetailPage({
  params,
}: Props) {
  const { id } = await params;
  const detail = await getApplicationDetail(id);
  if (!detail) notFound();

  const { application: a, seat, industryLabel, postcodeDistrict } = detail;
  const territoryLabel = `${postcodeDistrict} ${industryLabel}`;

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link
          href="/territory/admin/applications"
          className="text-brand-navy link-navy hover:underline"
        >
          &larr; All applications
        </Link>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Application {a.id}
          </p>
          <h1 className="mt-1 font-headline text-2xl sm:text-3xl text-brand-navy">
            {a.firm_name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {territoryLabel} &middot; submitted {formatDateTime(a.created_at)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ApplicationStatusBadge status={a.status} />
          <span className="text-xs uppercase tracking-wide text-slate-500">
            Entry: {a.entry_type}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Firm
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-slate-500">Firm name</dt>
              <dd className="text-slate-800">{a.firm_name}</dd>
              <dt className="text-slate-500">Firm postcode</dt>
              <dd className="text-slate-800">{a.firm_postcode}</dd>
              {a.website_url ? (
                <>
                  <dt className="text-slate-500">Website</dt>
                  <dd>
                    <a
                      href={a.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-navy link-navy hover:underline"
                    >
                      {a.website_url}
                    </a>
                  </dd>
                </>
              ) : null}
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Contact
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-slate-500">Name</dt>
              <dd className="text-slate-800">{a.contact_name}</dd>
              {a.contact_role ? (
                <>
                  <dt className="text-slate-500">Role</dt>
                  <dd className="text-slate-800">{a.contact_role}</dd>
                </>
              ) : null}
              <dt className="text-slate-500">Email</dt>
              <dd>
                <a
                  href={`mailto:${a.contact_email}`}
                  className="text-brand-navy link-navy hover:underline"
                >
                  {a.contact_email}
                </a>
              </dd>
              {a.contact_phone ? (
                <>
                  <dt className="text-slate-500">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${a.contact_phone}`}
                      className="text-brand-navy link-navy hover:underline"
                    >
                      {a.contact_phone}
                    </a>
                  </dd>
                </>
              ) : null}
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Requested territory
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-slate-500">Postcode district</dt>
              <dd className="text-slate-800">{postcodeDistrict}</dd>
              <dt className="text-slate-500">
                {a.entry_type === 'freeform' ? 'Industry (freeform)' : 'Sector'}
              </dt>
              <dd className="text-slate-800">{industryLabel}</dd>
              {a.sector_slug ? (
                <>
                  <dt className="text-slate-500">Sector slug</dt>
                  <dd className="text-slate-800 font-mono text-xs">
                    {a.sector_slug}
                  </dd>
                </>
              ) : null}
              {seat ? (
                <>
                  <dt className="text-slate-500">Seat ID</dt>
                  <dd className="text-slate-800 font-mono text-xs">
                    {seat.seat_id}
                  </dd>
                  <dt className="text-slate-500">Seat state</dt>
                  <dd className="text-slate-800">{seat.state}</dd>
                  <dt className="text-slate-500">Pending until</dt>
                  <dd className="text-slate-800">{formatDateTime(seat.pending_until)}</dd>
                </>
              ) : null}
            </dl>
          </div>

          {(a.ai_visibility_approach || a.additional_context) ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              {a.ai_visibility_approach ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
                    AI visibility approach
                  </h2>
                  <p className="text-sm text-slate-800">{a.ai_visibility_approach}</p>
                </div>
              ) : null}
              {a.additional_context ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
                    Additional context
                  </h2>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">
                    {a.additional_context}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Status
            </h2>
            <AdminApplicationStatusForm
              applicationId={a.id}
              currentStatus={a.status}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Timeline
            </h2>
            <dl className="text-sm space-y-1">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Created</dt>
                <dd className="text-slate-800">{formatDateTime(a.created_at)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Updated</dt>
                <dd className="text-slate-800">{formatDateTime(a.updated_at)}</dd>
              </div>
              {a.booked_call_at ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Booked call</dt>
                  <dd className="text-slate-800">{formatDateTime(a.booked_call_at)}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </aside>
      </section>
    </div>
  );
}
