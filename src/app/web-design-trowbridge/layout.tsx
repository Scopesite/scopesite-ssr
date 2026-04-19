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
const PAGE_URL = `${BASE_URL}/web-design-trowbridge`;

export const metadata: Metadata = {
  title: 'Web Design Trowbridge | Modern Websites Built Near You',
  description: 'Web design for Trowbridge businesses. AI-optimised websites built by ScopeSite, just 12 miles away in Frome. Next.js, 100/100 Lighthouse scores, transparent pricing.',
  keywords: ['web design trowbridge', 'web designer trowbridge', 'website design trowbridge', 'trowbridge web design'],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs: FAQItem[] = [
  { question: "Is there a good web designer near Trowbridge?", answer: "ScopeSite is based just 12 miles away in Frome. We work with businesses across Trowbridge and Wiltshire, offering face-to-face meetings, local knowledge, and transparent pricing from £2,625." },
  { question: "How much does a website cost in Trowbridge?", answer: "Our packages start from £2,625 for a simple site. Most Trowbridge businesses invest between £5,000 and £9,000 depending on complexity. That's well below what Bath and Bristol agencies charge." },
  { question: "Do you work with Wiltshire businesses?", answer: "Yes. Trowbridge is the county town of Wiltshire, and we serve businesses across the whole county. From Trowbridge itself to Melksham, Devizes, Bradford-on-Avon, and beyond." },
  { question: "What makes your websites different from WordPress?", answer: "We build on Next.js, not WordPress. That means sub-2-second load times, 100/100 Lighthouse scores, and proper AI optimisation. Most Trowbridge businesses are still running slow WordPress sites that AI platforms can't read properly." },
  { question: "Can you help my Trowbridge business get found on AI search?", answer: "Yes. We build every site with structured schema markup and content designed for AI platforms like ChatGPT, Perplexity, and voice assistants. When someone asks 'Who does web design near Trowbridge?', your business should be the answer." },
  { question: "How long does a web design project take?", answer: "Typically 4-6 weeks from brief to launch. We agree on a specific timeline upfront and stick to it." },
  { question: "Will you meet in person?", answer: "Absolutely. We're 12 miles from Trowbridge and happy to meet at your premises or locally." },
  { question: "Do you help with local SEO for Trowbridge?", answer: "Yes. Local SEO is built into every project: Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' searches." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly plans available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit." },
];

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
      { name: 'Simple Website', price: '2625' },
      { name: 'Standard Website', price: '5625' },
      { name: 'Complex Website', price: '9375' },
    ]
  ),
  generateLocalBusinessSchema('Trowbridge', areasServed, PAGE_URL),
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
