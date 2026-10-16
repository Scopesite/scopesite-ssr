import { Metadata } from 'next';
import {
  generateLandingPageSchema,
  generateServiceChannels,
  schemaAggregateOfferRange,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/schema-markup`;

export const metadata: Metadata = {
  title: 'Schema Markup Services | JSON-LD UK | ScopeSite',
  description: 'Schema markup implementation that accurately describes your business and its relationships. 100% validation guarantee. Professional structured data services for UK businesses.',
  keywords: ['schema markup services', 'structured data implementation', 'json-ld services', 'schema markup agency'],
  openGraph: {
    title: 'Schema Markup Services | Professional JSON-LD Implementation UK',
    description: 'Schema markup implementation that accurately describes your business and its relationships. 100% validation guarantee. Professional structured data services for UK businesses.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-schema-markup.png`,
        width: 1200,
        height: 630,
        alt: 'Schema Markup Services - Professional JSON-LD Implementation by ScopeSite',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Schema Markup Services | Professional JSON-LD Implementation UK',
    description: 'Schema markup implementation that accurately describes your business and its relationships. 100% validation guarantee.',
    images: [`${BASE_URL}/images/og/og-schema-markup.png`],
},
  alternates: {
    canonical: PAGE_URL,
},
};

// FAQ data for schema

// Generate page schema
const pageSchema = generateLandingPageSchema(
  PAGE_URL,
  'Schema Markup Services',
  'Schema Markup Services | Professional JSON-LD Implementation UK',
  'Schema markup implementation that accurately describes your business and its relationships. 100% validation guarantee. Professional structured data services for UK businesses.',
  faqs,
  {
    name: 'Schema Markup Services',
    alternateNames: ['Structured Data Services', 'JSON-LD Implementation', 'Schema Markup Implementation'],
    description: 'Professional schema markup implementation service with 100% validation guarantee. Hand-coded JSON-LD structured data for AI visibility and rich results.',
},
  undefined,
  {
    isRelatedTo: [
      { '@id': `${BASE_URL}/web-design/#service` },
      { '@id': `${BASE_URL}/ai-seo-services/#service` },
      { '@id': `${BASE_URL}/generative-engine-optimisation/#service` },
    ],
    availableChannel: generateServiceChannels(),
    serviceType: 'Schema markup implementation',
    category: 'Structured data',
    offers: schemaAggregateOfferRange('750', '2000'),
}
);

export default function SchemaMarkupLayout({
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
