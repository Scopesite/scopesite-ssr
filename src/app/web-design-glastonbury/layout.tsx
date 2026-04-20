import { Metadata } from 'next';
import { 
  generateWebPageFAQPageSchema, 
  generateLocalServiceSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  wrapInGraph,
  type FAQItem,
  type AreaServedItem 
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/web-design-glastonbury`;

export const metadata: Metadata = {
  title: 'Web Design Glastonbury | AI-First Websites',
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

const faqs: FAQItem[] = [
  { question: "Why choose a local web designer near Glastonbury?", answer: "We're based in Frome, 25 minutes from Glastonbury. We understand the town's unique mix of tourism, independent retail, and creative businesses. Face-to-face meetings, local knowledge, and fair pricing." },
  { question: "How much does web design in Glastonbury cost?", answer: "Our packages start from £2,625 for a simple site. Most Glastonbury businesses invest £5,000-£9,000 depending on complexity. That's significantly below Bristol and Bath agency rates." },
  { question: "Do you understand Glastonbury's market?", answer: "Yes. Glastonbury has a unique economy driven by tourism, festivals, alternative health, independent retail, and creative industries. We've worked with businesses across these sectors and understand their specific needs." },
  { question: "Can you help tourism businesses in Glastonbury?", answer: "Absolutely. Tourism businesses benefit hugely from AI visibility. When someone asks ChatGPT 'What should I visit in Glastonbury?', proper schema markup and content structure determines whether your business gets mentioned." },
  { question: "What makes your web design different?", answer: "We build on Next.js, not WordPress. Our sites load in under 2 seconds, score 100/100 on Lighthouse, and are optimised for AI search platforms. Most Glastonbury businesses are still on slow WordPress sites." },
  { question: "How long does a Glastonbury web design project take?", answer: "Typically 4-6 weeks from brief to launch. We set a specific timeline and stick to it." },
  { question: "Will you meet in person?", answer: "Yes. We're 25 minutes from Glastonbury and happy to meet at your premises or a local spot." },
  { question: "Can you help with local SEO for Glastonbury?", answer: "Yes. Local SEO is built into every project: Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' searches." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly plans available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit." },
];

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
      { name: 'Simple Website', price: '2625' },
      { name: 'Standard Website', price: '5625' },
      { name: 'Complex Website', price: '9375' },
    ]
  ),
  generateLocalBusinessSchema('Glastonbury', areasServed, PAGE_URL),
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
