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
const PAGE_URL = `${BASE_URL}/seo-somerset`;

export const metadata: Metadata = {
  title: 'SEO Somerset | AI-Powered Search Optimisation',
  description: 'Somerset SEO services built for AI search visibility. V.O.I.C.E methodology gets your business found by ChatGPT, Perplexity, and Google. Free audit available.',
  keywords: ['seo somerset', 'somerset seo', 'search engine optimisation somerset', 'seo services somerset', 'ai seo somerset', 'local seo somerset'],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs: FAQItem[] = [
  { question: "What does SEO in Somerset actually cost?", answer: "Our SEO work is built into every web design project. Standalone SEO audits start from £500. Ongoing SEO retainers from £300/month. We price based on work, not postcodes." },
  { question: "Do I need SEO if I already have a website?", answer: "If your website isn't showing up when someone Googles your service in Somerset, yes. And if ChatGPT doesn't mention you when asked about your industry locally, you're already behind." },
  { question: "What's the difference between SEO and AI optimisation?", answer: "Traditional SEO focuses on Google rankings. AI optimisation (what we call GEO and AEO) ensures your business gets recommended by ChatGPT, Perplexity, Claude, and voice assistants. We do both." },
  { question: "How long does SEO take to show results?", answer: "Technical SEO improvements (speed, schema, structure) show impact within weeks. Content-driven ranking improvements typically take 3-6 months. AI visibility improvements can happen faster because the field is less competitive." },
  { question: "Can you help with Google Business Profile?", answer: "Yes. GBP optimisation is part of every local SEO engagement. We optimise your profile, manage citations, and ensure NAP consistency across the web." },
  { question: "What is V.O.I.C.E methodology?", answer: "V.O.I.C.E stands for Visibility, Optimisation, Integration, Content, and Engagement. It's our proprietary framework for making businesses visible to both traditional search engines and AI platforms." },
  { question: "Do you guarantee first page rankings?", answer: "No. Anyone who guarantees rankings is lying. What we guarantee is technically sound implementation: validated schema, fast load times, proper site structure, and AI-readable content." },
  { question: "Is local SEO different from national SEO?", answer: "Yes. Local SEO targets geographic searches ('plumber in Frome'), uses local schema markup, optimises Google Business Profile, and builds local citations. We specialise in Somerset local SEO." },
  { question: "Will AI search replace Google?", answer: "Not replace, but it's already changing how people find businesses. 58% of local searches now happen through voice. ChatGPT handles 100+ million queries daily. Businesses that optimise for both will win." },
  { question: "Can you audit my current SEO?", answer: "Yes. We offer a free AI visibility audit that checks your site's schema markup, load speed, AI crawler accessibility, and content structure. Book a call and we'll run it live." },
];

const areasServed: AreaServedItem[] = [
  { type: 'AdministrativeArea', name: 'Somerset' },
  { type: 'City', name: 'Frome' },
  { type: 'City', name: 'Taunton' },
  { type: 'City', name: 'Yeovil' },
  { type: 'City', name: 'Bridgwater' },
  { type: 'City', name: 'Glastonbury' },
  { type: 'City', name: 'Wells' },
  { type: 'City', name: 'Shepton Mallet' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'SEO Somerset | AI-Powered Search Optimisation',
    'Somerset SEO services built for AI search visibility. V.O.I.C.E methodology gets your business found by ChatGPT, Perplexity, and Google.',
    faqs,
    `${PAGE_URL}#service`
  ),
  generateLocalServiceSchema(
    'SEO Somerset',
    ['Somerset SEO', 'Search Engine Optimisation Somerset', 'SEO Services Somerset'],
    'Professional SEO services for Somerset businesses with AI optimisation and local search visibility.',
    PAGE_URL,
    areasServed,
    [
      { name: 'SEO Audit', price: '500' },
      { name: 'Monthly SEO Retainer', price: '300' },
    ],
    'SEO'
  ),
  generateLocalBusinessSchema('Somerset', areasServed),
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
