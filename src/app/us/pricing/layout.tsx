import { Metadata } from 'next';
import {
  generateWebPageFAQPageSchema,
  generateOfferSchema,
  generateUSLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateItemListSchema,
  wrapInGraph,
  type FAQItem,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/us/pricing`;

const faqs: FAQItem[] = [
  {
    question: 'Why is US pricing different from UK pricing?',
    answer:
      'US pricing reflects the American market. We benchmark against US-based AI visibility agencies, account for USD currency differences, and tailor our research to US search patterns and competitor data. The deliverables are the same high standard, but the pricing is set for the market you operate in.',
  },
  {
    question: 'Can I start with the audit and upgrade later?',
    answer:
      'Yes. Many US clients begin with the $2,500 AI Visibility Audit to understand where they stand. If you move to Tier 2 (AI-Ready Website) within 60 days, the full audit fee is credited toward your project cost.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept ACH bank transfers, wire transfers, and all major credit cards. All invoices are issued in USD. Payment terms are 50% upfront and 50% on completion for project work. Retainers are billed monthly in advance.',
  },
  {
    question: 'Is there a contract for the retainer?',
    answer:
      'The AI Visibility Retainer has a 3-month minimum commitment. After that, it rolls month-to-month with 30 days written notice to cancel. There are no long-term lock-ins or early termination fees after the initial period.',
  },
];

export const metadata: Metadata = {
  title: 'US Pricing: AI-Ready Websites and Visibility Packages',
  description:
    'Transparent USD pricing for AI visibility. Three tiers: Audit ($2,500), AI-Ready Website (from $8,000), Retainer ($2,000/month). No hidden fees.',
  alternates: {
    canonical: PAGE_URL,
    languages: {
      'en-US': PAGE_URL,
      'en-GB': `${BASE_URL}/pricing`,
      'x-default': `${BASE_URL}/pricing`,
    },
  },
  openGraph: {
    title: 'US Pricing: AI-Ready Websites and Visibility Packages | ScopeSite',
    description:
      'Transparent USD pricing for AI visibility services. Three clear tiers from $2,500. No hidden fees, no surprises.',
    url: PAGE_URL,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}/images/og/og-us-pricing.png`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite US Pricing - AI Visibility Packages in USD',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US Pricing: AI-Ready Websites and Visibility Packages | ScopeSite',
    description:
      'Transparent USD pricing for AI visibility services. Three clear tiers from $2,500. No hidden fees, no surprises.',
    images: [`${BASE_URL}/images/og/og-us-pricing.png`],
  },
};

const webPageFAQSchema = generateWebPageFAQPageSchema(
  PAGE_URL,
  'US Pricing: AI-Ready Websites and Visibility Packages',
  'Transparent USD pricing for AI visibility services. Three clear tiers: AI Visibility Audit ($2,500), AI-Ready Website (from $8,000), and AI Visibility Retainer ($2,000/month).',
  faqs
);

const auditOffer = generateOfferSchema(
  'AI Visibility Audit',
  'Full V.O.I.C.E. scan, schema audit, AI crawler analysis, Core Web Vitals review, competitor benchmark, strategy call, and written roadmap. Delivered in 5 business days.',
  '2500',
  'USD'
);

const websiteOffer = generateOfferSchema(
  'AI-Ready Website',
  'Custom Next.js SSR site with JSON-LD schema, V.O.I.C.E. implementation, Lighthouse 90+ scores, mobile-first design, llms.txt, and optimized robots.txt. Includes 90 days post-launch support.',
  '8000',
  'USD'
);

const retainerOffer = generateOfferSchema(
  'AI Visibility Retainer',
  'Monthly V.O.I.C.E. scan, AI citation monitoring, content strategy, schema maintenance, performance monitoring, and monthly strategy call. 3-month minimum commitment.',
  '2000',
  'USD'
);

const usLocalBusiness = generateUSLocalBusinessSchema(PAGE_URL);

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: BASE_URL },
  { name: 'United States', url: `${BASE_URL}/us` },
  { name: 'Pricing', url: PAGE_URL },
]);

const usOfferListSchema = generateItemListSchema(
  `${PAGE_URL}/#offer-list`,
  'ScopeSite US Pricing Packages',
  [auditOffer, websiteOffer, retainerOffer]
);

const pageSchema = wrapInGraph([
  webPageFAQSchema,
  usOfferListSchema,
  auditOffer,
  websiteOffer,
  retainerOffer,
  usLocalBusiness,
  breadcrumbSchema,
]);

export default function USPricingLayout({
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
