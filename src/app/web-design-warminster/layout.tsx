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
const PAGE_URL = `${BASE_URL}/web-design-warminster`;

export const metadata: Metadata = {
  title: 'Web Design Warminster | Websites Built for AI Visibility',
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

const faqs: FAQItem[] = [
  { question: "Who does web design near Warminster?", answer: "ScopeSite is based 20 minutes away in Frome. We work with businesses across Warminster and Wiltshire, offering face-to-face meetings, local knowledge, and transparent pricing from £2,625." },
  { question: "How much does a website cost in Warminster?", answer: "Our packages start from £2,625 for a simple site. Most Warminster businesses invest between £5,000 and £9,000 depending on complexity. That's well below Bath and Salisbury agency rates." },
  { question: "Can you help my Warminster business get found online?", answer: "Yes. We build every site with AI visibility in mind. Structured schema markup, content designed for ChatGPT and voice assistants, plus local SEO so you appear in 'near me' searches around Warminster." },
  { question: "What makes your websites different from WordPress?", answer: "We build on Next.js, not WordPress. That means sub-2-second load times, 100/100 Lighthouse scores, and proper AI optimisation. Most Warminster businesses are still running slow WordPress sites that AI platforms can't read properly." },
  { question: "Do you understand the Warminster area?", answer: "Yes. We're based in Frome, just down the A362. We know Warminster's mix of local businesses, its military community, and the town's position between Bath and Salisbury. We build websites that reflect what makes the area unique." },
  { question: "How long does a web design project take?", answer: "Typically 4-6 weeks from brief to launch. We agree on a specific timeline upfront and stick to it." },
  { question: "Will you meet in person?", answer: "Absolutely. We're 20 minutes from Warminster and happy to meet at your premises or locally." },
  { question: "Do you help with local SEO for Warminster?", answer: "Yes. Local SEO is built into every project: Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' searches." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly plans available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit." },
];

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
      { name: 'Simple Website', price: '2625' },
      { name: 'Standard Website', price: '5625' },
      { name: 'Complex Website', price: '9375' },
    ]
  ),
  generateLocalBusinessSchema('Warminster', areasServed, PAGE_URL),
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
