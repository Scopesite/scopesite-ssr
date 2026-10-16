import { Metadata } from 'next';
import {
  generateWebPageFAQPageSchema,
  generateServiceSchema,
  generateBreadcrumbSchema,
  wrapInGraph,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { getAlternates } from '@/lib/hreflang-map';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/us/generative-engine-optimization`;

export const metadata: Metadata = {
  title: 'Generative Engine Optimization Agency | ScopeSite',
  description:
    'Generative engine optimization agency for US businesses. Get cited by ChatGPT, Claude, Gemini and Perplexity. AI visibility methodology. Free scan.',
  keywords: [
    'generative engine optimization',
    'generative engine optimization agency',
    'geo agency',
    'generative engine optimization services',
    'what is generative engine optimization',
  ],
  alternates: getAlternates('/us/generative-engine-optimization', BASE_URL),
  openGraph: {
    title: 'Generative Engine Optimization Agency | ScopeSite US',
    description:
      'Generative engine optimization agency for US businesses. Get cited by ChatGPT, Claude, Gemini and Perplexity. AI visibility methodology. Free scan.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Generative Engine Optimization Agency - ScopeSite US',
},
    ],
    locale: 'en_US',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Generative Engine Optimization Agency | ScopeSite US',
    description:
      'Generative engine optimization agency for US businesses. Get cited by ChatGPT, Claude, Gemini and Perplexity. AI visibility methodology. Free scan.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
};

const webPageSchema = generateWebPageFAQPageSchema(
  PAGE_URL,
  'Generative Engine Optimization',
  'Generative engine optimization agency for US businesses. Get cited by ChatGPT, Claude, Gemini and Perplexity.',
  faqs,
  `${PAGE_URL}/#service`
);

const serviceSchema = {
  ...generateServiceSchema(
    'Generative Engine Optimization for US Businesses',
    'Generative engine optimisation services for accessible content, accurate structured data and provider-specific citation checks.',
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
    { name: 'Generative Engine Optimization', url: PAGE_URL },
  ]),
]);

export default function USGenerativeEngineOptimizationLayout({
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
