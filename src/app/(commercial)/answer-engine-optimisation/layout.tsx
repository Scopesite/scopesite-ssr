import { Metadata } from 'next';
import {
  generateLandingPageSchema,
  generateServiceChannels,
  type FAQItem,
  schemaStandardTierServiceOffers,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/answer-engine-optimisation`;

const PAGE_TITLE = 'AEO Agency UK | Answer Engine Optimisation Services';
const PAGE_DESCRIPTION =
  'Answer engine optimisation services to get your business cited by ChatGPT, Claude, Gemini and Perplexity. UK AEO agency with structured data, SSR, and entity-led content.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: ['answer engine optimisation', 'aeo agency', 'aeo agency uk', 'answer engine optimisation services', 'what is answer engine optimisation'],
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite Answer Engine Optimisation',
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
    question: "What is answer engine optimisation (AEO)?",
    answer: "Answer Engine Optimisation (AEO) is the process of structuring your website and content so that AI-powered answer engines (like ChatGPT, Perplexity, and Claude) can easily extract facts and cite your business as the definitive answer to a user's question, rather than just providing a link to your site."
  },
  {
    question: "How is AEO different from SEO?",
    answer: "Traditional SEO focuses on ranking high in a list of search results using keywords and backlinks. AEO focuses on being the single cited answer. While SEO relies heavily on keyword density and content length, AEO relies on structured data (JSON-LD), clear factual statements, entity relationships, and server-side rendered architecture that AI crawlers can easily digest."
  },
  {
    question: "What is the difference between AEO and GEO?",
    answer: "AEO (Answer Engine Optimisation) and GEO (Generative Engine Optimisation) are often used interchangeably. Both focus on optimising for AI platforms rather than traditional search engines. At ScopeSite, we view AEO as the specific tactic of structuring content to be the 'answer', while GEO encompasses the broader technical architecture required for AI visibility."
  },
  {
    question: "Which AI platforms does AEO target?",
    answer: "Our AEO strategies target the major generative AI platforms: ChatGPT (OpenAI), Claude (Anthropic), Perplexity, Gemini (Google), and Google's AI Overviews (SGE). The structured data and content architecture we implement also heavily benefits voice search assistants like Siri and Alexa."
  },
  {
    question: "How do I know if my business appears in AI answers?",
    answer: "You can manually test by asking ChatGPT or Perplexity questions related to your services in your area. However, AI responses can vary. We use our proprietary AI visibility scanner to systematically test and benchmark your visibility across multiple AI platforms to give you a clear, objective baseline."
  },
  {
    question: "Can AEO work alongside traditional SEO?",
    answer: "Absolutely. In fact, they complement each other perfectly. The technical foundation required for AEO (fast server-side rendering, comprehensive schema markup, clear content structure) are all massive positive signals for traditional Google SEO. You don't have to choose between ranking and being recommended; you can have both."
  },
  {
    question: "What technical changes does AEO require?",
    answer: "AEO requires a shift away from client-side rendered JavaScript (common in Wix, Squarespace, and basic React sites) to Server-Side Rendering (SSR). It also requires deep JSON-LD schema engineering, optimised robots.txt files that allow AI crawlers, and the implementation of llms.txt files to provide AI-specific context."
  },
  {
    question: "How much does answer engine optimisation cost?",
    answer:
      'Our standard AEO / AI SEO retainer is £500 per month with a £750 one-time setup. If your site needs a full AI-first rebuild, project pricing is on our pricing page via the instant quote calculator.',
  },
  {
    question: "What results can I expect from AEO?",
    answer: "Our goal is to move you from being invisible to AI, to being the cited recommendation in your sector. Clients typically see initial citations in Perplexity within 2-4 weeks, and consistent recommendations in ChatGPT within 6-12 weeks as the AI models update their entity graphs and ingest your new structured data."
  }
];

// Generate page schema
const pageSchema = generateLandingPageSchema(
  PAGE_URL,
  'Answer Engine Optimisation',
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  faqs,
  {
    name: 'Answer Engine Optimisation',
    alternateNames: ['AEO', 'AEO Agency', 'Generative Engine Optimisation'],
    description: 'Answer Engine Optimisation (AEO) services to get your business cited by AI platforms.',
  },
  undefined,
  {
    isRelatedTo: [
      { '@id': `${BASE_URL}/ai-seo-agency/#service` },
      { '@id': `${BASE_URL}/ai-seo-services/#service` },
      { '@id': `${BASE_URL}/ai-visibility/#service` },
      { '@id': `${BASE_URL}/generative-engine-optimisation/#service` },
    ],
    availableChannel: generateServiceChannels(),
    serviceType: 'Answer engine optimisation',
    category: 'Search engine optimisation',
    offers: schemaStandardTierServiceOffers(PAGE_URL),
  },
  ['h1', '.hero-description', '.faq-answer', 'h3']
);

export default function AEOLayout({
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
