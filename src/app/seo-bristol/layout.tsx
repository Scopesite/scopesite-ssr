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
const PAGE_URL = `${BASE_URL}/seo-bristol`;

export const metadata: Metadata = {
  title: 'SEO Bristol | AI Search Optimisation',
  description: 'Bristol SEO services that go beyond Google rankings. Get your business recommended by ChatGPT, Perplexity, and AI search engines. V.O.I.C.E methodology.',
  keywords: ['seo bristol', 'bristol seo', 'search engine optimisation bristol', 'seo services bristol', 'ai seo bristol'],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs: FAQItem[] = [
  { question: "How is your SEO different from Bristol SEO agencies?", answer: "Most Bristol SEO agencies focus exclusively on Google rankings. We optimise for Google, ChatGPT, Perplexity, Claude, and voice assistants. Bristol's tech scene is competitive - AI visibility is the differentiator." },
  { question: "What does SEO in Bristol cost?", answer: "Standalone SEO audits from £500. Ongoing SEO retainers from £300/month. We don't have Bristol office rent, so our rates are significantly below city agencies for the same (or better) work." },
  { question: "Why hire a Somerset agency for Bristol SEO?", answer: "Because we deliver better technology at fairer rates. We're 40 minutes from Bristol, regularly in the city for meetings, and our V.O.I.C.E™ methodology is more advanced than what Bristol agencies offer." },
  { question: "Do you understand Bristol's market?", answer: "Yes. Bristol is a tech hub, creative capital, and competitive digital market. Startups, scale-ups, professional services, and creative agencies all need different SEO approaches. We've worked across all of them." },
  { question: "Can you help Bristol startups with SEO?", answer: "Absolutely. Startups need to build visibility fast without burning through their runway. AI SEO is often less competitive than traditional SEO, giving startups an edge established competitors haven't exploited yet." },
  { question: "What's V.O.I.C.E methodology?", answer: "V.O.I.C.E stands for Visibility, Optimisation, Integration, Content, and Engagement. It's our proprietary framework for making businesses visible to both traditional search engines and AI platforms." },
  { question: "How long until I see results?", answer: "Technical SEO improvements show impact within weeks. Content-driven ranking improvements take 3-6 months. AI visibility improvements can happen within 4-8 weeks because the field is less competitive." },
  { question: "Do you guarantee rankings?", answer: "No. Anyone who guarantees rankings is lying. We guarantee technically sound implementation: validated schema, fast load times, proper site structure, and AI-readable content." },
  { question: "Will you meet Bristol clients in person?", answer: "Yes. We're in Bristol regularly and happy to meet at your office or a coffee shop. 40 minutes is nothing." },
  { question: "Can you audit our current SEO?", answer: "Yes. We offer a free AI visibility audit that checks schema markup, load speed, AI crawler accessibility, and content structure. Book a call and we'll run it live." },
];

const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Bristol' },
  { type: 'City', name: 'Portishead' },
  { type: 'City', name: 'Clevedon' },
];

const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'SEO Bristol | AI Search Optimisation',
    'Bristol SEO services that go beyond Google rankings. Get your business recommended by ChatGPT, Perplexity, and AI search engines.',
    faqs,
    `${PAGE_URL}#service`
  ),
  generateLocalServiceSchema(
    'SEO Bristol',
    ['Bristol SEO', 'Search Engine Optimisation Bristol', 'SEO Services Bristol'],
    'Professional SEO services for Bristol businesses with AI optimisation and search visibility.',
    PAGE_URL,
    areasServed,
    [
      { name: 'SEO Audit', price: '500' },
      { name: 'Monthly SEO Retainer', price: '300' },
    ],
    'SEO'
  ),
  generateLocalBusinessSchema('Bristol', areasServed),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'SEO Bristol', url: PAGE_URL },
  ]),
]);

export default function SEOBristolLayout({
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
