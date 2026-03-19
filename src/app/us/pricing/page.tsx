'use client';

import Link from 'next/link';

const faqs = [
  {
    question: 'Why is US pricing different from UK pricing?',
    answer:
      'US pricing reflects the American market. We benchmark against US-based AI visibility agencies, account for USD currency differences, and tailor our research to US search patterns and competitor data. The deliverables are the same high standard, but the pricing is set for the market you operate in.',
  },
  {
    question: 'Can I start with the audit and upgrade later?',
    answer:
      'Yes. Many US clients begin with the $2,500 AI Visibility Audit to understand where they stand. If you move to Tier 2 (AI-Ready Website) within 60 days, the full audit fee is credited toward your project cost.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept ACH bank transfers, wire transfers, and all major credit cards. All invoices are issued in USD. Payment terms are 50% upfront and 50% on completion for project work. Retainers are billed monthly in advance.',
  },
  {
    question: 'Is there a contract for the retainer?',
    answer:
      'The AI Visibility Retainer has a 3-month minimum commitment. After that, it rolls month-to-month with 30 days written notice to cancel. There are no long-term lock-ins or early termination fees after the initial period.',
  },
];

const tiers = [
  {
    name: 'AI Visibility Audit',
    tier: 'Tier 1',
    price: '$2,500',
    basis: 'one-time',
    delivery: '5 business days',
    cta: 'Book Your Audit',
    items: [
      'Full V.O.I.C.E. scan of your current site',
      'Schema markup audit and validation',
      'AI crawler access check (GPTBot, ClaudeBot, PerplexityBot)',
      'Core Web Vitals and performance review',
      'Competitor benchmark across AI platforms',
      '60-minute strategy call with actionable priorities',
      'Written roadmap with specific recommendations',
    ],
  },
  {
    name: 'AI-Ready Website',
    tier: 'Tier 2',
    price: '$8,000 \u2013 $15,000',
    basis: 'project',
    delivery: '6\u20138 weeks',
    cta: 'Start Your Project',
    items: [
      'Custom Next.js SSR site built for AI visibility',
      'JSON-LD structured data across all pages',
      'Full V.O.I.C.E. methodology implementation',
      'Lighthouse scores of 90+ on all metrics',
      'Mobile-first responsive design',
      'llms.txt and robots.txt optimized for AI crawlers',
      '90 days post-launch support included',
    ],
  },
  {
    name: 'AI Visibility Retainer',
    tier: 'Tier 3',
    price: '$2,000',
    basis: '/month',
    delivery: '3-month minimum',
    cta: 'Start Your Retainer',
    items: [
      'Monthly V.O.I.C.E. scan and scoring',
      'AI citation monitoring across ChatGPT, Perplexity, and Claude',
      'Content strategy aligned to AI search trends',
      'Schema maintenance and updates',
      'Performance monitoring and optimization',
      'Monthly strategy call with progress review',
    ],
  },
];

export default function USPricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy pt-16 pb-12">
        <div className="max-w-content mx-auto px-6 text-center">
          <span className="inline-block bg-brand-gold/10 text-brand-gold text-body-sm font-bold px-4 py-1.5 rounded-pill mb-6 uppercase tracking-wide">
            US Pricing in USD
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-white font-headline mb-6">
            US Pricing: AI-Ready Websites and Visibility Packages
          </h1>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto mb-4">
            Clear pricing in US dollars. Three tiers designed for American businesses that want to
            be found, recommended, and cited by AI search platforms. No hidden fees, no hourly
            billing, no surprises.
          </p>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Every package is built on our{' '}
            <Link href="/us/ai-visibility" className="text-brand-gold underline hover:text-brand-gold/80">
              V.O.I.C.E. methodology
            </Link>
            , the same framework used across all{' '}
            <Link href="/us/services" className="text-brand-gold underline hover:text-brand-gold/80">
              ScopeSite US services
            </Link>
            .
          </p>
          <Link
            href="/us/quote"
            className="btn inline-block bg-brand-gold !text-brand-navy no-underline font-extrabold text-lg px-10 py-4 rounded-xl shadow-[0_4px_0_#b8860b] hover:shadow-[0_2px_0_#b8860b] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-150"
          >
            Get Instant Quote
          </Link>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="bg-brand-navy py-16">
        <div className="max-w-wide mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="bg-brand-navy border-2 border-brand-gold/30 rounded-xl p-8 flex flex-col hover:border-brand-gold transition-colors duration-300"
              >
                <span className="text-brand-gold text-body-sm font-bold uppercase tracking-wide mb-2">
                  {tier.tier}
                </span>
                <h2 className="text-white font-headline text-h3 mb-4">{tier.name}</h2>
                <div className="mb-2">
                  <span className="text-brand-gold font-headline text-h2">{tier.price}</span>
                  <span className="text-white/60 ml-2">{tier.basis}</span>
                </div>
                <p className="text-white/60 text-body-sm mb-6">Delivery: {tier.delivery}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/80">
                      <span className="text-brand-gold mt-0.5 shrink-0">&#10003;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book"
                  className="btn block text-center bg-brand-gold !text-brand-navy no-underline font-bold py-3 px-6 rounded-pill hover:bg-brand-gold/90 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
                >
                  {tier.cta}
                </Link>
                {tier.tier === 'Tier 1' && (
                  <p className="text-brand-gold/70 text-xs text-center mt-3">
                    Your $2,500 is credited toward a Tier 2 build within 60 days.
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-white/60 mt-8 max-w-2xl mx-auto">
            Tier 1 audit fee is credited in full toward a Tier 2 project if you proceed within 60
            days. All prices are in USD.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-brand-navy/95 py-16">
        <div className="max-w-content mx-auto px-6">
          <h2 className="text-white font-headline text-2xl sm:text-h2 text-center mb-10">
            What Every Tier Includes
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-white/80">
            <div className="flex items-start gap-3">
              <span className="text-brand-gold shrink-0">&#10003;</span>
              <span>Server-side rendered HTML that AI crawlers can read</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-brand-gold shrink-0">&#10003;</span>
              <span>JSON-LD structured data validated against Schema.org</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-brand-gold shrink-0">&#10003;</span>
              <span>Direct communication with Dan Cartwright, founder</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-brand-gold shrink-0">&#10003;</span>
              <span>AI crawler configuration (GPTBot, ClaudeBot, PerplexityBot)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-brand-gold shrink-0">&#10003;</span>
              <span>Written deliverables you own and can keep</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-brand-gold shrink-0">&#10003;</span>
              <span>All invoicing and payments in USD</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-content mx-auto px-6">
          <h2 className="text-brand-navy font-headline text-2xl sm:text-h2 text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="bg-brand-navy text-brand-gold font-headline text-h2 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-brand-navy font-bold mb-2">Book a Call</h3>
              <p className="text-brand-navy/70 text-body-sm">
                Schedule a free 30-minute call to discuss your goals and current AI visibility.
              </p>
            </div>
            <div>
              <div className="bg-brand-navy text-brand-gold font-headline text-h2 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-brand-navy font-bold mb-2">Choose Your Tier</h3>
              <p className="text-brand-navy/70 text-body-sm">
                Pick the package that fits your needs. Not sure? Start with the audit.
              </p>
            </div>
            <div>
              <div className="bg-brand-navy text-brand-gold font-headline text-h2 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-brand-navy font-bold mb-2">We Deliver</h3>
              <p className="text-brand-navy/70 text-body-sm">
                You get regular updates throughout the project. No disappearing for weeks.
              </p>
            </div>
            <div>
              <div className="bg-brand-navy text-brand-gold font-headline text-h2 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="text-brand-navy font-bold mb-2">AI Finds You</h3>
              <p className="text-brand-navy/70 text-body-sm">
                ChatGPT, Perplexity, and Claude start recommending your business to their users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-brand-navy/5 py-16">
        <div className="max-w-narrow mx-auto px-6">
          <h2 className="text-brand-navy font-headline text-2xl sm:text-h2 text-center mb-10">
            Pricing FAQs
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-card">
                <h3 className="text-brand-navy font-bold mb-2">{faq.question}</h3>
                <p className="text-brand-navy/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-navy py-16">
        <div className="max-w-content mx-auto px-6 text-center">
          <h2 className="text-white font-headline text-2xl sm:text-h2 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Book a free 30-minute call. We will review your current AI visibility, answer your
            questions, and recommend the right tier for your business. No pressure, no obligation.
          </p>
          <Link
            href="/book"
            className="btn inline-block bg-brand-gold !text-brand-navy no-underline font-bold py-4 px-10 rounded-pill text-lg hover:bg-brand-gold/90 transition-colors duration-200 shadow-button hover:shadow-button-hover focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
          >
            Book a Free Strategy Call
          </Link>
          <p className="text-white/40 mt-6 text-body-sm">
            Or explore our{' '}
            <Link href="/us" className="text-brand-gold underline hover:text-brand-gold/80">
              US homepage
            </Link>{' '}
            and{' '}
            <Link href="/us/services" className="text-brand-gold underline hover:text-brand-gold/80">
              full service list
            </Link>{' '}
            first.
          </p>
        </div>
      </section>
    </>
  );
}
