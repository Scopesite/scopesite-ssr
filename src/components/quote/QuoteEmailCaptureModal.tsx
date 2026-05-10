'use client';

import { useEffect, useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Loader2, Mail, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuoteEmailCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Called when the user submits a valid email. Must return a Promise — the
   * modal will stay open with a spinner until it resolves. Resolve `{ ok: true }`
   * to close the modal and advance, `{ ok: false, error: string }` to show
   * an inline error.
   *
   * websiteUrl is optional — empty string when not provided.
   */
  onSubmit: (email: string, websiteUrl: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  /** Focus is restored here when the modal closes (e.g. Step 4 Next button). */
  restoreFocusRef?: React.RefObject<HTMLElement | null>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function QuoteEmailCaptureModal({
  open,
  onOpenChange,
  onSubmit,
  restoreFocusRef,
}: QuoteEmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (open) {
      setError(null);
      setEmailTouched(false);
      const t = setTimeout(() => emailRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    if (prevOpenRef.current && !open) {
      restoreFocusRef?.current?.focus();
    }
    prevOpenRef.current = open;
  }, [open, restoreFocusRef]);

  const isValidEmail = email.trim() !== '' && EMAIL_RE.test(email.trim());
  const showEmailError = emailTouched && !isValidEmail;

  const handleDismiss = () => {
    if (isSubmitting) return;
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit(email.trim().toLowerCase(), websiteUrl.trim());
      if (!result.ok) {
        setError(result.error);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        />
        <DialogPrimitive.Content
          onPointerDown={(e) => e.stopPropagation()}
          onPointerDownOutside={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (isSubmitting) e.preventDefault();
          }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="quote-email-modal-title"
          aria-describedby="quote-email-modal-desc"
          className={cn(
            'fixed left-1/2 top-1/2 z-[51] w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2',
            'bg-white rounded-2xl shadow-2xl border border-brand-navy/10',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'max-h-[95vh] overflow-y-auto outline-none'
          )}
        >
          <div className="bg-brand-navy text-white rounded-t-2xl p-6 md:p-8 relative">
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close email form"
              className="absolute right-4 top-4 rounded-md p-1.5 text-white/90 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <X className="w-5 h-5" aria-hidden />
            </button>
            <div className="flex items-start gap-3 pr-10">
              <div className="shrink-0 w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center">
                <Mail className="w-5 h-5 text-brand-navy" />
              </div>
              <div>
                <DialogPrimitive.Title
                  id="quote-email-modal-title"
                  className="text-xl md:text-2xl font-headline font-black text-white"
                >
                  Let&apos;s get your quote started
                </DialogPrimitive.Title>
                <p id="quote-email-modal-desc" className="sr-only">
                  Enter your email address to continue building your quote. Adding your website is optional but lets us
                  run a free Pro Scan.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            <div>
              <p className="text-brand-navy font-medium mb-3">Pop your email in and we&apos;ll send you:</p>
              <ul className="space-y-2 text-body-sm text-brand-navy/80">
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold font-bold">✓</span>
                  <span>A PDF copy of your full quote</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold font-bold">✓</span>
                  <span>
                    A <strong>FREE</strong> professional AI visibility scan of your website
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <Label htmlFor="quote-modal-email" className="text-brand-navy font-bold flex items-center gap-1">
                Email Address
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </Label>
              <Input
                ref={emailRef}
                id="quote-modal-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="you@yourcompany.co.uk"
                className="mt-2"
                autoComplete="email"
                aria-required="true"
                aria-invalid={showEmailError ? true : undefined}
                aria-describedby={showEmailError ? 'quote-modal-email-error' : undefined}
                disabled={isSubmitting}
              />
              {showEmailError && (
                <p id="quote-modal-email-error" role="alert" className="text-body-sm text-red-500 mt-1">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="quote-modal-url" className="text-brand-navy font-bold">
                Website URL <span className="text-brand-graphite font-normal">(optional)</span>
              </Label>
              <Input
                id="quote-modal-url"
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="yourfirm.co.uk"
                className="mt-2"
                autoComplete="url"
                inputMode="url"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-body-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={!isValidEmail || isSubmitting}
              className="w-full bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white shadow-button py-6 text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting your quote...
                </>
              ) : (
                'Continue to my quote →'
              )}
            </Button>
            <p className="text-caption text-brand-graphite text-center">No spam. Just your quote and your scan.</p>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
