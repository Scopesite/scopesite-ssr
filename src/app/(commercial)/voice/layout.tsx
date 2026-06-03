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
  title: 'AI visibility checker and AI SEO | ScopeSite',
  description:
    'Free AI visibility scan. See how ChatGPT, Claude, Gemini, and Perplexity read your business today. Optional AI SEO retainer from £750 setup and £500 per month.',
  openGraph: {
    title: 'AI visibility checker and AI SEO | ScopeSite',
    description:
      'Free AI visibility scan for ChatGPT, Claude, Gemini, and Perplexity. Optional AI SEO support from ScopeSite.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-voice.png`,
        width: 1200,
        height: 630,
        alt: 'AI visibility scan by ScopeSite Digital Studios',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI visibility checker | ScopeSite',
    description:
      'Free AI visibility scan. See how major AI platforms read your business.',
    images: [`${BASE_URL}/images/og/og-voice.png`],
  },
  alternates: getAlternates('/voice', BASE_URL),
};

// HowTo steps for AI visibility methodology
const howToSteps = [
  {
    name: 'Get your free AI visibility score',
    text: 'Run our free scan to see how assistants like ChatGPT and Claude currently read you.',
  },
  {
    name: 'Review your report',
    text: 'See structured data health, authority signals, and AI mention checks in plain English.',
  },
  {
    name: 'Follow the 90-day implementation guide',
    text: 'Use the PDF roadmap to fix issues yourself or ask ScopeSite to implement.',
  },
  {
    name: 'Monitor your progress',
    text: 'Track improvements as structured facts and speed fixes take hold.',
  },
];

// FAQ data for schema (mirrors page.tsx faqItems)
const faqs: FAQItem[] = [
  {
    question: 'What is the AI visibility methodology?',
    answer:
      'It is our ScopeSite framework for AI SEO: fast HTML, structured facts, crawler access, and content laid out for AI extraction. It helps ChatGPT, Perplexity, Gemini, and Claude cite you accurately.',
  },
  {
    question: 'Who built it?',
    answer:
      'Dan Cartwright, founder of ScopeSite Digital Studios. Dan is a British Army veteran who focused on a simple problem: good-looking sites that AI still cannot read.',
  },
  {
    question: 'How is this different from traditional SEO?',
    answer:
      'Classic SEO chases rankings. AI SEO chases citations inside AI answers. You usually want both. Generative engine optimisation covers the AI side, search SEO covers the blue links.',
  },
  {
    question: 'What results have you proven?',
    answer:
      'Client H4TLT (Hearing 4 The Long Term) reached number one AI recommendations across ChatGPT, Perplexity, Claude, and Gemini. That made them a standout UK case in their sector.',
  },
  {
    question: 'How much does the AI SEO retainer cost?',
    answer:
      'The scan is free. The standard AI SEO retainer is £500 per month with a £750 one-time setup on a 6- or 12-month commitment. See our pricing page for detail. After three months on the retainer, our 80 Score Guarantee applies. If your AI visibility score stays below 80 while you follow our direction, you pay nothing more until the score reaches 80 and holds for 30 consecutive days.',
  },
  {
    question: 'Is this only for Somerset businesses?',
    answer:
      'No. ScopeSite is based in Somerset and works UK-wide. The technical approach is the same wherever you operate.',
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
    { name: 'AI visibility scan', url: PAGE_URL },
  ]);

  const serviceSchema = {
    ...generateServiceSchema(
      'AI visibility scan and AI SEO',
      'ScopeSite methodology for AI SEO: fast HTML, structured facts, crawler access, and content built for AI answers. Helps ChatGPT, Perplexity, Gemini, and Claude cite your business accurately.',
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
    'How to improve AI visibility',
    'Steps to make your business easier for AI assistants to read and recommend.',
    howToSteps
  );

  const voiceLogoSchema = generateImageObjectSchema({
    contentUrl: `${BASE_URL}/images/voice-ai-aeo-geo-uk-scopesite-top-logo.webp`,
    name: 'AI visibility scan logo',
    description: 'AI visibility scanning tool by ScopeSite Digital Studios',
    width: 600,
    height: 120,
    id: `${PAGE_URL}/#voice-logo`,
  });

  const webPageSchema = {
    ...generateWebPageSchema(
      'AI visibility scan | ScopeSite',
      'Free AI visibility score plus optional AI SEO retainer. Built for ChatGPT, Claude, Gemini, and Perplexity.',
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
