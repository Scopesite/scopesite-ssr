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
  title: 'Web Design Somerset | SSR Websites',
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

// FAQ data for schema - buyer anxiety first, tech last
const faqItems = [
  {
    question: 'How long does it take to build a website?',
    answer:
      "Most projects take 4-8 weeks from kickoff to launch. Simple brochure sites are faster; complex builds with custom features take longer. We'll give you an accurate timeline in your quote — and we stick to it.",
  },
  {
    question: 'How much does a website cost?',
    answer:
      "Our websites start from £8,000 for established businesses. We also offer monthly payment plans with no credit checks and no interest — spreading the cost over 6, 12, or 24 months. You'll get an instant quote in under 2 minutes on our pricing page.",
  },
  {
    question: "What if I'm not happy with the design?",
    answer:
      "We build in stages with feedback checkpoints, so you're never surprised by a finished product you hate. If something's not right, we fix it. We're not done until you're genuinely happy — that's not a slogan, it's how we work.",
  },
  {
    question: 'What happens after my website launches?',
    answer:
      "We don't disappear. All packages include ongoing maintenance, security patches, performance monitoring, and support when you need changes. You focus on your business; we keep your site running perfectly.",
  },
  {
    question: 'Do I need to provide all the content?',
    answer:
      "We work with whatever you've got. Content ready? Great. Nothing prepared? We offer copywriting services or can guide you through exactly what's needed. Most clients land somewhere in the middle.",
  },
  {
    question: 'Will my website work on mobile?',
    answer:
      "We design mobile-first — over 60% of traffic is on phones now. Your site will look and perform brilliantly on everything from an iPhone SE to a 4K monitor.",
  },
  {
    question: 'What about hosting and domains?',
    answer:
      "Included. Your site runs on Vercel's global edge network — the same infrastructure behind Stripe, Notion, and Nike. We handle domains, SSL certificates, and ongoing maintenance. No hidden hosting fees.",
  },
  {
    question: 'Can you help with SEO and AI visibility?',
    answer:
      "Every site has bulletproof technical SEO built in — proper meta tags, structured data, XML sitemaps, optimised images, fast load times. For ongoing content strategy and getting recommended by ChatGPT, Claude, and Perplexity, check out our V.O.I.C.E™ service.",
  },
  {
    question: 'What technology do you use and why does it matter?',
    answer:
      "We build with Next.js and deploy on Vercel's edge network. Unlike WordPress or Wix sites, ours are Server-Side Rendered, meaning AI crawlers can actually read your content. This is why our clients show up when someone asks ChatGPT for recommendations. The tech matters, but only because of what it delivers: speed, visibility, and results.",
  },
  {
    question: 'How much should a website cost in the UK in 2026?',
    answer:
      'It depends on what you need. Template sites (Wix, Squarespace) cost £500-£2,000. Custom WordPress builds run £3,000-£10,000. Server-side rendered Next.js sites (what ScopeSite builds) range from £2,625-£15,000+. The price difference reflects the technology. SSR sites score 100/100 on Lighthouse, load in under a second, and are readable by AI crawlers. Template sites cannot match this. The investment in SSR pays back through better search rankings and AI recommendations.',
  },
  {
    question: 'What is the difference between a template website and a custom website?',
    answer:
      'Template sites (Wix, Squarespace, WordPress themes) use pre-built layouts with limited customisation. They rely on client-side JavaScript that AI crawlers cannot read. Custom SSR websites are built from scratch using Next.js, delivering complete HTML to every visitor and crawler. This means faster load times, full control over schema markup, and genuine AI visibility. Template sites work for hobby projects. Businesses that want to be found by AI need custom builds.',
  },
  {
    question: 'Why is SSR (server-side rendering) better for SEO?',
    answer:
      'When Google or an AI crawler visits a client-side rendered site (React SPA, most WordPress themes), they receive an empty HTML shell and must execute JavaScript to see content. Many crawlers skip this step entirely. SSR delivers complete HTML on every request. Google can read it immediately. AI crawlers like GPTBot and PerplexityBot can parse it without executing scripts. The result: faster indexing, better rankings, and AI recommendations.',
  },
  {
    question: 'Do I need a website if I have social media?',
    answer:
      'Yes. AI chatbots cannot recommend your Instagram page or Facebook profile. When someone asks ChatGPT "Who is the best plumber near me?", it pulls from websites with structured data, not social media posts. Your social presence supports your brand, but your website is what AI systems reference. Without a website with proper schema markup, you are invisible to the fastest-growing search channel.',
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

  // Speed Test Tool schema
  const speedTestSchema = {
    '@type': 'WebApplication',
    '@id': `${PAGE_URL}#speed-test`,
    name: 'Website Speed Test Tool',
    description:
      "Free website speed test comparing your site's performance against Google's Core Web Vitals standards. Tests mobile performance with simulated 4G throttling using Google PageSpeed Insights API.",
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'GBP',
    },
    provider: {
      '@type': 'Organization',
      name: 'ScopeSite Digital Studios',
      '@id': `${BASE_URL}/#organization`,
    },
    featureList: [
      'Google PageSpeed Insights integration',
      'Core Web Vitals analysis',
      'Mobile performance testing',
      '4G throttling simulation',
      'Side-by-side comparison',
    ],
  };

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, serviceSchema, faqSchema, speedTestSchema]} />
      {children}
    </>
  );
}
