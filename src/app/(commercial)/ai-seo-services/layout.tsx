import { Metadata } from 'next';
import {
  buildAiSearchPerformanceGuaranteeWarrantyPromise,
  generateLandingPageSchema,
  generateServiceChannels,
  type FAQItem,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

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
const faqs: FAQItem[] = [
  {
    question: 'What AI SEO services do you offer?',
    answer:
      'We cover the full stack: AI visibility scans, Ultra Fast website rebuilds when needed, structured data so facts are auto-formatted for AI to read, entity signals, content layout for AI extraction, and crawler access files such as robots.txt, llms.txt, and ai-context.json.',
  },
  {
    question: 'Do I need a new website for AI SEO?',
    answer:
      'Not always. If your site leans on heavy client-side JavaScript, AI crawlers may see an empty page. Then we usually recommend an Ultra Fast rebuild. If your pages already ship full HTML, we can often layer structured data and content fixes on top.',
  },
  {
    question: 'What is an AI visibility scan?',
    answer:
      'It is our diagnostic run across ChatGPT, Claude, Gemini, and Perplexity. You see whether AI can read you, how it describes you, and which technical blocks stop recommendations.',
  },
  {
    question: 'How does structured data help AI find my business?',
    answer:
      'Structured data spells out services, prices, locations, and credentials in a machine-friendly way. That cuts guesswork for AI and search engines.',
  },
  {
    question: 'What is entity building and why does it matter?',
    answer:
      'Entity building is how we strengthen your business as a recognised thing in sources such as Wikidata and the Google Knowledge Graph. Stronger entities mean AI can verify facts instead of guessing.',
  },
  {
    question: 'Can you improve my existing Wix, WordPress, or Squarespace site?',
    answer:
      'We can make limited fixes on WordPress. Wix and Squarespace usually block the server access we need. For serious AI SEO we normally recommend an Ultra Fast build.',
  },
  {
    question: 'What is an AI visibility retainer?',
    answer:
      'It is ongoing AI SEO: we watch citations, refresh structured data, add AI-friendly content, and adjust as models change. Standalone pricing is a £750 setup and £500 per month on a 6- or 12-month commitment.',
  },
  {
    question: 'How quickly will I see results?',
    answer:
      'After an Ultra Fast launch with solid structured data and crawler access, we often see early Perplexity citations in 2 to 4 weeks. ChatGPT and Claude usually need 6 to 12 weeks as confidence builds.',
  },
];

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
