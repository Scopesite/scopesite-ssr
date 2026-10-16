import { Metadata } from 'next';
import {
  buildAiSearchPerformanceGuaranteeWarrantyPromise,
  generateLandingPageSchema,
  generateServiceChannels,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/ai-seo-services`;

export const metadata: Metadata = {
  title: 'AI SEO Services UK | Get Recommended by AI | ScopeSite',
  description:
    'AI SEO services for ChatGPT, Claude, Gemini, and Perplexity. Ultra Fast builds, structured data, entity signals, and ongoing retainers from £750 setup and £500 per month.',
  keywords: ['ai seo services', 'ai seo software', 'ai search optimisation services'],
  openGraph: {
    title: 'AI SEO Services UK | Get Recommended by AI | ScopeSite',
    description:
      'AI SEO services for ChatGPT, Claude, Gemini, and Perplexity. Ultra Fast sites, structured facts, crawler access, retainers from £750 setup and £500 per month.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite AI SEO Services',
},
    ],
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'AI SEO Services UK | ScopeSite',
    description:
      'AI SEO for ChatGPT, Claude, Gemini, and Perplexity. Ultra Fast builds and structured data.',
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
  'AI SEO Services',
  'AI SEO Services UK | Get Recommended by AI | ScopeSite',
  'AI SEO services for ChatGPT, Claude, Gemini, and Perplexity. Ultra Fast builds, structured data, entity signals, retainers from £750 setup and £500 per month.',
  faqs,
  {
    name: 'AI SEO Services',
    alternateNames: ['AI Search Optimisation Services', 'AI SEO Software'],
    description:
      'AI SEO programmes with Ultra Fast builds, structured data engineering, entity signals, and optional retainers.',
},
  undefined,
  {
    isRelatedTo: [
      { '@id': `${BASE_URL}/ai-seo-agency/#service` },
      { '@id': `${BASE_URL}/answer-engine-optimisation/#service` },
      { '@id': `${BASE_URL}/ai-visibility/#service` },
      { '@id': `${BASE_URL}/generative-engine-optimisation/#service` },
    ],
    availableChannel: generateServiceChannels(),
    serviceType: 'AI SEO',
    category: 'Search engine optimisation',
},
  ['h1', '.hero-description', '.faq-answer', 'h3']
);

export default function AISEOServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd schema={pageSchema} />
      <JsonLd
        schema={{
          '@type': 'Service',
          name: 'AI SEO Retainer',
          provider: {
            '@type': 'Organization',
            name: 'ScopeSite Digital Studios',
            url: BASE_URL,
},
          areaServed: 'United Kingdom',
          description:
            'Performance-driven AI Search Engine Optimization. Be the answer when ChatGPT, Perplexity, Claude, and Google AI Overviews get asked about your sector.',
          offers: {
            '@type': 'Offer',
            priceCurrency: 'GBP',
            price: '500',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '500',
              priceCurrency: 'GBP',
              unitText: 'MONTH',
              referenceQuantity: {
                '@type': 'QuantitativeValue',
                value: '1',
                unitCode: 'MON',
},
},
            description:
              '£750 setup plus £500 per month. 6-month and 12-month commitments. Bundled free with SSR website builds.',
            warranty: buildAiSearchPerformanceGuaranteeWarrantyPromise(),
},
}}
      />
      {children}
    </>
  );
}
