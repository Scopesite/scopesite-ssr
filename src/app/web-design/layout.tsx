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
  title: 'Web Design Somerset | AI-Optimised SSR Websites',
  description:
    'Professional web design in Somerset. Server-side rendered sites AI crawlers can see. 100/100 Lighthouse scores, auto-generated schema. Next.js experts.',
  keywords: [
    'web design Somerset',
    'SSR web design UK',
    'AI-optimised web design',
    'Next.js web design',
    'server-side rendered websites',
    'GEO optimised websites',
    'websites visible to ChatGPT',
    'website designer Somerset',
    'AI crawler compatible websites',
  ],
  openGraph: {
    title: 'Web Design Somerset | AI-Optimised SSR Websites | ScopeSite Digital Studios',
    description:
      'Professional web design in Somerset. Server-side rendered sites AI crawlers can see. 100/100 Lighthouse scores, auto-generated schema. Next.js experts.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Somerset - AI-Optimised SSR Websites by ScopeSite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Somerset | AI-Optimised SSR Websites | ScopeSite',
    description:
      'Professional web design in Somerset. Server-side rendered sites AI crawlers can see. 100/100 Lighthouse scores.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

// Updated FAQ data for schema - SSR focused
const faqItems = [
  {
    question: 'What technology do you use?',
    answer:
      "We build with Next.js and deploy on Vercel's edge network. This isn't a preference - it's a technical decision based on what actually works for AI visibility. Our sites are Server-Side Rendered, meaning the full page is delivered as HTML, ready for humans AND AI crawlers instantly. For content management, we use Ghost CMS as a headless backend.",
  },
  {
    question: 'What is Server-Side Rendering (SSR)?',
    answer:
      "SSR means your website's content is generated on the server before it reaches the browser. When someone (or an AI crawler) requests a page, they get the complete HTML immediately - no waiting for JavaScript to load and render. AI crawlers can't execute JavaScript, so with SSR they see your complete content instantly.",
  },
  {
    question: 'How long does it take to build a website?',
    answer:
      "Most projects take 4-8 weeks from kickoff to launch. Simple brochure sites are faster, complex builds with custom functionality take longer. We'll give you an accurate timeline in your quote based on exactly what you need.",
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
    question: 'What about hosting and domains?',
    answer:
      "Your site is deployed to Vercel's global edge network - the same infrastructure used by companies like Stripe, Notion, and McDonald's. We handle domain configuration, SSL certificates, and ongoing maintenance. It's all included.",
  },
  {
    question: 'What happens after my website launches?',
    answer:
      "We don't disappear. All our packages include ongoing maintenance and support. We handle updates, security patches, performance monitoring, and are on hand when you need changes. You focus on running your business.",
  },
  {
    question: 'Can you help with SEO and AI visibility?',
    answer:
      "Your site will have bulletproof technical SEO built in from day one - proper meta tags, structured data, XML sitemaps, optimised images, and fast load times. For ongoing content strategy and AI visibility optimization, check out our V.O.I.C.E™ service.",
  },
  {
    question: "What if I'm not happy with the design?",
    answer:
      "We build in stages with checkpoints for feedback, so you're never surprised by a finished product you hate. If something's not right, we fix it. We're not done until you're genuinely happy with the result.",
  },
];

// Service offerings - updated for SSR focus
const serviceOfferings = [
  {
    name: 'SSR Brochure Websites',
    description: 'Server-side rendered 5-10 page websites perfect for small businesses and professionals. AI-visible from day one.',
  },
  {
    name: 'SSR E-commerce Websites',
    description: 'Fast, AI-optimised online stores with product management, payment processing, and blazing-fast page loads.',
  },
  {
    name: 'Website Redesign & Migration',
    description: 'Migrate from WordPress, Wix, or Squarespace to a modern SSR architecture with improved AI visibility.',
  },
  {
    name: 'SSR Landing Pages',
    description: 'High-converting single pages built with Next.js for campaigns, products, or lead generation.',
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
    { name: 'SSR Web Design', url: PAGE_URL },
  ]);

  const serviceSchema = generateProfessionalServiceSchema(
    'SSR Web Design - Server-Side Rendered Websites',
    'Professional SSR web design services using Next.js and Vercel. Server-side rendered websites optimized for both traditional search engines and AI assistants like ChatGPT, Claude, and Perplexity. 100/100 Lighthouse scores, auto-generated schema, mobile-first design.',
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
