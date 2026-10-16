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
const PAGE_URL = `${BASE_URL}/web-design-bath`;

export const metadata: Metadata = {
  title: 'Web Design Bath | AI-Optimised Sites | ScopeSite',
  description: 'Bath web design agency building AI-optimised websites that get recommended by ChatGPT. Premium quality without premium agency prices. Based in nearby Somerset.',
  openGraph: {
    title: 'Web Design Bath | AI-Optimised Websites for Bath Businesses',
    description: 'Bath web design agency building AI-optimised websites that get recommended by ChatGPT. Premium quality without premium agency prices. Based in nearby Somerset.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Bath | AI-Optimised Websites for Bath Businesses',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Bath | AI-Optimised Websites for Bath Businesses',
    description: 'Bath web design agency building AI-optimised websites that get recommended by ChatGPT. Premium quality without premium agency prices. Based in nearby Somerset.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
},
  keywords: ['web design bath', 'web designer bath', 'website design bath', 'bath web design agency'],
  alternates: {
    canonical: PAGE_URL,
},
};

// FAQ data

// Areas served
const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Bath' },
  { type: 'City', name: 'Keynsham' },
  { type: 'City', name: 'Midsomer Norton' },
  { type: 'City', name: 'Radstock' },
  { type: 'City', name: 'Bradford-on-Avon' },
];

// Generate schema
const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'Web Design Bath | AI-Optimised Websites for Bath Businesses',
    'Bath web design agency building AI-optimised websites that get recommended by ChatGPT. Premium quality without premium agency prices.',
    faqs,
    `${PAGE_URL}/#service`,
    ['h1', '.hero-description', '.faq-answer', 'h2']
  ),
  generateLocalServiceSchema(
    'Web Design Bath',
    ['Bath Web Design', 'Web Designer Bath', 'Website Design Bath'],
    'Professional web design services for Bath businesses with AI optimisation and local SEO.',
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
    { name: 'Web Design Bath', url: PAGE_URL },
  ]),
]);

export default function WebDesignBathLayout({
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
