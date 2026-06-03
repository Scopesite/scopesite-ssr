import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  getSectorBySlug,
  getSeatFullById,
  getSeatFullByPostcodeAndSector,
} from '@/lib/territory/queries';
import { APPLICATION } from '@/lib/territory/copy';
import {
  TerritoryApplicationForm,
  type ResolvedApplyContext,
} from '@/components/territory/TerritoryApplicationForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Territory Application - ScopeSite',
  description: 'Apply to hold your territory while we arrange a qualifying call.',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{
    seat?: string;
    postcode?: string;
    sector?: string;
    industry?: string;
  }>;
}

/**
 * Three valid entry shapes - all render the SAME full application form:
 *   (a) ?seat=<uuid>                       ResultCard "Apply for this territory"
 *   (b) ?postcode=X&sector=<slug>          PilotCheckerModal, known sector
 *   (c) ?postcode=X&industry=<text>        PilotCheckerModal, freeform
 *
 * Resolution rules:
 *   seat  mode - we have a specific available territory.seats row to hold
 *   sector mode - known sector + known pilot postcode, but the seat is
 *                 not currently available (not_active, pending, claimed,
 *                 or simply not present). Submit inserts an application
 *                 without flipping any seat.
 *   freeform mode - postcode known but sector is free text.
 *
 * Rendering is identical in all three cases; only the submit payload and
 * the "Applying for X" label differ.
 */
async function resolveContext(params: {
  seat?: string;
  postcode?: string;
  sector?: string;
  industry?: string;
}): Promise<ResolvedApplyContext | 'unavailable' | null> {
  const seatId = (params.seat || '').trim();
  const postcode = (params.postcode || '').trim().toUpperCase();
  const sector = (params.sector || '').trim();
  const industry = (params.industry || '').trim().slice(0, 120);

  if (seatId) {
    const s = await getSeatFullById(seatId);
    if (!s) return null;
    if (s.state !== 'available') return 'unavailable';
    return {
      mode: 'seat',
      seatId: s.seat_id,
      postcodeDistrict: s.postcode_district,
      sectorSlug: s.sector_slug,
      sectorLabel: s.sector_label,
    };
  }

  if (postcode && sector) {
    // First try to resolve as an available seat (fast path, keeps 48h hold).
    const s = await getSeatFullByPostcodeAndSector(postcode, sector);
    if (s && s.state === 'available') {
      return {
        mode: 'seat',
        seatId: s.seat_id,
        postcodeDistrict: s.postcode_district,
        sectorSlug: s.sector_slug,
        sectorLabel: s.sector_label,
      };
    }
    // Fall back to sector-mode: the sector must still exist in our
    // taxonomy (rejects garbage slugs from manual URL tampering). If
    // we found a seat but it's pending/claimed, render sector-mode
    // using that seat's postcode_district + sector_label; otherwise
    // resolve the sector directly by slug.
    if (s) {
      return {
        mode: 'sector',
        postcodeDistrict: s.postcode_district,
        sectorSlug: s.sector_slug,
        sectorLabel: s.sector_label,
      };
    }
    const sectorRow = await getSectorBySlug(sector);
    if (!sectorRow) return null;
    return {
      mode: 'sector',
      postcodeDistrict: postcode,
      sectorSlug: sectorRow.slug,
      sectorLabel: sectorRow.label,
    };
  }

  if (postcode && industry) {
    return {
      mode: 'freeform',
      postcodeDistrict: postcode,
      freeformIndustry: industry,
    };
  }

  return null;
}

export default async function TerritoryApplyPage({ searchParams }: Props) {
  const params = await searchParams;
  const resolved = await resolveContext(params);

  if (resolved === null) {
    // No valid entry shape - bounce back to the map.
    redirect('/territory?apply=unavailable');
  }

  if (resolved === 'unavailable') {
    return (
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-headline text-3xl sm:text-4xl text-brand-navy">
            This territory is not currently available
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed">
            That territory is currently held by another applicant or not yet
            live. You can join the waitlist from the Territory Command page.
          </p>
          <div className="mt-6">
            <Button asChild variant="brandOutline" size="brand">
              <Link href="/territory">Back to Territory Command</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const ctx = resolved;
  const titleLabel =
    ctx.mode === 'freeform' ? ctx.freeformIndustry : ctx.sectorLabel;

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-wide text-brand-gold-accessible font-semibold">
            {APPLICATION.pageTitlePrefix}
          </p>
          <h1 className="mt-1 font-headline text-3xl sm:text-4xl text-brand-navy">
            {ctx.postcodeDistrict} {titleLabel}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed">
            {APPLICATION.instruction}
          </p>
        </header>
        <TerritoryApplicationForm context={ctx} />
      </div>
    </section>
  );
}
