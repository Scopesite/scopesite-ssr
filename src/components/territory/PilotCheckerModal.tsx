'use client';

/**
 * Territory Command - area industry picker.
 *
 * Opens when the user clicks a postcode area on the map. The user confirms
 * they meant this area, picks or types their industry via the shared
 * IndustrySearch combobox, and is routed to /territory/apply.
 *
 * We serve every industry. The modal does not branch on `is_active` - both
 * known-sector picks and freeform entries funnel to the application page.
 * Sectors outside the pre-configured launch set are handled downstream by
 * the freeform industry path on /territory/apply.
 *
 * LEGACY: pilot terminology retained in code (component name, event name,
 * input IDs). Not user-facing.
 */

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import {
  OPEN_PILOT_CHECKER_EVENT,
  type OpenPilotCheckerDetail,
} from '@/lib/territory/events';
import type { SectorTile } from '@/lib/territory/types';
import { IndustrySearch, type IndustryValue } from './IndustrySearch';
import { Button } from '@/components/ui/button';
import { PromotionCountdown } from '@/components/territory/PromotionCountdown';

interface Props {
  /** All sectors grouped by category, pre-fetched server-side on /territory. */
  allSectorsByCategory: Record<string, SectorTile[]>;
}

export function PilotCheckerModal({ allSectorsByCategory }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [town, setTown] = useState<string | undefined>(undefined);
  const [industry, setIndustry] = useState<IndustryValue | null>(null);
  const [promotion, setPromotion] = useState<
    NonNullable<OpenPilotCheckerDetail['promotion']> | null
  >(null);

  const allSectors = useMemo<SectorTile[]>(
    () => Object.values(allSectorsByCategory).flat(),
    [allSectorsByCategory],
  );

  // Listen for map clicks on active-pilot postcodes.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<OpenPilotCheckerDetail>).detail;
      setPostcode(detail.postcode.toUpperCase());
      setTown(detail.town);
      setIndustry(null);
      setPromotion(detail.promotion ?? null);
      setOpen(true);
    };
    window.addEventListener(OPEN_PILOT_CHECKER_EVENT, handler);
    return () => window.removeEventListener(OPEN_PILOT_CHECKER_EVENT, handler);
  }, []);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setIndustry(null);
      setPromotion(null);
    }
  };

  const onContinue = () => {
    if (!postcode || !industry) return;
    const qs =
      industry.kind === 'sector'
        ? new URLSearchParams({ postcode, sector: industry.slug }).toString()
        : new URLSearchParams({ postcode, industry: industry.text }).toString();
    setOpen(false);
    router.push(`/territory/apply?${qs}`);
  };

  const headline = town
    ? `You clicked ${postcode} ${town}`
    : `You clicked ${postcode}`;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 z-50 max-h-[90vh] overflow-y-auto -translate-y-1/2 rounded-2xl bg-white p-6 sm:p-8 shadow-xl sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-full sm:max-w-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Dialog.Title className="font-headline text-xl sm:text-2xl text-brand-navy">
                {headline}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-600 mt-1">
                Is this the territory you&rsquo;re interested in?
              </Dialog.Description>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="link-navy mt-2 text-xs font-medium text-brand-navy underline underline-offset-4 hover:text-brand-gold-accessible"
              >
                Not this one? Close and pick another.
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {promotion ? (
            <div
              className={`mb-4 rounded-xl border p-4 ${
                promotion.originTier === 'premium'
                  ? 'border-purple-300 bg-gradient-to-br from-amber-50 via-amber-50 to-purple-100'
                  : 'border-amber-200 bg-amber-50/90'
              }`}
            >
              {promotion.headline ? (
                <p className="font-headline text-lg text-brand-navy">{promotion.headline}</p>
              ) : (
                <p className="font-headline text-lg text-brand-navy">Limited-time offer</p>
              )}
              {promotion.description ? (
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">{promotion.description}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-black text-brand-navy">
                  £{promotion.promotionalMonthlyPriceGbp.toFixed(0)}/mo
                </span>
                <span className="text-sm text-slate-500 line-through">
                  £{promotion.originMonthlyPriceGbp.toFixed(0)}/mo
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Ends in{' '}
                <PromotionCountdown
                  expiresAt={promotion.expiresAt}
                  onExpired={() => router.refresh()}
                />
              </p>
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="pilot-industry"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                What industry are you in? *
              </label>
              <IndustrySearch
                allSectors={allSectors}
                value={industry}
                onChange={setIndustry}
                inputId="pilot-industry"
                placeholder="Start typing your industry..."
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="brandOutline"
                size="brand"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="brand"
                size="brand"
                onClick={onContinue}
                disabled={!industry}
              >
                Continue to Application
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default PilotCheckerModal;
