import { Metadata } from 'next';
import {
  generateLandingPageSchema,
  generateServiceChannels,
  schemaStandardTierServiceOffers,
} from '@/lib/schema';
import { getAlternates } from '@/lib/hreflang-map';
import { JsonLd } from '@/components/JsonLd';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/generative-engine-optimisation`;

export const metadata: Metadata = {
  title: 'Generative Engine Optimisation Agency | ScopeSite',
  description: 'Generative engine optimisation for UK businesses: website evidence, technical repairs and separate checks of assistant answers. Explore the current scanner.',
  keywords: ['generative engine optimisation', 'generative engine optimisation agency', 'geo agency', 'generative engine optimisation services', 'what is generative engine optimisation'],
  openGraph: {
    title: 'Generative Engine Optimisation Agency | ScopeSite',
    description: 'Generative engine optimisation for UK businesses: website evidence, technical repairs and separate checks of assistant answers. Explore the current scanner.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite Generative Engine Optimisation',
},
    ],
},
  twitter: {
    card: 'summary_large_image',
    title: 'Generative Engine Optimisation Agency | ScopeSite',
    description: 'Generative engine optimisation for UK businesses: website evidence, technical repairs and separate checks of assistant answers. Explore the current scanner.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
  alternates: getAlternates('/generative-engine-optimisation', BASE_URL),
};

// FAQ data for schema

// Generate page schema
const pageSchema = generateLandingPageSchema(
  PAGE_URL,
  'Generative Engine Optimisation',
  'Generative Engine Optimisation Agency | ScopeSite',
  'Generative engine optimisation for UK businesses: website evidence, technical repairs and separate checks of assistant answers. Explore the current scanner.',
  faqs,
  {
    name: 'Generative Engine Optimisation',
    alternateNames: ['GEO', 'GEO Agency', 'Generative Engine Optimization', 'Generative Engine Optimisation Agency'],
    description: 'Generative engine optimisation services to get your business cited by ChatGPT, Claude, Gemini and Perplexity.',
},
  undefined,
  {
    isRelatedTo: [
      { '@id': `${BASE_URL}/ai-seo-agency/#service` },
      { '@id': `${BASE_URL}/ai-seo-services/#service` },
      { '@id': `${BASE_URL}/answer-engine-optimisation/#service` },
      { '@id': `${BASE_URL}/ai-visibility/#service` },
    ],
    availableChannel: generateServiceChannels(),
    serviceType: 'Generative engine optimisation',
    category: 'Search engine optimisation',
    offers: schemaStandardTierServiceOffers(PAGE_URL),
},
  ['h1', '.hero-description', '.faq-answer', 'h3']
);

export default function GenerativeEngineOptimisationLayout({
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
