import { Metadata } from 'next';
import {
  generateWebPageFAQPageSchema,
  generateOfferSchema,
  generateBreadcrumbSchema,
  generateItemListSchema,
  wrapInGraph,
} from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { faqItems as faqs } from './faqs';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/us/pricing`;

export const metadata: Metadata = {
  title: 'US Pricing: AI-Ready Websites | ScopeSite',
  description:
    'Transparent USD pricing for AI visibility. Three tiers: Audit ($2,500), AI-Ready Website (from $8,000), Retainer ($2,000/month). No hidden fees.',
  alternates: {
    canonical: PAGE_URL,
    // /pricing reciprocates with /us/quote because that page contains the
    // comparable quote workflow. /us/pricing is a separate US package page, so
    // it stays self-canonical only until it has a true UK equivalent.
  },
  openGraph: {
    title: 'US Pricing: AI-Ready Websites | ScopeSite',
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
    title: 'US Pricing: AI-Ready Websites | ScopeSite',
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
  'Full AI visibility scan, schema audit, AI crawler analysis, Core Web Vitals review, competitor benchmark, strategy call, and written roadmap. Delivered in 5 business days.',
  '2500',
  'USD'
);

const websiteOffer = generateOfferSchema(
  'AI-Ready Website',
  'Custom Next.js site with structured data, AI visibility implementation, strong Lighthouse scores, mobile-first design, llms.txt, and optimized robots.txt. Includes 90 days post-launch support.',
  '8000',
  'USD'
);

const retainerOffer = generateOfferSchema(
  'AI Visibility Retainer',
  'Monthly AI visibility scan, AI citation monitoring, content strategy, schema maintenance, performance monitoring, and monthly strategy call. 3-month minimum commitment.',
  '2000',
  'USD'
);

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
