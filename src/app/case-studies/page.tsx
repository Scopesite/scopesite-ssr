import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  generateItemListSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/case-studies`;

export const metadata: Metadata = {
  title: 'Case Studies | AI Visibility Results | ScopeSite',
  description:
    'Real results from our AI-first web design and V.O.I.C.E.™ methodology. See how we get UK businesses recommended by ChatGPT, Claude, and Perplexity.',
  openGraph: {
    title: 'Case Studies | AI Visibility Results | ScopeSite Digital Studios',
    description:
      'Real results from our AI-first web design and V.O.I.C.E.™ methodology. See how we get UK businesses recommended by ChatGPT, Claude, and Perplexity.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-case-study-h4tlt.png`, // Reusing H4TLT for now or a generic one
        width: 1200,
        height: 630,
        alt: 'ScopeSite Case Studies - AI Visibility Results',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies | AI Visibility Results | ScopeSite',
    description:
      'Real results from our AI-first web design and V.O.I.C.E.™ methodology.',
    images: [`${BASE_URL}/images/og/og-case-study-h4tlt.png`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const caseStudies = [
  {
    title: 'From Invisible to National #1 in 4 Months',
    client: 'Hear 4 The Long Term (H4TLT)',
    slug: 'h4tlt',
    description: 'How V.O.I.C.E.™ methodology took a Somerset audiologist from 7 visitors a week to nationally recommended by Google AI Overview, ChatGPT and Perplexity. No ad spend.',
    metrics: [
      { label: 'AI Bot Crawls', value: '2,169' },
      { label: 'AI Platforms', value: '#1 on 3' },
    ],
  },
];

export default function CaseStudiesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Case Studies', url: PAGE_URL },
  ]);

  const collectionPageSchema = generateCollectionPageSchema(
    PAGE_URL,
    'Case Studies | AI Visibility Results | ScopeSite'
  );

  const itemListSchema = generateItemListSchema(
    `${PAGE_URL}/#case-studies-list`,
    'ScopeSite Case Studies',
    caseStudies.map((cs) => ({
      '@type': 'Article',
      '@id': `${BASE_URL}/case-studies/${cs.slug}/#article`,
      headline: cs.title,
      url: `${BASE_URL}/case-studies/${cs.slug}`,
    }))
  );

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, collectionPageSchema, itemListSchema]} />

      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section">
        <div className="container-content text-center">
          <span className="badge-gold-lg mb-6 inline-flex items-center justify-center">
            Client Success
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-white mb-4">
            CASE <span className="text-brand-gold">STUDIES</span>
          </h1>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
            Real results from our AI-first web design and V.O.I.C.E.™ methodology. 
            See how we get businesses recommended by ChatGPT, Claude, and Perplexity.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="section-white">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((cs) => (
              <Link 
                key={cs.slug} 
                href={`/case-studies/${cs.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-brand-navy/10 overflow-hidden hover:shadow-card transition-all duration-300"
              >
                <div className="p-8 flex-1 flex flex-col">
                  <div className="text-brand-gold font-bold text-sm tracking-wider uppercase mb-3">
                    {cs.client}
                  </div>
                  <h2 className="text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-gold-accessible transition-colors">
                    {cs.title}
                  </h2>
                  <p className="text-muted mb-8 flex-1">
                    {cs.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-brand-navy/10">
                    {cs.metrics.map((metric, i) => (
                      <div key={i}>
                        <div className="text-2xl font-bold text-brand-navy mb-1 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-brand-gold" />
                          {metric.value}
                        </div>
                        <div className="text-xs text-muted font-medium uppercase tracking-wider">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center text-brand-navy font-bold group-hover:text-brand-gold-accessible transition-colors mt-auto">
                    Read Case Study
                    <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
