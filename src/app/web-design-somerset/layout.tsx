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
const PAGE_URL = `${BASE_URL}/web-design-somerset`;

export const metadata: Metadata = {
  title: 'Web Design Somerset | AI-First Websites That Get Found',
  description: 'Somerset web design agency building AI-optimised websites that get recommended by ChatGPT. Based in Frome, serving all of Somerset. Veteran-owned, premium built.',
  keywords: ['web design somerset', 'web designer somerset', 'website design somerset', 'web design frome'],
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data
const faqs: FAQItem[] = [
  { question: "Why choose a Somerset-based web designer?", answer: "Local matters. We understand Somerset's business landscape, we're available for face-to-face meetings, and we're invested in the local economy. When you call, a real person in Frome answers." },
  { question: "How much does web design in Somerset cost?", answer: "Our packages start from £2,625 for a simple site. Most local businesses invest £5,000-£9,000. That's 25% below typical agency rates." },
  { question: "Do you only work with Somerset businesses?", answer: "No, we work UK-wide. But Somerset is home, and we enjoy working with local businesses where we can meet face-to-face." },
  { question: "Can you help with Google Business Profile?", answer: "Yes. Local SEO is part of every Somerset web design package including GBP optimisation, NAP consistency, and local schema markup." },
  { question: "What makes you different from other Somerset agencies?", answer: "We build for AI visibility using V.O.I.C.E™ methodology. Most Somerset web designers haven't heard of AI SEO. Plus, we build on Next.js, not WordPress." },
  { question: "How long does a project take?", answer: "Typically 4-6 weeks from brief to launch. Military precision means deadlines are deadlines." },
  { question: "Will you meet in person?", answer: "Absolutely. We're based in Frome and happy to meet anywhere in Somerset." },
  { question: "Do you work with specific industries?", answer: "We work across all industries but have experience with Somerset tourism, trades, professional services, and retail." },
  { question: "What ongoing support do you offer?", answer: "30 days post-launch support included. Monthly maintenance packages from £150/month after that." },
  { question: "What if I already have a website?", answer: "We can rebuild or optimise existing sites. We'll assess honestly and recommend the most cost-effective path." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion. Monthly plans available for larger projects." },
  { question: "What's included in training?", answer: "Every project includes a recorded training session on content updates and enquiry management." },
  { question: "How do you handle revisions?", answer: "Two rounds included. Additional revisions at £60/hour with full transparency." },
  { question: "Can you help with content writing?", answer: "Yes. We can write copy or structure what you provide for AI optimisation." },
  { question: "What's the benefit of Next.js over WordPress?", answer: "Speed, security, and AI optimisation. WordPress averages 3-4 seconds load time. Our sites load under 2 seconds." },
  { question: "Are you actually based in Somerset?", answer: "Yes - Frome, Somerset, BA11. Veteran-owned, locally registered." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit." },
];

// Areas served
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

// Generate schema
const pageSchema = wrapInGraph([
  {
    ...generateWebPageFAQPageSchema(
      PAGE_URL,
      'Web Design Somerset | AI-First Websites That Get Found',
      'Somerset web design agency building AI-optimised websites that get recommended by ChatGPT.',
      faqs,
      `${PAGE_URL}#service`
    ),
    speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
  },
  generateLocalServiceSchema(
    'Web Design Somerset',
    ['Somerset Web Design', 'Web Designer Somerset', 'Website Design Somerset'],
    'Professional web design services for Somerset businesses with AI optimisation and local SEO.',
    PAGE_URL,
    areasServed,
    [
      { name: 'Simple Website', price: '2625' },
      { name: 'Standard Website', price: '5625' },
      { name: 'Complex Website', price: '9375' },
    ]
  ),
  generateLocalBusinessSchema('Somerset', areasServed),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Web Design Somerset', url: PAGE_URL },
  ]),
]);

export default function WebDesignSomersetLayout({
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
