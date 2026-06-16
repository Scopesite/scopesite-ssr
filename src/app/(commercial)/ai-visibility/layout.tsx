import { Metadata } from 'next';
import { generateLandingPageSchema, generateServiceChannels, type FAQItem } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

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
const faqs: FAQItem[] = [
  {
    question: 'What is AI visibility?',
    answer:
      'AI visibility is how well AI platforms understand, cite, and recommend your business. When someone asks ChatGPT or Perplexity for help in your market, your AI visibility decides if you are part of the answer.',
  },
  {
    question: 'How do I check if AI can find my business?',
    answer:
      'You can ask ChatGPT or Perplexity manual questions, but the reliable baseline is our free AI visibility scan. It tests multiple platforms and lists the technical blocks that stop recommendations.',
  },
  {
    question: 'Why is my website not showing up in ChatGPT?',
    answer:
      'Often the site loads content with JavaScript after the page shell. AI crawlers may skip that step and see a blank page. Missing structured data, weak entity signals, or blocked crawlers are the other usual causes.',
  },
  {
    question: 'What does the AI visibility scan do?',
    answer:
      'It shows how major AI engines describe you today, checks structured data, verifies crawler access, and benchmarks you against competitors.',
  },
  {
    question: 'Does AI visibility replace SEO?',
    answer:
      'No. Classic SEO targets rankings. AI visibility targets citations inside AI answers. The same technical work, fast HTML plus structured facts, helps both.',
  },
  {
    question: 'Which AI platforms matter?',
    answer:
      'ChatGPT, Claude, Perplexity, and Gemini matter most. Google AI Overviews matter because AI sits inside normal search. Voice assistants benefit from the same structured facts.',
  },
  {
    question: 'How long does it take to become AI visible?',
    answer:
      'After an Ultra Fast architecture with structured data and crawler access, we often see early Perplexity citations in 2 to 4 weeks. ChatGPT and Claude usually need 6 to 12 weeks as trust builds.',
  },
  {
    question: 'What is LLM visibility?',
    answer:
      'It is another name for AI visibility. It focuses on how large language models represent you in retrieval and answers.',
  },
  {
    question: 'Can I track AI visibility over time?',
    answer:
      'Yes. On retainers we monitor citations, schema health, crawler access, and reporting monthly. Standalone AI SEO is £750 setup and £500 per month on a 6- or 12-month commitment.',
  },
];

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
