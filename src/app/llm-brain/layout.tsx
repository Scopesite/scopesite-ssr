import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateProductSchema,
  generateWebPageSchema,
  generateSpeakableSchema,
  generateOfferSchema,
  type FAQItem,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/llm-brain`;

export const metadata: Metadata = {
  title: 'LLM Brain: Persistent AI Memory for Business | ScopeSite',
  description:
    'Stop re-briefing AI every conversation. LLM Brain gives Claude and ChatGPT a permanent database that remembers your business. £250 one-time setup.',
  openGraph: {
    title: 'LLM Brain: Persistent AI Memory for Business | ScopeSite',
    description:
      'Stop re-briefing AI every conversation. LLM Brain gives Claude and ChatGPT a permanent database that remembers your business. £250 one-time setup.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-llm-brain.png`,
        width: 1200,
        height: 630,
        alt: 'LLM Brain — Persistent AI Memory for Your Business by ScopeSite Digital Studios',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLM Brain: Persistent AI Memory for Business | ScopeSite',
    description:
      'Stop re-briefing AI every conversation. LLM Brain gives Claude and ChatGPT a permanent database that remembers your business.',
    images: [`${BASE_URL}/images/og/og-llm-brain.png`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function LlmBrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setupOffer = generateOfferSchema(
    'LLM Brain done-for-you setup',
    'One-time build, configure, seed your data, Claude MCP and ChatGPT bridge, thirty-minute onboarding.',
    '250',
    'GBP'
  );

  const managedOffer = generateOfferSchema(
    'LLM Brain managed hosting',
    'Hosted, maintained, updates and backups handled by ScopeSite.',
    '85',
    'GBP'
  );

  const productSchema = generateProductSchema(
    'LLM Brain',
    'Done-for-you persistent memory for AI assistants. Supabase database connected via MCP and Make.com so Claude and ChatGPT remember tasks, contacts, decisions, and your knowledge base across every conversation.',
    PAGE_URL,
    [setupOffer, managedOffer]
  );

  const webPageSchema = {
    ...generateWebPageSchema(
      'LLM Brain | Persistent AI Memory for Your Business',
      'Stop re-briefing AI every conversation. LLM Brain gives Claude and ChatGPT a permanent database that remembers your business.',
      PAGE_URL
    ),
    mainEntity: { '@id': `${PAGE_URL}/#product` },
    speakable: generateSpeakableSchema(['h1', '.hero-description', '.faq-answer', 'h2']),
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'LLM Brain', url: PAGE_URL },
  ]);

  return (
    <>
      <JsonLd schema={[webPageSchema, breadcrumbSchema, productSchema]} />
      {children}
    </>
  );
}
