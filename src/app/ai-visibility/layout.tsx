import { Metadata } from 'next';
import { generateLandingPageSchema, generateServiceChannels, type FAQItem } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/ai-visibility`;

export const metadata: Metadata = {
  title: 'AI Visibility Agency UK | ScopeSite',
  description: 'AI visibility agency that makes your business visible to ChatGPT, Claude, Gemini and Perplexity. Scanner, audit, and optimisation. V.O.I.C.E. methodology.',
  keywords: ['ai visibility', 'llm visibility', 'llm visibility tool', 'llm visibility tracking'],
  openGraph: {
    title: 'AI Visibility Agency UK | ScopeSite Digital Studios',
    description: 'AI visibility agency that makes your business visible to ChatGPT, Claude, Gemini and Perplexity. Scanner, audit, and optimisation. V.O.I.C.E. methodology.',
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
    title: 'AI Visibility Agency UK | ScopeSite Digital Studios',
    description: 'AI visibility agency that makes your business visible to ChatGPT, Claude, Gemini and Perplexity. Scanner, audit, and optimisation.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data for schema
const faqs: FAQItem[] = [
  {
    question: "What is AI visibility?",
    answer: "AI visibility is the measure of how well your business is understood, cited, and recommended by artificial intelligence platforms like ChatGPT, Claude, Perplexity, and Gemini. If a potential customer asks an AI assistant for a recommendation in your industry, your AI visibility determines whether your business is the answer."
  },
  {
    question: "How do I check if AI can find my business?",
    answer: "You can manually test by asking ChatGPT or Perplexity questions related to your services. However, for a systematic and objective baseline, we use our proprietary V.O.I.C.E. scanner. This tool tests your visibility across multiple AI platforms and identifies technical blockers preventing you from being recommended."
  },
  {
    question: "Why is my website not showing up in ChatGPT?",
    answer: "The most common reason is client-side rendering (CSR). If your website uses JavaScript to load content (common in Wix, Squarespace, and basic React sites), AI crawlers like GPTBot often see a blank page. Other reasons include missing JSON-LD schema markup, poor entity relationships, or robots.txt files that accidentally block AI crawlers."
  },
  {
    question: "What is the V.O.I.C.E. scanner?",
    answer: "The V.O.I.C.E. scanner is our proprietary diagnostic tool that tests your business's AI visibility. It checks how major generative engines currently describe your business, analyses your schema markup, verifies AI crawler access, and benchmarks your visibility against competitors."
  },
  {
    question: "Does AI visibility replace SEO?",
    answer: "No, AI visibility and traditional SEO complement each other. While SEO focuses on ranking in Google's traditional search results, AI visibility focuses on being the cited answer in AI platforms. The technical foundation required for AI visibility (fast server-side rendering, comprehensive schema) also heavily benefits traditional SEO."
  },
  {
    question: "Which AI platforms matter for my business?",
    answer: "The 'Big Four' generative engines matter most: ChatGPT (OpenAI), Claude (Anthropic), Perplexity, and Gemini (Google). Additionally, Google's AI Overviews (SGE) are crucial as they integrate AI directly into traditional search results. Optimising for these platforms also improves visibility on voice assistants like Siri and Alexa."
  },
  {
    question: "How long does it take to become AI visible?",
    answer: "Once we implement an AI-first architecture with proper schema and crawler access, we typically see initial citations in Perplexity within 2-4 weeks. Consistent recommendations in ChatGPT and Claude usually take 6-12 weeks as the models update their underlying data and entity confidence grows."
  },
  {
    question: "What is LLM visibility?",
    answer: "LLM (Large Language Model) visibility is another term for AI visibility. It refers specifically to how well your business is represented in the training data and real-time retrieval systems of models like GPT-4, Claude 3.5, and Gemini Pro."
  },
  {
    question: "Can I track my AI visibility over time?",
    answer: "Yes. As part of our AI visibility retainers, we provide ongoing monitoring and reporting. We track direct AI citations, brand mentions in LLM outputs, schema validation scores, and AI crawler access logs to ensure your visibility continues to grow."
  }
];

// Generate page schema
const pageSchema = generateLandingPageSchema(
  PAGE_URL,
  'AI Visibility',
  'AI Visibility Agency UK | ScopeSite Digital Studios',
  'AI visibility agency that makes your business visible to ChatGPT, Claude, Gemini and Perplexity. Scanner, audit, and optimisation. V.O.I.C.E. methodology.',
  faqs,
  {
    name: 'AI Visibility',
    alternateNames: ['LLM Visibility', 'AI Visibility Optimisation'],
    description: 'AI visibility services to get your business recommended by ChatGPT, Claude, Gemini and Perplexity.',
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
