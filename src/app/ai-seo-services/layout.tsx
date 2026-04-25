import { Metadata } from 'next';
import { generateLandingPageSchema, generateServiceChannels, type FAQItem } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/ai-seo-services`;

export const metadata: Metadata = {
  title: 'AI SEO Services UK | Get Recommended by AI | ScopeSite',
  description: 'AI SEO services that make your business visible to ChatGPT, Claude, Gemini and Perplexity. SSR builds, schema engineering, entity optimisation.',
  keywords: ['ai seo services', 'ai seo software', 'ai search optimisation services'],
  openGraph: {
    title: 'AI SEO Services UK | Get Recommended by AI | ScopeSite',
    description: 'AI SEO services that make your business visible to ChatGPT, Claude, Gemini and Perplexity. SSR builds, schema engineering, entity optimisation.',
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
    description: 'AI SEO services that make your business visible to ChatGPT, Claude, Gemini and Perplexity.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data for schema
const faqs: FAQItem[] = [
  {
    question: "What AI SEO services do you offer?",
    answer: "We offer a comprehensive suite of AI SEO services including V.O.I.C.E. AI visibility audits, AI-first website builds using server-side rendering (SSR), JSON-LD schema engineering, entity building across Knowledge Graphs, content architecture for AI extraction, and AI crawler configuration (robots.txt, llms.txt, ai-context.json)."
  },
  {
    question: "Do I need a new website for AI SEO?",
    answer: "Not always, but often yes. If your current website relies heavily on client-side JavaScript (like many Wix, Squarespace, or basic React sites), AI crawlers cannot read your content. In these cases, an AI-first website build using Next.js SSR is required. If your site is already server-side rendered, we can often implement schema and content architecture over the top."
  },
  {
    question: "What is a V.O.I.C.E. audit?",
    answer: "A V.O.I.C.E. audit is our proprietary diagnostic scan that tests your business's visibility across 4 major AI platforms: ChatGPT, Claude, Gemini, and Perplexity. It identifies whether AI can see you, how it describes you, and what technical blockers are preventing you from being recommended."
  },
  {
    question: "How does schema markup help AI find my business?",
    answer: "Schema markup (JSON-LD) is the structured data language that AI platforms use to understand facts about your business. Instead of forcing AI to guess what your website is about by reading paragraphs of text, schema explicitly states your services, prices, location, and credentials in a machine-readable format."
  },
  {
    question: "What is entity building and why does it matter?",
    answer: "Entity building is the process of establishing your business as a recognised 'thing' (entity) in databases like Wikidata and the Google Knowledge Graph. AI models rely on these entity databases to verify facts. If you aren't an established entity, AI is less likely to trust and recommend you."
  },
  {
    question: "Can you optimise my existing Wix/WordPress/Squarespace site for AI?",
    answer: "We can implement basic schema and content changes on WordPress, but platforms like Wix and Squarespace are fundamentally limited for true AI SEO because of how they render code and restrict server access. For serious AI visibility, we strongly recommend a custom SSR build."
  },
  {
    question: "What is an AI visibility retainer?",
    answer: "An AI visibility retainer is our ongoing service where we monitor your AI citations, update your schema as your business changes, add new content structured for AI extraction, and adapt to the rapidly changing algorithms of ChatGPT, Claude, and Perplexity."
  },
  {
    question: "How quickly will I see results from AI SEO services?",
    answer: "Once an AI-first website is launched with proper schema and crawler access, we typically see initial citations in Perplexity within 2-4 weeks. Consistent recommendations in ChatGPT and Claude usually take 6-12 weeks as the models update their underlying data and entity confidence grows."
  }
];

// Generate page schema
const pageSchema = generateLandingPageSchema(
  PAGE_URL,
  'AI SEO Services',
  'AI SEO Services UK | Get Recommended by AI | ScopeSite',
  'AI SEO services that make your business visible to ChatGPT, Claude, Gemini and Perplexity. SSR builds, schema engineering, entity optimisation.',
  faqs,
  {
    name: 'AI SEO Services',
    alternateNames: ['AI Search Optimisation Services', 'AI SEO Software'],
    description: 'Comprehensive AI SEO services including SSR website builds, schema engineering, and entity optimisation.',
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
      {children}
    </>
  );
}
