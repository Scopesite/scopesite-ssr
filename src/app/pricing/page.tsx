import { Metadata } from 'next';
import { QuoteCalculator } from '@/components/pricing';

export const metadata: Metadata = {
  title: 'Get Instant Quote',
  description:
    'Get an instant, transparent quote for your web design project. No hidden fees, no sales calls - just honest pricing 25% below UK market average.',
  openGraph: {
    title: 'Get Instant Quote | ScopeSite Digital Studios',
    description:
      'Get an instant, transparent quote for your web design project. No hidden fees, no sales calls.',
  },
};

export default function PricingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy pt-12 pb-8">
        <div className="container-content text-center">
          <span className="badge-gold mb-4">Transparent Pricing</span>
          <h1 className="text-display text-white mb-4">
            GET YOUR <span className="text-brand-gold">INSTANT QUOTE</span>
          </h1>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
            No sales calls. No hidden fees. Just honest, transparent pricing 
            that&apos;s 25% below UK market average. Build your quote in under 2 minutes.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-white -mt-4">
        <div className="container-content">
          <QuoteCalculator />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-brand-navy/5">
        <div className="container-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-brand-navy text-brand-gold font-headline text-h2 px-6 py-3 rounded-full mb-2">348</div>
              <div className="text-body-sm text-brand-graphite font-bold">UK agencies researched</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-brand-navy text-brand-gold font-headline text-h2 px-6 py-3 rounded-full mb-2">25%</div>
              <div className="text-body-sm text-brand-graphite font-bold">Below market average</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-brand-navy text-brand-gold font-headline text-h2 px-6 py-3 rounded-full mb-2">24hr</div>
              <div className="text-body-sm text-brand-graphite font-bold">Response time</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-brand-navy text-brand-gold font-headline text-h2 px-6 py-3 rounded-full mb-2">100%</div>
              <div className="text-body-sm text-brand-graphite font-bold">Transparent pricing</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

