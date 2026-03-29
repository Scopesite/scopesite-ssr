import { Metadata } from 'next';
import {
  generateWebPageFAQPageSchema,
  generateLocalServiceSchema,
  generateUSLocalBusinessSchema,
  generateBreadcrumbSchema,
  wrapInGraph,
  type FAQItem,
  type AreaServedItem,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/us/services`;

export const metadata: Metadata = {
  title: 'Web Design and AI Visibility Services for US Businesses',
  description:
    'AI-first web design and visibility services for American businesses. Server-side rendered websites, schema markup, answer engine optimization, and V.O.I.C.E. methodology. USD pricing.',
  alternates: {
    canonical: PAGE_URL,
    languages: {
      'en-US': PAGE_URL,
      'en-GB': BASE_URL,
      'x-default': BASE_URL,
    },
  },
  openGraph: {
    title: 'Web Design and AI Visibility Services for US Businesses | ScopeSite',
    description:
      'AI-first web design and visibility services for American businesses. Server-side rendered websites, schema markup, and answer engine optimization.',
    url: PAGE_URL,
    locale: 'en_US',
  },
};

const faqs: FAQItem[] = [
  {
    question: 'What is server-side rendering and why does it matter for AI?',
    answer:
      'Server-side rendering (SSR) generates your page content on the server before sending it to the browser. Client-side rendering (CSR), used by most React apps and WordPress page builders, depends on JavaScript to build the page after it loads. AI crawlers from ChatGPT, Perplexity, and Claude do not execute JavaScript. If your site relies on CSR, those crawlers see a blank page. SSR ensures your content is readable by every AI system from the moment it arrives.',
  },
  {
    question: 'Do you work with e-commerce sites?',
    answer:
      'Yes. We build custom e-commerce sites with Product, Offer, and Review schema markup so AI platforms can read your catalog, understand pricing, and surface your products in recommendations. E-commerce projects typically fall at the higher end of our Tier 2 pricing.',
  },
  {
    question: 'What CMS do you use?',
    answer:
      'We use headless CMS platforms like Ghost and Sanity, connected to a Next.js front end. This separates your content management from your presentation layer, giving you an easy editing experience while keeping your site fast, secure, and fully optimized for AI visibility.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'A standard website build takes 6 to 8 weeks from kickoff to launch. Complex projects with custom functionality or large content migrations typically take 8 to 12 weeks. Our AI Visibility Audit is delivered within 5 business days.',
  },
];

const areasServed: AreaServedItem[] = [
  { type: 'Country', name: 'United States' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'Web Design and AI Visibility Services for US Businesses',
    'AI-first web design and visibility services for American businesses. Server-side rendered websites, schema markup, and answer engine optimization.',
    faqs,
    `${PAGE_URL}/#service`
  ),
  generateLocalServiceSchema(
    'Web Design and AI Visibility Services',
    ['US Web Design', 'AI Visibility Services USA'],
    'AI-first web design and visibility services for businesses in the United States. Server-side rendered websites with schema markup, answer engine optimization, and V.O.I.C.E. methodology.',
    PAGE_URL,
    areasServed,
    [
      { name: 'AI Visibility Audit', price: '2500' },
      { name: 'AI-Ready Website', price: '8000' },
      { name: 'AI Visibility Retainer', price: '2000' },
    ],
    'Web Design',
    'USD'
  ),
  generateUSLocalBusinessSchema(),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'United States', url: `${BASE_URL}/us` },
    { name: 'Services', url: PAGE_URL },
  ]),
]);

export default function USServicesLayout({
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
