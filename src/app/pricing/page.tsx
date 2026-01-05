import { Metadata } from 'next';
import { Suspense } from 'react';
import { QuoteCalculator } from '@/components/pricing';
import { Loader2 } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateOfferSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/pricing`;

export const metadata: Metadata = {
  title: 'Transparent Web Design Pricing',
  description:
    'No hidden costs, no surprises. Get an instant quote for your web design project. Flexible 6, 12, or 24-month payment plans available.',
  openGraph: {
    title: 'Transparent Web Design Pricing | ScopeSite Digital Studios',
    description:
      'No hidden costs, no surprises. Get an instant quote for your web design project. Flexible payment plans available.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Transparent Web Design Pricing - ScopeSite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transparent Web Design Pricing | ScopeSite',
    description: 'Get an instant quote for your web design project.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

function QuoteCalculatorFallback() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-card p-12 text-center">
      <Loader2 className="w-12 h-12 text-brand-gold animate-spin mx-auto mb-4" />
      <p className="text-brand-navy">Loading quote calculator...</p>
    </div>
  );
}

export default function PricingPage() {
  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Pricing', url: PAGE_URL },
  ]);

  const serviceSchema = generateServiceSchema(
    'Web Design Pricing',
    'Transparent, instant quotes for web design projects. No hidden fees, flexible payment plans, 25% below UK market average.',
    PAGE_URL
  );

  const starterOffer = generateOfferSchema(
    'Starter Website Package',
    'Professional 1-5 page website with AI visibility optimization',
    '1500-3000'
  );

  const professionalOffer = generateOfferSchema(
    'Professional Website Package',
    'Comprehensive 6-10 page website with e-commerce capabilities',
    '3000-8000'
  );

  const enterpriseOffer = generateOfferSchema(
    'Enterprise Website Package',
    'Large-scale websites and custom web applications',
    '8000+'
  );

  return (
    <>
      {/* Page-specific structured data */}
      <JsonLd
        schema={[
          breadcrumbSchema,
          serviceSchema,
          starterOffer,
          professionalOffer,
          enterpriseOffer,
        ]}
      />

      {/* Hero Section */}
      <section className="bg-brand-navy pt-12 pb-8">
        <div className="container-content text-center">
          <span className="badge-gold mb-4">Transparent Pricing</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-white mb-4">
            GET YOUR <span className="text-brand-gold">INSTANT QUOTE</span>
          </h1>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
            No sales calls. No hidden fees. Just honest, transparent pricing
            that&apos;s 25% below UK market average. Build your quote in under 2
            minutes.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-white -mt-4">
        <div className="container-content">
          <Suspense fallback={<QuoteCalculatorFallback />}>
            <QuoteCalculator />
          </Suspense>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-brand-navy/5">
        <div className="container-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-brand-navy text-brand-gold font-headline text-h2 px-6 py-3 rounded-full mb-2">
                348
              </div>
              <div className="text-body-sm text-brand-graphite font-bold">
                UK agencies researched
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-brand-navy text-brand-gold font-headline text-h2 px-6 py-3 rounded-full mb-2">
                25%
              </div>
              <div className="text-body-sm text-brand-graphite font-bold">
                Below market average
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
        </div>
      </section>
    </>
  );
}
