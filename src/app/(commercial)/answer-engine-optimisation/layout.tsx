import { Metadata } from 'next';
import {
  generateLandingPageSchema,
  generateServiceChannels,
  schemaStandardTierServiceOffers,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/answer-engine-optimisation`;

const PAGE_TITLE = 'AEO Agency UK | Answer Engine Optimisation Services';
const PAGE_DESCRIPTION =
  'Answer engine optimisation services to get your business cited by ChatGPT, Claude, Gemini and Perplexity. UK AEO agency with structured data, SSR, and entity-led content.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: ['answer engine optimisation', 'aeo agency', 'aeo agency uk', 'answer engine optimisation services', 'what is answer engine optimisation'],
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite Answer Engine Optimisation',
},
    ],
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
  alternates: {
    canonical: PAGE_URL,
},
};

// FAQ data for schema

// Generate page schema
const pageSchema = generateLandingPageSchema(
  PAGE_URL,
  'Answer Engine Optimisation',
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  faqs,
  {
    name: 'Answer Engine Optimisation',
    alternateNames: ['AEO', 'AEO Agency', 'Generative Engine Optimisation'],
    description: 'Answer Engine Optimisation (AEO) services to get your business cited by AI platforms.',
},
  undefined,
  {
    isRelatedTo: [
      { '@id': `${BASE_URL}/ai-seo-agency/#service` },
      { '@id': `${BASE_URL}/ai-seo-services/#service` },
      { '@id': `${BASE_URL}/ai-visibility/#service` },
      { '@id': `${BASE_URL}/generative-engine-optimisation/#service` },
    ],
    availableChannel: generateServiceChannels(),
    serviceType: 'Answer engine optimisation',
    category: 'Search engine optimisation',
    offers: schemaStandardTierServiceOffers(PAGE_URL),
},
  ['h1', '.hero-description', '.faq-answer', 'h3']
);

export default function AEOLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd schema={pageSchema} />
      {children}
    </>
  );
}
