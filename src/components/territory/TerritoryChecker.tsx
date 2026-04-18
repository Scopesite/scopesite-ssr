'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HERO } from '@/lib/territory/copy';
import type { AvailabilityResult, SectorTile } from '@/lib/territory/types';
import {
  normalisePostcode,
  isPlausibleUkPostcode,
  isPostcodeDistrictOnly,
  validateUkPostcodeLive,
} from '@/lib/territory/postcode';
import { emitOpenAreaWaitlist } from '@/lib/territory/events';
import { IndustrySearch, type IndustryValue } from './IndustrySearch';
import { WaitlistForm } from './WaitlistForm';
import { ResultCard } from './ResultCard';
import { Spinner } from './Spinner';
import { Button } from '@/components/ui/button';

interface Props {
  /** Pre-fetched by the server component. No client fetch on mount. */
  featuredSectors: SectorTile[];
  /** Pre-fetched by the server component. Flattened to feed IndustrySearch. */
  allSectorsByCategory: Record<string, SectorTile[]>;
}

export function TerritoryChecker({
  featuredSectors,
  allSectorsByCategory,
}: Props) {
  const router = useRouter();
  const [postcode, setPostcode] = useState('');
  const [industry, setIndustry] = useState<IndustryValue | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [postcodeError, setPostcodeError] = useState<string | null>(null);
  const [industryError, setIndustryError] = useState<string | null>(null);
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const allSectors = useMemo<SectorTile[]>(
    () => Object.values(allSectorsByCategory).flat(),
    [allSectorsByCategory],
  );

  const onPostcodeChange = (raw: string) => {
    setPostcode(raw.toUpperCase());
    setPostcodeError(null);
  };

  const chooseFeaturedSector = useCallback(
    (s: SectorTile) => {
      setIndustry({ kind: 'sector', slug: s.slug, label: s.label });
      setIndustryError(null);
      // Auto-fire Check when the user already has a plausible postcode so
      // the chip acts as a one-tap quick pick.
      const normalised = normalisePostcode(postcode);
      if (normalised && isPlausibleUkPostcode(normalised)) {
        window.setTimeout(() => formRef.current?.requestSubmit(), 0);
      }
    },
    [postcode],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostcodeError(null);
    setIndustryError(null);

    const normalised = normalisePostcode(postcode);
    if (!normalised || !isPlausibleUkPostcode(normalised)) {
      setPostcodeError(HERO.invalidPostcode);
      return;
    }
    if (!industry) {
      setIndustryError('Please select your industry.');
      return;
    }

    // Freeform industry short-circuits availability lookup and hands off
    // to the /territory/apply freeform interstitial. The API has no seat
    // row for a freeform industry so checking availability would always
    // return "not found" and degrade into the waitlist flow - the direct
    // route is both faster and consistent with the pilot modal's freeform
    // behaviour.
    if (industry.kind === 'freeform') {
      const qs = new URLSearchParams({
        postcode: normalised,
        industry: industry.text,
      }).toString();
      router.push(`/territory/apply?${qs}`);
      return;
    }

    setIsChecking(true);
    try {
      // Postcodes.io `/validate` only accepts FULL postcodes (e.g. "BS1 1AA")
      // and returns false for district-only inputs like "BS20". Map boundary
      // clicks always prefill a district, so for those we trust our own
      // regex (isPlausibleUkPostcode above) and skip the round-trip.
      const districtOnly = isPostcodeDistrictOnly(normalised);
      const [checkRes, postcodeOk] = await Promise.all([
        fetch('/api/territory/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postcode: normalised,
            sectorSlug: industry.slug,
          }),
        }),
        districtOnly ? Promise.resolve(true) : validateUkPostcodeLive(normalised),
      ]);
      const data = (await checkRes.json()) as {
        ok: boolean;
        result?: AvailabilityResult;
        error?: string;
      };

      if (!checkRes.ok || !data.ok || !data.result) {
        setPostcodeError(HERO.invalidPostcode);
        return;
      }

      const res = data.result;

      if (res.state === 'territory_not_found' || res.state === 'sector_not_found') {
        if (postcodeOk) {
          emitOpenAreaWaitlist({
            entrySource: 'postcode_not_in_pilot',
            postcode: normalised,
            sectorSlug: industry.slug,
          });
          return;
        }
        setPostcodeError(HERO.invalidPostcode);
        return;
      }

      setResult(res);
    } catch {
      setPostcodeError('Could not check availability. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const reset = () => {
    setResult(null);
    setPostcodeError(null);
    setIndustryError(null);
    const el = document.getElementById('territory-postcode');
    if (el) (el as HTMLInputElement).focus();
  };

  const activeResult =
    result && result.state !== 'territory_not_found' && result.state !== 'sector_not_found'
      ? result
      : null;

  const featuredChipSlug =
    industry?.kind === 'sector' ? industry.slug : null;

  return (
    <div className="w-full">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        data-territory-form
        className="rounded-2xl bg-white p-5 sm:p-6 shadow-lg border border-white/20"
        aria-describedby="territory-price-strip"
      >
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] gap-3 items-end">
          <div>
            <label
              htmlFor="territory-postcode"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Postcode
            </label>
            <input
              id="territory-postcode"
              type="text"
              inputMode="text"
              autoComplete="postal-code"
              placeholder={HERO.postcodePlaceholder}
              value={postcode}
              onChange={(e) => onPostcodeChange(e.target.value)}
              maxLength={12}
              required
              className="w-full rounded-md border border-slate-300 bg-white text-brand-navy placeholder:text-slate-400 px-3 py-2.5 uppercase tracking-wide font-semibold focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
          </div>
          <div>
            <label
              htmlFor="territory-industry"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Industry
            </label>
            <IndustrySearch
              allSectors={allSectors}
              value={industry}
              onChange={(v) => {
                setIndustry(v);
                if (v) setIndustryError(null);
              }}
              inputId="territory-industry"
              placeholder={HERO.sectorPlaceholder}
            />
          </div>
          <Button
            type="submit"
            variant="brand"
            size="brand"
            disabled={isChecking}
            className="h-11 md:h-[42px] py-0"
          >
            {isChecking ? (
              <>
                <Spinner className="text-brand-navy" label="Checking" />
                <span>Checking...</span>
              </>
            ) : (
              <span>{HERO.cta}</span>
            )}
          </Button>
        </div>

        {postcodeError ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {postcodeError}
          </p>
        ) : null}
        {industryError ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {industryError}
          </p>
        ) : null}

        {featuredSectors.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              Featured industries
            </p>
            <div className="flex flex-wrap gap-2">
              {featuredSectors.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => chooseFeaturedSector(s)}
                  className={[
                    'inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold border transition-colors',
                    featuredChipSlug === s.slug
                      ? 'border-brand-gold bg-brand-gold text-brand-navy'
                      : 'border-slate-200 bg-white text-brand-navy hover:border-brand-gold hover:bg-brand-gold/10',
                  ].join(' ')}
                >
                  <span>{s.label}</span>
                  {s.availableCount > 0 ? (
                    <span className="ml-2 text-xs text-brand-gold-accessible font-semibold">
                      {s.availableCount} available
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </form>

      {activeResult ? (
        <>
          <ResultCard
            result={activeResult}
            onReset={reset}
            onJoinWaitlist={() => setWaitlistOpen(true)}
          />
          <WaitlistForm
            open={waitlistOpen}
            onOpenChange={setWaitlistOpen}
            seatId={activeResult.seatId}
            postcodeDistrict={activeResult.postcodeDistrict}
            sectorLabel={activeResult.sectorLabel}
          />
        </>
      ) : null}
    </div>
  );
}

export default TerritoryChecker;
