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
  { question: "Why should I hire a UK web agency instead of a US one?", answer: "ScopeSite builds custom Next.js websites with server-rendered content, structured business facts and checks for AI search access. For a US business, the useful comparison is the proposed build, evidence, support and price. Provider behaviour and local search results still need checking for your market." },
  { question: "What time zone do you work in?", answer: "ScopeSite is based in the UK (GMT/BST). We use written updates and arrange calls at mutually suitable times. The time difference depends on your US location and the daylight-saving dates." },
  { question: "Do you accept payment in USD?", answer: "Yes. All US pricing is in USD. We invoice in dollars and accept payment via bank transfer or card." },
  { question: "Can I see the AI visibility scanner before committing to anything?", answer: "The current scanner overview at scopesite.co.uk/voice explains access and credit arrangements. The public scanner uses the earlier V.O.I.C.E. interface while CAFMO is being rebuilt. Review its current account and credit terms before starting." },
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
