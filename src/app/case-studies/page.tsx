import { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { CaseStudyListWithFilters } from '@/components/case-studies/CaseStudyListWithFilters';
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
    'Real results from our AI-first web design and AI visibility methodology. See how we get UK businesses recommended by ChatGPT, Claude, and Perplexity.',
  openGraph: {
    title: 'Case Studies | AI Visibility Results | ScopeSite Digital Studios',
    description:
      'Real results from our AI-first web design and AI visibility methodology. See how we get UK businesses recommended by ChatGPT, Claude, and Perplexity.',
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
      'Real results from our AI-first web design and AI visibility methodology.',
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
    description: 'How AI visibility methodology took a Somerset audiologist from 7 visitors a week to nationally recommended by Google AI Overview, ChatGPT and Perplexity. No ad spend.',
    metrics: [
      { label: 'AI Bot Crawls', value: '2,169' },
      { label: 'AI Platforms', value: '#1 on 3' },
    ],
    sector: 'health' as const,
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
            Real results from our AI-first web design and AI visibility methodology. 
            See how we get businesses recommended by ChatGPT, Claude, and Perplexity.
          </p>
        </div>
      </section>

      <section className="section-white border-b border-brand-navy/10" aria-label="Methodology and market context">
        <div className="container-content max-w-3xl mx-auto">
          <p className="text-muted text-lg leading-relaxed mb-6">
            The work behind these results is not guesswork. We draw on large-scale technical audits
            of real sites in the wild — for example,{' '}
            <Link
              href="/blog/we-audited-500-personal-injury-law-firm-websites"
              className="text-brand-gold hover:underline"
            >
              our 500-firm audit of personal injury law websites
            </Link>
            , which shows how small structural issues repeat across an entire sector until someone
            fixes the foundation.
          </p>
          <p className="text-muted text-lg leading-relaxed">
            We also track how UK agencies and in-house teams compare in AI visibility, which is why
            we publish{' '}
            <Link href="/blog/2026-uk-ai-visibility-index" className="text-brand-gold hover:underline">
              the 2026 UK AI Visibility Index
            </Link>
            — a market snapshot, not a league table for its own sake, but context for what
            &quot;good&quot; looks like in 2026.
          </p>
        </div>
      </section>

      {/* Case Studies Grid + sector chips */}
      <section className="section-white">
        <CaseStudyListWithFilters caseStudies={caseStudies} />
      </section>
    </>
  );
}
