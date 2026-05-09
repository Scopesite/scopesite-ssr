'use client';

import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';

const STORAGE_KEY = 'scopesite_quote_redirect_notice';

/**
 * Shows a one-shot banner when the pricing calculator redirects here with a
 * sessionStorage message (legacy ?q= visibility / webapp tokens).
 */
export function QuoteRedirectNotice() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        setMessage(raw);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore */
    }
  }, []);

  if (!message) return null;

  return (
    <div className="container-content pt-6 pb-0">
      <div
        className="flex gap-3 items-start rounded-xl border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-brand-navy"
        role="status"
      >
        <Info className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" aria-hidden />
        <p className="text-sm md:text-base leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
