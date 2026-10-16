import { Metadata } from 'next';
import { generateLandingPageSchema, generateServiceChannels,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/ai-visibility`;

const PAGE_TITLE = 'AI Visibility Agency UK | Get Cited by ChatGPT and Google AI';
const PAGE_DESCRIPTION =
  'AI visibility agency for UK businesses that want ChatGPT, Claude, Gemini and Perplexity to recommend them. Free scan, audits, structured data, and retainers from £750 setup and £500 per month.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: ['ai visibility agency', 'ai visibility', 'llm visibility', 'llm visibility tool', 'llm visibility tracking'],
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite AI Visibility',
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
  'AI Visibility',
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  faqs,
  {
    name: 'AI Visibility',
    alternateNames: ['LLM Visibility', 'AI Visibility Optimisation'],
    description:
      'AI visibility services to get your business recommended by ChatGPT, Claude, Gemini, and Perplexity.',
},
  undefined,
  {
    isRelatedTo: [
      { '@id': `${BASE_URL}/ai-seo-agency/#service` },
      { '@id': `${BASE_URL}/ai-seo-services/#service` },
      { '@id': `${BASE_URL}/answer-engine-optimisation/#service` },
      { '@id': `${BASE_URL}/generative-engine-optimisation/#service` },
    ],
    availableChannel: generateServiceChannels(),
    serviceType: 'AI visibility',
    category: 'Search engine optimisation',
},
  ['h1', '.hero-description', '.faq-answer', 'h3']
);

export default function AIVisibilityLayout({
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
