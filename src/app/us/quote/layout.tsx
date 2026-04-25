import { Metadata } from 'next';
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateUSLocalBusinessSchema,
  wrapInGraph,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/us/quote`;

export const metadata: Metadata = {
  title: 'Instant Quote | US Pricing | ScopeSite',
  description:
    'Get an instant quote for AI-ready web design, AI visibility services, and custom development. All prices in USD.',
  alternates: {
    canonical: PAGE_URL,
    languages: {
      'en-US': PAGE_URL,
      'en-GB': `${BASE_URL}/pricing`,
      'x-default': `${BASE_URL}/pricing`,
    },
  },
  openGraph: {
    title: 'Instant Quote | US Pricing | ScopeSite Digital Studios',
    description:
      'Get an instant quote for AI-ready web design, AI visibility services, and custom development. All prices in USD.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-us-quote.png`,
        width: 1200,
        height: 630,
        alt: 'Instant Quote for AI Web Design - US Pricing by ScopeSite',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instant Quote | US Pricing | ScopeSite',
    description:
      'Get an instant quote for AI-ready web design, AI visibility services, and custom development. All prices in USD.',
    images: [`${BASE_URL}/images/og/og-us-quote.png`],
  },
};

const pageSchema = wrapInGraph([
  generateWebPageSchema(
    'Instant Quote | US Pricing | ScopeSite',
    'Get an instant quote for AI-ready web design, AI visibility services, and custom development. All prices in USD.',
    PAGE_URL
  ),
  generateUSLocalBusinessSchema(PAGE_URL),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'United States', url: `${BASE_URL}/us` },
    { name: 'Instant Quote', url: PAGE_URL },
  ]),
]);

export default function USQuoteLayout({
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
