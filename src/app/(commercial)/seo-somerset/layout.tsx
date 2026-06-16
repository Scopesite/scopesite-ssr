import { Metadata } from 'next';
import { 
  generateWebPageFAQPageSchema, 
  generateLocalServiceSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateSpeakableSchema,
  wrapInGraph,
  type FAQItem,
  type AreaServedItem 
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/seo-somerset`;

export const metadata: Metadata = {
  title: 'SEO Somerset | Technical SEO & AI Visibility Agency',
  description:
    'Technical SEO, schema and AI visibility optimisation for Somerset businesses that want stronger Google rankings and to be found by AI search.',
  keywords: ['seo somerset', 'somerset seo', 'search engine optimisation somerset', 'seo services somerset', 'ai seo somerset', 'local seo somerset'],
  openGraph: {
    title: 'SEO Somerset | Technical SEO & AI Visibility Agency',
    description:
      'Technical SEO, schema and AI visibility optimisation for Somerset businesses that want stronger Google rankings and to be found by AI search.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-seo-somerset.png`,
        width: 1200,
        height: 630,
        alt: 'SEO Somerset - AI-Powered Search Optimisation by ScopeSite',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Somerset | Technical SEO & AI Visibility Agency',
    description:
      'Technical SEO, schema and AI visibility optimisation for Somerset businesses that want stronger Google rankings and to be found by AI search.',
    images: [`${BASE_URL}/images/og/og-seo-somerset.png`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs: FAQItem[] = [
  { question: "What does SEO in Somerset actually cost?", answer: "Technical SEO is built into every web build. Standalone AI SEO uses a £750 setup and £500 per month on a 6- or 12-month commitment. We price from the published sheet, not your postcode." },
  { question: "Do I need SEO if I already have a website?", answer: "If your website isn't showing up when someone Googles your service in Somerset, yes. And if ChatGPT doesn't mention you when asked about your industry locally, you're already behind." },
  { question: "What's the difference between SEO and AI optimisation?", answer: "Traditional SEO focuses on Google rankings. AI optimisation (what we call GEO and AEO) ensures your business gets recommended by ChatGPT, Perplexity, Claude, and voice assistants. We do both." },
  { question: "How long does SEO take to show results?", answer: "Technical SEO improvements (speed, schema, structure) show impact within weeks. Content-driven ranking improvements typically take 3-6 months. AI visibility improvements can happen faster because the field is less competitive." },
  { question: "Can you help with Google Business Profile?", answer: "Yes. GBP optimisation is part of every local SEO engagement. We optimise your profile, manage citations, and ensure NAP consistency across the web." },
  { question: "What is ScopeSite's AI visibility approach?", answer: "It is ScopeSite's practical framework for making businesses visible to Google and to AI platforms such as ChatGPT and Perplexity." },
  { question: "Do you guarantee first page rankings?", answer: "No. Anyone who guarantees rankings is lying. What we guarantee is technically sound implementation: validated schema, fast load times, proper site structure, and AI-readable content." },
  { question: "Is local SEO different from national SEO?", answer: "Yes. Local SEO targets geographic searches ('plumber in Frome'), uses local schema markup, optimises Google Business Profile, and builds local citations. We specialise in Somerset local SEO." },
  { question: "Will AI search replace Google?", answer: "Not replace, but it's already changing how people find businesses. 58% of local searches now happen through voice. ChatGPT handles 100+ million queries daily. Businesses that optimise for both will win." },
  { question: "Can you audit my current SEO?", answer: "Yes. We offer a free AI visibility audit that checks your site's schema markup, load speed, AI crawler accessibility, and content structure. Book a call and we'll run it live." },
];

const areasServed: AreaServedItem[] = [
  { type: 'AdministrativeArea', name: 'Somerset' },
  { type: 'City', name: 'Bath' },
  { type: 'City', name: 'Bristol' },
  { type: 'AdministrativeArea', name: 'Wiltshire' },
  { type: 'AdministrativeArea', name: 'South West England' },
  { type: 'Country', name: 'United Kingdom' },
];

const PAGE_TITLE = 'SEO Somerset | Technical SEO & AI Visibility Agency';
const PAGE_DESCRIPTION =
  'Technical SEO, schema and AI visibility optimisation for Somerset businesses that want stronger Google rankings and to be found by AI search.';

const pageSchema = wrapInGraph([
  {
    ...generateWebPageFAQPageSchema(
      PAGE_URL,
      PAGE_TITLE,
      PAGE_DESCRIPTION,
      faqs,
      `${PAGE_URL}/#service`
    ),
    speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
  },
  generateLocalServiceSchema(
    'SEO Somerset',
    ['Somerset SEO', 'Search Engine Optimisation Somerset', 'SEO Services Somerset'],
    PAGE_DESCRIPTION,
    PAGE_URL,
    areasServed,
    [
      { name: 'SEO Audit', price: '500' },
      { name: 'Monthly SEO Retainer', price: '300' },
    ],
    'Technical SEO and AI visibility optimisation'
  ),
  generateLocalBusinessSchema('Somerset', areasServed, PAGE_URL),
  generateFAQSchema(faqs, { id: `${PAGE_URL}/#faq`, inLanguage: 'en-GB' }),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'SEO Somerset', url: PAGE_URL },
  ]),
]);

export default function SEOSomersetLayout({
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
