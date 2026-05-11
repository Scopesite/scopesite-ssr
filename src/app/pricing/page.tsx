import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { QuoteCalculator } from '@/components/pricing';
import { Loader2 } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import {
  AI_SEARCH_PERFORMANCE_GUARANTEE_WARRANTY,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generatePricingSchema,
  generatePricingQuoteCalculatorWebApplicationSchema,
} from '@/lib/schema';
import { getAlternates } from '@/lib/hreflang-map';
import { PricingBreakdownTables } from './PricingBreakdownTables';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/pricing`;

/** Visible HTML + FAQPage JSON-LD — must stay 1:1. */
const canonicalPricingFaqs = [
  {
    question: 'How much does a 5-page Wix Studio website cost?',
    answer:
      'A 5-page Wix Studio website (Starter tier, client-managed) costs £1,875 as a flat fee. This is a one-off cost, you can edit content yourself after we hand it over.',
  },
  {
    question: 'How much does a 10-page Wix Studio website cost?',
    answer:
      'A 10-page Wix Studio website (Professional tier) costs £4,125 flat. There are no per-page extras within the 6-10 page band.',
  },
  {
    question: 'How much does a 5-page SSR website cost?',
    answer:
      'A 5-page Ultra Fast SSR website starts at £2,000 and includes AI SEO bundled at no extra charge. The site is hand-coded for speed and AI visibility.',
  },
  {
    question: 'How much does a 10-page SSR website cost?',
    answer:
      'A 10-page Ultra Fast SSR website costs £3,250 (£2,000 base plus 5 pages at £250 each). AI SEO is included free.',
  },
  {
    question: 'How much does a Live Jobs Board cost?',
    answer:
      'Our Live Jobs Board with auto-schema is £1,999 as an add-on to any ScopeSite build. Every job posted automatically generates JSON-LD JobPosting schema, appearing in Google for Jobs the same day.',
  },
  {
    question: 'How much is the AI SEO retainer?',
    answer:
      'Standalone AI SEO retainer is £750 setup plus £500 per month. 6-month commitment total is £3,750. 12-month total is £6,750. AI SEO is bundled free with all SSR website builds.',
  },
  {
    question: 'How much is Territory Command?',
    answer:
      'Territory Command Standard is £750 setup plus £500 per month and includes postcode exclusivity. Premium tier (cities and high-competition postcodes) is £1,250 setup plus £750 per month. Both include an SSR build and AI SEO.',
  },
  {
    question: 'What payment terms do you offer?',
    answer:
      'All payment options are at the same total price — no interest, no credit charges, no premium for spreading the cost. Choose Pay in Full, 6-Month Contract, 12-Month Contract, or Pay Monthly Service depending on what works for your cashflow. Pay Monthly Service is a tiered subscription with 6-month minimum then 30-day rolling — see Table 7 for tier-specific setup and monthly fees.',
  },
  {
    question: 'How much does a recruitment website with a jobs board cost?',
    answer:
      'A typical recruitment build is a 10-page Ultra Fast SSR website plus the Live Jobs Board add-on. Total cost is £5,249 — same price across all payment options. AI SEO is included free. For positioning, schema-first delivery, and the live JobBoard Sonar demo, see https://scopesite.co.uk/recruitment-website-design',
  },
  {
    question: 'How much does an e-commerce website cost?',
    answer:
      'Our Online Shop bundle is a 10-page Ultra Fast SSR with Stripe Checkout (free), Live Promotions (£1,500), and pre-selected shop add-ons. Starts from £4,750 plus selected add-ons.',
  },
  {
    question: 'Why is your SSR site cheaper than your Wix site for most page counts?',
    answer:
      'Component reuse and modern tooling means SSR sites take less time to build than Wix Studio sites. We pass the savings on. Wix is the right choice if you want to edit content yourself, SSR is faster, AI-visible, and cheaper from 6 pages onwards.',
  },
  {
    question: 'What is Pay Monthly Service?',
    answer:
      'Pay Monthly Service (internally referred to as Website-as-a-Service) is a continuous monthly subscription that gives you a full website without the upfront capital cost. Tier-specific setup and monthly fees apply (see Table 7). 6-month minimum, then 30-day rolling. ScopeSite retains ownership of the build during the subscription. Available for Wix Studio (Starter and Professional) and Ultra Fast SSR builds (up to 20 pages).',
  },
  {
    question: 'Can I cancel Pay Monthly Service anytime?',
    answer:
      'Pay Monthly Service has a 6-month minimum term. After that it continues on 30-day rolling terms — cancel by giving 30 days\' written notice. No early termination fees if you have served the full 6-month minimum.',
  },
  {
    question: 'Do I own the website on Pay Monthly Service?',
    answer:
      'No. Under Pay Monthly Service, ScopeSite retains 100% ownership of the build for the duration of your subscription. You hold a license to use the website. If you want to own it outright, you can purchase a Buyout (see below).',
  },
  {
    question: 'What is the Pay Monthly Service Buyout fee?',
    answer:
      'Pay Monthly Service Buyout fees are tiered: £1,500 for Wix Starter, £3,000 for Wix Professional, £2,500 for SSR Base (≤5 pages), £3,500 for SSR Plus (6–10 pages), £4,500 for SSR Premium (11–20 pages). Buyout is optional and only available after the 6-month minimum term is served. Previous monthly payments do not count toward the Buyout price — the Buyout is a separate one-off acquisition fee.',
  },
  {
    question: 'What is the AI Search Performance Guarantee?',
    answer: AI_SEARCH_PERFORMANCE_GUARANTEE_WARRANTY,
  },
] satisfies ReadonlyArray<{ question: string; answer: string }>;

export const metadata: Metadata = {
  title: 'Web Design Pricing UK | ScopeSite',
  description:
    'Honest web design pricing from £1,875. No hidden costs, instant quotes online. Pay in Full, 6- or 12-month instalments at the same total, or Pay Monthly Service where eligible. Somerset-based, UK-wide service.',
  openGraph: {
    title: 'Web Design Pricing UK | Transparent Costs | ScopeSite Digital Studios',
    description:
      'Honest web design pricing from £1,875. No hidden costs, instant quotes online. Pay in Full, 6- or 12-month instalments at the same total, or Pay Monthly Service where eligible. Somerset-based, UK-wide service.',
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
    description:
      'Honest web design pricing from £1,875. No hidden costs, instant quotes online. Pay in Full, parity instalments, or Pay Monthly Service.',
    images: [`${BASE_URL}/images/og/og-pricing.png`],
  },
  alternates: getAlternates('/pricing', BASE_URL),
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
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Pricing', url: PAGE_URL },
  ]);

  const pricingSchema = generatePricingSchema();

  const webPageSchema = {
    ...generateWebPageSchema(
      'Web Design Pricing UK',
      'Honest web design pricing from £1,875. No hidden costs, instant quotes online. Pay in Full, 6- or 12-month instalments at the same total, or Pay Monthly Service where eligible. Somerset-based, UK-wide service.',
      PAGE_URL
    ),
    mainEntity: { '@id': `${BASE_URL}/pricing/#service` },
  };

  const pricingWebApplicationSchema = {
    ...generatePricingQuoteCalculatorWebApplicationSchema(),
    browserRequirements: 'Requires JavaScript',
    publisher: {
      '@type': 'Organization',
      name: 'ScopeSite Digital Studios',
      url: BASE_URL,
    },
  };

  const pricingFaqPageSchema = {
    '@type': 'FAQPage',
    mainEntity: canonicalPricingFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd
        schema={[
          webPageSchema,
          breadcrumbSchema,
          pricingSchema,
          pricingWebApplicationSchema,
          pricingFaqPageSchema,
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
            No sales calls. No hidden fees. Just honest, transparent pricing that&apos;s 25% below UK
            market average. Build your quote in under 2 minutes.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-white -mt-4">
        <div className="container-content">
          <Suspense fallback={<QuoteCalculatorFallback />}>
            <QuoteCalculator />
          </Suspense>
          <p className="text-center text-brand-navy/70 text-sm mt-6 max-w-xl mx-auto">
            Prefer to send a written brief? Use our{' '}
            <Link href="/brief" className="text-brand-gold underline hover:text-brand-navy">
              project brief form
            </Link>
            .
          </p>
        </div>
      </section>

      <PricingBreakdownTables />

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
                  add-ons - so you know exactly what you&apos;re paying for before you commit to
                  anything.
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
                  spread the cost into manageable monthly amounts - no credit checks, no finance
                  companies, no interest. Just straightforward monthly payments.
                </p>
              </div>
              <div>
                <h3 className="text-brand-navy font-bold text-lg mb-3">UK Market Comparison</h3>
                <p className="text-brand-navy/70">
                  Every quote shows you the UK market average for the same work. You&apos;ll see
                  exactly how much you&apos;re saving compared to what you&apos;d pay elsewhere. No
                  more wondering if you&apos;re getting ripped off.
                </p>
              </div>
            </div>

            <div className="bg-brand-navy rounded-xl p-8">
              <h3 className="text-white font-bold text-lg mb-4 text-center">
                What&apos;s Included in Every Project
              </h3>
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

      {/* FAQ Section — matches FAQPage JSON-LD 1:1 */}
      <section className="bg-brand-navy/5 py-16">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-h2 text-brand-navy text-center mb-8">
              PRICING FAQs
            </h2>
            <div className="space-y-6">
              {canonicalPricingFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-brand-navy font-bold mb-2">{faq.question}</h3>
                  <p className="text-brand-navy/70">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-brand-navy/60 mb-4">Still have questions? We&apos;re happy to chat.</p>
              <Link href="/book" className="btn-primary inline-block">
                Book a Free Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
