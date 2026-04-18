import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeatFullById, getWaitlistEntryById } from '@/lib/territory/queries';
import { WAITLIST_CONFIRMED } from '@/lib/territory/copy';

export const metadata: Metadata = {
  title: WAITLIST_CONFIRMED.pageTitle,
  description: 'You have joined the Territory Command waitlist.',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ waitlist?: string }>;
}

export default async function TerritoryWaitlistConfirmedPage({ searchParams }: Props) {
  const params = await searchParams;
  const waitlistId = (params.waitlist || '').trim();
  if (!waitlistId) notFound();

  const entry = await getWaitlistEntryById(waitlistId);
  if (!entry) notFound();

  const seat = await getSeatFullById(entry.seat_id);
  const postcodeDistrict = seat?.postcode_district || '';
  const sectorLabel = seat?.sector_label || entry.sector_slug || '';

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-navy/10 px-3 py-1 text-xs sm:text-sm font-semibold text-brand-navy">
            Waitlist position {entry.waitlist_position ?? '—'}
          </p>
          <h1 className="mt-4 font-headline text-3xl sm:text-4xl text-brand-navy">
            {WAITLIST_CONFIRMED.headlinePrefix}
            {postcodeDistrict} {sectorLabel}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-700 leading-relaxed">
            {WAITLIST_CONFIRMED.body}
          </p>
          <div className="mt-8">
            <Link
              href={WAITLIST_CONFIRMED.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white text-brand-navy font-semibold px-6 py-3 hover:bg-slate-50"
            >
              {WAITLIST_CONFIRMED.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
