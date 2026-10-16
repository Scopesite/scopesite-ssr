import { Metadata } from 'next';
import {
  generateWebPageFAQPageSchema,
  generateLocalServiceSchema,
  generateBreadcrumbSchema,
  wrapInGraph,
  type AreaServedItem,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { getAlternates } from '@/lib/hreflang-map';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/us/services`;

export const metadata: Metadata = {
  title: 'Web Design and AI Visibility for US | ScopeSite',
  description:
    'AI-first web design and visibility for US businesses. Server-side rendered websites, schema markup, and answer engine optimization. USD pricing.',
  alternates: getAlternates('/us/services', BASE_URL),
  openGraph: {
    title: 'Web Design and AI Visibility for US | ScopeSite',
    description:
      'AI-first web design and visibility for US businesses. Server-side rendered websites, schema markup, and answer engine optimization. USD pricing.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-us-services.png`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite US Services - AI Web Design and Visibility for American Businesses',
},
    ],
    locale: 'en_US',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design and AI Visibility for US | ScopeSite',
    description:
      'AI-first web design and visibility for US businesses. Server-side rendered websites, schema markup, and answer engine optimization. USD pricing.',
    images: [`${BASE_URL}/images/og/og-us-services.png`],
},
};

const areasServed: AreaServedItem[] = [
  { type: 'Country', name: 'United States' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'Web Design and AI Visibility Services for US Businesses',
    'AI-first web design and visibility services for American businesses. Server-side rendered websites, schema markup, and answer engine optimization.',
    faqs,
    `${PAGE_URL}/#service`
  ),
  generateLocalServiceSchema(
    'Web Design and AI Visibility Services',
    ['US Web Design', 'AI Visibility Services USA'],
    'AI-first web design and visibility services for businesses in the United States. Server-side rendered websites with schema markup, answer engine optimization, and AI visibility methodology.',
    PAGE_URL,
    areasServed,
    [
      { name: 'AI Visibility Audit', price: '2500' },
      { name: 'AI-Ready Website', price: '8000' },
      { name: 'AI Visibility Retainer', price: '2000' },
    ],
    'Web Design',
    'USD'
  ),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'United States', url: `${BASE_URL}/us` },
    { name: 'Services', url: PAGE_URL },
  ]),
]);

export default function USServicesLayout({
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
