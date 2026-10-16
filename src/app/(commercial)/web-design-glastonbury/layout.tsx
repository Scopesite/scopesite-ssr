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
const PAGE_URL = `${BASE_URL}/web-design-glastonbury`;

export const metadata: Metadata = {
  title: 'Web Design Glastonbury | AI-First Websites | ScopeSite',
  description: 'Glastonbury web design for independent businesses, tourism operators, and creative studios. AI-optimised websites with 100/100 Lighthouse scores.',
  openGraph: {
    title: 'Web Design Glastonbury | AI-First Websites',
    description: 'Glastonbury web design for independent businesses, tourism operators, and creative studios. AI-optimised websites with 100/100 Lighthouse scores.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Glastonbury | AI-First Websites',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Glastonbury | AI-First Websites',
    description: 'Glastonbury web design for independent businesses, tourism operators, and creative studios. AI-optimised websites with 100/100 Lighthouse scores.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
  keywords: ['web design glastonbury', 'web designer glastonbury', 'website design glastonbury', 'glastonbury web design'],
  alternates: {
    canonical: PAGE_URL,
},
};

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Glastonbury' },
  { type: 'AdministrativeArea', name: 'Somerset' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'Web Design Glastonbury | AI-First Websites',
    'Glastonbury web design for independent businesses, tourism operators, and creative studios.',
    faqs,
    `${PAGE_URL}/#service`,
    ['h1', '.hero-description', '.faq-answer', 'h2']
  ),
  generateLocalServiceSchema(
    'Web Design Glastonbury',
    ['Glastonbury Web Design', 'Web Designer Glastonbury', 'Website Design Glastonbury'],
    'Professional web design services for Glastonbury businesses with AI optimisation and local SEO.',
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
    { name: 'Web Design Glastonbury', url: PAGE_URL },
  ]),
]);

export default function WebDesignGlastonburyLayout({
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
