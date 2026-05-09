/**
 * SCOPESITE US PRICING CONFIGURATION
 *
 * US market pricing in USD. These are NOT currency conversions from GBP.
 * US market has different price expectations for specialist services.
 *
 * Last Updated: 2026-02-01
 */

import type { PaymentPreference } from '@/types/pricing';

// ============================================
// US SERVICE TYPES
// ============================================

export type USServiceCategory = 'websiteBuilds' | 'aiVisibility' | 'customDev';

export type USServiceType =
  | 'ssrBrochure'
  | 'ssrExtended'
  | 'ssrEcommerce'
  | 'wixStandard'
  | 'wixExtended'
  | 'aiAudit'
  | 'aiRetainer'
  | 'localSeo'
  | 'schemaMarkup'
  | 'contentStrategy'
  | 'customApp'
  | 'apiIntegration'
  | 'websiteMigration';

// ============================================
// US PRICING VALUES (USD)
// ============================================

export const US_PRICING = {
  websiteBuilds: {
    ssrBrochure: {
      base: 10000,
      min: 8000,
      max: 12000,
      perPageAbove10: 600,
    },
    ssrExtended: {
      base: 15000,
      min: 12000,
      max: 18000,
      perPageAbove20: 500,
    },
    ssrEcommerce: {
      base: 20000,
      min: 15000,
      max: 25000,
    },
    wixStandard: {
      base: 4000,
      min: 3000,
      max: 5000,
      perPageAbove10: 200,
    },
    wixExtended: {
      base: 6500,
      min: 5000,
      max: 8000,
      perPageAbove15: 175,
    },
  },

  aiVisibility: {
    aiAudit: {
      price: 2500,
    },
    aiRetainer: {
      monthlyPrice: 2000,
    },
    localSeo: {
      base: 2000,
      min: 1500,
      max: 3000,
    },
    schemaMarkup: {
      base: 1500,
      min: 1000,
      max: 2500,
    },
    contentStrategy: {
      base: 3000,
      min: 2000,
      max: 4000,
    },
  },

  customDev: {
    customApp: {
      startingFrom: 15000,
      isEnquiryBased: true,
    },
    apiIntegration: {
      base: 5000,
      min: 3000,
      max: 10000,
    },
    websiteMigration: {
      base: 7500,
      min: 5000,
      max: 12000,
    },
  },

  /**
   * SSR ADD-ONS (USD)
   * Available when selecting any SSR website build
   */
  ssrAddOns: {
    animations: 3000,
    customerPortal: 7500,
    database: 5000,
    authentication: 4000,
    apiIntegration: 2500,
    multilanguage: 4500,
    realtime: 6000,
    analytics: 3000,
    scalability: 4000,
  },

  /**
   * GENERAL ADD-ONS (USD)
   * Available across service types
   */
  addOns: {
    branding: 6500,
    research: 4500,
    videoLong: 3500,
    videoShortBundle: 500,
    imageLibrary: 1000,
    complexForms: 3500,
    automationSetup: 2500,
    automationMonthly: 250,
  },

  /**
   * CONTRACT STRUCTURES
   * Same markup/discount percentages as UK
   */
  contracts: {
    oneOff: {
      discount: 0.95,
    },
    six: {
      markup: 1.03,
      ongoingMonthly: 175,
    },
    twelve: {
      markup: 1.06,
      ongoingMonthly: 125,
    },
    twentyFour: {
      markup: 1.12,
      ongoingMonthly: 100,
    },
    thirtySix: {
      markup: 1.18,
      ongoingMonthly: 85,
    },
  },

  /**
   * SSR MINIMUM MONTHLY PAYMENTS (USD)
   */
  ssrMinimums: {
    six: 1600,
    twelve: 1000,
    twentyFour: 550,
    thirtySix: 400,
  },
};

// ============================================
// US SERVICE LABELS (American English)
// ============================================

export const US_SERVICE_CATEGORIES: {
  id: USServiceCategory;
  label: string;
  services: {
    id: USServiceType;
    label: string;
    tagline: string;
    description: string;
    badge?: string;
    recommended?: boolean;
    isEnquiryBased?: boolean;
    isMonthly?: boolean;
  }[];
}[] = [
  {
    id: 'websiteBuilds',
    label: 'Website Builds',
    services: [
      {
        id: 'ssrBrochure',
        label: 'AI-First SSR Website (Brochure)',
        tagline: 'Maximum AI visibility',
        description:
          'Server-Side Rendered on Next.js. 5-10 pages with full AI visibility implementation. Auto-generated schema, 100/100 Lighthouse scores.',
        badge: '99+ Lighthouse Mobile',
        recommended: true,
      },
      {
        id: 'ssrExtended',
        label: 'AI-First SSR Website (Extended)',
        tagline: 'For larger businesses',
        description:
          '10-20 page SSR website with advanced features. Ideal for businesses with multiple service lines or locations.',
        badge: '99+ Lighthouse Mobile',
      },
      {
        id: 'ssrEcommerce',
        label: 'AI-First SSR Website (E-commerce)',
        tagline: 'Headless e-commerce',
        description:
          'Full SSR website with headless e-commerce integration (Shopify, Snipcart, or custom). AI-optimized product pages.',
        badge: '99+ Lighthouse Mobile',
      },
      {
        id: 'wixStandard',
        label: 'Client-Managed Website (Standard)',
        tagline: 'Easy to edit yourself',
        description:
          'Built on Wix Studio. 5-10 pages. Update content yourself without touching code. Great performance, GEO-ready structure.',
        badge: '60+ Lighthouse Mobile',
      },
      {
        id: 'wixExtended',
        label: 'Client-Managed Website (Extended)',
        tagline: 'More pages, more features',
        description:
          '10-15 page Wix Studio site with blog, integrations, and advanced design. CMS training included.',
        badge: '60+ Lighthouse Mobile',
      },
    ],
  },
  {
    id: 'aiVisibility',
    label: 'AI Visibility & SEO',
    services: [
      {
        id: 'aiAudit',
        label: 'AI Visibility Audit',
        tagline: 'Find out where you stand',
        description:
          'Full audit of your AI visibility across ChatGPT, Claude, Perplexity, and Google AI Overviews. Actionable report with prioritized recommendations.',
      },
      {
        id: 'aiRetainer',
        label: 'AI Visibility Retainer',
        tagline: 'Ongoing optimization',
        description:
          'Monthly AI visibility optimization: schema updates, content strategy, AI citation monitoring, and competitor tracking.',
        isMonthly: true,
      },
      {
        id: 'localSeo',
        label: 'Local SEO Setup',
        tagline: 'Dominate your area',
        description:
          'Google Business Profile optimization, local schema markup, citation building, and location-specific content strategy.',
      },
      {
        id: 'schemaMarkup',
        label: 'Schema Markup Implementation',
        tagline: 'For existing websites',
        description:
          'Add structured data to your existing website. JSON-LD schema for your business, services, FAQs, and more. Works with any platform.',
      },
      {
        id: 'contentStrategy',
        label: 'Content Strategy & Blog Setup',
        tagline: 'Content that AI recommends',
        description:
          'Blog architecture, editorial calendar, and initial content batch optimized for AI visibility and traditional SEO.',
      },
    ],
  },
  {
    id: 'customDev',
    label: 'Custom Development',
    services: [
      {
        id: 'customApp',
        label: 'Custom Web Application',
        tagline: 'Bespoke business tools',
        description:
          'CRM systems, dashboards, internal tools, client portals. Built to your exact specifications on modern infrastructure.',
        isEnquiryBased: true,
      },
      {
        id: 'apiIntegration',
        label: 'API Integration & Automation',
        tagline: 'Connect your systems',
        description:
          'Link your CRM, payment processors, booking systems, or any third-party services. Automate workflows between platforms.',
      },
      {
        id: 'websiteMigration',
        label: 'Website Migration to SSR',
        tagline: 'Move from WordPress, Squarespace, or Wix',
        description:
          'Full migration of your existing site to a server-side rendered Next.js build with AI visibility baked in.',
      },
    ],
  },
];

// ============================================
// US PRICING LABELS (American English)
// ============================================

export const US_PRICING_LABELS = {
  payments: {
    oneOff: 'Pay in Full (5% discount)' as const,
    six: '6-Month Contract' as const,
    twelve: '12-Month Contract' as const,
    twentyFour: '24-Month Contract' as const,
    thirtySix: '36-Month Contract' as const,
  } satisfies Record<PaymentPreference, string>,

  ssrAddOns: {
    animations: 'Premium Animations',
    customerPortal: 'Client Portal',
    database: 'Data Storage & Records',
    authentication: 'Member Login System',
    apiIntegration: 'Connect Your Tools',
    multilanguage: 'Multi-language Support',
    realtime: 'Live Updates & Notifications',
    analytics: 'Advanced Analytics',
    scalability: 'High-Traffic Ready',
  },

  ssrAddOnDescriptions: {
    animations:
      'Page transitions, scroll-triggered animations, micro-interactions, hover effects. Makes your site feel alive.',
    customerPortal:
      'Secure login area for your customers. Dashboard, account management, order history, document access.',
    database:
      'Store customer data, application records, content libraries. Scales infinitely as you grow.',
    authentication:
      'Secure login with Google/Apple/Microsoft, password reset, session management.',
    apiIntegration:
      'Link your CRM, payment gateways, booking systems, or any third-party service.',
    multilanguage:
      'Reach global audiences with content in multiple languages. Automatic routing by location.',
    realtime:
      'WebSocket connections, live updates, notifications, chat functionality.',
    analytics:
      'Beyond Google Analytics. Conversion tracking, funnel visualization, custom event tracking, heatmaps.',
    scalability:
      'Load balancing, advanced CDN setup, auto-scaling, performance monitoring. Built for serious traffic.',
  },

  addOns: {
    branding: 'Full Branding Package',
    research: 'Market Research + Persona',
    videoLong: 'Long-form Video Production',
    videoShortBundle: 'Short-form Video Bundle',
    imageLibrary: 'Custom Image Library',
    complexForms: 'Advanced Logic Forms',
    automationSetup: 'Automation Setup',
    automationMonthly: 'Automation Maintenance',
  },
};

/**
 * SSR INCLUDED FEATURES (American English)
 */
export const US_SSR_INCLUDED_FEATURES = [
  'AI visibility (worth $2,000/mo)',
  'Server-Side Rendering (Next.js 16)',
  'Ghost CMS Integration (headless blog)',
  'Auto-generated JSON-LD Schema',
  'Vercel Edge Deployment',
  '100/100 Lighthouse Optimization',
  'Mobile-first Responsive Design',
  'Basic SEO Setup (meta tags, sitemaps, robots.txt)',
  'SSL Certificate',
  '30 days post-launch support',
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format a number as USD currency
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get the display price for a US service
 */
export function getUSServicePrice(serviceId: USServiceType): string {
  switch (serviceId) {
    case 'ssrBrochure':
      return `${formatUSD(US_PRICING.websiteBuilds.ssrBrochure.min)} - ${formatUSD(US_PRICING.websiteBuilds.ssrBrochure.max)}`;
    case 'ssrExtended':
      return `${formatUSD(US_PRICING.websiteBuilds.ssrExtended.min)} - ${formatUSD(US_PRICING.websiteBuilds.ssrExtended.max)}`;
    case 'ssrEcommerce':
      return `${formatUSD(US_PRICING.websiteBuilds.ssrEcommerce.min)} - ${formatUSD(US_PRICING.websiteBuilds.ssrEcommerce.max)}`;
    case 'wixStandard':
      return `${formatUSD(US_PRICING.websiteBuilds.wixStandard.min)} - ${formatUSD(US_PRICING.websiteBuilds.wixStandard.max)}`;
    case 'wixExtended':
      return `${formatUSD(US_PRICING.websiteBuilds.wixExtended.min)} - ${formatUSD(US_PRICING.websiteBuilds.wixExtended.max)}`;
    case 'aiAudit':
      return formatUSD(US_PRICING.aiVisibility.aiAudit.price);
    case 'aiRetainer':
      return `${formatUSD(US_PRICING.aiVisibility.aiRetainer.monthlyPrice)}/mo`;
    case 'localSeo':
      return `${formatUSD(US_PRICING.aiVisibility.localSeo.min)} - ${formatUSD(US_PRICING.aiVisibility.localSeo.max)}`;
    case 'schemaMarkup':
      return `${formatUSD(US_PRICING.aiVisibility.schemaMarkup.min)} - ${formatUSD(US_PRICING.aiVisibility.schemaMarkup.max)}`;
    case 'contentStrategy':
      return `${formatUSD(US_PRICING.aiVisibility.contentStrategy.min)} - ${formatUSD(US_PRICING.aiVisibility.contentStrategy.max)}`;
    case 'customApp':
      return `From ${formatUSD(US_PRICING.customDev.customApp.startingFrom)}`;
    case 'apiIntegration':
      return `${formatUSD(US_PRICING.customDev.apiIntegration.min)} - ${formatUSD(US_PRICING.customDev.apiIntegration.max)}`;
    case 'websiteMigration':
      return `${formatUSD(US_PRICING.customDev.websiteMigration.min)} - ${formatUSD(US_PRICING.customDev.websiteMigration.max)}`;
  }
}

/**
 * Calculate SSR brochure price based on page count
 */
export function calculateUSSSRBrochurePrice(pages: number): number {
  const config = US_PRICING.websiteBuilds.ssrBrochure;
  if (pages <= 10) return config.base;
  return config.base + (pages - 10) * config.perPageAbove10;
}

/**
 * Calculate SSR extended price based on page count
 */
export function calculateUSSSRExtendedPrice(pages: number): number {
  const config = US_PRICING.websiteBuilds.ssrExtended;
  if (pages <= 20) return config.base;
  return config.base + (pages - 20) * config.perPageAbove20;
}

/**
 * Calculate Wix standard price based on page count
 */
export function calculateUSWixStandardPrice(pages: number): number {
  const config = US_PRICING.websiteBuilds.wixStandard;
  if (pages <= 10) return config.base;
  return config.base + (pages - 10) * config.perPageAbove10;
}

/**
 * Calculate Wix extended price based on page count
 */
export function calculateUSWixExtendedPrice(pages: number): number {
  const config = US_PRICING.websiteBuilds.wixExtended;
  if (pages <= 15) return config.base;
  return config.base + (pages - 15) * config.perPageAbove15;
}

/**
 * Check if a service type is an SSR website build
 */
export function isUSSSRService(serviceType: USServiceType): boolean {
  return (
    serviceType === 'ssrBrochure' ||
    serviceType === 'ssrExtended' ||
    serviceType === 'ssrEcommerce' ||
    serviceType === 'websiteMigration'
  );
}

/**
 * Check if a service type is a website build (shows add-ons, page count, etc.)
 */
export function isUSWebsiteBuild(serviceType: USServiceType): boolean {
  return (
    serviceType === 'ssrBrochure' ||
    serviceType === 'ssrExtended' ||
    serviceType === 'ssrEcommerce' ||
    serviceType === 'wixStandard' ||
    serviceType === 'wixExtended' ||
    serviceType === 'websiteMigration'
  );
}

/**
 * Check if a service type is a Wix build
 */
export function isUSWixService(serviceType: USServiceType): boolean {
  return serviceType === 'wixStandard' || serviceType === 'wixExtended';
}

/**
 * Check if a service type supports contract payment options
 * (standalone services like audit are one-off only)
 */
export function supportsContracts(serviceType: USServiceType): boolean {
  return (
    isUSWebsiteBuild(serviceType) ||
    serviceType === 'customApp' ||
    serviceType === 'apiIntegration'
  );
}
