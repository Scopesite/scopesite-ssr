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
const PAGE_URL = `${BASE_URL}/web-design-bristol`;

export const metadata: Metadata = {
  title: 'Web Design Bristol | AI-First SSR Websites | ScopeSite',
  description: 'Bristol web design that gets your business recommended by ChatGPT and Google. 100/100 Lighthouse scores, SSR builds, fair pricing. Free AI visibility audit.',
  openGraph: {
    title: 'Web Design Bristol | AI-First SSR Websites',
    description: 'Bristol web design that gets your business recommended by ChatGPT and Google. 100/100 Lighthouse scores, SSR builds, fair pricing. Free AI visibility audit.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Bristol | AI-First SSR Websites',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Bristol | AI-First SSR Websites',
    description: 'Bristol web design that gets your business recommended by ChatGPT and Google. 100/100 Lighthouse scores, SSR builds, fair pricing. Free AI visibility audit.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  keywords: ['web design bristol', 'web designer bristol', 'website design bristol', 'bristol web design agency', 'website design company bristol', 'bristol website designers', 'website designers bristol', 'ai optimisation bristol'],
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data
const faqs: FAQItem[] = [
  { question: "Why choose a Somerset agency for Bristol web design?", answer: "Because Bristol agencies charge Bristol prices for work we do better at fairer rates. We're 40 minutes away - close enough for regular face-to-face meetings, but without Harbourside rent built into your quote. Better tech, better value." },
  { question: "How do your prices compare to Bristol agencies?", answer: "Our packages start from £2,625. Bristol agencies typically charge £10,000-£20,000 for comparable work. We're not cutting corners - we just don't have Bristol overheads and we don't pad quotes with 'discovery phases' and 'brand workshops'." },
  { question: "Will you meet Bristol clients in person?", answer: "Yes. We're in Bristol regularly and happy to meet at your office, a coffee shop, or co-working space. Initial consultations, design reviews, training - whatever works for you. 40 minutes is nothing." },
  { question: "Do you work with Bristol tech companies?", answer: "Yes, and they're often our favourite clients. They understand why Next.js matters, why WordPress is a liability, and why AI visibility is the future. We speak the same technical language." },
  { question: "What makes you different from Bristol web agencies?", answer: "Technology and honesty. We build on Next.js (like Nike, Netflix, TikTok), not WordPress. We optimise for AI visibility, not just Google rankings. And we price based on work, not postcode." },
  { question: "How long does a Bristol web design project take?", answer: "Typically 4-6 weeks from brief to launch. Complex projects take longer, simple ones can be faster. We give you a specific timeline and stick to it - no Bristol agency vagueness." },
  { question: "Can you help Bristol startups?", answer: "Absolutely. Startups need fast, scalable, professional sites that don't cost their entire seed round. Our tech stack (Next.js, React, Vercel) is exactly what modern startups should be building on." },
  { question: "What about ongoing support?", answer: "30 days post-launch support is included. Monthly maintenance from £150/month after that. We're not going to abandon you after launch like some Bristol agencies do." },
  { question: "Can you redesign our existing Bristol business website?", answer: "Yes. We can rebuild from scratch or add AI optimisation to existing sites on compatible platforms. We'll assess honestly and recommend the most cost-effective approach." },
  { question: "Do you understand Bristol's market?", answer: "Yes. Bristol's a unique mix of tech startups, creative agencies, aerospace, professional services, and independent businesses. We've worked across these sectors and understand what each needs." },
  { question: "Why Next.js instead of WordPress?", answer: "Speed, security, and AI optimisation. WordPress sites average 3-4 seconds load time and are constant hacking targets. Next.js gives us sub-2-second loads, enterprise security, and complete control for AI visibility." },
  { question: "Can you help with Bristol local SEO?", answer: "Yes. Local SEO is built into every project - Google Business Profile, local schema markup, citations, and content structured for 'near me' and voice searches specific to Bristol areas." },
  { question: "Do you offer payment plans?", answer: "Yes. 50% upfront, 50% on completion is standard. Monthly payment plans available for larger projects - we understand Bristol startup cash flow." },
  { question: "What industries do you work with in Bristol?", answer: "All industries, but we have particular experience with Bristol tech companies, professional services, creative agencies, hospitality, and e-commerce businesses." },
  { question: "How do revisions work?", answer: "Two rounds of design revisions included. Additional revisions at £60/hour with full transparency about when we're approaching that point." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. Specific load time and accessibility scores in writing before you commit. We deliver what we promise." },
  { question: "Why not just hire a Bristol freelancer?", answer: "You can - many are talented. But freelancers rarely have AI optimisation expertise, and availability can be unpredictable. We offer agency capability with freelancer-friendly pricing and guaranteed delivery." },
];

// Areas served
const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Bristol' },
  { type: 'City', name: 'Portishead' },
  { type: 'City', name: 'Clevedon' },
];

// Generate schema
const pageSchema = wrapInGraph([
  {
    ...generateWebPageFAQPageSchema(
      PAGE_URL,
      'Web Design Bristol | AI-First SSR Websites',
      'Bristol web design that gets your business recommended by ChatGPT and Google. 100/100 Lighthouse scores, SSR builds, fair pricing.',
      faqs,
      `${PAGE_URL}/#service`
    ),
    speakable: generateSpeakableSchema(['h1', 'section:first-of-type p:first-of-type']),
  },
  generateLocalServiceSchema(
    'Web Design Bristol',
    ['Bristol Web Design', 'Web Designer Bristol', 'Website Design Bristol'],
    'Professional web design services for Bristol businesses with AI optimisation and local SEO.',
    PAGE_URL,
    areasServed,
    [
      { name: 'Simple Website', price: '2625' },
      { name: 'Standard Website', price: '5625' },
      { name: 'Complex Website', price: '9375' },
    ]
  ),
  generateLocalBusinessSchema('Bristol', areasServed, PAGE_URL),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Web Design Bristol', url: PAGE_URL },
  ]),
]);

export default function WebDesignBristolLayout({
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
