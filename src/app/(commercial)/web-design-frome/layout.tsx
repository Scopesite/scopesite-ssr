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
const PAGE_URL = `${BASE_URL}/web-design-frome`;

export const metadata: Metadata = {
  title: 'Web Design Frome | AI-First Websites for Local Businesses | ScopeSite',
  description: 'Web design agency based in Beckington, Frome, Somerset. AI-optimised websites with 100/100 Lighthouse scores. Veteran-owned, transparent pricing.',
  keywords: ['web design frome', 'web designer frome', 'website design frome', 'frome web design'],
  openGraph: {
    title: 'Web Design Frome | AI-First Websites for Local Businesses',
    description: 'Web design agency based in Beckington, Frome, Somerset. AI-optimised websites with 100/100 Lighthouse scores. Veteran-owned, transparent pricing.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-web-design-frome.png`,
        width: 1200,
        height: 630,
        alt: 'Web Design Frome - AI-First Websites by ScopeSite Digital Studios',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Frome | AI-First Websites for Local Businesses',
    description: 'Web design agency based in Beckington, Frome, Somerset. AI-optimised websites with 100/100 Lighthouse scores.',
    images: [`${BASE_URL}/images/og/og-web-design-frome.png`],
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
      'Web Design Frome | AI-First Websites for Local Businesses',
      'Web design agency based in Frome, Somerset. AI-optimised websites with 100/100 Lighthouse scores.',
      faqs,
      `${PAGE_URL}/#service`
    ),
    speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
},
  generateLocalServiceSchema(
    'Web Design Frome',
    ['Frome Web Design', 'Web Designer Frome', 'Website Design Frome'],
    'Professional web design services for Frome businesses with AI optimisation and local SEO.',
    PAGE_URL,
    areasServed,
    [
      { name: 'Simple Website', price: '1875' },
      { name: 'Standard Website', price: '5625' },
      { name: 'Complex Website', price: '9375' },
    ]
  ),

  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Web Design Frome', url: PAGE_URL },
  ]),
]);

export default function WebDesignFromeLayout({
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
