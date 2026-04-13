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
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/voice`;

export const metadata: Metadata = {
  title: 'AI Visibility | V.O.I.C.E™',
  description:
    'Get your business recommended by ChatGPT, Claude & Perplexity. Our V.O.I.C.E™ methodology makes you visible to AI search. Free AI visibility score.',
  openGraph: {
    title: 'AI Visibility Optimisation | V.O.I.C.E™ Methodology | ScopeSite Digital Studios',
    description:
      'Get your business recommended by ChatGPT, Claude & Perplexity. Our V.O.I.C.E™ methodology makes you visible to AI search. Free AI visibility score.',
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
    title: 'AI Visibility Optimisation | V.O.I.C.E™ | ScopeSite',
    description:
      'Get your business recommended by ChatGPT, Claude & Perplexity. Our V.O.I.C.E™ methodology makes you visible to AI search.',
    images: [`${BASE_URL}/images/og/og-voice.png`],
  },
  alternates: {
    canonical: PAGE_URL,
    languages: {
      'en-GB': PAGE_URL,
      'en-US': `${BASE_URL}/us/ai-visibility`,
      'x-default': PAGE_URL,
    },
  },
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
      'V.O.I.C.E™ AI Visibility Optimization',
      'Proprietary methodology for optimising websites to be visible and recommended by AI search engines including ChatGPT, Perplexity, Gemini, and Claude. Created by Dan Cartwright at ScopeSite Digital Studios.',
      PAGE_URL,
      undefined,
      {
        availableChannel: generateServiceChannels(),
      }
    ),
    isRelatedTo: [
      { '@id': `${BASE_URL}/ai-seo-services/#service` },
      { '@id': `${BASE_URL}/schema-markup/#service` },
      { '@id': `${BASE_URL}/#voice-scanner` },
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

  return (
    <>
      <JsonLd schema={[webPageSchema, breadcrumbSchema, serviceSchema, softwareAppSchema, howToSchema, voiceLogoSchema]} />
      {children}
    </>
  );
}
