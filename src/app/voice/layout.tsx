import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateFAQSchema,
  generateHowToSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/voice`;

export const metadata: Metadata = {
  title: 'AI Visibility Optimisation | V.O.I.C.E™ Methodology',
  description:
    'Get your business recommended by ChatGPT, Claude & Perplexity. Our V.O.I.C.E™ methodology makes you visible to AI search. Free AI visibility score.',
  openGraph: {
    title: 'AI Visibility Optimisation | V.O.I.C.E™ Methodology | ScopeSite Digital Studios',
    description:
      'Get your business recommended by ChatGPT, Claude & Perplexity. Our V.O.I.C.E™ methodology makes you visible to AI search. Free AI visibility score.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/voice-ai-aeo-geo-uk-scopesite-top-logo.webp`,
        width: 1200,
        height: 630,
        alt: 'V.O.I.C.E™ - AI Visibility Optimisation by ScopeSite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Visibility Optimisation | V.O.I.C.E™ | ScopeSite',
    description:
      'Get your business recommended by ChatGPT, Claude & Perplexity. Our V.O.I.C.E™ methodology makes you visible to AI search.',
    images: [`${BASE_URL}/images/voice-ai-aeo-geo-uk-scopesite-top-logo.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data for schema
const faqItems = [
  {
    question: 'What is V.O.I.C.E™ GEO?',
    answer:
      "V.O.I.C.E™ stands for Visibility Optimisation for Intelligent Conversational Engines. It's our AI-first system that makes sure your website gets seen by tools like ChatGPT, Siri, Alexa, and Claude. It's not just search engine friendly - it's AI fluent.",
  },
  {
    question: "Why do I need GEO for AI visibility - isn't Google enough?",
    answer:
      "People are talking to search engines now, not just typing. If your site isn't speaking the right structured data language, AI assistants can't find you or recommend you. Traditional SEO alone won't cut it anymore.",
  },
  {
    question: 'Is the scan really free?',
    answer:
      "100%, no strings, no sneaky sales pitch. We run a full visibility scan and tell you what's working, what's invisible, and what needs fixing.",
  },
  {
    question: 'What do I get with the free GEO scan?',
    answer:
      "You'll receive an AI GEO visibility score, full structured data health breakdown, DA/PA ranking powered by MOZ, spam score, backlink count, AI mentions tracking, and a 90-day implementation guide as a PDF report.",
  },
  {
    question: 'Can ScopeSite help implement the fixes after the scan?',
    answer:
      "Absolutely. If you want us to handle it, we've got packages starting from £495. But there's no pressure - you can DIY with the report or let us do it for you.",
  },
  {
    question: 'How long does the scan take?',
    answer:
      "Usually 1-2 working days. It's a proper audit, not a five-second gimmick. We look under the bonnet and give it to you straight.",
  },
  {
    question: 'Is this just SEO with a fancy name?',
    answer:
      "Not at all. Traditional SEO focuses on humans and Google. V.O.I.C.E™ is built for how AI understands your site - structure, schema, relationships, and context. It's next-gen visibility.",
  },
  {
    question: 'Do I need to be technical to understand the report?',
    answer:
      "Nope. We translate everything into plain English. You'll get clear explanations, visual diagrams, and a human-friendly summary.",
  },
  {
    question: 'Can I use this if I\'m on Wix, Squarespace, or WordPress?',
    answer:
      "You sure can. Whether your site's DIY or custom-coded, we'll show you what's working and what's not. We work across all platforms.",
  },
];

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

  const serviceSchema = generateServiceSchema(
    'V.O.I.C.E™ AI Visibility Optimization',
    'Comprehensive AI search optimization using our proprietary V.O.I.C.E™ methodology. Make your business visible to ChatGPT, Claude, Perplexity, and AI assistants.',
    PAGE_URL
  );

  const faqSchema = generateFAQSchema(faqItems);

  const howToSchema = generateHowToSchema(
    'How to Improve Your AI Visibility with V.O.I.C.E™',
    'Step-by-step guide to making your business visible to AI assistants using the V.O.I.C.E™ methodology.',
    howToSteps
  );

  return (
    <>
      {/* Main schemas in graph */}
      <JsonLd schema={[breadcrumbSchema, serviceSchema, howToSchema]} />
      {/* FAQPage schema as separate output for better Google recognition */}
      <JsonLd schema={faqSchema} />
      {children}
    </>
  );
}
