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
const PAGE_URL = `${BASE_URL}/web-design-somerset`;

export const metadata: Metadata = {
  title: 'Web Design Somerset | AI-First Websites That Get Found | ScopeSite',
  description: 'Somerset web design agency building AI-optimised sites recommended by ChatGPT. Based in Frome, serving Somerset. Veteran-owned.',
  keywords: ['web design somerset', 'web designer somerset', 'website design somerset', 'web design frome'],
  openGraph: {
    title: 'Web Design Somerset | AI-First Websites That Get Found',
    description: 'Somerset web design agency building AI-optimised sites recommended by ChatGPT. Based in Frome, serving Somerset. Veteran-owned.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-web-design-somerset.png`,
        width: 1200,
        height: 630,
        alt: 'Web Design Somerset - AI-Optimised Websites by ScopeSite Digital Studios',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Somerset | AI-First Websites That Get Found',
    description: 'Somerset web design agency building AI-optimised sites recommended by ChatGPT. Based in Frome, serving Somerset. Veteran-owned.',
    images: [`${BASE_URL}/images/og/og-web-design-somerset.png`],
},
  alternates: {
    canonical: PAGE_URL,
},
};

// FAQ data

// Areas served
const areasServed: AreaServedItem[] = [
  { type: 'AdministrativeArea', name: 'Somerset' },
  { type: 'City', name: 'Frome' },
  { type: 'City', name: 'Taunton' },
  { type: 'City', name: 'Yeovil' },
  { type: 'City', name: 'Bridgwater' },
  { type: 'City', name: 'Glastonbury' },
  { type: 'City', name: 'Wells' },
  { type: 'City', name: 'Shepton Mallet' },
];

// Generate schema
const pageSchema = wrapInGraph([
  {
    ...generateWebPageFAQPageSchema(
      PAGE_URL,
      'Web Design Somerset | AI-First Websites That Get Found',
      'Somerset web design agency building AI-optimised websites that get recommended by ChatGPT.',
      faqs,
      `${PAGE_URL}/#service`
    ),
    speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
},
  generateLocalServiceSchema(
    'Web Design Somerset',
    ['Somerset Web Design', 'Web Designer Somerset', 'Website Design Somerset'],
    'Professional web design services for Somerset businesses with AI optimisation and local SEO.',
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
    { name: 'Web Design Somerset', url: PAGE_URL },
  ]),
]);

export default function WebDesignSomersetLayout({
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
