import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, FileSearch, Sparkles, ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateServiceSchema,
  generateWebPageSchema,
  type FAQItem,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_PATH = '/recruitment-website-design';
const PAGE_URL = `${BASE_URL}${PAGE_PATH}`;
const DEMO_URL = 'https://jobboard-sonar.vercel.app/';
const SPECIALIST_SITE_URL = 'https://recruitmentwebdesign.com';

/** Service JSON-LD Offer: mirrors visible "from £2,000" and SSR cap £8,000 (canonical pricing). */
const recruitmentServiceOffer: Record<string, unknown> = {
  '@type': 'Offer',
  priceCurrency: 'GBP',
  price: '2000',
  priceSpecification: {
    '@type': 'PriceSpecification',
    minPrice: '2000',
    maxPrice: '8000',
    priceCurrency: 'GBP',
  },
  url: PAGE_URL,
  description:
    'Custom recruitment website design from £2,000. AI SEO included free. £5,249 typical with Live Jobs Board add-on.',
  availability: 'https://schema.org/InStock',
  priceValidUntil: '2026-12-31',
  seller: { '@id': `${BASE_URL}/#organization` },
};

export const metadata: Metadata = {
  title: 'Recruitment Website Design UK | Custom-Built, Schema-First, AI-Visible | ScopeSite',
  description:
    'Bespoke recruitment website design for UK agencies. Schema-first, Google for Jobs ready, AI-visible. One extra placement covers the cost. See the live demo.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Recruitment Website Design That Earns Its Place',
    description:
      'Custom-built UK recruitment websites with schema baked in, Google for Jobs verified, and ChatGPT-readable from day one. One placement pays for it.',
    url: PAGE_URL,
    type: 'website',
    images: [
      {
        url: 'https://scopesite.co.uk/og/recruitment-website-design.png',
        width: 1200,
        height: 630,
        alt: 'ScopeSite recruitment website design: bespoke, schema-first, AI-visible',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recruitment Website Design UK | ScopeSite',
    description:
      'Custom-built recruitment websites that Google for Jobs reads, ChatGPT cites, and candidates can actually use.',
  },
};

const recruitmentFaqs: FAQItem[] = [
  {
    question: 'What is a recruitment website, exactly?',
    answer:
      "It's the public-facing site that holds your live vacancies, your team bios, and your sector positioning. The bit that ChatGPT, Google, and candidates actually read. Not the ATS backend, that's separate.",
  },
  {
    question: 'How much does a recruitment website cost in the UK?',
    answer:
      'A custom Ultra Fast SSR recruitment website starts at £2,000 for up to 5 pages. A typical 10-page build is £3,250. Add a Live Jobs Board with auto-schema for £1,999, taking a typical recruitment build with jobs board to £5,249, one-off. AI SEO is included free. Same total whether you pay in full, spread over 6 months, or 12 months. Pay Monthly Service is also available; see https://scopesite.co.uk/pricing for tier-specific setup and monthly fees. Volcanic charges £899 a month over a three-year lock-in, totalling £32,364.',
  },
  {
    question: 'How do you design a recruitment website that ranks for Google for Jobs?',
    answer:
      'JSON-LD JobPosting schema on every role page (title, salary, location, employment type), server-side rendered HTML so the schema exists before any JavaScript runs, and Google Search Console submission for the role sitemap. Google indexes the page and surfaces the vacancy inside the Google for Jobs widget. Candidates click through to your domain, not Indeed.',
  },
  {
    question: 'How do you set up a recruitment website with AI visibility?',
    answer:
      'Schema-first SSR architecture, named author bios, AEO-friendly answer blocks, entity-linked content, and monthly V.O.I.C.E methodology monitoring across ChatGPT, Perplexity, Claude, and Google AI Overviews. The goal is for AI engines to cite your agency by name when somebody asks for the best recruitment firm in your niche.',
  },
];

const comparisonRows: { feature: string; template: string; custom: string }[] = [
  { feature: 'You own the code', template: 'No (template SaaS)', custom: 'Yes' },
  { feature: 'Contract length', template: '3-year minimum', custom: 'None' },
  { feature: 'JSON-LD JobPosting schema', template: 'Inconsistent', custom: 'Auto-generated on every role' },
  { feature: 'Google for Jobs verified', template: 'Sometimes', custom: 'Day one, monitored monthly' },
  { feature: 'ChatGPT / Perplexity visibility', template: 'Not measured', custom: 'Tracked via V.O.I.C.E' },
  { feature: 'Mobile PageSpeed score', template: '30-50 typical', custom: '90+ target' },
  { feature: 'Brand differentiation', template: 'Template', custom: 'Bespoke design' },
  { feature: 'Support response', template: 'Tickets, days', custom: 'Direct, hours' },
  { feature: 'ATS migration', template: 'Painful, locked-in', custom: 'Stack-agnostic, sits over existing' },
];
