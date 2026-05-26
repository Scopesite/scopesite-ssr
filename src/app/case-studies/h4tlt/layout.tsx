import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/case-studies/h4tlt`;

export const metadata: Metadata = {
  title: 'H4TLT: Invisible to #1 AI Pick in 4 Months | ScopeSite',
  description:
    'How AI visibility methodology took a Somerset audiologist from 7 visitors a week to nationally cited by Google AI Overview, ChatGPT and Perplexity.',
  keywords: [
    'case study',
    'AI visibility methodology',
    'AI visibility',
    'answer engine optimisation',
    'hearing compliance',
    'ChatGPT recommendations',
    'AI SEO case study',
  ],
  openGraph: {
    title: 'H4TLT: Invisible to #1 AI Pick in 4 Months | ScopeSite',
    description:
      'How AI visibility methodology took a Somerset audiologist from 7 visitors a week to nationally cited by Google AI Overview, ChatGPT and Perplexity.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-case-study-h4tlt.png`,
        width: 1200,
        height: 630,
        alt: 'H4TLT Case Study - AI Visibility Results with AI visibility Methodology',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'H4TLT: Invisible to #1 AI Pick in 4 Months | ScopeSite',
    description:
      'How AI visibility methodology took a Somerset audiologist from 7 visitors a week to nationally cited by Google AI Overview, ChatGPT and Perplexity.',
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

  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://scopesite.co.uk/#organization',
        name: 'ScopeSite Digital Studios',
        url: 'https://scopesite.co.uk',
        logo: {
          '@type': 'ImageObject',
          url: 'https://scopesite.co.uk/images/logo-icon.svg'
        },
        description: 'Veteran-owned web design and AI visibility agency',
        foundingDate: '2024',
        founder: { '@id': 'https://scopesite.co.uk/#dan-cartwright' },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Beckington, Frome',
          addressRegion: 'Somerset',
          postalCode: 'BA11',
          addressCountry: 'UK'
        },
        telephone: '01373 311339',
        email: 'support@scopesite.co.uk',
        sameAs: [
          // TEMP REMOVED 2026-04-18: Wikidata entity Q138866631 deleted 6 April 2026 (spam/advertising). Awaiting admin review. Restore if entity is reinstated.
          // 'https://www.wikidata.org/wiki/Q138866631',
          'https://find-and-update.company-information.service.gov.uk/company/16130355'
        ]
      },
      {
        '@type': 'Person',
        '@id': 'https://scopesite.co.uk/#dan-cartwright',
        name: 'Dan Cartwright',
        jobTitle: 'Founder',
        worksFor: { '@id': 'https://scopesite.co.uk/#organization' },
        url: 'https://scopesite.co.uk/about'
      },
      {
        '@type': 'Organization',
        '@id': 'https://hear4thelongterm.co.uk/#organization',
        name: 'Hear 4 The Long Term',
        url: 'https://hear4thelongterm.co.uk',
        founder: {
          '@type': 'Person',
          '@id': 'https://hear4thelongterm.co.uk/#mark-ashmore',
          name: 'Mark Ashmore',
          jobTitle: 'Registered Audiologist',
          hasCredential: {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Registered Audiologist'
          }
        },
        address: {
          '@type': 'PostalAddress',
          addressRegion: 'Somerset',
          addressCountry: 'UK'
        }
      },
      {
        '@type': 'Service',
        '@id': 'https://scopesite.co.uk/case-studies/h4tlt/#methodology-service',
        name: 'AI visibility Methodology',
        alternateName: 'Visibility, Optimisation, for Intelligent, Crawler, Engines',
        provider: { '@id': 'https://scopesite.co.uk/#organization' },
        description: 'Answer Engine Optimisation methodology for AI visibility',
        url: 'https://scopesite.co.uk/voice',
      },
      {
        '@type': 'ScholarlyArticle',
        '@id': 'https://doi.org/10.61841/xt3he524',
        name: 'The Impact of JSON-LD Metadata on ChatGPT Visibility',
        author: [{ '@type': 'Person', name: 'P. Schanbacher' }],
        datePublished: '2026'
      },
      {
        '@type': 'ScholarlyArticle',
        '@id': 'https://doi.org/10.1145/3637528.3671900',
        name: 'GEO: Generative Engine Optimization',
        author: [{ '@type': 'Person', name: 'Aggarwal et al.' }],
        datePublished: '2024'
      },
      {
        '@type': 'WebPage',
        '@id': 'https://scopesite.co.uk/case-studies/h4tlt/#webpage',
        url: 'https://scopesite.co.uk/case-studies/h4tlt',
        name: 'Case Study: H4TLT | From Invisible to National #1 in 4 Months | AI visibility | ScopeSite',
        isPartOf: { '@id': 'https://scopesite.co.uk/#website' },
      },
      {
        '@type': 'Article',
        '@id': 'https://scopesite.co.uk/case-studies/h4tlt/#article',
        isPartOf: { '@id': 'https://scopesite.co.uk/case-studies/h4tlt/#webpage' },
        mainEntityOfPage: { '@id': 'https://scopesite.co.uk/case-studies/h4tlt/#webpage' },
        headline: 'From Invisible to National #1 in 4 Months: H4TLT Case Study',
        description: 'How AI visibility methodology took a Somerset audiologist from zero AI visibility to being recommended nationally by Google AI Overview, ChatGPT and Perplexity in 4 months.',
        author: { '@id': 'https://scopesite.co.uk/#dan-cartwright' },
        publisher: { '@id': 'https://scopesite.co.uk/#organization' },
        datePublished: '2026-01-15T08:00:00+00:00',
        dateModified: '2026-04-16T08:00:00+00:00',
        image: {
          '@type': 'ImageObject',
          url: 'https://scopesite.co.uk/images/og/og-case-study-h4tlt.png'
        },
        about: { '@id': 'https://scopesite.co.uk/#voice-methodology' },
        mentions: [
          { '@id': 'https://hear4thelongterm.co.uk/#organization' },
          { '@id': 'https://scopesite.co.uk/case-studies/h4tlt/#mark-ashmore-review' },
          { '@id': 'https://doi.org/10.61841/xt3he524' },
          { '@id': 'https://doi.org/10.1145/3637528.3671900' }
        ],
        citation: [
          { '@id': 'https://doi.org/10.61841/xt3he524' },
          { '@id': 'https://doi.org/10.1145/3637528.3671900' }
        ]
      },
      {
        '@type': 'Review',
        '@id': 'https://scopesite.co.uk/case-studies/h4tlt/#mark-ashmore-review',
        itemReviewed: { '@id': 'https://scopesite.co.uk/#organization' },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Mark Ashmore',
          honorificSuffix: 'RHAD, MIOA',
          jobTitle: 'Founder',
          worksFor: { '@id': 'https://hear4thelongterm.co.uk/#organization' },
        },
        reviewBody:
          "Proof positive you know what you're at! Excellent result which we can only build on. Well done and thanks. Onwards and upwards!",
        datePublished: '2026-04-14',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://scopesite.co.uk/case-studies/h4tlt/#faq',
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
            name: 'What is the AI visibility methodology?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our AI visibility methodology is a research-backed framework developed by ScopeSite Digital Studios for making businesses visible to AI assistants like ChatGPT, Claude, Gemini and Perplexity.'
            }
          },
          {
            '@type': 'Question',
            name: 'Does AI visibility work for small businesses?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'H4TLT is a single-operator audiology business. Within 4 months of implementing our AI visibility stack, it was recommended nationally alongside firms that have operated for decades with significantly larger marketing budgets. The methodology is designed to level the playing field.'
            }
          },
          {
            '@type': 'Question',
            name: 'How much does AI visibility optimisation cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The H4TLT project combined a full Ultra Fast build, structured data, entity work, and content architecture. Pricing moves with our published calculator; this engagement was scoped under the Ultra Fast ladder at the time. Start with a free AI visibility scan at voice.scopesite.co.uk to see where your site currently stands.'
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
      },
      breadcrumbSchema
    ]
  };

  return (
    <>
      <JsonLd schema={graphSchema} />
      {children}
    </>
  );
}
