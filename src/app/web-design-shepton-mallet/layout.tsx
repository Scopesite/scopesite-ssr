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
const PAGE_URL = `${BASE_URL}/web-design-shepton-mallet`;

export const metadata: Metadata = {
  title: 'Web Design Shepton Mallet | AI-Ready Websites for Local Businesses',
  description: 'Web design for Shepton Mallet businesses. AI-optimised websites by ScopeSite, based 15 minutes away in Frome. 100/100 Lighthouse scores, fair pricing.',
  keywords: ['web design shepton mallet', 'web designer shepton mallet', 'website design shepton mallet', 'shepton mallet web design'],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs: FAQItem[] = [
  { question: "Is there a web designer near Shepton Mallet?", answer: "Yes. ScopeSite is based just 15 minutes away in Frome. We work with businesses across Shepton Mallet and the surrounding Somerset area. Face-to-face meetings are easy to arrange." },
  { question: "How much does web design cost for a small business?", answer: "Our packages start from £2,625 for a simple site. Most Shepton Mallet businesses invest between £5,000 and £9,000 depending on complexity. That's well below what Bristol or Bath agencies charge." },
  { question: "What is AI-ready web design?", answer: "AI-ready means your site is built with server-side rendering, structured schema markup, and content designed to be understood by AI platforms like ChatGPT and Google AI Overviews. It's how businesses get found in 2026." },
  { question: "Do you work with small businesses in Shepton Mallet?", answer: "Yes. Most of our clients are small and medium businesses. We understand the Shepton Mallet market, from independent shops to businesses connected to the Royal Bath and West Showground." },
  { question: "What technology do you use?", answer: "We build on Next.js with server-side rendering. No WordPress, no page builders. This gives you sub-2-second load times, 100/100 Lighthouse scores, and proper AI visibility." },
  { question: "How long does a web design project take?", answer: "Typically 4-6 weeks from brief to launch. We agree a specific timeline upfront and stick to it." },
  { question: "Can you help with local SEO for Shepton Mallet?", answer: "Yes. Local SEO is built into every project. That includes Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' searches." },
  { question: "Will my website work on mobile?", answer: "Every site we build is mobile-first. Over 60% of local searches happen on mobile, so your site is designed for phones and tablets before anything else." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly plans are available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. We put specific load time and accessibility scores in writing before you commit." },
];

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
    `${PAGE_URL}#service`
  ),
  generateLocalServiceSchema(
    'Web Design Shepton Mallet',
    ['Shepton Mallet Web Design', 'Web Designer Shepton Mallet', 'Website Design Shepton Mallet'],
    'Professional web design services for Shepton Mallet businesses with AI optimisation and local SEO.',
    PAGE_URL,
    areasServed,
    [
      { name: 'Simple Website', price: '2625' },
      { name: 'Standard Website', price: '5625' },
      { name: 'Complex Website', price: '9375' },
    ]
  ),
  generateLocalBusinessSchema('Shepton Mallet', areasServed),
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
