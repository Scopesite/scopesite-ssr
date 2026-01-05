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
  title: 'Book a Strategy Call',
  description:
    'Book a free 30-minute strategy call with Dan Cartwright, director of ScopeSite. Discuss your project requirements with no obligation.',
  openGraph: {
    title: 'Book a Strategy Call | ScopeSite Digital Studios',
    description:
      'Book a free 30-minute strategy call with Dan Cartwright to discuss your web project.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/dan-headshot.webp`,
        width: 400,
        height: 400,
        alt: 'Dan Cartwright - Director of ScopeSite',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Book a Strategy Call | ScopeSite',
    description: 'Book a free 30-minute strategy call with Dan Cartwright.',
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
          <h1 className="text-display text-white mb-4">
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
