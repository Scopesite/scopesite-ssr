import { Metadata } from 'next';
import { Suspense } from 'react';
import { FilloutEmbed } from '@/components/shared/FilloutEmbed';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateContactPageSchema,
  generateScheduleActionSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/book`;

export const metadata: Metadata = {
  title: 'Book a Free Strategy Call',
  description:
    'Book a free 30-minute strategy call with Dan Cartwright. Discuss your web design or AI visibility project. No obligation, no hard sell. Somerset-based.',
  openGraph: {
    title: 'Book a Free Strategy Call | Web Design Consultation | ScopeSite Digital Studios',
    description:
      'Book a free 30-minute strategy call with Dan Cartwright. Discuss your web design or AI visibility project. No obligation, no hard sell. Somerset-based.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/dan-headshot.webp`,
        width: 400,
        height: 400,
        alt: 'Dan Cartwright - Director of ScopeSite Digital Studios',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Book a Free Strategy Call | ScopeSite',
    description: 'Book a free 30-minute strategy call with Dan Cartwright. Discuss your web design or AI visibility project.',
    images: [`${BASE_URL}/images/dan-headshot.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function BookPage() {
  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Book a Call', url: PAGE_URL },
  ]);

  const contactPageSchema = generateContactPageSchema(PAGE_URL);
  const scheduleActionSchema = generateScheduleActionSchema();

  return (
    <>
      {/* Page-specific structured data */}
      <JsonLd
        schema={[breadcrumbSchema, contactPageSchema, scheduleActionSchema]}
      />

      {/* Hero Section */}
      <section className="bg-brand-navy pt-12 pb-8">
        <div className="container-content text-center">
          <span className="badge-gold mb-4">Zero Pressure</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-white mb-4">
            BOOK A <span className="text-brand-gold">STRATEGY CALL</span>
          </h1>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
            Struggling to find what you&apos;re looking for? Book a free 1:1
            Google Meet with
            <strong className="text-brand-gold"> Dan Cartwright</strong>, the
            director of ScopeSite, where he&apos;ll help determine the best
            solution for your project.
          </p>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="bg-brand-navy/95 py-12">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-white font-bold text-lg mb-4">What We&apos;ll Cover</h2>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Your current situation - what&apos;s working, what isn&apos;t</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>What you actually need (which might be different from what you think)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Realistic timelines and rough costs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Whether we&apos;re actually the right fit for your project</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-white font-bold text-lg mb-4">Who You&apos;ll Speak To</h2>
                <p className="text-white/70 mb-4">
                  You&apos;ll be talking directly to Dan Cartwright - no account managers, 
                  no junior staff, no handoffs. Dan&apos;s a British Army veteran who founded 
                  ScopeSite after watching businesses get burned by agencies that overpromise 
                  and underdeliver.
                </p>
                <p className="text-white/70">
                  He&apos;ll give you straight advice, even if that means telling you we&apos;re 
                  not the right choice for your project. No hard sell. Ever.
                </p>
              </div>
            </div>
            <div className="mt-8 bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-6 text-center">
              <p className="text-white/80">
                <strong className="text-brand-gold">Not sure if you need a call?</strong>{' '}
                Try our <a href="/pricing" className="text-brand-gold underline hover:text-white transition-colors">instant quote calculator</a> first - 
                you might find exactly what you need without needing to talk to anyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fillout Form Section */}
      <section className="bg-brand-navy py-8">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <Suspense
              fallback={
                <div className="h-[900px] flex items-center justify-center">
                  <div className="text-white/60">
                    Loading booking calendar...
                  </div>
                </div>
              }
            >
              <FilloutEmbed />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-brand-navy/5">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-h2 text-brand-gold font-headline mb-2">
                30 min
              </div>
              <div className="text-body-sm text-brand-graphite">
                Quick & focused call
              </div>
            </div>
            <div>
              <div className="text-h2 text-brand-gold font-headline mb-2">
                100%
              </div>
              <div className="text-body-sm text-brand-graphite">
                Free, no obligation
              </div>
            </div>
            <div>
              <div className="text-h2 text-brand-gold font-headline mb-2">
                24hr
              </div>
              <div className="text-body-sm text-brand-graphite">
                Response time
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
