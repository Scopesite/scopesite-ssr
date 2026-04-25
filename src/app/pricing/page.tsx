import { Metadata } from 'next';
import { Suspense } from 'react';
import { QuoteCalculator } from '@/components/pricing';
import { Loader2 } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateWebPageSchema,
  generatePricingSchema,
} from '@/lib/schema';
import { PRICING_CONFIG } from '@/lib/pricing-config';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/pricing`;

// Pricing FAQ data
const pricingFAQs = [
  {
    question: 'How much does a website cost with ScopeSite?',
    answer: `Our websites start from £${PRICING_CONFIG.baseWebsite.starter.toLocaleString('en-GB')} for a professional 1-5 page site. Use our instant quote calculator to get an exact price based on your specific requirements - page count, e-commerce, custom features, and more.`,
  },
  {
    question: 'Do you offer payment plans?',
    answer: 'Yes! We offer flexible 12-month and 24-month payment plans with no credit checks and no interest. This lets you spread the cost while getting your website built immediately.',
  },
  {
    question: 'What\'s included in the price?',
    answer: 'All our packages include responsive design, basic SEO setup, mobile optimization, SSL certificate, and 30 days of post-launch support. Hosting and ongoing maintenance are quoted separately.',
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'Absolutely not. We pride ourselves on transparent pricing. The quote you receive is the price you pay. Any additional work outside the agreed scope is discussed and quoted before we proceed.',
  },
  {
    question: 'How does your pricing compare to other UK agencies?',
    answer: 'We researched 348 UK web design agencies to benchmark our pricing. On average, we\'re 25% below market rate for comparable quality work, without compromising on features or support.',
  },
  {
    question: 'Can I upgrade my package later?',
    answer: 'Yes, you can add features or pages at any time. We\'ll provide a quote for the additional work and can often integrate it into your existing payment plan if applicable.',
  },
];

export const metadata: Metadata = {
  title: 'Web Design Pricing UK | ScopeSite',
  description:
    'Honest web design pricing from £1,875. No hidden costs, instant quotes online. Flexible 6, 12 or 24-month payment plans. Somerset-based, UK-wide service.',
  openGraph: {
    title: 'Web Design Pricing UK | Transparent Costs | ScopeSite Digital Studios',
    description:
      'Honest web design pricing from £1,875. No hidden costs, instant quotes online. Flexible 6, 12 or 24-month payment plans. Somerset-based, UK-wide service.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-pricing.png`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite Web Design Pricing UK - Transparent Costs',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Pricing UK | Transparent Costs | ScopeSite',
    description: 'Honest web design pricing from £1,875. No hidden costs, instant quotes online. Flexible payment plans available.',
    images: [`${BASE_URL}/images/og/og-pricing.png`],
  },
  alternates: {
    canonical: PAGE_URL,
    languages: {
      'en-GB': PAGE_URL,
      'en-US': `${BASE_URL}/us/pricing`,
      'x-default': PAGE_URL,
    },
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

  // Comprehensive Service + Offer[] schema for the pricing page. Reads every
  // price from PRICING_CONFIG + VOICE_SPEC so published prices cannot drift
  // from the quote wizard. See generatePricingSchema JSDoc for what is /
  // is not published.
  const pricingSchema = generatePricingSchema();

  const webPageSchema = {
    ...generateWebPageSchema(
      'Web Design Pricing UK',
      'Honest web design pricing from £1,875. No hidden costs, instant quotes online. Flexible 6, 12 or 24-month payment plans. Somerset-based, UK-wide service.',
      PAGE_URL
    ),
    mainEntity: { '@id': `${PAGE_URL}#service` },
  };

  return (
    <>
      {/* Page-specific structured data */}
      <JsonLd
        schema={[
          webPageSchema,
          breadcrumbSchema,
          serviceSchema,
          pricingSchema,
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

      {/* Why Our Pricing is Different */}
      <section className="section-white">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-h2 text-brand-navy text-center mb-8">
              WHY OUR PRICING IS DIFFERENT
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-brand-navy font-bold text-lg mb-3">No Guesswork</h3>
                <p className="text-brand-navy/70">
                  Most agencies give you a &quot;starting from&quot; price, then hit you with extras 
                  once you&apos;re committed. We show you the full picture upfront - pages, features, 
                  add-ons - so you know exactly what you&apos;re paying for before you commit to anything.
                </p>
              </div>
              <div>
                <h3 className="text-brand-navy font-bold text-lg mb-3">Research-Backed</h3>
                <p className="text-brand-navy/70">
                  We didn&apos;t just make up our prices. We researched 348 UK web design agencies to 
                  understand what the market actually charges. Our prices are set to be competitive 
                  without cutting corners on quality.
                </p>
              </div>
              <div>
                <h3 className="text-brand-navy font-bold text-lg mb-3">Flexible Payment Plans</h3>
                <p className="text-brand-navy/70">
                  Not everyone has thousands to spend upfront. Our 12-month and 24-month payment plans 
                  spread the cost into manageable monthly amounts - no credit checks, no finance companies, 
                  no interest. Just straightforward monthly payments.
                </p>
              </div>
              <div>
                <h3 className="text-brand-navy font-bold text-lg mb-3">UK Market Comparison</h3>
                <p className="text-brand-navy/70">
                  Every quote shows you the UK market average for the same work. You&apos;ll see exactly 
                  how much you&apos;re saving compared to what you&apos;d pay elsewhere. No more wondering 
                  if you&apos;re getting ripped off.
                </p>
              </div>
            </div>

            <div className="bg-brand-navy rounded-xl p-8">
              <h3 className="text-white font-bold text-lg mb-4 text-center">What&apos;s Included in Every Project</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  <span>Mobile-first responsive design</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  <span>Basic SEO setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  <span>SSL certificate (HTTPS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  <span>Schema markup for AI visibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  <span>30 days post-launch support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  <span>Performance optimisation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  <span>Analytics setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  <span>Contact form integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-gold">✓</span>
                  <span>Cookie consent (GDPR)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-brand-navy/5 py-16">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-h2 text-brand-navy text-center mb-8">
              PRICING FAQs
            </h2>
            <div className="space-y-6">
              {pricingFAQs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-brand-navy font-bold mb-2">{faq.question}</h3>
                  <p className="text-brand-navy/70">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-brand-navy/60 mb-4">
                Still have questions? We&apos;re happy to chat.
              </p>
              <a href="/book" className="btn-primary">
                Book a Free Call
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
