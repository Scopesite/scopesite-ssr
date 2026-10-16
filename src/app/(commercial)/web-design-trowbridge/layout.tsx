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
const PAGE_URL = `${BASE_URL}/web-design-trowbridge`;

export const metadata: Metadata = {
  title: 'Web Design Trowbridge | Modern Websites Built Near You | ScopeSite',
  description: 'Web design for Trowbridge businesses. AI-optimised sites built by ScopeSite, 12 miles away in Frome. Next.js, 100/100 Lighthouse, transparent pricing.',
  openGraph: {
    title: 'Web Design Trowbridge | Modern Websites Built Near You',
    description: 'Web design for Trowbridge businesses. AI-optimised sites built by ScopeSite, 12 miles away in Frome. Next.js, 100/100 Lighthouse, transparent pricing.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Trowbridge | Modern Websites Built Near You',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Trowbridge | Modern Websites Built Near You',
    description: 'Web design for Trowbridge businesses. AI-optimised sites built by ScopeSite, 12 miles away in Frome. Next.js, 100/100 Lighthouse, transparent pricing.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
  keywords: ['web design trowbridge', 'web designer trowbridge', 'website design trowbridge', 'trowbridge web design'],
  alternates: {
    canonical: PAGE_URL,
},
};

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Trowbridge' },
  { type: 'AdministrativeArea', name: 'Wiltshire' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'Web Design Trowbridge | Modern Websites Built Near You',
    'Web design for Trowbridge businesses. AI-optimised websites built by ScopeSite, just 12 miles away in Frome.',
    faqs,
    `${PAGE_URL}/#service`,
    ['h1', '.hero-description', '.faq-answer', 'h2']
  ),
  generateLocalServiceSchema(
    'Web Design Trowbridge',
    ['Trowbridge Web Design', 'Web Designer Trowbridge', 'Website Design Trowbridge'],
    'Professional web design services for Trowbridge businesses with AI optimisation and local SEO.',
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
    { name: 'Web Design Trowbridge', url: PAGE_URL },
  ]),
]);

export default function WebDesignTrowbridgeLayout({
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
