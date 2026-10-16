import { Metadata } from 'next';
import {
  generateWebPageFAQPageSchema,
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateSpeakableSchema,
  wrapInGraph,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { getAlternates } from '@/lib/hreflang-map';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/us/ai-visibility`;

export const metadata: Metadata = {
  title: 'AI visibility checks for US businesses | ScopeSite',
  description:
    'Understand technical website checks, actual AI answer observations and the current CAFMO and earlier scanner status.',
  keywords: [
    'AI visibility scanner',
    'AI visibility check',
    'answer engine optimization',
    'AEO for US businesses',
    'ChatGPT visibility',
    'AI search optimization',
    'AI visibility scanner',
  ],
  alternates: getAlternates('/us/ai-visibility', BASE_URL),
  openGraph: {
    title: 'AI visibility checks for US businesses | ScopeSite',
    description:
      'Understand technical website checks, actual AI answer observations and the current CAFMO and earlier scanner status.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-us-ai-visibility.png`,
        width: 1200,
        height: 630,
        alt: 'AI visibility checks for US businesses by ScopeSite',
},
    ],
    locale: 'en_US',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'AI visibility checks for US businesses | ScopeSite',
    description:
      'Understand technical website checks, actual AI answer observations and the current CAFMO and earlier scanner status.',
    images: [`${BASE_URL}/images/og/og-us-ai-visibility.png`],
},
};

const webPageSchema = {
  ...generateWebPageFAQPageSchema(
    PAGE_URL,
    'Is Your Business Visible to AI? Check for Free',
    'AI visibility scanner for US businesses. Check if ChatGPT, Perplexity, and Claude can find and recommend your business.',
    faqs,
    `${PAGE_URL}/#service`
  ),
  speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
};

const serviceSchema = {
  ...generateServiceSchema(
    'AI Visibility Optimization for US Businesses',
    'Technical website checks and improvements for accessible content, structured data and AI search access. Actual citations are assessed separately.',
    PAGE_URL,
    'Service'
  ),
  areaServed: { '@type': 'Country', name: 'United States' },
};

const pageSchema = wrapInGraph([
  webPageSchema,
  serviceSchema,
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'United States', url: `${BASE_URL}/us` },
    { name: 'AI Visibility', url: PAGE_URL },
  ]),
]);

export default function AIVisibilityLayout({
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
