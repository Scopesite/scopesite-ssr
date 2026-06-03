import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateLlmBrainProductOffers,
  generateProductSchema,
  generateWebPageSchema,
  generateSpeakableSchema,
  type FAQItem,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/llm-brain`;

const llmBrainFaqItems: FAQItem[] = [
  {
    question: 'What is LLM Brain?',
    answer:
      'LLM Brain is a persistent memory and context layer for AI assistants. It stores your business information, project history, preferences, and operational rules so that AI tools like Claude, ChatGPT, Perplexity, and Copilot can access a single source of truth across every conversation.',
  },
  {
    question: 'Who is LLM Brain for?',
    answer:
      'LLM Brain is for anyone using AI assistants regularly at work — business owners, consultants, marketers, developers, and agencies. It is particularly useful if you find yourself re-explaining context every time you start a new chat, or if multiple AI tools need access to the same shared knowledge base.',
  },
  {
    question: 'How much does LLM Brain cost?',
    answer:
      'LLM Brain is £250 setup plus £85 per month. The setup covers configuration, initial knowledge ingestion, and connection of your preferred AI assistants. The monthly fee covers managed hosting, ongoing storage, and access from any of your connected AI tools.',
  },
  {
    question: 'Which AI assistants does LLM Brain work with?',
    answer:
      'LLM Brain integrates with major LLM platforms via the Model Context Protocol (MCP), including Claude, ChatGPT, Perplexity, Copilot, and any other tool that supports MCP-compatible memory connections.',
  },
  {
    question: 'Do I need a ScopeSite website to use LLM Brain?',
    answer:
      'No. LLM Brain is a standalone product. Anyone working with AI assistants at scale can buy it, regardless of whether they have a ScopeSite-built website or not.',
  },
  {
    question: 'Can I cancel LLM Brain anytime?',
    answer:
      "Yes. LLM Brain is a 30-day rolling subscription with no minimum term. Cancel any time by giving 30 days' written notice.",
  },
];

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
  const llmBrainOffers = generateLlmBrainProductOffers();

  const productSchema = generateProductSchema(
    'LLM Brain',
    'Done-for-you persistent memory for AI assistants. Supabase database connected via MCP and Make.com so Claude and ChatGPT remember tasks, contacts, decisions, and your knowledge base across every conversation.',
    PAGE_URL,
    llmBrainOffers,
    {
      image: [`${BASE_URL}/images/llm-brain-hero.webp`],
      brand: {
        '@type': 'Brand',
        name: 'ScopeSite Digital Studios',
      },
    }
  );

  const llmBrainServiceSchema: Record<string, unknown> = {
    '@type': 'Service',
    '@id': `${PAGE_URL}/#service`,
    name: 'LLM Brain',
    serviceType: 'AI memory and context management',
    description:
      'LLM Brain is a persistent memory and context layer that gives AI assistants (Claude, ChatGPT, Perplexity, and others) a single source of truth across conversations. Stop re-explaining your business, projects, and preferences every session. Available as a standalone product for anyone working with LLMs at scale.',
    provider: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
    },
    areaServed: [
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'United States' },
    ],
    audience: {
      '@type': 'Audience',
      audienceType: 'Professionals and businesses using AI assistants',
    },
    offers: llmBrainOffers,
  };

  const faqPageSchema = {
    ...generateFAQSchema(llmBrainFaqItems),
    '@id': `${PAGE_URL}/#faq`,
  };

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
      <JsonLd
        schema={[
          webPageSchema,
          breadcrumbSchema,
          productSchema,
          llmBrainServiceSchema,
          faqPageSchema,
        ]}
      />
      {children}
    </>
  );
}
