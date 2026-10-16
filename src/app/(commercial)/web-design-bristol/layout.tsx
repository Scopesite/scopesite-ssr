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
const PAGE_URL = `${BASE_URL}/web-design-bristol`;

export const metadata: Metadata = {
  title: 'Web Design Bristol | AI-First SSR Websites | ScopeSite',
  description: 'Bristol web design that gets your business recommended by ChatGPT and Google. 100/100 Lighthouse scores, SSR builds, fair pricing. Free AI visibility audit.',
  openGraph: {
    title: 'Web Design Bristol | AI-First SSR Websites',
    description: 'Bristol web design that gets your business recommended by ChatGPT and Google. 100/100 Lighthouse scores, SSR builds, fair pricing. Free AI visibility audit.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Bristol | AI-First SSR Websites',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Bristol | AI-First SSR Websites',
    description: 'Bristol web design that gets your business recommended by ChatGPT and Google. 100/100 Lighthouse scores, SSR builds, fair pricing. Free AI visibility audit.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
  keywords: ['web design bristol', 'web designer bristol', 'website design bristol', 'bristol web design agency', 'website design company bristol', 'bristol website designers', 'website designers bristol', 'ai optimisation bristol'],
  alternates: {
    canonical: PAGE_URL,
},
};

// FAQ data

// Areas served
const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Bristol' },
  { type: 'City', name: 'Portishead' },
  { type: 'City', name: 'Clevedon' },
];

// Generate schema
const pageSchema = wrapInGraph([
  {
    ...generateWebPageFAQPageSchema(
      PAGE_URL,
      'Web Design Bristol | AI-First SSR Websites',
      'Bristol web design that gets your business recommended by ChatGPT and Google. 100/100 Lighthouse scores, SSR builds, fair pricing.',
      faqs,
      `${PAGE_URL}/#service`
    ),
    speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
},
  generateLocalServiceSchema(
    'Web Design Bristol',
    ['Bristol Web Design', 'Web Designer Bristol', 'Website Design Bristol'],
    'Professional web design services for Bristol businesses with AI optimisation and local SEO.',
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
    { name: 'Web Design Bristol', url: PAGE_URL },
  ]),
]);

export default function WebDesignBristolLayout({
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
