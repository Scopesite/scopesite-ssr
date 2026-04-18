import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getApplicationById,
  getSectorBySlug,
  getSeatFullById,
} from '@/lib/territory/queries';
import { APPLICATION_CONFIRMED } from '@/lib/territory/copy';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: APPLICATION_CONFIRMED.pageTitle,
  description: 'Your Territory Command application has been received.',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ application?: string }>;
}

export default async function TerritoryConfirmedPage({ searchParams }: Props) {
  const params = await searchParams;
  const applicationId = (params.application || '').trim();
  if (!applicationId) notFound();

  const application = await getApplicationById(applicationId);
  if (!application) notFound();

  // Resolve the display postcode + sector/industry label. Three shapes:
  //   seat     -> look up the seat for canonical postcode + sector label
  //   sector   -> use requested_postcode_district + sector_slug (resolve
  //               label via sectors table for the human-readable form)
  //   freeform -> requested_postcode_district + freeform_industry (text)
  // "isSeat" keeps the 48h hold copy. Everything else shows the generic
  // "application is received" copy.
  const isSeat = application.entry_type === 'seat';
  let postcodeDistrict: string;
  let industryLabel: string;
  if (application.entry_type === 'seat') {
    const seat = application.seat_id
      ? await getSeatFullById(application.seat_id)
      : null;
    postcodeDistrict = seat?.postcode_district || application.firm_postcode;
    industryLabel = seat?.sector_label || application.sector_slug || 'your sector';
  } else if (application.entry_type === 'sector') {
    postcodeDistrict =
      application.requested_postcode_district || application.firm_postcode;
    const sector = application.sector_slug
      ? await getSectorBySlug(application.sector_slug)
      : null;
    industryLabel = sector?.label || application.sector_slug || 'your sector';
  } else {
    postcodeDistrict =
      application.requested_postcode_district || application.firm_postcode;
    industryLabel = application.freeform_industry || 'your sector';
  }

  const headline = isSeat
    ? APPLICATION_CONFIRMED.headlineSeat
    : APPLICATION_CONFIRMED.headlineFreeform;
  const sourceLines = isSeat
    ? APPLICATION_CONFIRMED.bodyLinesSeat
    : APPLICATION_CONFIRMED.bodyLinesFreeform;
  const bodyLines = sourceLines.map((line) =>
    line.replace('[POSTCODE]', postcodeDistrict).replace('[SECTOR]', industryLabel),
  );

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-territory-available/40 bg-territory-available/10 p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-gold/20 px-3 py-1 text-xs sm:text-sm font-semibold text-brand-gold-accessible">
            <span aria-hidden="true">✓</span>
            Application received
          </p>
          <h1 className="mt-4 font-headline text-3xl sm:text-4xl text-brand-navy">
            {headline}
          </h1>
          <div className="mt-6 space-y-4">
            {bodyLines.map((line, i) => (
              <p key={i} className="text-base sm:text-lg text-slate-700 leading-relaxed">
                {line}
              </p>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="brand" size="brand">
              <Link href={APPLICATION_CONFIRMED.cta.href}>
                {APPLICATION_CONFIRMED.cta.label}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
