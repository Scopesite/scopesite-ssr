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
const PAGE_URL = `${BASE_URL}/seo-frome`;

export const metadata: Metadata = {
  title: 'SEO Frome: Get Found on Google and AI | ScopeSite',
  description: 'SEO services based in Frome, Somerset. Local SEO and AI visibility for Frome businesses. AI visibility methodology. Free AI audit available.',
  keywords: ['seo frome', 'frome seo', 'search engine optimisation frome', 'local seo frome'],
  openGraph: {
    title: 'SEO Frome: Get Found on Google and AI | ScopeSite',
    description: 'SEO services based in Frome, Somerset. Local SEO and AI visibility for Frome businesses. AI visibility methodology. Free AI audit available.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-seo-frome.png`,
        width: 1200,
        height: 630,
        alt: 'SEO Frome - Local SEO and AI Visibility by ScopeSite',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Frome: Get Found on Google and AI | ScopeSite',
    description: 'SEO services based in Frome, Somerset. Local SEO and AI visibility for Frome businesses. AI visibility methodology.',
    images: [`${BASE_URL}/images/og/og-seo-frome.png`],
},
  alternates: {
    canonical: PAGE_URL,
},
};

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Frome' },
  { type: 'AdministrativeArea', name: 'Somerset' },
];

const pageSchema = wrapInGraph([
  {
    ...generateWebPageFAQPageSchema(
      PAGE_URL,
      'SEO Frome | Get Your Business Found on Google and AI',
      'SEO services based in Frome, Somerset. Local SEO and AI visibility for Frome businesses. AI visibility methodology.',
      faqs,
      `${PAGE_URL}/#service`
    ),
    speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
},
  generateLocalServiceSchema(
    'SEO Frome',
    ['Frome SEO', 'Search Engine Optimisation Frome', 'Local SEO Frome'],
    'Professional SEO services for Frome businesses with AI optimisation and local search visibility.',
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
    { name: 'SEO Frome', url: PAGE_URL },
  ]),
]);

export default function SEOFromeLayout({
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
