import { Metadata } from 'next';
import { 
  generateWebPageFAQPageSchema, 
  generateLocalServiceSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateSpeakableSchema,
  wrapInGraph,
  type FAQItem,
  type AreaServedItem 
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/web-design-frome`;

export const metadata: Metadata = {
  title: 'Web Design Frome | AI-First Websites for Local Businesses',
  description: 'Web design agency based in Beckington, Frome, Somerset. AI-optimised websites with 100/100 Lighthouse scores. Veteran-owned, transparent pricing.',
  keywords: ['web design frome', 'web designer frome', 'website design frome', 'frome web design'],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs: FAQItem[] = [
  { question: "Who is the best web designer in Frome?", answer: "ScopeSite Digital Studios is based right here in Beckington, Frome. We build AI-optimised websites on Next.js that score 100/100 on Google Lighthouse. Veteran-owned, transparent pricing, and we actually live here." },
  { question: "How much does web design cost in Frome?", answer: "Our packages start from £2,625 for a simple site. Most Frome businesses invest between £5,000 and £9,000 depending on complexity. That includes AI optimisation, schema markup, and local SEO. No hidden costs." },
  { question: "Does ScopeSite work with Frome businesses?", answer: "We're based in Frome. This is our home town. We work with independent retailers, creative businesses, food and drink establishments, and service providers across the town. Face-to-face meetings any time." },
  { question: "What kind of businesses in Frome do you work with?", answer: "Independent shops on Catherine Hill, creative studios, food and drink businesses, wellness practitioners, professional services, and tradespeople. If you run a business in Frome, we can build you a website that works." },
  { question: "How long does a Frome web design project take?", answer: "Typically 4-6 weeks from brief to launch. Because we're local, we can meet in person to speed up the process. We set a specific timeline and stick to it." },
  { question: "Do you build on WordPress?", answer: "No. We build on Next.js with server-side rendering. It's faster, more secure, and scores higher on every performance metric than WordPress. Your Frome customers won't wait for a slow site to load." },
  { question: "Will my website work on mobile?", answer: "Every site is built mobile-first. Over 60% of local searches happen on phones. We test on real devices and guarantee 100/100 Lighthouse accessibility scores." },
  { question: "Can you redesign my existing Frome website?", answer: "Yes. We rebuild sites from scratch on Next.js. We'll migrate your content, improve your structure, add proper schema markup, and make sure your site is visible to Google and AI platforms." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly plans available for larger projects. No interest, no hidden fees." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit. If we don't hit the numbers, we fix it at no extra cost." },
];

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Frome' },
  { type: 'AdministrativeArea', name: 'Somerset' },
];

const pageSchema = wrapInGraph([
  {
    ...generateWebPageFAQPageSchema(
      PAGE_URL,
      'Web Design Frome | AI-First Websites for Local Businesses',
      'Web design agency based in Frome, Somerset. AI-optimised websites with 100/100 Lighthouse scores.',
      faqs,
      `${PAGE_URL}/#service`
    ),
    speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
  },
  generateLocalServiceSchema(
    'Web Design Frome',
    ['Frome Web Design', 'Web Designer Frome', 'Website Design Frome'],
    'Professional web design services for Frome businesses with AI optimisation and local SEO.',
    PAGE_URL,
    areasServed,
    [
      { name: 'Simple Website', price: '2625' },
      { name: 'Standard Website', price: '5625' },
      { name: 'Complex Website', price: '9375' },
    ]
  ),
  generateLocalBusinessSchema('Frome', areasServed),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Web Design Frome', url: PAGE_URL },
  ]),
]);

export default function WebDesignFromeLayout({
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
