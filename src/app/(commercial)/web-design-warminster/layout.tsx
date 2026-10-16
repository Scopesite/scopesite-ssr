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
const PAGE_URL = `${BASE_URL}/web-design-warminster`;

export const metadata: Metadata = {
  title: 'Web Design Warminster | Websites Built for AI Visibility | ScopeSite',
  description: 'Web design for Warminster businesses. AI-optimised websites by ScopeSite, based 20 minutes away in Frome. Next.js, schema markup, transparent pricing.',
  openGraph: {
    title: 'Web Design Warminster | Websites Built for AI Visibility',
    description: 'Web design for Warminster businesses. AI-optimised websites by ScopeSite, based 20 minutes away in Frome. Next.js, schema markup, transparent pricing.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Warminster | Websites Built for AI Visibility',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Warminster | Websites Built for AI Visibility',
    description: 'Web design for Warminster businesses. AI-optimised websites by ScopeSite, based 20 minutes away in Frome. Next.js, schema markup, transparent pricing.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
  keywords: ['web design warminster', 'web designer warminster', 'website design warminster', 'warminster web design'],
  alternates: {
    canonical: PAGE_URL,
},
};

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Warminster' },
  { type: 'AdministrativeArea', name: 'Wiltshire' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'Web Design Warminster | Websites Built for AI Visibility',
    'Web design for Warminster businesses. AI-optimised websites by ScopeSite, based 20 minutes away in Frome.',
    faqs,
    `${PAGE_URL}/#service`,
    ['h1', '.hero-description', '.faq-answer', 'h2']
  ),
  generateLocalServiceSchema(
    'Web Design Warminster',
    ['Warminster Web Design', 'Web Designer Warminster', 'Website Design Warminster'],
    'Professional web design services for Warminster businesses with AI optimisation and local SEO.',
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
    { name: 'Web Design Warminster', url: PAGE_URL },
  ]),
]);

export default function WebDesignWarminsterLayout({
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
