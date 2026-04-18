'use client';

import { FINAL_CTA } from '@/lib/territory/copy';
import { Button } from '@/components/ui/button';

export function FinalCTA() {
  const onClick = () => {
    const el = document.getElementById('territory-hero');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const input = document.getElementById('territory-postcode') as HTMLInputElement | null;
    if (input) setTimeout(() => input.focus(), 400);
  };
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-headline text-3xl sm:text-4xl text-brand-navy mb-4">
          {FINAL_CTA.headline}
        </h2>
        <p className="text-lg text-slate-700 mb-8">{FINAL_CTA.body}</p>
        <Button
          type="button"
          variant="brand"
          size="brand"
          className="text-base sm:text-lg px-8 py-4"
          onClick={onClick}
        >
          {FINAL_CTA.buttonLabel}
        </Button>
      </div>
    </section>
  );
}

export default FinalCTA;
