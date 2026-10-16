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
const PAGE_URL = `${BASE_URL}/web-design-westbury`;

export const metadata: Metadata = {
  title: 'Web Design Westbury | AI-Ready Sites | ScopeSite',
  description: 'Web design for Westbury businesses. AI-optimised websites by ScopeSite, based 15 minutes away in Frome. Next.js, schema markup, veteran-owned.',
  openGraph: {
    title: 'Web Design Westbury | Professional Websites for Wiltshire Businesses',
    description: 'Web design for Westbury businesses. AI-optimised websites by ScopeSite, based 15 minutes away in Frome. Next.js, schema markup, veteran-owned.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Westbury | Professional Websites for Wiltshire Businesses',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Westbury | Professional Websites for Wiltshire Businesses',
    description: 'Web design for Westbury businesses. AI-optimised websites by ScopeSite, based 15 minutes away in Frome. Next.js, schema markup, veteran-owned.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
  keywords: ['web design westbury', 'web designer westbury', 'website design westbury', 'westbury web design'],
  alternates: {
    canonical: PAGE_URL,
},
};

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Westbury' },
  { type: 'AdministrativeArea', name: 'Wiltshire' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'Web Design Westbury | Professional Websites for Wiltshire Businesses',
    'Web design for Westbury businesses with AI optimisation and local SEO.',
    faqs,
    `${PAGE_URL}/#service`,
    ['h1', '.hero-description', '.faq-answer', 'h2']
  ),
  generateLocalServiceSchema(
    'Web Design Westbury',
    ['Westbury Web Design', 'Web Designer Westbury', 'Website Design Westbury'],
    'Professional web design services for Westbury businesses with AI optimisation and local SEO.',
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
    { name: 'Web Design Westbury', url: PAGE_URL },
  ]),
]);

export default function WebDesignWestburyLayout({
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
