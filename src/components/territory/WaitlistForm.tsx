'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { WAITLIST } from '@/lib/territory/copy';
import { Spinner } from './Spinner';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  seatId: string;
  postcodeDistrict: string;
  sectorLabel: string;
  onSuccess?: (position: number, waitlistId: string) => void;
}

export function WaitlistForm({
  open,
  onOpenChange,
  seatId,
  postcodeDistrict,
  sectorLabel,
  onSuccess,
}: Props) {
  const [firmName, setFirmName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);

  const heading = WAITLIST.formHeading
    .replace('[POSTCODE]', postcodeDistrict)
    .replace('[SECTOR]', sectorLabel);

  const reset = () => {
    setFirmName('');
    setContactName('');
    setContactEmail('');
    setError(null);
    setPosition(null);
  };

  const onClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/territory/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seatId,
          contactName,
          contactEmail,
          firmName: firmName || null,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        position?: number;
        waitlistId?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.waitlistId || typeof data.position !== 'number') {
        setError(data.error || 'Could not join waitlist. Please try again.');
        return;
      }
      setPosition(data.position);
      onSuccess?.(data.position, data.waitlistId);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 rounded-2xl bg-white p-6 sm:p-8 shadow-xl sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-full sm:max-w-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className="flex items-start justify-between mb-4">
            <Dialog.Title className="font-headline text-xl sm:text-2xl text-brand-navy">
              {heading}
            </Dialog.Title>
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

          {position !== null ? (
            <div className="space-y-3">
              <p className="text-slate-800 leading-relaxed">
                You are on the waitlist at position <strong>{position}</strong>.
              </p>
              <p className="text-sm text-slate-600">
                We have sent a confirmation to <strong>{contactEmail}</strong>.
              </p>
              <Button
                type="button"
                variant="brandOutline"
                size="brand"
                className="mt-2"
                onClick={() => onClose(false)}
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} data-territory-form className="space-y-4">
              <p className="text-sm text-slate-600">{WAITLIST.disclaimer}</p>
              <div>
                <label htmlFor="wl-firm" className="block text-sm font-medium text-slate-700 mb-1">
                  {WAITLIST.labels.firmName} *
                </label>
                <input
                  id="wl-firm"
                  type="text"
                  required
                  maxLength={200}
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white text-brand-navy placeholder:text-slate-400 px-3 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
              <div>
                <label htmlFor="wl-name" className="block text-sm font-medium text-slate-700 mb-1">
                  {WAITLIST.labels.contactName} *
                </label>
                <input
                  id="wl-name"
                  type="text"
                  required
                  maxLength={200}
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white text-brand-navy placeholder:text-slate-400 px-3 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
              <div>
                <label htmlFor="wl-email" className="block text-sm font-medium text-slate-700 mb-1">
                  {WAITLIST.labels.contactEmail} *
                </label>
                <input
                  id="wl-email"
                  type="email"
                  required
                  maxLength={320}
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white text-brand-navy placeholder:text-slate-400 px-3 py-2 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
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
                    <Spinner className="text-brand-navy" label="Joining" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <span>{WAITLIST.submit}</span>
                )}
              </Button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default WaitlistForm;
