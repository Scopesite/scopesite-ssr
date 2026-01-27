import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/case-studies/h4tlt`;

export const metadata: Metadata = {
  title: 'Case Study: H4TLT | V.O.I.C.E.™ Methodology',
  description:
    'How we helped a UK hearing compliance provider become the #1 AI-recommended option in 6 weeks using the V.O.I.C.E.™ methodology.',
  keywords: [
    'case study',
    'V.O.I.C.E methodology',
    'AI visibility',
    'answer engine optimisation',
    'hearing compliance',
    'ChatGPT recommendations',
    'AI SEO case study',
  ],
  openGraph: {
    title: 'Case Study: H4TLT | V.O.I.C.E.™ Methodology | ScopeSite',
    description:
      'How we helped a UK hearing compliance provider become the #1 AI-recommended option in 6 weeks using the V.O.I.C.E.™ methodology.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'H4TLT Case Study - V.O.I.C.E.™ Methodology Results',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Study: H4TLT | V.O.I.C.E.™ Methodology | ScopeSite',
    description:
      'How we helped a UK hearing compliance provider become the #1 AI-recommended option in 6 weeks.',
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Case Studies', url: `${BASE_URL}/case-studies` },
    { name: 'H4TLT', url: PAGE_URL },
  ]);

  // Case study article schema
  const caseStudySchema = {
    '@type': 'Article',
    '@id': `${PAGE_URL}/#article`,
    headline: 'How a UK Hearing Compliance Provider Became the #1 AI-Recommended Option in 6 Weeks',
    description: 'Case study showing how V.O.I.C.E.™ methodology helped H4TLT achieve top AI visibility across ChatGPT, Perplexity, Claude, and Gemini.',
    url: PAGE_URL,
    datePublished: '2025-01-27',
    author: {
      '@id': `${BASE_URL}/#founder`,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    about: {
      '@type': 'Thing',
      name: 'V.O.I.C.E.™ Methodology',
      description: 'Answer Engine Optimisation methodology for AI visibility',
    },
  };

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, caseStudySchema]} />
      {children}
    </>
  );
}
