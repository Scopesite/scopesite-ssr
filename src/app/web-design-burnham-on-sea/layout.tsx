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
const PAGE_URL = `${BASE_URL}/web-design-burnham-on-sea`;

export const metadata: Metadata = {
  title: 'Web Design Burnham-on-Sea | AI-First Websites | ScopeSite',
  description: 'Burnham-on-Sea web design for tourism, hospitality, and local businesses. AI-optimised SSR websites that get recommended by ChatGPT and Google.',
  openGraph: {
    title: 'Web Design Burnham-on-Sea | AI-First Websites',
    description: 'Burnham-on-Sea web design for tourism, hospitality, and local businesses. AI-optimised SSR websites that get recommended by ChatGPT and Google.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Burnham-on-Sea | AI-First Websites',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Burnham-on-Sea | AI-First Websites',
    description: 'Burnham-on-Sea web design for tourism, hospitality, and local businesses. AI-optimised SSR websites that get recommended by ChatGPT and Google.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  keywords: ['web design burnham-on-sea', 'web designer burnham-on-sea', 'website design burnham-on-sea', 'burnham-on-sea web design'],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs: FAQItem[] = [
  { question: "Why choose a Somerset web designer for Burnham-on-Sea?", answer: "We're based in Frome, Somerset. We understand the coastal tourism market, the holiday park economy, and what Burnham-on-Sea businesses need. Local knowledge, fair pricing, and face-to-face meetings." },
  { question: "How much does web design for Burnham-on-Sea businesses cost?", answer: "Our packages start from £2,625. Most local businesses invest £5,000-£9,000. That's well below what Bristol or Exeter agencies charge for comparable work." },
  { question: "Do you understand Burnham-on-Sea's tourism market?", answer: "Yes. Burnham-on-Sea's economy is driven by coastal tourism, holiday parks, hospitality, and independent retail. We understand seasonal search patterns and how to keep your business visible year-round." },
  { question: "Can you help holiday parks and accommodation businesses?", answer: "Absolutely. Tourism and hospitality businesses benefit hugely from AI visibility. When someone asks ChatGPT 'Where to stay near Burnham-on-Sea?', proper schema markup determines whether your business gets mentioned." },
  { question: "What makes your approach different?", answer: "We build on Next.js, not WordPress. Our sites load in under 2 seconds, score 100/100 on Lighthouse, and are optimised for AI search platforms including ChatGPT, Perplexity, and voice assistants." },
  { question: "How long does a project take?", answer: "Typically 4-6 weeks from brief to launch. Specific timelines agreed upfront and respected." },
  { question: "Can you help with local SEO for Burnham-on-Sea?", answer: "Yes. Local SEO is part of every project: Google Business Profile optimisation, local schema markup, citation building, and content optimised for coastal tourism searches." },
  { question: "Do you offer ongoing support?", answer: "30 days post-launch support is included. Monthly maintenance packages from £150/month. We don't disappear after launch." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion. Monthly plans available for larger projects." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit." },
];

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Burnham-on-Sea' },
  { type: 'AdministrativeArea', name: 'Somerset' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'Web Design Burnham-on-Sea | AI-First Websites',
    'Burnham-on-Sea web design for tourism, hospitality, and local businesses.',
    faqs,
    `${PAGE_URL}/#service`,
    ['h1', '.hero-description', '.faq-answer', 'h2']
  ),
  generateLocalServiceSchema(
    'Web Design Burnham-on-Sea',
    ['Burnham-on-Sea Web Design', 'Web Designer Burnham-on-Sea', 'Website Design Burnham-on-Sea'],
    'Professional web design services for Burnham-on-Sea businesses with AI optimisation and tourism SEO.',
    PAGE_URL,
    areasServed,
    [
      { name: 'Simple Website', price: '2625' },
      { name: 'Standard Website', price: '5625' },
      { name: 'Complex Website', price: '9375' },
    ]
  ),
  generateLocalBusinessSchema('Burnham-on-Sea', areasServed, PAGE_URL),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Web Design Burnham-on-Sea', url: PAGE_URL },
  ]),
]);

export default function WebDesignBurnhamOnSeaLayout({
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
