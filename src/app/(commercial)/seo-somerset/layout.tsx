import { Metadata } from 'next';
import { 
  generateWebPageFAQPageSchema, 
  generateLocalServiceSchema,

  generateBreadcrumbSchema,

  generateSpeakableSchema,
  wrapInGraph,
  type AreaServedItem 
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/seo-somerset`;

export const metadata: Metadata = {
  title: 'SEO Somerset | Technical SEO & AI Visibility Agency',
  description:
    'Technical SEO, schema and AI visibility optimisation for Somerset businesses that want stronger Google rankings and to be found by AI search.',
  keywords: ['seo somerset', 'somerset seo', 'search engine optimisation somerset', 'seo services somerset', 'ai seo somerset', 'local seo somerset'],
  openGraph: {
    title: 'SEO Somerset | Technical SEO & AI Visibility Agency',
    description:
      'Technical SEO, schema and AI visibility optimisation for Somerset businesses that want stronger Google rankings and to be found by AI search.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-seo-somerset.png`,
        width: 1200,
        height: 630,
        alt: 'SEO Somerset - AI-Powered Search Optimisation by ScopeSite',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Somerset | Technical SEO & AI Visibility Agency',
    description:
      'Technical SEO, schema and AI visibility optimisation for Somerset businesses that want stronger Google rankings and to be found by AI search.',
    images: [`${BASE_URL}/images/og/og-seo-somerset.png`],
},
  alternates: {
    canonical: PAGE_URL,
},
};

const areasServed: AreaServedItem[] = [
  { type: 'AdministrativeArea', name: 'Somerset' },
  { type: 'City', name: 'Bath' },
  { type: 'City', name: 'Bristol' },
  { type: 'AdministrativeArea', name: 'Wiltshire' },
  { type: 'AdministrativeArea', name: 'South West England' },
  { type: 'Country', name: 'United Kingdom' },
];

const PAGE_TITLE = 'SEO Somerset | Technical SEO & AI Visibility Agency';
const PAGE_DESCRIPTION =
  'Technical SEO, schema and AI visibility optimisation for Somerset businesses that want stronger Google rankings and to be found by AI search.';

const pageSchema = wrapInGraph([
  {
    ...generateWebPageFAQPageSchema(
      PAGE_URL,
      PAGE_TITLE,
      PAGE_DESCRIPTION,
      faqs,
      `${PAGE_URL}/#service`
    ),
    speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
},
  generateLocalServiceSchema(
    'SEO Somerset',
    ['Somerset SEO', 'Search Engine Optimisation Somerset', 'SEO Services Somerset'],
    PAGE_DESCRIPTION,
    PAGE_URL,
    areasServed,
    [
      { name: 'AI SEO Setup', price: '750' },
      { name: 'Monthly AI SEO Retainer', price: '500' },
    ],
    'Technical SEO and AI visibility optimisation'
  ),

  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'SEO Somerset', url: PAGE_URL },
  ]),
]);

export default function SEOSomersetLayout({
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
