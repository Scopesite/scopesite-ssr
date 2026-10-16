import { Metadata } from 'next';
import { generateLandingPageSchema, schemaAggregateOfferRange } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/ai-website-design`;

export const metadata: Metadata = {
  title: 'AI Website Design | Built for ChatGPT | ScopeSite',
  description: 'Custom website design with readable HTML, accurate structured data and checks for AI search access. UK web design agency ScopeSite.',
  keywords: ['ai website design', 'ai web design', 'ai powered website design', 'chatgpt website optimisation'],
  openGraph: {
    title: 'AI Website Design | Websites Built for ChatGPT & Voice Search',
    description: 'Custom website design with readable HTML, accurate structured data and checks for AI search access. UK web design agency ScopeSite.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-ai-website-design.png`,
        width: 1200,
        height: 630,
        alt: 'AI Website Design by ScopeSite - Built for ChatGPT and Voice Search',
},
    ],
    locale: 'en_GB',
    type: 'website',
},
  twitter: {
    card: 'summary_large_image',
    title: 'AI Website Design | Websites Built for ChatGPT & Voice Search',
    description: 'Custom website design with readable HTML, accurate structured data and checks for AI search access. UK agency ScopeSite.',
    images: [`${BASE_URL}/images/og/og-ai-website-design.png`],
},
  alternates: {
    canonical: PAGE_URL,
},
};

// FAQ data for schema

// Generate page schema
const pageSchema = generateLandingPageSchema(
  PAGE_URL,
  'AI Website Design',
  'AI Website Design | Websites Built for ChatGPT & Voice Search',
  'Custom website design with readable HTML, accurate structured data and checks for AI search access. UK web design agency ScopeSite.',
  faqs,
  {
    name: 'AI Website Design',
    alternateNames: ['AI Web Design', 'AI-Powered Website Design', 'Artificial Intelligence Website Design'],
    description: 'AI website design service that builds websites optimised for ChatGPT recommendations, voice search, and AI answer engines using schema markup and structured data.',
},
  undefined,
  {
    serviceType: 'AI website design',
    category: 'Web design',
    offers: schemaAggregateOfferRange('1875', '8000'),
},
  ['h1', '.hero-description', '.faq-answer', 'h2']
);

export default function AIWebsiteDesignLayout({
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
