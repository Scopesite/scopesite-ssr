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
const PAGE_URL = `${BASE_URL}/web-design-shepton-mallet`;

export const metadata: Metadata = {
  title: 'Web Design Shepton Mallet | AI-Ready | ScopeSite',
  description: 'Web design for Shepton Mallet businesses. AI-optimised websites by ScopeSite, based 15 minutes away in Frome. 100/100 Lighthouse scores, fair pricing.',
  openGraph: {
    title: 'Web Design Shepton Mallet | AI-Ready Websites for Local Businesses',
    description: 'Web design for Shepton Mallet businesses. AI-optimised websites by ScopeSite, based 15 minutes away in Frome. 100/100 Lighthouse scores, fair pricing.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Shepton Mallet | AI-Ready Websites for Local Businesses',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Shepton Mallet | AI-Ready Websites for Local Businesses',
    description: 'Web design for Shepton Mallet businesses. AI-optimised websites by ScopeSite, based 15 minutes away in Frome. 100/100 Lighthouse scores, fair pricing.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
  keywords: ['web design shepton mallet', 'web designer shepton mallet', 'website design shepton mallet', 'shepton mallet web design'],
  alternates: {
    canonical: PAGE_URL,
},
};

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Shepton Mallet' },
  { type: 'AdministrativeArea', name: 'Somerset' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'Web Design Shepton Mallet | AI-Ready Websites for Local Businesses',
    'Web design for Shepton Mallet businesses with AI optimisation and local SEO.',
    faqs,
    `${PAGE_URL}/#service`,
    ['h1', '.hero-description', '.faq-answer', 'h2']
  ),
  generateLocalServiceSchema(
    'Web Design Shepton Mallet',
    ['Shepton Mallet Web Design', 'Web Designer Shepton Mallet', 'Website Design Shepton Mallet'],
    'Professional web design services for Shepton Mallet businesses with AI optimisation and local SEO.',
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
    { name: 'Web Design Shepton Mallet', url: PAGE_URL },
  ]),
]);

export default function WebDesignSheptonMalletLayout({
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
