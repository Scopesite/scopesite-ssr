import { Metadata } from 'next';
import {
  generateLandingPageSchema,
  generateServiceChannels,
  schemaStandardTierServiceOffers,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/ai-seo-agency`;

export const metadata: Metadata = {
  title: 'AI SEO Agency UK | ScopeSite',
  description: 'UK AI SEO agency checking website access, structured data and real citations across relevant search and AI services.',
  keywords: ['ai seo agency', 'ai seo company', 'seo ai agency', 'ai search optimisation'],
  openGraph: {
    title: 'AI SEO Agency UK | ScopeSite Digital Studios',
    description: 'UK AI SEO agency checking website access, structured data and real citations across relevant search and AI services.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite AI SEO Agency',
},
    ],
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'AI SEO Agency UK | ScopeSite',
    description: 'UK AI SEO agency checking website access, structured data and real AI citations.',
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
  'AI SEO Agency',
  'AI SEO Agency UK | ScopeSite Digital Studios',
  'UK AI SEO agency checking website access, structured data and real citations across relevant search and AI services.',
  faqs,
  {
    name: 'AI SEO Agency',
    alternateNames: ['AI Search Optimisation Agency', 'ChatGPT SEO Agency', 'AI SEO Company'],
    description: 'Specialist AI SEO agency helping UK businesses become visible to ChatGPT, Claude, Perplexity and Gemini.',
},
  undefined,
  {
    isRelatedTo: [
      { '@id': `${BASE_URL}/ai-seo-services/#service` },
      { '@id': `${BASE_URL}/answer-engine-optimisation/#service` },
      { '@id': `${BASE_URL}/ai-visibility/#service` },
      { '@id': `${BASE_URL}/generative-engine-optimisation/#service` },
    ],
    availableChannel: generateServiceChannels(),
    serviceType: 'AI SEO agency',
    category: 'Search engine optimisation',
    offers: schemaStandardTierServiceOffers(PAGE_URL),
},
  ['h1', '.hero-description', '.faq-answer', 'h3']
);

export default function AISEOAgencyLayout({
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
