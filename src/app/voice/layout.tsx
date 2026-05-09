import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateHowToSchema,
  generateSpeakableSchema,
  generateImageObjectSchema,
  generateWebPageSchema,
  generateVOICESoftwareApplicationSchema,
  generateServiceChannels,
  generateFAQSchema,
  schemaStandardTierServiceOffers,
  type FAQItem,
} from '@/lib/schema';
import { getAlternates } from '@/lib/hreflang-map';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/voice`;

export const metadata: Metadata = {
  title: 'AI Visibility Checker: V.O.I.C.E. by ScopeSite',
  description:
    'Free AI visibility checker. V.O.I.C.E. is the AI SEO software that scores how visible you are to ChatGPT, Claude, Gemini and Perplexity. Scan in 2 minutes.',
  openGraph: {
    title: 'AI Visibility Checker: V.O.I.C.E. by ScopeSite',
    description:
      'Free AI visibility checker. V.O.I.C.E. is the AI SEO software that scores how visible you are to ChatGPT, Claude, Gemini and Perplexity. Scan in 2 minutes.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-voice.png`,
        width: 1200,
        height: 630,
        alt: 'V.O.I.C.E™ AI Visibility Methodology by ScopeSite Digital Studios',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Visibility Checker: V.O.I.C.E. by ScopeSite',
    description:
      'Free AI visibility checker. V.O.I.C.E. is the AI SEO software that scores how visible you are to ChatGPT, Claude, Gemini and Perplexity. Scan in 2 minutes.',
    images: [`${BASE_URL}/images/og/og-voice.png`],
  },
  alternates: getAlternates('/voice', BASE_URL),
};

// HowTo steps for V.O.I.C.E methodology
const howToSteps = [
  {
    name: 'Get Your Free AI Visibility Score',
    text: 'Run our free scan to see exactly how visible you are to AI assistants like ChatGPT and Claude.',
  },
  {
    name: 'Review Your Report',
    text: 'Receive a comprehensive report showing your structured data health, DA/PA ranking, and AI mentions.',
  },
  {
    name: 'Follow the 90-Day Implementation Guide',
    text: 'Use our detailed PDF roadmap to fix issues yourself or let ScopeSite handle the implementation.',
  },
  {
    name: 'Monitor Your Progress',
    text: 'Track improvements in AI visibility as your optimizations take effect.',
  },
];

// FAQ data for schema (mirrors page.tsx faqItems)
const faqs: FAQItem[] = [
  {
    question: 'What is V.O.I.C.E™ methodology?',
    answer: 'V.O.I.C.E.™ stands for Visibility, Optimisation, for Intelligent, Crawler, Engines. It\'s a proprietary methodology developed by ScopeSite Digital Studios that combines server-side rendering, structured data engineering, and content architecture specifically designed for generative AI citation. It makes your website visible and recommendable by ChatGPT, Perplexity, Gemini, and Claude.',
  },
  {
    question: 'Who created V.O.I.C.E™?',
    answer: 'V.O.I.C.E™ was created by Dan Cartwright, founder and director of ScopeSite Digital Studios. Dan is a British Army veteran who built V.O.I.C.E™ to solve a specific problem: most UK businesses are invisible to AI search engines despite having perfectly good websites.',
  },
  {
    question: 'How does V.O.I.C.E™ differ from traditional SEO?',
    answer: 'Traditional SEO targets Google rankings through keywords and backlinks. V.O.I.C.E™ targets AI chatbot recommendations through structured data, entity graphs, and content engineering. SEO gets you ranked. V.O.I.C.E™ gets you recommended. This is the difference between Generative Engine Optimisation (GEO) and traditional search engine optimisation. You need both.',
  },
  {
    question: 'What results has V.O.I.C.E™ achieved?',
    answer: 'V.O.I.C.E™ achieved #1 AI recommendations for client H4TLT (Hearing 4 The Long Term) across ChatGPT, Perplexity, Claude, and Gemini. This made H4TLT the first UK hearing compliance business to be recommended by all four major AI platforms.',
  },
  {
    question: 'How much does V.O.I.C.E™ cost?',
    answer:
      'A free AI visibility scan is available to assess your current position. V.O.I.C.E™ on our standard tier is £500 per month with a £750 one-time setup (minimum commitment applies — see our pricing page). After 3 months on the retainer, our 80 Score Guarantee kicks in — if your AI Visibility Score is below 80 and you have followed our direction, you pay nothing more until your score hits 80 and holds there for 30 consecutive days.',
  },
  {
    question: 'Is V.O.I.C.E™ only for businesses in Somerset?',
    answer: 'No. V.O.I.C.E™ is location-agnostic. The methodology works for any business, anywhere. ScopeSite is based in Somerset and serves clients across the UK, but the technical principles behind V.O.I.C.E™ apply regardless of where your business operates.',
  },
];

export default function VoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'V.O.I.C.E™', url: PAGE_URL },
  ]);

  const serviceSchema = {
    ...generateServiceSchema(
      'V.O.I.C.E. — AI Visibility Scanner for UK Businesses',
      'Proprietary methodology for optimising websites to be visible and recommended by AI search engines including ChatGPT, Perplexity, Gemini, and Claude. Created by Dan Cartwright at ScopeSite Digital Studios.',
      PAGE_URL,
      undefined,
      {
        availableChannel: generateServiceChannels(),
        serviceType: 'AI visibility methodology',
        category: 'Search engine optimisation',
        offers: schemaStandardTierServiceOffers(PAGE_URL),
      }
    ),
    isRelatedTo: [
      { '@id': `${BASE_URL}/ai-seo-services/#service` },
      { '@id': `${BASE_URL}/schema-markup/#service` },
      { '@id': `${BASE_URL}/#voice-scanner` },
      { '@id': `${BASE_URL}/generative-engine-optimisation/#service` },
    ],
  };

  const howToSchema = generateHowToSchema(
    'How to Improve Your AI Visibility with V.O.I.C.E™',
    'Step-by-step guide to making your business visible to AI assistants using the V.O.I.C.E™ methodology.',
    howToSteps
  );

  const voiceLogoSchema = generateImageObjectSchema({
    contentUrl: `${BASE_URL}/images/voice-ai-aeo-geo-uk-scopesite-top-logo.webp`,
    name: 'V.O.I.C.E. AI Visibility Logo',
    description: 'V.O.I.C.E. AI visibility scanning tool by ScopeSite Digital Studios',
    width: 600,
    height: 120,
    id: `${PAGE_URL}/#voice-logo`,
  });

  const webPageSchema = {
    ...generateWebPageSchema(
      'AI Visibility | V.O.I.C.E™',
      'Get your business recommended by ChatGPT, Claude & Perplexity. Our V.O.I.C.E™ methodology makes you visible to AI search. Free AI visibility score.',
      PAGE_URL
    ),
    mainEntity: { '@id': `${BASE_URL}/#voice-scanner` },
    speakable: generateSpeakableSchema(['h1', '#voice-definition', '.voice-definition']),
  };

  const softwareAppSchema = generateVOICESoftwareApplicationSchema();

  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <JsonLd schema={[webPageSchema, breadcrumbSchema, serviceSchema, softwareAppSchema, howToSchema, voiceLogoSchema, faqSchema]} />
      {children}
    </>
  );
}
