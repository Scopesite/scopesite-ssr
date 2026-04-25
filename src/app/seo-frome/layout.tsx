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
const PAGE_URL = `${BASE_URL}/seo-frome`;

export const metadata: Metadata = {
  title: 'SEO Frome: Get Found on Google and AI | ScopeSite',
  description: 'SEO services based in Frome, Somerset. Local SEO and AI visibility for Frome businesses. V.O.I.C.E methodology. Free AI audit available.',
  keywords: ['seo frome', 'frome seo', 'search engine optimisation frome', 'local seo frome'],
  openGraph: {
    title: 'SEO Frome: Get Found on Google and AI | ScopeSite',
    description: 'SEO services based in Frome, Somerset. Local SEO and AI visibility for Frome businesses. V.O.I.C.E methodology. Free AI audit available.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-seo-frome.png`,
        width: 1200,
        height: 630,
        alt: 'SEO Frome - Local SEO and AI Visibility by ScopeSite',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Frome: Get Found on Google and AI | ScopeSite',
    description: 'SEO services based in Frome, Somerset. Local SEO and AI visibility for Frome businesses. V.O.I.C.E methodology.',
    images: [`${BASE_URL}/images/og/og-seo-frome.png`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs: FAQItem[] = [
  { question: "How much does SEO cost in Frome?", answer: "SEO is built into every web design project. Standalone SEO audits start from £500. Ongoing retainers from £300/month. We're based in Frome so there's no travel markup or big-city agency pricing." },
  { question: "Can SEO help my Frome business get on ChatGPT?", answer: "Yes. Our V.O.I.C.E methodology is specifically designed to get businesses recommended by AI platforms like ChatGPT, Perplexity, and Claude. We proved it works with our client H4TLT, who went from invisible to #1 AI-recommended in 6 weeks." },
  { question: "What is local SEO?", answer: "Local SEO targets people searching for services in a specific area. When someone searches 'plumber in Frome' or asks Alexa for a local recommendation, local SEO determines whether your business shows up. It involves Google Business Profile optimisation, local schema markup, citation building, and location-specific content." },
  { question: "How long does SEO take to show results?", answer: "Technical SEO improvements like speed, schema, and site structure show impact within weeks. Content-driven ranking improvements typically take 3-6 months. AI visibility improvements can happen faster because the field is less competitive." },
  { question: "What is V.O.I.C.E. methodology?", answer: "V.O.I.C.E. stands for Visibility, Optimisation, for Intelligent, Crawler, Engines. It's our proprietary framework for making businesses visible to both traditional search engines and AI platforms like ChatGPT and Perplexity." },
  { question: "Do you guarantee first page rankings?", answer: "No. Anyone who guarantees rankings is lying. What we guarantee is technically sound implementation: validated schema, fast load times, proper site structure, and AI-readable content. The results speak for themselves." },
  { question: "Can you help with Google Business Profile?", answer: "Yes. GBP optimisation is part of every local SEO engagement. We optimise your profile, manage citations, and ensure NAP consistency across the web. Being in Frome means we can photograph your premises too." },
  { question: "What's the difference between SEO and AI optimisation?", answer: "Traditional SEO focuses on Google rankings. AI optimisation (what we call GEO and AEO) ensures your business gets recommended by ChatGPT, Perplexity, Claude, and voice assistants. We do both." },
  { question: "Will AI search replace Google?", answer: "Not replace, but it's already changing how people find businesses. 58% of local searches now happen through voice. ChatGPT handles 100+ million queries daily. Businesses that optimise for both will win." },
  { question: "Can you audit my current SEO?", answer: "Yes. We offer a free AI visibility audit that checks your site's schema markup, load speed, AI crawler accessibility, and content structure. We're in Frome, so we can walk you through the results in person." },
];

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Frome' },
  { type: 'AdministrativeArea', name: 'Somerset' },
];

const pageSchema = wrapInGraph([
  {
    ...generateWebPageFAQPageSchema(
      PAGE_URL,
      'SEO Frome | Get Your Business Found on Google and AI',
      'SEO services based in Frome, Somerset. Local SEO and AI visibility for Frome businesses. V.O.I.C.E methodology.',
      faqs,
      `${PAGE_URL}/#service`
    ),
    speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
  },
  generateLocalServiceSchema(
    'SEO Frome',
    ['Frome SEO', 'Search Engine Optimisation Frome', 'Local SEO Frome'],
    'Professional SEO services for Frome businesses with AI optimisation and local search visibility.',
    PAGE_URL,
    areasServed,
    [
      { name: 'SEO Audit', price: '500' },
      { name: 'Monthly SEO Retainer', price: '300' },
    ],
    'SEO'
  ),
  generateLocalBusinessSchema('Frome', areasServed, PAGE_URL),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'SEO Frome', url: PAGE_URL },
  ]),
]);

export default function SEOFromeLayout({
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
