'use client';

import { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { AREA_WAITLIST } from '@/lib/territory/copy';
import {
  AREA_WAITLIST_EVENT,
  type OpenAreaWaitlistDetail,
} from '@/lib/territory/events';
import type { SectorTile } from '@/lib/territory/types';
import { IndustrySearch, type IndustryValue } from './IndustrySearch';
import { Spinner } from './Spinner';
import { Button } from '@/components/ui/button';

interface Props {
  /** Pre-fetched on the server. Flattened for the sector dropdown. */
  allSectorsByCategory: Record<string, SectorTile[]>;
}

type QueuePosition =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'ready'; currentSize: number }
  | { state: 'error' };

export function AreaWaitlistForm({ allSectorsByCategory }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'region' | 'postcode'>('region');
  const [regionLabel, setRegionLabel] = useState<string>('');
  const [regionKey, setRegionKey] = useState<string>('');
  const [postcode, setPostcode] = useState<string>('');

  const [firmName, setFirmName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [optionalPostcode, setOptionalPostcode] = useState('');
  const [industry, setIndustry] = useState<IndustryValue | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [assignedPosition, setAssignedPosition] = useState<number | null>(null);
  const [queue, setQueue] = useState<QueuePosition>({ state: 'idle' });
  const [error, setError] = useState<string | null>(null);

  const sectors = useMemo<SectorTile[]>(
    () => Object.values(allSectorsByCategory).flat(),
    [allSectorsByCategory],
  );

  // Listen for the open event dispatched by TerritoryMap/TerritoryChecker.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<OpenAreaWaitlistDetail>).detail;
      setError(null);
      setSuccess(false);
      setAssignedPosition(null);
      setMode(detail.entrySource === 'region_click' ? 'region' : 'postcode');
      setRegionLabel(detail.regionLabel || '');
      setRegionKey(detail.regionKey || '');
      setPostcode(detail.postcode || '');
      setOptionalPostcode('');
      if (detail.sectorSlug) {
        const match = sectors.find((s) => s.slug === detail.sectorSlug);
        if (match) {
          setIndustry({ kind: 'sector', slug: match.slug, label: match.label });
        } else {
          setIndustry(null);
        }
      } else {
        setIndustry(null);
      }
      setOpen(true);
    };
    window.addEventListener(AREA_WAITLIST_EVENT, handler);
    return () => window.removeEventListener(AREA_WAITLIST_EVENT, handler);
  }, [sectors]);

  // Fetch queue size for postcode-mode opens. Only meaningful when we have
  // a real postcode to query against (region-mode entries have no per-area
  // queue position because the queue is per-postcode).
  useEffect(() => {
    if (!open || mode !== 'postcode' || !postcode) {
      setQueue({ state: 'idle' });
      return;
    }
    let cancelled = false;
    setQueue({ state: 'loading' });
    (async () => {
      try {
        const res = await fetch(
          `/api/territory/area-waitlist/queue-position?postcode=${encodeURIComponent(postcode)}`,
          { cache: 'no-store' },
        );
        if (!res.ok) throw new Error('queue lookup failed');
        const data = (await res.json()) as { currentQueueSize?: number };
        if (cancelled) return;
        setQueue({ state: 'ready', currentSize: data.currentQueueSize ?? 0 });
      } catch {
        if (!cancelled) setQueue({ state: 'error' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, mode, postcode]);

  const onOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      setFirmName('');
      setContactName('');
      setContactEmail('');
      setOptionalPostcode('');
      setIndustry(null);
      setError(null);
      setSuccess(false);
      setAssignedPosition(null);
      setQueue({ state: 'idle' });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!industry) {
      setError('Please select your industry.');
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        firmName,
        contactName,
        contactEmail,
        postcode: mode === 'postcode' ? postcode : optionalPostcode || null,
        region: mode === 'region' ? regionKey : null,
        sectorSlug: industry.kind === 'sector' ? industry.slug : null,
        freeformIndustry:
          industry.kind === 'freeform' ? industry.text : null,
        entrySource: mode === 'region' ? 'region_click' : 'postcode_not_in_pilot',
      };
      const res = await fetch('/api/territory/area-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        assignedPosition?: number | null;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not register interest. Please try again.');
        return;
      }
      setAssignedPosition(
        typeof data.assignedPosition === 'number' ? data.assignedPosition : null,
      );
      setSuccess(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    mode === 'region'
      ? `${AREA_WAITLIST.regionHeadlinePrefix}${regionLabel}`
      : AREA_WAITLIST.postcodeWaitlistTitle(postcode);
  const subline =
    mode === 'region'
      ? AREA_WAITLIST.regionSubHeadline
      : AREA_WAITLIST.postcodeWaitlistSubline;

  // Pre-submit queue position copy.
  const queueLine: string | null = (() => {
    if (mode !== 'postcode' || !postcode) return null;
    if (queue.state === 'loading') return AREA_WAITLIST.queue.loading;
    if (queue.state === 'ready') {
      const next = queue.currentSize + 1;
      return next === 1
        ? AREA_WAITLIST.queue.first(postcode)
        : AREA_WAITLIST.queue.upcoming(next, postcode);
    }
    return null;
  })();

  // Post-submit confirmation queue position copy.
  const successQueueLine: string | null =
    mode === 'postcode' && postcode && assignedPosition !== null
      ? assignedPosition <= 1
        ? AREA_WAITLIST.queue.assignedFirst(postcode)
        : AREA_WAITLIST.queue.assigned(assignedPosition, postcode)
      : null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 z-50 max-h-[90vh] overflow-y-auto -translate-y-1/2 rounded-2xl bg-white p-6 sm:p-8 shadow-xl sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-full sm:max-w-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Dialog.Title className="font-headline text-xl sm:text-2xl text-brand-navy">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-600 mt-1">
                {subline}
              </Dialog.Description>
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

          {success ? (
            <div className="space-y-3">
              <p className="text-slate-800 leading-relaxed">{AREA_WAITLIST.success}</p>
              {successQueueLine ? (
                <p className="rounded-md border border-brand-gold/40 bg-brand-gold/10 px-3 py-2 text-sm font-medium text-brand-navy">
                  {successQueueLine}
                </p>
              ) : null}
              <Button
                type="button"
                variant="brand"
                size="brand"
                className="mt-2"
                onClick={() => onOpenChange(false)}
              >
                {AREA_WAITLIST.close}
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} data-territory-form className="space-y-4">
              {queueLine ? (
                <p
                  className="rounded-md border border-brand-gold/40 bg-brand-gold/10 px-3 py-2 text-sm font-medium text-brand-navy"
                  aria-live="polite"
                >
                  {queueLine}
                </p>
              ) : null}
              <div>
                <label htmlFor="aw-firm" className="block text-sm font-medium text-slate-700 mb-1">
                  {AREA_WAITLIST.labels.firmName} *
                </label>
                <input
                  id="aw-firm"
                  type="text"
                  required
                  maxLength={200}
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white text-brand-navy placeholder:text-slate-400 px-3 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
              <div>
                <label htmlFor="aw-name" className="block text-sm font-medium text-slate-700 mb-1">
                  {AREA_WAITLIST.labels.contactName} *
                </label>
                <input
                  id="aw-name"
                  type="text"
                  required
                  maxLength={200}
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white text-brand-navy placeholder:text-slate-400 px-3 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
              <div>
                <label htmlFor="aw-email" className="block text-sm font-medium text-slate-700 mb-1">
                  {AREA_WAITLIST.labels.contactEmail} *
                </label>
                <input
                  id="aw-email"
                  type="email"
                  required
                  maxLength={320}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white text-brand-navy placeholder:text-slate-400 px-3 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
              {mode === 'region' ? (
                <div>
                  <label htmlFor="aw-postcode" className="block text-sm font-medium text-slate-700 mb-1">
                    {AREA_WAITLIST.labels.postcode}
                  </label>
                  <input
                    id="aw-postcode"
                    type="text"
                    maxLength={12}
                    value={optionalPostcode}
                    onChange={(e) => setOptionalPostcode(e.target.value.toUpperCase())}
                    className="w-full rounded-md border border-slate-300 bg-white text-brand-navy placeholder:text-slate-400 px-3 py-2 uppercase focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  />
                  <p className="mt-1 text-xs text-slate-500">{AREA_WAITLIST.labels.postcodeHelp}</p>
                </div>
              ) : null}
              <div>
                <label htmlFor="aw-industry" className="block text-sm font-medium text-slate-700 mb-1">
                  {AREA_WAITLIST.labels.sector} *
                </label>
                <IndustrySearch
                  allSectors={sectors}
                  value={industry}
                  onChange={(v) => {
                    setIndustry(v);
                    if (v) setError(null);
                  }}
                  inputId="aw-industry"
                  placeholder={AREA_WAITLIST.labels.sectorPlaceholder}
                />
              </div>
              {error ? (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
              <Button
                type="submit"
                variant="brand"
                size="brand"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Spinner className="text-brand-navy" label="Registering" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <span>{AREA_WAITLIST.submit}</span>
                )}
              </Button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AreaWaitlistForm;
