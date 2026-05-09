import { Metadata } from 'next';
import {
  generateLandingPageSchema,
  generateServiceChannels,
  type FAQItem,
  schemaStandardTierServiceOffers,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/ai-seo-agency`;

export const metadata: Metadata = {
  title: 'AI SEO Agency UK | ScopeSite',
  description: 'UK AI SEO agency that gets your business recommended by ChatGPT, Claude, Gemini and Perplexity. Not just ranked. Recommended.',
  keywords: ['ai seo agency', 'ai seo company', 'seo ai agency', 'ai search optimisation'],
  openGraph: {
    title: 'AI SEO Agency UK | ScopeSite Digital Studios',
    description: 'UK AI SEO agency that gets your business recommended by ChatGPT, Claude, Gemini and Perplexity. Not just ranked. Recommended.',
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
    description: 'UK AI SEO agency that gets your business recommended by ChatGPT, Claude, Gemini and Perplexity.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data for schema
const faqs: FAQItem[] = [
  {
    question: "What is an AI SEO agency?",
    answer: "An AI SEO agency specialises in making your business visible to artificial intelligence platforms like ChatGPT, Claude, Perplexity, and Gemini. Instead of just trying to rank you on Google's traditional search results, we engineer your website's architecture, structured data, and content so that AI models extract it, understand it, and recommend your business to users."
  },
  {
    question: "How is AI SEO different from traditional SEO?",
    answer: "Traditional SEO focuses on keywords, backlinks, and climbing a list of blue links on Google. AI SEO (or Answer Engine Optimisation) focuses on being the single cited answer when someone asks an AI assistant a question. AI platforms don't care about your keyword density; they care about clear entity relationships, comprehensive schema markup, and server-side rendered content they can easily read."
  },
  {
    question: "Can my current website be optimised for AI search?",
    answer: "It depends on how it's built. If your site relies heavily on client-side JavaScript (like many Wix or basic React sites), AI crawlers like GPTBot might see a blank page. We start with a V.O.I.C.E. scan to see what AI currently sees. In many cases, we need to implement server-side rendering (SSR) and rebuild your schema architecture to make you visible."
  },
  {
    question: "How long does it take to appear in AI recommendations?",
    answer: "Unlike traditional SEO which can take 6-12 months, AI platforms often ingest new structured data and content much faster. We typically see clients appearing in Perplexity citations within 2-4 weeks, and becoming consistent recommendations in ChatGPT within 6-12 weeks, depending on the industry and current authority."
  },
  {
    question: "Do you work with businesses outside Somerset?",
    answer: "Yes. While we are based in Frome, Somerset, we work with professional services, clinics, and e-commerce businesses across the UK. AI visibility is a national and global game, and our methodology works regardless of your location."
  },
  {
    question: "What does AI SEO cost?",
    answer:
      'Our standard AI SEO retainer is £500 per month with a £750 one-time setup. New AI-first website projects are priced separately — use the instant quote calculator on our pricing page.',
  },
  {
    question: "How do you measure AI SEO results?",
    answer: "We don't just track Google rankings. We track direct AI citations, brand mentions in LLM outputs, schema validation scores, and AI crawler access logs. We use our proprietary V.O.I.C.E. scanner to benchmark your visibility across ChatGPT, Claude, Gemini, and Perplexity over time."
  },
  {
    question: "What AI platforms do you optimise for?",
    answer: "We optimise for the major generative engines: ChatGPT (OpenAI), Claude (Anthropic), Perplexity, Gemini (Google), and Google's AI Overviews (SGE). By focusing on universal structured data standards and clean server-side HTML, our optimisations also cover voice assistants like Siri and Alexa."
  }
];

// Generate page schema
const pageSchema = generateLandingPageSchema(
  PAGE_URL,
  'AI SEO Agency',
  'AI SEO Agency UK | ScopeSite Digital Studios',
  'UK AI SEO agency that gets your business recommended by ChatGPT, Claude, Gemini and Perplexity. Not just ranked. Recommended.',
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
