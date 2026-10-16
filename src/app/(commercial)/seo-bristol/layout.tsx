import { Metadata } from 'next';
import { 
  generateWebPageFAQPageSchema, 
  generateLocalServiceSchema,

  generateBreadcrumbSchema,
  wrapInGraph,
  type AreaServedItem 
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/seo-bristol`;

export const metadata: Metadata = {
  title: 'SEO Bristol | AI Search Optimisation | ScopeSite',
  description: 'Bristol SEO services that go beyond Google rankings. Get your business recommended by ChatGPT, Perplexity, and AI search engines. AI visibility methodology.',
  openGraph: {
    title: 'SEO Bristol | AI Search Optimisation',
    description: 'Bristol SEO services that go beyond Google rankings. Get your business recommended by ChatGPT, Perplexity, and AI search engines. AI visibility methodology.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'SEO Bristol | AI Search Optimisation',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Bristol | AI Search Optimisation',
    description: 'Bristol SEO services that go beyond Google rankings. Get your business recommended by ChatGPT, Perplexity, and AI search engines. AI visibility methodology.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
  keywords: ['seo bristol', 'bristol seo', 'search engine optimisation bristol', 'seo services bristol', 'ai seo bristol'],
  alternates: {
    canonical: PAGE_URL,
},
};

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Bristol' },
  { type: 'City', name: 'Portishead' },
  { type: 'City', name: 'Clevedon' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'SEO Bristol | AI Search Optimisation',
    'Bristol SEO services that go beyond Google rankings. Get your business recommended by ChatGPT, Perplexity, and AI search engines.',
    faqs,
    `${PAGE_URL}/#service`,
    ['h1', '.hero-description', '.faq-answer', 'h2']
  ),
  generateLocalServiceSchema(
    'SEO Bristol',
    ['Bristol SEO', 'Search Engine Optimisation Bristol', 'SEO Services Bristol'],
    'Professional SEO services for Bristol businesses with AI optimisation and search visibility.',
    PAGE_URL,
    areasServed,
    [
      { name: 'AI SEO Setup', price: '750' },
      { name: 'Monthly AI SEO Retainer', price: '500' },
    ],
    'SEO'
  ),

  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'SEO Bristol', url: PAGE_URL },
  ]),
]);

export default function SEOBristolLayout({
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
