'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RESULT_STATES, resolveResultKey } from '@/lib/territory/copy';
import type { AvailabilityResult } from '@/lib/territory/types';
import { Button } from '@/components/ui/button';
import { TerritoryPricingStrip } from '@/components/territory/TerritoryPricingStrip';

interface Props {
  result: Extract<
    AvailabilityResult,
    { state: 'available' | 'pending' | 'claimed' | 'not_active' }
  >;
  onJoinWaitlist: () => void;
  onReset: () => void;
}

// Background uses the new state token at 15% opacity. Foreground/icon uses a
// darker shade of the same hue so the label is WCAG AA on the tinted pill.
const STATE_BADGE: Record<
  keyof typeof RESULT_STATES,
  { bg: string; fg: string; icon: string }
> = {
  available: { bg: 'bg-territory-available/15', fg: 'text-green-700',         icon: '✓' },
  pending:   { bg: 'bg-territory-pending/15',   fg: 'text-blue-700',          icon: '◷' },
  claimed:   { bg: 'bg-territory-claimed/15',   fg: 'text-territory-claimed', icon: '✕' },
  not_active:{ bg: 'bg-territory-inactive/15',  fg: 'text-slate-700',         icon: '○' },
  premium:   { bg: 'bg-territory-premium/15',   fg: 'text-purple-700',        icon: '★' },
};

export function ResultCard({ result, onJoinWaitlist, onReset }: Props) {
  const router = useRouter();
  const key = resolveResultKey(result.state, result.tier);
  const copy = RESULT_STATES[key];
  const badge = STATE_BADGE[key];
  const postcode = result.postcodeDistrict;
  const sector = result.sectorLabel;

  const isApply = key === 'available' || key === 'premium';

  return (
    <div
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-200 motion-safe:ease-out"
      role="status"
      aria-live="polite"
    >
      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${badge.bg} ${badge.fg}`}>
        <span aria-hidden="true" className="text-base leading-none">{badge.icon}</span>
        <span>{copy.label}</span>
      </div>

      <div className="mt-4">
        <TerritoryPricingStrip
          state={result.postcodeDisplayState}
          onPromoExpired={() => router.refresh()}
          promoMonthlyClassName="text-2xl font-black text-brand-gold-accessible"
        />
      </div>

      <h2 className="mt-4 font-headline text-2xl sm:text-3xl text-brand-navy">
        {copy.headline(postcode, sector)}
      </h2>
      <p className="mt-3 text-base sm:text-lg text-slate-700 leading-relaxed">{copy.body}</p>

      {result.areaIntelligence ? (
        <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-slate-50 p-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Firms in area</dt>
            <dd className="font-headline text-lg text-brand-navy">{result.areaIntelligence.firmCount}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">AI-visible today</dt>
            <dd className="font-headline text-lg text-brand-navy">{result.areaIntelligence.aiVisibleCount}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Avg V.O.I.C.E.</dt>
            <dd className="font-headline text-lg text-brand-navy">
              {result.areaIntelligence.averageVoiceScore ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Top competitors</dt>
            <dd className="font-headline text-lg text-brand-navy">
              {result.areaIntelligence.topCompetitorCount}
            </dd>
          </div>
        </dl>
      ) : null}

      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        {isApply ? (
          <Button asChild variant="brand" size="brand">
            <Link href={`/territory/apply?seat=${encodeURIComponent(result.seatId)}`}>
              {copy.primaryCta}
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            variant="brand"
            size="brand"
            onClick={onJoinWaitlist}
          >
            {copy.primaryCta}
          </Button>
        )}
        <Button
          type="button"
          variant="brandOutline"
          size="brand"
          onClick={onReset}
        >
          {copy.secondaryCta}
        </Button>
      </div>
    </div>
  );
}

export default ResultCard;
