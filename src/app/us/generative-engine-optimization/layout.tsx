import { Metadata } from 'next';
import {
  generateWebPageFAQPageSchema,
  generateServiceSchema,
  generateUSLocalBusinessSchema,
  generateBreadcrumbSchema,
  wrapInGraph,
  type FAQItem,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/us/generative-engine-optimization`;

export const metadata: Metadata = {
  title: 'Generative Engine Optimization Agency | ScopeSite US',
  description:
    'Generative engine optimization agency for US businesses. Get cited by ChatGPT, Claude, Gemini and Perplexity. V.O.I.C.E. methodology. Free scan.',
  keywords: [
    'generative engine optimization',
    'generative engine optimization agency',
    'geo agency',
    'generative engine optimization services',
    'what is generative engine optimization',
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      'en-US': PAGE_URL,
      'en-GB': `${BASE_URL}/generative-engine-optimisation`,
      'x-default': `${BASE_URL}/generative-engine-optimisation`,
    },
  },
  openGraph: {
    title: 'Generative Engine Optimization Agency | ScopeSite US',
    description:
      'Generative engine optimization agency for US businesses. Get cited by ChatGPT, Claude, Gemini and Perplexity. V.O.I.C.E. methodology. Free scan.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Generative Engine Optimization Agency - ScopeSite US',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generative Engine Optimization Agency | ScopeSite US',
    description:
      'Generative engine optimization agency for US businesses. Get cited by ChatGPT, Claude, Gemini and Perplexity. V.O.I.C.E. methodology. Free scan.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
};

const faqs: FAQItem[] = [
  {
    question: "What is generative engine optimization?",
    answer: "Generative engine optimization is the practice of structuring your website, schema and content so that generative AI models (ChatGPT, Claude, Gemini and Perplexity) cite your business when someone asks a question in your field. Traditional SEO targets a list of ten blue links. GEO targets the one or two sources the model actually names in its answer."
  },
  {
    question: "What is the difference between GEO and SEO?",
    answer: "SEO fights for ranking on a search engine results page. GEO fights to be a citation inside a generative AI answer. SEO cares about keywords, backlinks and click-through rate. GEO cares about structured data, entity relationships, server-rendered HTML and whether the model can extract a clean fact from your page in the first place."
  },
  {
    question: "What is the difference between GEO and AEO?",
    answer: "AEO (answer engine optimization) is about being the single extracted answer to a specific question. GEO (generative engine optimization) is broader, covering every technical and content signal that influences whether a generative model trusts and cites your brand. In practice the two overlap heavily, and most agency briefs use the terms interchangeably."
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
    question: "Which AI platforms does generative engine optimization target?",
    answer: "ChatGPT (OpenAI), Claude (Anthropic), Perplexity, Gemini (Google) and Google AI Overviews are the five platforms that matter for US businesses in 2026. The same structured data signals also help with voice search on Siri and Alexa, so the work carries over."
  },
  {
    question: "How long does generative engine optimization take to work?",
    answer: "Perplexity typically starts citing correctly structured sources within 2 to 4 weeks. ChatGPT and Claude usually take 6 to 12 weeks as their retrieval layers pick up your new schema. Persistent citations, where the model names your business by default in a category, take 3 to 6 months depending on your starting authority."
  },
  {
    question: "How much does a generative engine optimization agency cost?",
    answer: "Our GEO retainers start at $1,000 per month, covering ongoing schema maintenance, entity work, citation tracking and monthly reporting. A full AI-first website rebuild, if your current site blocks AI crawlers, starts at $3,500 as a one-off. The quote calculator at /us/pricing gives you an exact figure."
  }
];

const webPageSchema = generateWebPageFAQPageSchema(
  PAGE_URL,
  'Generative Engine Optimization',
  'Generative engine optimization agency for US businesses. Get cited by ChatGPT, Claude, Gemini and Perplexity.',
  faqs,
  `${PAGE_URL}/#service`
);

const serviceSchema = {
  ...generateServiceSchema(
    'Generative Engine Optimization for US Businesses',
    'Get cited by ChatGPT, Perplexity, Claude, and Google AI Overviews. We engineer the structured data and content architecture AI needs.',
    PAGE_URL,
    'ProfessionalService'
  ),
  areaServed: { '@type': 'Country', name: 'United States' },
};

const pageSchema = wrapInGraph([
  webPageSchema,
  serviceSchema,
  generateUSLocalBusinessSchema(PAGE_URL),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'United States', url: `${BASE_URL}/us` },
    { name: 'Generative Engine Optimization', url: PAGE_URL },
  ]),
]);

export default function USGenerativeEngineOptimizationLayout({
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
