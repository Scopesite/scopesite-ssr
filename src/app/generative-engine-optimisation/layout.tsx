import { Metadata } from 'next';
import { generateLandingPageSchema, generateServiceChannels, type FAQItem } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/generative-engine-optimisation`;

export const metadata: Metadata = {
  title: 'Generative Engine Optimisation Agency | ScopeSite',
  description: 'Generative engine optimisation agency getting UK businesses cited by ChatGPT, Claude, Gemini and Perplexity. V.O.I.C.E. methodology. Start with a free scan.',
  keywords: ['generative engine optimisation', 'generative engine optimisation agency', 'geo agency', 'generative engine optimisation services', 'what is generative engine optimisation'],
  openGraph: {
    title: 'Generative Engine Optimisation Agency | ScopeSite',
    description: 'Generative engine optimisation agency getting UK businesses cited by ChatGPT, Claude, Gemini and Perplexity. V.O.I.C.E. methodology. Start with a free scan.',
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
    description: 'Generative engine optimisation agency getting UK businesses cited by ChatGPT, Claude, Gemini and Perplexity. V.O.I.C.E. methodology. Start with a free scan.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data for schema
const faqs: FAQItem[] = [
  {
    question: "What is generative engine optimisation?",
    answer: "Generative engine optimisation is the practice of structuring your website, schema and content so that generative AI models (ChatGPT, Claude, Gemini and Perplexity) cite your business when someone asks a question in your field. Traditional SEO targets a list of ten blue links. GEO targets the one or two sources the model actually names in its answer."
  },
  {
    question: "What is the difference between GEO and SEO?",
    answer: "SEO fights for ranking on a search engine results page. GEO fights to be a citation inside a generative AI answer. SEO cares about keywords, backlinks and click-through rate. GEO cares about structured data, entity relationships, server-rendered HTML and whether the model can extract a clean fact from your page in the first place."
  },
  {
    question: "What is the difference between GEO and AEO?",
    answer: "AEO (answer engine optimisation) is about being the single extracted answer to a specific question. GEO (generative engine optimisation) is broader, covering every technical and content signal that influences whether a generative model trusts and cites your brand. In practice the two overlap heavily, and most agency briefs use the terms interchangeably."
  },
  {
    question: "How do AI models decide which businesses to recommend?",
    answer: "Generative models blend training data, real-time retrieval and entity confidence scoring. If your business is an established entity in Wikidata and the Google Knowledge Graph, has deep JSON-LD schema and is reachable via server-rendered HTML, you are more likely to be cited. If your site is a JavaScript shell with no structured data, the model has nothing to work with and picks a competitor."
  },
  {
    question: "Do I need GEO if I already have SEO?",
    answer: "Yes. Strong SEO gives you clicks from Google traditional results, but it does not guarantee a single citation inside ChatGPT, Gemini, Claude or Perplexity. Those platforms rank by entity confidence and extraction quality, not keyword density. GEO adds the structured data, content architecture and crawler access that AI models specifically require."
  },
  {
    question: "Which AI platforms does generative engine optimisation target?",
    answer: "ChatGPT (OpenAI), Claude (Anthropic), Perplexity, Gemini (Google) and Google AI Overviews are the five platforms that matter for UK businesses in 2026. The same structured data signals also help with voice search on Siri and Alexa, so the work carries over."
  },
  {
    question: "How long does generative engine optimisation take to work?",
    answer: "Perplexity typically starts citing correctly structured sources within 2 to 4 weeks. ChatGPT and Claude usually take 6 to 12 weeks as their retrieval layers pick up your new schema. Persistent citations, where the model names your business by default in a category, take 3 to 6 months depending on your starting authority."
  },
  {
    question: "How much does a generative engine optimisation agency cost?",
    answer: "Our GEO retainers start at £750 per month, covering ongoing schema maintenance, entity work, citation tracking and monthly reporting. A full AI-first website rebuild, if your current site blocks AI crawlers, starts at £2,625 as a one-off. The quote calculator at /pricing gives you an exact figure."
  }
];

// Generate page schema
const pageSchema = generateLandingPageSchema(
  PAGE_URL,
  'Generative Engine Optimisation',
  'Generative Engine Optimisation Agency | ScopeSite',
  'Generative engine optimisation agency getting UK businesses cited by ChatGPT, Claude, Gemini and Perplexity. V.O.I.C.E. methodology. Start with a free scan.',
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
