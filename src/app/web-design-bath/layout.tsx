import { Metadata } from 'next';
import { 
  generateWebPageFAQPageSchema, 
  generateLocalServiceSchema,
  generateBreadcrumbSchema,
  wrapInGraph,
  type FAQItem,
  type AreaServedItem 
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/web-design-bath`;

export const metadata: Metadata = {
  title: 'Web Design Bath | AI-Optimised Websites for Bath Businesses',
  description: 'Bath web design agency building AI-optimised websites that get recommended by ChatGPT. Premium quality without premium agency prices. Based in nearby Somerset.',
  keywords: ['web design bath', 'web designer bath', 'website design bath', 'bath web design agency'],
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data
const faqs: FAQItem[] = [
  { question: "Why choose a Somerset agency for Bath web design?", answer: "Because you get Bath-quality work without Bath-agency prices. We're 25 minutes away in Frome - close enough for face-to-face meetings, but without the overheads that Bath agencies bake into their quotes. Same expertise, better value." },
  { question: "How do your prices compare to Bath web design agencies?", answer: "Our packages start from £2,625. That's typically 40-60% less than comparable Bath agencies charge for similar (often inferior) work. We can charge less because we don't have Bath city centre rent built into our quotes." },
  { question: "Will you meet clients in Bath?", answer: "Absolutely. We're happy to meet anywhere in Bath - your office, a coffee shop, wherever works. We're just 25 minutes away and regularly meet Bath clients in person for consultations, design reviews, and training sessions." },
  { question: "What makes your web design different from Bath agencies?", answer: "Two things: AI optimisation and honest pricing. We build for ChatGPT and voice search visibility - something most Bath agencies don't understand. And we price based on actual work, not Bath postcode premiums." },
  { question: "Can you help Bath tourism businesses?", answer: "Yes. Tourism is a significant part of Bath's economy and we understand its specific needs - booking integration, seasonal content, multilingual considerations, and visibility for 'things to do in Bath' type searches." },
  { question: "How long does a Bath web design project take?", answer: "Typically 4-6 weeks from brief to launch. We give you a specific timeline upfront and we stick to it. No Bath agency vagueness about 'sometime next quarter'." },
  { question: "Do you understand Bath's business market?", answer: "Yes. Bath has a unique mix of heritage tourism, professional services (especially legal and financial), independent retail, and hospitality. We've worked with businesses across these sectors and understand what works locally." },
  { question: "What about ongoing support after launch?", answer: "30 days post-launch support is included with every project. After that, monthly maintenance packages start from £150/month. You're never abandoned after launch." },
  { question: "Can you help with existing Bath business websites?", answer: "Yes. We can either rebuild from scratch or add AI optimisation to existing sites if they're on compatible platforms. We'll assess your current site honestly and recommend the most cost-effective approach." },
  { question: "Do you offer payment plans?", answer: "Yes. Standard terms are 50% upfront, 50% on completion. For larger projects, we can arrange monthly payment plans that work for your cash flow." },
  { question: "What CMS do you use?", answer: "We build on Next.js with headless CMS options, not WordPress. This means faster sites, better security, and proper AI optimisation that WordPress simply can't achieve." },
  { question: "Can you help Bath businesses rank locally?", answer: "Yes. Local SEO is built into every project - Google Business Profile optimisation, local schema markup, citation building, and content structured for 'near me' and voice searches." },
  { question: "What industries in Bath do you work with?", answer: "We work across all industries but have particular experience with Bath professional services, tourism and hospitality, independent retail, and wellness businesses." },
  { question: "How do revisions work?", answer: "Two rounds of design revisions are included. Additional revisions are charged at £60/hour, but we're always transparent about when we're approaching that point." },
  { question: "Do you provide training?", answer: "Yes. Every project includes a recorded training session covering content updates, blog posts, and enquiry management. You'll be confident managing your site independently." },
  { question: "What guarantee do you offer?", answer: "100% schema validation guarantee. We also guarantee specific load time and accessibility scores in writing before you commit. If we don't deliver, we fix it at no cost." },
  { question: "Why shouldn't I just use a Bath agency?", answer: "You can - but you'll likely pay 40-60% more for similar or worse results. Bath agencies charge premium prices for their postcode, not their expertise. We charge for actual work delivered." },
];

// Areas served
const areasServed: AreaServedItem[] = [
  { type: 'City', name: 'Bath' },
  { type: 'City', name: 'Keynsham' },
  { type: 'City', name: 'Midsomer Norton' },
  { type: 'City', name: 'Radstock' },
  { type: 'City', name: 'Bradford-on-Avon' },
];

// Generate schema
const pageSchema = wrapInGraph([
  generateWebPageFAQPageSchema(
    PAGE_URL,
    'Web Design Bath | AI-Optimised Websites for Bath Businesses',
    'Bath web design agency building AI-optimised websites that get recommended by ChatGPT. Premium quality without premium agency prices.',
    faqs,
    `${PAGE_URL}#service`
  ),
  generateLocalServiceSchema(
    'Web Design Bath',
    ['Bath Web Design', 'Web Designer Bath', 'Website Design Bath'],
    'Professional web design services for Bath businesses with AI optimisation and local SEO.',
    PAGE_URL,
    areasServed,
    [
      { name: 'Simple Website', price: '2625' },
      { name: 'Standard Website', price: '5625' },
      { name: 'Complex Website', price: '9375' },
    ]
  ),
  generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Web Design Bath', url: PAGE_URL },
  ]),
]);

export default function WebDesignBathLayout({
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
