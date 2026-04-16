import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema, generateWebPageSchema } from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/case-studies/h4tlt`;

export const metadata: Metadata = {
  title: 'Case Study: H4TLT | From Invisible to National #1 in 4 Months | V.O.I.C.E.™ | ScopeSite',
  description:
    'How V.O.I.C.E.™ methodology took a Somerset audiologist from 7 visitors/week to nationally recommended by Google AI Overview, ChatGPT and Perplexity. No ad spend. No backlinks.',
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
    title: 'Case Study: H4TLT | From Invisible to National #1 in 4 Months | V.O.I.C.E.™ | ScopeSite',
    description:
      'How V.O.I.C.E.™ methodology took a Somerset audiologist from 7 visitors/week to nationally recommended by Google AI Overview, ChatGPT and Perplexity. No ad spend. No backlinks.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-case-study-h4tlt.png`,
        width: 1200,
        height: 630,
        alt: 'H4TLT Case Study - AI Visibility Results with V.O.I.C.E.™ Methodology',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Study: H4TLT | From Invisible to National #1 in 4 Months | V.O.I.C.E.™ | ScopeSite',
    description:
      'How V.O.I.C.E.™ methodology took a Somerset audiologist from 7 visitors/week to nationally recommended by Google AI Overview, ChatGPT and Perplexity. No ad spend. No backlinks.',
    images: [`${BASE_URL}/images/og/og-case-study-h4tlt.png`],
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
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${PAGE_URL}#article`,
    headline: 'From Invisible to National #1 in 4 Months: H4TLT Case Study',
    description: 'How V.O.I.C.E. methodology took a Somerset audiologist from zero AI visibility to being recommended nationally by Google AI Overview, ChatGPT and Perplexity in 4 months.',
    author: {
      '@type': 'Person',
      name: 'Dan Cartwright',
      url: `${BASE_URL}/about`
    },
    publisher: {
      '@type': 'Organization',
      name: 'ScopeSite Digital Studios',
      '@id': `${BASE_URL}/#organization`
    },
    datePublished: '2026-01-15',
    dateModified: '2026-04-16',
    about: {
      '@type': 'Service',
      name: 'V.O.I.C.E. AI Visibility Methodology',
      provider: {
        '@type': 'Organization',
        name: 'ScopeSite Digital Studios'
      }
    },
    mentions: [
      {
        '@type': 'Organization',
        name: 'Hear 4 The Long Term',
        url: 'https://hear4thelongterm.co.uk'
      }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How long did it take for H4TLT to appear in AI recommendations?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The website went live on 1 January 2026. By April 2026, H4TLT was being recommended nationally by Google AI Overview, ChatGPT and Perplexity across multiple search queries.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the V.O.I.C.E. methodology?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'V.O.I.C.E. stands for Visibility, Optimisation, for Intelligent, Crawler, Engines. It is a research-backed methodology developed by ScopeSite Digital Studios for making businesses visible to AI assistants like ChatGPT, Claude, Gemini and Perplexity.'
        }
      },
      {
        '@type': 'Question',
        name: 'Does AI visibility work for small businesses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'H4TLT is a single-operator audiology business. Within 4 months of implementing V.O.I.C.E., it was recommended nationally alongside firms that have operated for decades with significantly larger marketing budgets. The methodology is designed to level the playing field.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does AI visibility optimisation cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The H4TLT project was delivered for under £5,000 including website build, schema implementation, entity building, and content architecture. Start with a free V.O.I.C.E. scan at voice.scopesite.co.uk to see where your site currently stands.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is AI visibility the same as SEO?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. AI platforms use different crawlers, different ranking signals, and different citation logic to traditional search engines. The Princeton GEO paper (2024) found that traditional SEO techniques like keyword stuffing performed 10% worse on AI platforms than doing nothing. AI visibility requires a distinct methodology.'
        }
      }
    ]
  };

  const webPageSchema = {
    ...generateWebPageSchema(
      'Case Study: H4TLT | From Invisible to National #1 in 4 Months | V.O.I.C.E.™ | ScopeSite',
      'How V.O.I.C.E.™ methodology took a Somerset audiologist from 7 visitors/week to nationally recommended by Google AI Overview, ChatGPT and Perplexity. No ad spend. No backlinks.',
      PAGE_URL
    ),
    mainEntity: { '@id': `${PAGE_URL}#article` },
  };

  return (
    <>
      <JsonLd schema={[webPageSchema, breadcrumbSchema, caseStudySchema, faqSchema]} />
      {children}
    </>
  );
}
