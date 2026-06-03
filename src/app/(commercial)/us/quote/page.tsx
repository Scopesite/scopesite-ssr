'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const USQuoteCalculator = dynamic(
  () =>
    import('@/components/pricing/USQuoteCalculator').then(
      (m) => m.USQuoteCalculator
    ),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-card p-12 text-center">
        <Loader2 className="w-12 h-12 text-brand-gold animate-spin mx-auto mb-4" />
        <p className="text-brand-navy">Loading quote calculator...</p>
      </div>
    ),
  }
);

export default function USQuotePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy pt-12 pb-8">
        <div className="container-content text-center">
          <span className="badge-gold mb-4">US Pricing in USD</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-white mb-4">
            GET AN <span className="text-brand-gold">INSTANT QUOTE</span>
          </h1>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
            Tell us what you need and we&apos;ll give you a price right now. No
            waiting for a callback, no &quot;request a proposal&quot; forms that
            disappear into a black hole. Pick your services, configure your
            project, and get a quote you can act on today.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-white -mt-4">
        <div className="container-content">
          <Suspense
            fallback={
              <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-card p-12 text-center">
                <Loader2 className="w-12 h-12 text-brand-gold animate-spin mx-auto mb-4" />
                <p className="text-brand-navy">Loading quote calculator...</p>
              </div>
            }
          >
            <USQuoteCalculator />
          </Suspense>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-brand-navy/5">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-center mb-10">
              <div className="flex flex-col items-center">
                <div className="bg-brand-navy text-brand-gold font-headline text-h2 px-6 py-3 rounded-full mb-2">
                  $
                </div>
                <div className="text-body-sm text-brand-graphite font-bold">
                  All prices in USD
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-brand-navy text-brand-gold font-headline text-h2 px-6 py-3 rounded-full mb-2">
                  24hr
                </div>
                <div className="text-body-sm text-brand-graphite font-bold">
                  Response time
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-brand-navy text-brand-gold font-headline text-h2 px-6 py-3 rounded-full mb-2">
                  100%
                </div>
                <div className="text-body-sm text-brand-graphite font-bold">
                  Transparent pricing
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm space-y-4">
              <p className="text-brand-navy/80">
                <strong className="text-brand-navy">Veteran-owned studio</strong> based in the UK,
                serving US businesses remotely. We work across time zones.
              </p>
              <p className="text-brand-navy/80">
                <strong className="text-brand-navy">Tier 1 audit fee is credited</strong> toward a
                Tier 2 website build within 60 days.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/us/pricing"
                  className="btn inline-block bg-brand-gold !text-brand-navy no-underline font-bold px-6 py-3 rounded-lg hover:bg-brand-navy hover:!text-white transition-colors"
                >
                  View US Packages
                </Link>
                <Link
                  href="/voice"
                  className="btn inline-block border-2 border-brand-gold !text-brand-navy no-underline font-bold px-6 py-3 rounded-lg hover:bg-brand-gold transition-colors"
                >
                  Free AI Visibility Scan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
