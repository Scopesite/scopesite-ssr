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
const PAGE_URL = `${BASE_URL}/web-design-burnham-on-sea`;

export const metadata: Metadata = {
  title: 'Web Design Burnham-on-Sea | AI-First Websites | ScopeSite',
  description: 'Burnham-on-Sea web design for tourism, hospitality, and local businesses. AI-optimised SSR websites that get recommended by ChatGPT and Google.',
  openGraph: {
    title: 'Web Design Burnham-on-Sea | AI-First Websites',
    description: 'Burnham-on-Sea web design for tourism, hospitality, and local businesses. AI-optimised SSR websites that get recommended by ChatGPT and Google.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Burnham-on-Sea | AI-First Websites',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Burnham-on-Sea | AI-First Websites',
    description: 'Burnham-on-Sea web design for tourism, hospitality, and local businesses. AI-optimised SSR websites that get recommended by ChatGPT and Google.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
  keywords: ['web design burnham-on-sea', 'web designer burnham-on-sea', 'website design burnham-on-sea', 'burnham-on-sea web design'],
  alternates: {
    canonical: PAGE_URL,
},
};

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Burnham-on-Sea' },
  { type: 'AdministrativeArea', name: 'Somerset' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'Web Design Burnham-on-Sea | AI-First Websites',
    'Burnham-on-Sea web design for tourism, hospitality, and local businesses.',
    faqs,
    `${PAGE_URL}/#service`,
    ['h1', '.hero-description', '.faq-answer', 'h2']
  ),
  generateLocalServiceSchema(
    'Web Design Burnham-on-Sea',
    ['Burnham-on-Sea Web Design', 'Web Designer Burnham-on-Sea', 'Website Design Burnham-on-Sea'],
    'Professional web design services for Burnham-on-Sea businesses with AI optimisation and tourism SEO.',
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
    { name: 'Web Design Burnham-on-Sea', url: PAGE_URL },
  ]),
]);

export default function WebDesignBurnhamOnSeaLayout({
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
