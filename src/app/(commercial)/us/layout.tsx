import { Metadata } from 'next';
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  wrapInGraph,
  type FAQItem,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { getAlternates } from '@/lib/hreflang-map';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/us`;

export const metadata: Metadata = {
  title: 'AI-First Web Design for US Businesses | ScopeSite',
  description: 'UK-based web design agency serving US businesses. Server-side rendered websites optimized for AI visibility. AI visibility methodology. USD pricing available.',
  keywords: ['web design for US businesses', 'AI web design USA', 'AI visibility US', 'web design agency for American businesses', 'SSR websites US'],
  alternates: getAlternates('/us', BASE_URL),
  openGraph: {
    title: 'AI-First Web Design for US Businesses | ScopeSite Digital Studios',
    description: 'UK-based web design agency serving US businesses. Server-side rendered websites optimized for AI visibility.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-us-home.png`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite Digital Studios - AI-First Web Design for US Businesses',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-First Web Design for US Businesses | ScopeSite',
    description: 'UK-based web design agency serving US businesses. Server-side rendered websites optimized for AI visibility.',
    images: [`${BASE_URL}/images/og/og-us-home.png`],
  },
};

const faqs: FAQItem[] = [
  { question: "Why should I hire a UK web agency instead of a US one?", answer: "Because AI visibility is a global challenge and the technology doesn't change based on geography. ScopeSite specializes in server-side rendered websites with full schema markup and AI optimization, a combination most US agencies aren't offering yet. You get a specialist, not a generalist who's bolted 'AI' onto their existing services." },
  { question: "What time zone do you work in?", answer: "ScopeSite is based in the UK (GMT/BST). That gives us 5-8 hours of overlap with US East Coast business hours and full overlap with US West Coast mornings. All communication is async-friendly, and we schedule calls at times that work for both sides." },
  { question: "Do you accept payment in USD?", answer: "Yes. All US pricing is in USD. We invoice in dollars and accept payment via bank transfer or card." },
  { question: "Can I see the AI visibility scanner before committing to anything?", answer: "Absolutely. Run a free scan at scopesite.co.uk/voice on any URL. No signup required. You'll get an instant AI visibility report showing where your site stands." },
];

const serviceSchema = {
  ...generateServiceSchema(
    'AI-First Web Design for US Businesses',
    'Server-side rendered websites with full schema markup and AI optimization for businesses in the United States. Built by ScopeSite Digital Studios in the UK.',
    PAGE_URL
  ),
  areaServed: { '@type': 'Country', name: 'United States' },
};

const pageSchema = wrapInGraph([
  serviceSchema,
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'United States', url: PAGE_URL },
  ]),
]);

export default function USLayout({
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
