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
const PAGE_URL = `${BASE_URL}/web-design-westbury`;

export const metadata: Metadata = {
  title: 'Web Design Westbury | Professional Websites for Wiltshire Businesses',
  description: 'Web design for Westbury businesses. AI-optimised websites by ScopeSite, based 15 minutes away in Frome. Next.js, schema markup, veteran-owned.',
  keywords: ['web design westbury', 'web designer westbury', 'website design westbury', 'westbury web design'],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs: FAQItem[] = [
  { question: "Who is the best web designer near Westbury?", answer: "ScopeSite is based just 15 minutes away in Frome. We specialise in AI-optimised websites for local businesses, with 100/100 Lighthouse scores and structured schema markup as standard." },
  { question: "How much does a website cost for a small business in Westbury?", answer: "Our packages start from £2,625 for a simple site. Most Westbury businesses invest between £5,000 and £9,000 depending on complexity. That's well below what Bath or Salisbury agencies charge." },
  { question: "Do you serve Wiltshire as well as Somerset?", answer: "Yes. Westbury sits right on the Somerset/Wiltshire border, and we serve businesses across both counties. We're based in Frome, which is just 15 minutes from Westbury along the A362." },
  { question: "What technology do you use?", answer: "We build on Next.js with server-side rendering. No WordPress, no page builders. This gives you sub-2-second load times, 100/100 Lighthouse scores, and proper AI visibility." },
  { question: "What is AI-optimised web design?", answer: "AI-optimised means your site is built with structured schema markup, server-side rendering, and content designed to be understood by AI platforms like ChatGPT and Google AI Overviews. It's how local businesses get found in 2026." },
  { question: "How long does a web design project take?", answer: "Typically 4-6 weeks from brief to launch. We agree a specific timeline upfront and stick to it." },
  { question: "Can you help with local SEO for Westbury?", answer: "Yes. Local SEO is built into every project. That includes Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' searches across Westbury and Wiltshire." },
  { question: "Will you meet in person?", answer: "Yes. We're 15 minutes from Westbury and happy to meet at your premises or a local spot. We also work with businesses along the A350 corridor, from Trowbridge to Warminster." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly plans are available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. We put specific load time and accessibility scores in writing before you commit." },
];

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
    `${PAGE_URL}#service`
  ),
  generateLocalServiceSchema(
    'Web Design Westbury',
    ['Westbury Web Design', 'Web Designer Westbury', 'Website Design Westbury'],
    'Professional web design services for Westbury businesses with AI optimisation and local SEO.',
    PAGE_URL,
    areasServed,
    [
      { name: 'Simple Website', price: '2625' },
      { name: 'Standard Website', price: '5625' },
      { name: 'Complex Website', price: '9375' },
    ]
  ),
  generateLocalBusinessSchema('Westbury', areasServed),
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
