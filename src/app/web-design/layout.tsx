import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateProfessionalServiceSchema,
  generateFAQSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/web-design`;

export const metadata: Metadata = {
  title: 'AI-Optimized Web Design Services',
  description:
    "Websites built for humans AND AI. Lightning-fast, mobile-first designs with AI search optimization built in. Flexible payment plans available.",
  openGraph: {
    title: 'AI-Optimized Web Design Services | ScopeSite Digital Studios',
    description:
      "Websites built for humans AND AI. Lightning-fast, mobile-first designs with AI search optimization built in. Flexible payment plans available.",
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'AI-Optimized Web Design by ScopeSite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Optimized Web Design Services | ScopeSite',
    description:
      'Websites built for humans AND AI. Lightning-fast, mobile-first designs.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// FAQ data for schema
const faqItems = [
  {
    question: 'How long does it take to build a website?',
    answer:
      "Most projects take 4-8 weeks from kickoff to launch. Simple brochure sites are faster, complex e-commerce takes longer. We'll give you an accurate timeline in your quote based on exactly what you need.",
  },
  {
    question: 'Do I need to provide all the content?',
    answer:
      "We can work with whatever you've got. If you have content ready, great. If not, we offer copywriting services or can guide you through what's needed. Most clients land somewhere in the middle.",
  },
  {
    question: 'Will my website work on mobile?',
    answer:
      "Absolutely - we design mobile-first. Over 60% of web traffic is now on phones, so we build for mobile screens first and scale up to desktop. Your site will look great on everything from an iPhone to a widescreen monitor.",
  },
  {
    question: 'What platform do you build on?',
    answer:
      "It depends on your needs. We work with WordPress, Wix, Shopify, and custom-coded solutions. We'll recommend the best fit based on your requirements, technical ability, and growth plans - not what's easiest for us.",
  },
  {
    question: 'Do you help with hosting and domains?',
    answer:
      "Yes. We can set up hosting, register domains, configure emails - all the technical bits. It's included in our ongoing support, so you don't need to become an IT expert overnight.",
  },
  {
    question: 'What happens after my website launches?',
    answer:
      "We don't disappear. All our packages include ongoing maintenance and support. We handle updates, security, backups, and are on hand when you need changes. You focus on running your business.",
  },
  {
    question: 'Can you help with SEO after the site is built?',
    answer:
      "Your site will have solid technical SEO built in from the start. For ongoing SEO work - content, link building, monthly optimisation - we offer separate packages or can recommend trusted partners.",
  },
  {
    question: "What's V.O.I.C.E™ and do I need it?",
    answer:
      "V.O.I.C.E™ is our AI visibility system that makes your site findable by ChatGPT, Siri, and other AI assistants - not just Google. It's increasingly important as more people use AI for recommendations. We can add it to any package.",
  },
  {
    question: "What if I'm not happy with the design?",
    answer:
      "We build in stages with checkpoints for feedback, so you're never surprised by a finished product you hate. If something's not right, we fix it. We're not done until you're genuinely happy with the result.",
  },
];

// Service offerings
const serviceOfferings = [
  {
    name: 'Brochure Websites',
    description: 'Professional 5-10 page websites perfect for small businesses and professionals.',
  },
  {
    name: 'E-commerce Websites',
    description: 'Online stores with product management, payment processing, and inventory tracking.',
  },
  {
    name: 'Website Redesign',
    description: 'Modernize your existing website with improved design, performance, and AI visibility.',
  },
  {
    name: 'Landing Pages',
    description: 'High-converting single pages for campaigns, products, or lead generation.',
  },
];

export default function WebDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Web Design', url: PAGE_URL },
  ]);

  const serviceSchema = generateProfessionalServiceSchema(
    'AI-Optimized Web Design',
    'Professional web design services optimized for both traditional search engines and AI assistants. Mobile-first, lightning-fast websites that convert visitors into customers.',
    PAGE_URL,
    serviceOfferings
  );

  const faqSchema = generateFAQSchema(faqItems);

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, serviceSchema, faqSchema]} />
      {children}
    </>
  );
}
