import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateProfessionalServiceSchema,
  generateFAQSchema,
  generateWebPageSchema,
  generateServiceChannels,
  generateSpeakableSchema,
  schemaAggregateOfferLowOnly,
} from '@/lib/schema';
import { getAlternates } from '@/lib/hreflang-map';
import { PRICING_CONFIG } from '@/lib/pricing-config';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/web-design`;

const ULTRA_FAST_FROM = PRICING_CONFIG.ssrWebsite.base;
const WIX_FROM = PRICING_CONFIG.baseWebsite.starter;

export const metadata: Metadata = {
  title: 'Web Design Somerset | Ultra Fast AI Visible Sites | ScopeSite',
  description:
    'Professional web design in Somerset. Sites built for speed and AI visibility, with top Google speed scores and facts auto-formatted for AI to read.',
  keywords: [
    'web design Somerset',
    'AI visible website UK',
    'AI-optimised web design',
    'Next.js web design',
    'fast business websites',
    'GEO optimised websites',
    'websites visible to ChatGPT',
    'website designer Somerset',
    'AI crawler compatible websites',
  ],
  openGraph: {
    title: 'Web Design Somerset | Ultra Fast AI Visible Websites | ScopeSite Digital Studios',
    description:
      'Professional web design in Somerset. Sites built for speed and AI visibility, with strong speed scores and structured data.',
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'Web Design Somerset, Ultra Fast AI visible websites by ScopeSite',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design Somerset | Ultra Fast AI Visible Websites | ScopeSite',
    description:
      'Professional web design in Somerset. Sites built for speed and AI visibility.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  alternates: getAlternates('/web-design', BASE_URL),
};

// FAQ data for schema - buyer anxiety first, tech last
const faqItems = [
  {
    question: 'How long does it take to build a website?',
    answer:
      "Most projects take 4-8 weeks from kickoff to launch. Simple brochure sites are faster. Complex builds with custom features take longer. We give you an accurate timeline in your quote, and we stick to it.",
  },
  {
    question: 'How much does a website cost?',
    answer:
      `Client-managed Wix builds start from £${WIX_FROM.toLocaleString('en-GB')} (up to 5 pages, you manage content after launch). Our Ultra Fast AI visible premium builds start from £${ULTRA_FAST_FROM.toLocaleString('en-GB')} for up to 5 pages, with a published cap of £8,000 before we scope enterprise separately. Payment options include Pay in Full, a 6-Month Contract, a 12-Month Contract, or Pay Monthly Service — see what applies to you in an instant quote on our pricing page in under two minutes.`,
  },
  {
    question: "What if I'm not happy with the design?",
    answer:
      "We build in stages with feedback checkpoints, so you're never surprised by a finished product you hate. If something is not right, we fix it. We are not done until you are genuinely happy. That is how we work.",
  },
  {
    question: 'What happens after my website launches?',
    answer:
      "We do not disappear. All packages include ongoing maintenance, security patches, performance monitoring, and support when you need changes. You focus on your business. We keep your site running.",
  },
  {
    question: 'Do I need to provide all the content?',
    answer:
      "We work with whatever you have got. Content ready? Great. Nothing prepared? We offer copywriting services or can guide you through exactly what is needed. Most clients land somewhere in the middle.",
  },
  {
    question: 'Will my website work on mobile?',
    answer:
      "We design mobile-first. Over 60% of traffic is on phones now. Your site will look and perform well on everything from an iPhone SE to a 4K monitor.",
  },
  {
    question: 'What about hosting and domains?',
    answer:
      "Included. Your site runs on Vercel's global edge network, the same infrastructure behind Stripe, Notion, and Nike. We handle domains, SSL certificates, and ongoing maintenance. No hidden hosting fees.",
  },
  {
    question: 'Can you help with SEO and AI visibility?',
    answer:
      "Every site has strong technical SEO built in: meta tags, structured data, XML sitemaps, optimised images, fast load times. For ongoing AI SEO and getting recommended by ChatGPT, Claude, and Perplexity, see our AI SEO retainer and scan tools.",
  },
  {
    question: 'What technology do you use and why does it matter?',
    answer:
      "We build with Next.js and deploy on Vercel's edge network. Your full page is built for speed and AI visibility, so crawlers get readable HTML without fighting through empty shells. That is why our clients show up when someone asks an AI for recommendations.",
  },
  {
    question: 'How much should a website cost in the UK in 2026?',
    answer:
      `It depends what you need. DIY template sites often land around £500 to £2,000. Custom WordPress builds often run £3,000 to £10,000. Our published ScopeSite range starts at £${WIX_FROM.toLocaleString('en-GB')} for small client-managed sites and £${ULTRA_FAST_FROM.toLocaleString('en-GB')} for Ultra Fast AI visible premium builds (up to £8,000 on standard pricing before enterprise scoping). Use the calculator for an exact figure.`,
  },
  {
    question: 'What is the difference between a template website and a custom website?',
    answer:
      'Template sites use pre-built layouts with limited customisation. Many lean on client-side JavaScript that AI crawlers struggle to read. Our Ultra Fast builds deliver complete HTML to visitors and crawlers, with structured facts and fast load times. Templates can work for hobbies. If you want AI and Google to trust you, you want a proper build.',
  },
  {
    question: 'Why is an Ultra Fast build better for SEO and AI visibility?',
    answer:
      'When a crawler hits a thin client-side page, it often sees an empty shell. Our builds send full HTML on each request. Google can read it fast. AI crawlers can parse it without running heavy scripts. That means faster indexing, stronger rankings, and more chances to be cited.',
  },
  {
    question: 'Do I need a website if I have social media?',
    answer:
      'Yes. AI chatbots cannot recommend your Instagram page or Facebook profile the same way they cite a website. When someone asks for the best plumber nearby, they pull from sites with structured facts, not social posts. Your social channels support your brand. Your website is what AI systems reference.',
  },
];

const serviceOfferings = [
  {
    name: 'Ultra Fast brochure websites',
    description:
      'Fast multi-page sites for small businesses and professionals, built for speed and AI visibility from day one.',
  },
  {
    name: 'Ultra Fast e-commerce websites',
    description: 'Fast online stores with product management, payments, and quick page loads.',
  },
  {
    name: 'Website redesign and migration',
    description:
      'Move from WordPress, Wix, or Squarespace to a modern stack with better speed and AI visibility.',
  },
  {
    name: 'Campaign landing pages',
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
    { name: 'Web design', url: PAGE_URL },
  ]);

  const serviceBase = generateProfessionalServiceSchema(
    'Ultra Fast AI visible premium web design',
    'Professional web design on Next.js and Vercel. Sites built for speed and AI visibility for search engines and assistants like ChatGPT, Claude, and Perplexity. Strong Google speed scores, structured data, mobile-first design.',
    PAGE_URL,
    serviceOfferings
  );

  const serviceSchema = {
    ...serviceBase,
    '@type': 'Service',
    isRelatedTo: [
      { '@type': 'Service', '@id': `${BASE_URL}/ai-seo-services/#service` },
      { '@type': 'Service', '@id': `${BASE_URL}/schema-markup/#service` },
      { '@type': 'Service', '@id': `${BASE_URL}/generative-engine-optimisation/#service` },
    ],
    availableChannel: generateServiceChannels(),
    serviceType: 'Web design',
    category: 'Web design',
    offers: schemaAggregateOfferLowOnly(String(ULTRA_FAST_FROM)),
  };

  const faqSchema = generateFAQSchema(faqItems);

  // Speed Test Tool schema
  const speedTestSchema = {
    '@type': 'WebApplication',
    '@id': `${PAGE_URL}/#speed-test`,
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

  const wixStudioServiceSchema = {
    '@type': 'Service',
    name: 'Wix Studio Website Design',
    provider: {
      '@type': 'Organization',
      name: 'ScopeSite Digital Studios',
      url: BASE_URL,
    },
    areaServed: 'United Kingdom',
    description:
      'Client-managed Wix Studio websites you can update yourself after build. Flat-fee tier pricing with no hidden per-page costs within bands.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'GBP',
      lowPrice: '1875',
      highPrice: '7500',
      offerCount: '3',
      description:
        'Three tiers: Starter (1-5 pages) £1,875, Professional (6-10 pages) £4,125, Enterprise (11+ pages) £7,500 plus £150 per page above 10.',
    },
  };

  const webPageSchema = {
    ...generateWebPageSchema(
      'Web Design Somerset | Ultra Fast AI visible websites',
      'Professional web design in Somerset. Sites built for speed and AI visibility, with structured data and Next.js on Vercel.',
      PAGE_URL
    ),
    mainEntity: { '@id': `${PAGE_URL}/#service` },
    speakable: generateSpeakableSchema(['h1', '.faq-answer', 'h2']),
  };

  return (
    <>
      <JsonLd schema={[webPageSchema, breadcrumbSchema, serviceSchema, faqSchema, speedTestSchema, wixStudioServiceSchema]} />
      {children}
    </>
  );
}
