# Pricing calculation — full source bundle (UK + US)

Generated snapshot of the quote engines: **UK** (`calculate-quote.ts` + `pricing-config.ts`) and **US** (`us-calculate-quote.ts` + `us-pricing-config.ts`). **Canonical sources remain the `.ts` files in `src/`** — edit those, not this export. For `USQuoteRequest`, see the **US QUOTE TYPES** section at the end of `src/types/pricing.ts`.

---

## 1. `src/types/pricing.ts` (lines 1–309: config shape, request, breakdown, result)

```typescript
/**
 * SCOPESITE PRICING SYSTEM
 * Types and interfaces for the quote calculator
 * 
 * NOTE: Actual pricing values are in /src/lib/pricing-config.ts
 * This file defines the shape of the data only
 * 
 * Updated: January 2026 - Split website into Client-Managed (Wix) and SSR (Next.js)
 */

// ============================================
// PRICING CONFIGURATION TYPES
// ============================================

export interface PricingConfig {
  /** Client-Managed (Wix Studio) base packages */
  baseWebsite: {
    starter: number;      // 5 pages
    professional: number; // 10 pages  
    enterprise: number;   // Unlimited pages
  };
  
  /** SSR (Next.js) pricing tiers */
  ssrWebsite: {
    base: number;           // Up to 5 pages
    perPage6to10: number;   // Pages 6-10
    perPage11to20: number;  // Pages 11-20
    perPage21plus: number;  // Pages 21+
  };
  
  /** Cost per additional page beyond package (Client-Managed only) */
  perPageRate: number;
  
  /** E-commerce pricing tiers (Client-Managed) */
  ecommerce: {
    small: number;        // Up to 50 products
    medium: number;       // 51-200 products
    large: number;        // 200+ products
  };
  
  /** Headless E-commerce pricing (SSR only) */
  headlessEcommerce: {
    shopify: number;
    snipcart: number;
    custom: number;
  };
  
  /** Custom web app pricing tiers */
  webApps: {
    simple: number;       // Quote calculators, booking widgets, contact qualifiers
    standard: number;     // Client portals, dashboards, inventory trackers
    complex: number;      // Multi-user apps, API integrations, custom workflows
  };
  
  /** SSR web app pricing tiers */
  ssrWebApps: {
    simple: number;       // Dashboard, forms
    complex: number;      // Portal, integrations
  };
  
  /** Add-on services (both website types) */
  addOns: {
    voice: number;              // V.O.I.C.Eâ„¢ AI Visibility (monthly)
    branding: number;           // Full branding package (one-off)
    research: number;           // Market research + persona (one-off)
    videoLong: number;          // Long-form video (per video)
    videoShortBundle: number;   // Short-form bundle (monthly)
    imageLibrary: number;       // Custom image library (one-off)
    complexForms: number;       // Advanced logic forms (one-off)
    automationSetup: number;    // Outreach + cart setup (one-off)
    automationMonthly: number;  // Automation maintenance (monthly)
  };
  
  /** SSR-specific add-ons */
  ssrAddOns: {
    animations: number;         // Premium Animations Package (Framer Motion)
    customerPortal: number;     // Client Customer Portal
    database: number;           // PostgreSQL Database
    authentication: number;     // User Authentication System
    apiIntegration: number;     // Per API integration
    multilanguage: number;      // Multi-language / i18n
    realtime: number;           // Real-time Features
    analytics: number;          // Custom Analytics Dashboard
    scalability: number;        // Enterprise Scalability
  };
  
  /** UK market averages for SSR add-ons */
  ssrAddOnsMarket: {
    animations: number;
    customerPortal: number;
    database: number;
    authentication: number;
    apiIntegration: number;
    multilanguage: number;
    realtime: number;
    analytics: number;
    scalability: number;
  };
  
  /** Contract payment structures */
  contracts: {
    oneOff: {
      discount: number;   // Multiplier (e.g., 0.95 = 5% discount)
    };
    six: {
      markup: number;     // Multiplier (e.g., 1.03 = 3% markup)
      ongoingMonthly: number; // Post-contract maintenance
    };
    twelve: {
      markup: number;     // Multiplier (e.g., 1.06 = 6% markup)
      ongoingMonthly: number; // Post-contract maintenance
    };
    twentyFour: {
      markup: number;     // Multiplier (e.g., 1.12 = 12% markup)
      ongoingMonthly: number; // Post-contract maintenance
    };
    thirtySix: {
      markup: number;     // Multiplier (e.g., 1.18 = 18% markup)
      ongoingMonthly: number; // Post-contract maintenance
    };
  };
  
  /** SSR minimum monthly payments by contract length */
  ssrMinimums: {
    six: number;
    twelve: number;
    twentyFour: number;
    thirtySix: number;
  };
}

// ============================================
// QUOTE REQUEST TYPES (User Input)
// ============================================

export type ProjectType = 'clientManaged' | 'ssr' | 'upgrade' | 'visibility' | 'webapp';
export type WebsiteType = 'clientManaged' | 'ssr';
export type PaymentPreference = 'oneOff' | 'six' | 'twelve' | 'twentyFour' | 'thirtySix';
/**
 * V.O.I.C.E-only commitment picker values.
 * Used when projectType === 'visibility'. Sits alongside PaymentPreference â€” build
 * flows continue to use PaymentPreference (oneOff/six/twelve/twentyFour/thirtySix).
 */
export type VoiceCommitment = 'six' | 'twelve';
export type EcommerceSize = 'none' | 'small' | 'medium' | 'large';
export type HeadlessEcommerceType = 'none' | 'shopify' | 'snipcart' | 'custom';
export type WebAppSize = 'none' | 'simple' | 'standard' | 'complex';
export type SSRWebAppSize = 'none' | 'simple' | 'complex';

export type UpgradeTargetType = 'clientManaged' | 'ssr';

export interface QuoteRequest {
  /** Step 1: Project Type */
  projectType: ProjectType;
  
  /** For 'upgrade' projects: what type are they upgrading to? */
  upgradeTargetType?: UpgradeTargetType;
  
  /** Step 2: Scope */
  scope: {
    websiteType?: WebsiteType;
    pageCount: number;
    ecommerce: EcommerceSize;
    headlessEcommerce: HeadlessEcommerceType;
    productCount?: number;
    webApp: WebAppSize;
    ssrWebApp: SSRWebAppSize;
    hasBlog: boolean;
    hasComplexForms: boolean;
    hasAutomation: boolean;
  };
  
  /** Step 3: Add-Ons */
  addOns: {
    // Common add-ons
    voice: boolean;
    branding: boolean;
    research: boolean;
    videoLong: number;        // Quantity (0-10)
    videoShortBundle: boolean;
    imageLibrary: boolean;
    // SSR-specific add-ons
    ssrAnimations: boolean;
    ssrCustomerPortal: boolean;
    ssrDatabase: boolean;
    ssrAuthentication: boolean;
    ssrApiIntegrations: number;  // Quantity (0-5+)
    ssrMultilanguage: boolean;
    ssrRealtime: boolean;
    ssrAnalytics: boolean;
    ssrScalability: boolean;
  };
  
  /** Step 4: Payment (build flows only) */
  paymentPreference: PaymentPreference;

  /** V.O.I.C.E-only commitment selection (when projectType === 'visibility') */
  voiceCommitment?: VoiceCommitment;

  /** Contact Info (captured at submission) */
  contact?: ContactInfo;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}

// ============================================
// QUOTE RESULT TYPES (Calculated Output)
// ============================================

export interface QuoteLineItem {
  id: string;
  label: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isMonthly: boolean;
  isRequired: boolean;
  isIncluded?: boolean;  // For SSR included features
}

export interface QuoteBreakdown {
  /** One-off costs */
  oneOffItems: QuoteLineItem[];
  oneOffSubtotal: number;
  
  /** Monthly costs */
  monthlyItems: QuoteLineItem[];
  monthlySubtotal: number;
  
  /** Included items (SSR) */
  includedItems?: QuoteLineItem[];
  
  /** Totals by payment type */
  totals: {
    oneOff: {
      upfront: number;
      discount: number;
      final: number;
    };
    six: {
      monthly: number;
      totalOverTerm: number;
      ongoingAfter: number;
    };
    twelve: {
      monthly: number;
      totalOverTerm: number;
      ongoingAfter: number;
    };
    twentyFour: {
      monthly: number;
      totalOverTerm: number;
      ongoingAfter: number;
    };
    thirtySix: {
      monthly: number;
      totalOverTerm: number;
      ongoingAfter: number;
    };
  };

  /**
   * V.O.I.C.E-only totals (present when projectType === 'visibility').
   * Read from VOICE_SPEC rather than the generic contracts table.
   */
  voiceTotals?: {
    six: { monthlyPrice: number; months: 6; totalCost: number };
    twelve: {
      monthlyPrice: number;
      months: 12;
      totalCost: number;
      savingsVsSixMonth: number;
    };
    setupFee: number;
    ukMarketAverage: number;
  };
}

export interface QuoteResult {
  /** Unique quote ID */
  id: string;
  
  /** Timestamp */
  createdAt: Date;
  
  /** Original request */
  request: QuoteRequest;
  
  /** Calculated breakdown */
  breakdown: QuoteBreakdown;
  
  /** Selected payment option */
  selectedPayment: PaymentPreference;
  
  /** Final figures for selected option */
  selected: {
    upfront?: number;      // For one-off only
    monthly?: number;      // For contracts
    totalOverTerm: number;
    ongoingMonthly?: number; // Post-contract
  };
}
```

---

## 2. `src/lib/pricing-config.ts` (constants, labels, VOICE_SPEC, helpers)

```typescript
/**
 * SCOPESITE PRICING CONFIGURATION
 * 
 * âœ… RESEARCH COMPLETE - DATA FROM MANUS 1.6 MAX + PERPLEXITY
 * 
 * Sources: 348 UK data points (Manus) + 60 UK sources (Perplexity)
 * Research Date: January 2026
 * 
 * TWO WEBSITE TIERS:
 * 1. Client-Managed (Wix Studio) - Budget-friendly, 25% below market
 * 2. SSR AI-First (Next.js) - Premium, market-rate pricing
 * 
 * Last Updated: 2026-01-06
 * Research Status: COMPLETE âœ…
 */

import type { PricingConfig } from '@/types/pricing';

// ============================================
// UK MARKET REFERENCE DATA
// ============================================

export const UK_MARKET_AVERAGES = {
  // Client-Managed (Wix) websites
  basicWebsite: 2500,
  professionalWebsite: 5500,
  ecommerce50: 8500,
  ecommerce200: 12000,
  ecommerce200Plus: 18000,
  
  // SSR websites (premium tier)
  ssrBase: 10000,         // Market rate for custom Next.js sites
  ssrPerPage: 600,        // Market rate per additional page
  
  // Common services
  complexForms: 3500,
  aeoGeoMonthly: 750,
  branding: 6500,
  marketResearch: 4500,
  videoLong: 3500,
  videoShortBundle: 1500,
  imageLibrary: 1200,
  automationSetup: 2500,
  automationMonthly: 250,
  ongoingMaintenance: 200,
  
  // Custom Web Apps
  webAppSimple: 3500,
  webAppStandard: 7500,
  webAppComplex: 12500,
  
  // SSR-specific add-ons market rates
  ssrAnimations: 3500,
  ssrCustomerPortal: 8000,
  ssrDatabase: 5500,
  ssrAuthentication: 4000,
  ssrApiIntegration: 3000,
  ssrMultilanguage: 4500,
  ssrHeadlessEcommerce: 12000,
  ssrRealtime: 6500,
  ssrAnalytics: 3500,
  ssrScalability: 5000,
};

// ============================================
// SCOPESITE PRICING
// ============================================

export const PRICING_CONFIG: PricingConfig = {
  /**
   * CLIENT-MANAGED WEBSITE (Wix Studio)
   * 25% below UK market average
   * 
   * UK Market: Â£2,500 (basic), Â£5,500 (pro), Â£10,000+ (enterprise)
   * Our Price: 25% cheaper = Â£1,875, Â£4,125, Â£7,500
   */
  baseWebsite: {
    starter: 1875,       // 5 pages - UK avg Â£2,500, we're 25% less
    professional: 4125,  // 10 pages - UK avg Â£5,500, we're 25% less
    enterprise: 7500,    // Unlimited - UK avg Â£10,000, we're 25% less
  },
  
  /**
   * SSR AI-FIRST WEBSITE (Next.js)
   * Premium pricing - competitive market rates
   * 
   * Base: Â£8,000 for up to 5 pages
   * Pages 6-10: +Â£500 per page
   * Pages 11-20: +Â£400 per page
   * Pages 21+: +Â£350 per page
   */
  ssrWebsite: {
    base: 8000,           // Up to 5 pages
    perPage6to10: 500,    // Pages 6-10
    perPage11to20: 400,   // Pages 11-20
    perPage21plus: 350,   // Pages 21+
  },
  
  /**
   * PER PAGE RATE (Client-Managed only)
   * Market rate: Â£200-400 per page
   * Our rate: Â£150 (competitive)
   */
  perPageRate: 150,
  
  /**
   * E-COMMERCE (Client-Managed - Wix)
   * 
   * UK Market: Â£8,500 (50 products), Â£12,000 (200), Â£18,000+ (200+)
   * Our Price: 25% cheaper
   */
  ecommerce: {
    small: 6375,    // Up to 50 products - UK avg Â£8,500
    medium: 9000,   // 51-200 products - UK avg Â£12,000
    large: 13500,   // 200+ products - UK avg Â£18,000
  },
  
  /**
   * HEADLESS E-COMMERCE (SSR only)
   * Premium headless solutions
   */
  headlessEcommerce: {
    shopify: 7500,   // Shopify headless integration
    snipcart: 5500,  // Snipcart integration
    custom: 12000,   // Custom e-commerce solution
  },
  
  /**
   * CUSTOM WEB APPS (Client-Managed)
   * 
   * UK Market: Â£3,500 (simple), Â£7,500 (standard), Â£12,500+ (complex)
   * Our Price: 25% cheaper
   */
  webApps: {
    simple: 2625,     // Quote calculators, booking widgets - UK avg Â£3,500
    standard: 5625,   // Client portals, dashboards - UK avg Â£7,500
    complex: 9375,    // Multi-user apps, API integrations - UK avg Â£12,500
  },
  
  /**
   * SSR WEB APPS (Premium)
   */
  ssrWebApps: {
    simple: 5000,     // Dashboard, forms
    complex: 12000,   // Portal, integrations
  },
  
  /**
   * ADD-ON SERVICES (Both website types)
   * All priced at 25% below UK market average
   */
  addOns: {
    /**
     * V.O.I.C.Eâ„¢ AI Visibility (Monthly) â€” Standard tier list rate
     */
    voice: 500,
    
    /**
     * Full Branding Package
     * UK Market Average: Â£6,500
     * Our Price: Â£4,875 (25% less)
     */
    branding: 4875,
    
    /**
     * Market Research + Customer Persona
     * UK Market Average: Â£4,500
     * Our Price: Â£3,375 (25% less)
     */
    research: 3375,
    
    /**
     * Video - Long Form
     * UK Market Average: Â£3,500
     * Our Price: Â£2,625 (25% less)
     */
    videoLong: 2625,
    
    /**
     * Video - Short Form Bundle (Monthly)
     * UK Market Average: Â£1,500 (one-off bundle)
     * Our Price: Â£395/mo for ongoing content
     */
    videoShortBundle: 395,
    
    /**
     * Custom Image Library
     * UK Market Average: Â£1,200
     * Our Price: Â£800 (33% less)
     */
    imageLibrary: 800,
    
    /**
     * Complex Logic Forms
     * UK Market Average: Â£3,500
     * Our Price: Â£2,625 (25% less)
     */
    complexForms: 2625,
    
    /**
     * Automation Setup
     * UK Market Average: Â£2,500
     * Our Price: Â£1,875 (25% less)
     */
    automationSetup: 1875,
    
    /**
     * Automation Maintenance (Monthly)
     * UK Market Average: Â£250/mo
     * Our Price: Â£185/mo (26% less)
     */
    automationMonthly: 185,
  },
  
  /**
   * SSR-SPECIFIC ADD-ONS
   * Premium features for Next.js builds
   */
  ssrAddOns: {
    animations: 2250,        // Premium Animations Package (Framer Motion)
    customerPortal: 5500,    // Client Customer Portal
    database: 3500,          // PostgreSQL Database
    authentication: 2750,    // User Authentication System
    apiIntegration: 1875,    // Per API integration
    multilanguage: 3375,     // Multi-language / i18n
    realtime: 4500,          // Real-time Features
    analytics: 2250,         // Custom Analytics Dashboard
    scalability: 3000,       // Enterprise Scalability
  },
  
  /**
   * UK MARKET AVERAGES FOR SSR ADD-ONS
   * For displaying savings
   */
  ssrAddOnsMarket: {
    animations: 3500,
    customerPortal: 8000,
    database: 5500,
    authentication: 4000,
    apiIntegration: 3000,
    multilanguage: 4500,
    realtime: 6500,
    analytics: 3500,
    scalability: 5000,
  },
  
  /**
   * CONTRACT STRUCTURES
   */
  contracts: {
    oneOff: {
      discount: 0.95,  // 5% discount for paying upfront
    },
    six: {
      markup: 1.03,              // 3% markup for 6 months
      ongoingMonthly: 125,       // Â£125/mo after contract
    },
    twelve: {
      markup: 1.06,              // 6% markup (industry is 15-20%)
      ongoingMonthly: 95,        // Â£95/mo after contract
    },
    twentyFour: {
      markup: 1.12,              // 12% markup (industry is 25-35%)
      ongoingMonthly: 75,        // Â£75/mo after contract
    },
    thirtySix: {
      markup: 1.18,              // 18% markup for longest term
      ongoingMonthly: 65,        // Â£65/mo after contract
    },
  },
  
  /**
   * SSR MINIMUM MONTHLY PAYMENTS
   * Minimum monthly amounts for SSR projects by contract length
   */
  ssrMinimums: {
    six: 1200,        // Â£1,200/mo minimum for 6-month
    twelve: 750,      // Â£750/mo minimum for 12-month
    twentyFour: 400,  // Â£400/mo minimum for 24-month
    thirtySix: 300,   // Â£300/mo minimum for 36-month
  },
};

/**
 * PRICING LABELS
 * Human-readable labels for display
 */
export const PRICING_LABELS = {
  projectTypes: {
    clientManaged: 'Client-Managed Website',
    ssr: 'SSR AI-First Website',
    upgrade: 'Website Upgrade',
    visibility: 'AI Visibility Only (V.O.I.C.Eâ„¢)',
    webapp: 'Custom Web App',
  },
  projectDescriptions: {
    clientManaged: 'Built on Wix Studio. Easy to edit yourself. Great performance.',
    ssr: 'Server-Side Rendered on Next.js. Maximum AI visibility.',
    upgrade: 'Modernize your existing site with new features and design (40% discount)',
    visibility: 'Get found by ChatGPT, Claude, and other AI assistants',
    webapp: 'Bespoke tools and applications to automate your business',
  },
  projectBadges: {
    clientManaged: '60+ Lighthouse Mobile',
    ssr: '99+ Lighthouse Mobile',
  },
  packages: {
    starter: 'Starter (5 Pages)',
    professional: 'Professional (10 Pages)',
    enterprise: 'Enterprise (Unlimited)',
  },
  ecommerce: {
    none: 'No E-commerce',
    small: 'Small Shop (up to 50 products)',
    medium: 'Medium Shop (51-200 products)',
    large: 'Large Shop (200+ products)',
  },
  headlessEcommerce: {
    none: 'No E-commerce',
    shopify: 'Headless E-commerce (Shopify)',
    snipcart: 'Headless E-commerce (Snipcart)',
    custom: 'Custom E-commerce Solution',
  },
  webApps: {
    none: 'No Web App',
    simple: 'Simple (Calculator, Widget, Qualifier)',
    standard: 'Standard (Portal, Dashboard, Tracker)',
    complex: 'Complex (Multi-user, API, Custom Workflows)',
  },
  ssrWebApps: {
    none: 'No Web App',
    simple: 'Simple App (dashboard, forms)',
    complex: 'Complex App (portal, integrations)',
  },
  addOns: {
    voice: 'V.O.I.C.Eâ„¢ AI Visibility',
    branding: 'Full Branding Package',
    research: 'Market Research + Persona',
    videoLong: 'Long-form Video Production',
    videoShortBundle: 'Short-form Video Bundle',
    imageLibrary: 'Custom Image Library',
    complexForms: 'Advanced Logic Forms',
    automationSetup: 'Automation Setup',
    automationMonthly: 'Automation Maintenance',
  },
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
    animations: 'Page transitions, scroll-triggered animations, micro-interactions, hover effects. Makes your site feel alive.',
    customerPortal: 'Secure login area for your customers. Dashboard, account management, order history, document access.',
    database: 'Store customer data, application records, content libraries. Scales infinitely as you grow.',
    authentication: 'Secure login with Google/Apple/Microsoft, password reset, session management.',
    apiIntegration: 'Link your CRM, payment gateways, booking systems, or any third-party service.',
    multilanguage: 'Reach global audiences with content in multiple languages. Automatic routing by location.',
    realtime: 'WebSocket connections, live updates, notifications, chat functionality.',
    analytics: 'Beyond Google Analytics. Conversion tracking, funnel visualization, custom event tracking, heatmaps.',
    scalability: 'Load balancing, advanced CDN setup, auto-scaling, performance monitoring. Built for serious traffic.',
  },
  payments: {
    oneOff: 'Pay in Full (5% discount)',
    six: '6-Month Contract',
    twelve: '12-Month Contract',
    twentyFour: '24-Month Contract',
    thirtySix: '36-Month Contract',
  },
};

/**
 * SSR INCLUDED FEATURES
 * What's included in the SSR base price
 */
export const SSR_INCLUDED_FEATURES = [
  'V.O.I.C.Eâ„¢ AI Visibility (worth Â£500/mo)',
  'Server-Side Rendering (Next.js 16)',
  'Ghost CMS Integration (headless blog)',
  'Auto-generated JSON-LD Schema',
  'Vercel Edge Deployment',
  '100/100 Lighthouse Optimisation',
  'Mobile-first Responsive Design',
  'Basic SEO Setup (meta tags, sitemaps, robots.txt)',
  'SSL Certificate',
  '30 days post-launch support',
];

/**
 * CLIENT-MANAGED PACKAGE FEATURES
 */
export const PACKAGE_FEATURES = {
  starter: [
    'Up to 5 pages',
    'Mobile responsive design',
    'Contact form',
    'Basic SEO setup',
    'Google Analytics (GA4)',
    'Social media integration',
    'Wix Studio CMS access',
    '1 month free support',
  ],
  professional: [
    'Up to 10 pages',
    'Everything in Starter',
    'Animations & micro-interactions',
    'Blog/CMS functionality',
    'E-commerce ready (up to 50 products)',
    'Advanced SEO implementation',
    'Third-party integrations (up to 3)',
    'CMS training session',
    '3 months free support',
  ],
  enterprise: [
    'Unlimited pages',
    'Everything in Professional',
    'Advanced integrations (unlimited)',
    'E-commerce (up to 700 products)',
    'AI Chatbot with brand training',
    '4x SEO blog posts per month',
    'Custom graphics & creative writing',
    'Priority support',
    '6 months free support',
  ],
};

/**
 * V.O.I.C.Eâ„¢ FEATURES
 */
export const VOICE_FEATURES = [
  'Answer Engine Optimization (AEO)',
  'Geographic/Local SEO (GEO)',
  'Traditional SEO foundations',
  'Schema.org markup implementation',
  'ChatGPT/Claude visibility optimization',
  'Voice search optimization',
  'Monthly AI visibility reporting',
  'Competitor AI presence monitoring',
];

/**
 * V.O.I.C.Eâ„¢ STANDALONE RETAINER SPEC
 *
 * Used specifically for the standalone V.O.I.C.E flow (projectType === 'visibility')
 * and the marketing copy on the /voice page. Additive to PRICING_CONFIG.addOns.voice,
 * which remains the source of truth for the SSR-bundle and Wix-add-on paths.
 *
 * Source of truth for:
 *   - /pricing V.O.I.C.E-only quote wizard
 *   - /voice page FAQ copy (visible + JSON-LD)
 *   - /pricing JSON-LD schema offers (generatePricingSchema)
 */
export const VOICE_SPEC = {
  monthlyPrice: 500,
  setupFee: 750,
  ukMarketAverage: 750,

  commitmentOptions: {
    six: {
      months: 6,
      monthlyPrice: 500,
      label: '6-Month Commitment',
      badge: 'RECOMMENDED',
      description: 'Minimum commitment, cancel anytime after that.',
      totalCost: 750 + 500 * 6,
    },
    twelve: {
      months: 12,
      monthlyPrice: 500,
      label: '12-Month Commitment',
      badge: 'BEST VALUE',
      description: 'Same monthly rate with a longer commitment horizon for sustained AI visibility work.',
      totalCost: 750 + 500 * 12,
      savingsVsSixMonth: 0,
    },
  },

  minimumCommitmentMonths: 6,
  noticePeriodDays: 30,

  guarantee: {
    enabled: true,
    name: '80 Score Guarantee',
    activateAfterMonths: 3,
    targetScore: 80,
    sustainedDays: 30,
    summary:
      'After 3 months on the retainer, if your AI Visibility Score is below 80 and you have followed our direction, you pay nothing more until your score hits 80 and holds there for 30 consecutive days.',
    conditions: [
      'Client must be 3+ months into the retainer',
      'Client must have followed ScopeSite direction and recommendations',
      'Score measured on ScopeSite AI Visibility Score methodology',
      'Pause on billing continues until score hits 80+ and holds for 30 consecutive days',
    ],
  },

  included: {
    monthlyDeliverables: [
      'Monthly AI visibility audit across ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews',
      'Tracked AI Visibility Score with month-on-month progress reporting',
      'Competitor AI visibility monitoring (up to 3 named competitors)',
      'Schema markup updates and JSON-LD optimisation as your content grows',
      'AEO content recommendations based on what your audience is asking AI',
      'GEO ongoing refinements',
      'Monthly written report with findings, wins, and next moves',
      'One monthly 30-minute review call',
    ],
    technicalOptimisation: [
      'robots.txt and llms.txt maintenance',
      'Speakable schema for voice search',
      '.well-known/ai-context.json management',
      'Internal linking structure monitoring',
      'FAQ schema optimisation',
      'Author, Organization, and Person schema maintenance',
    ],
    contentSupport: [
      'Content gap identification against competitors',
      'Quarterly review of target AI-search questions',
      'Alerts if AI visibility drops',
    ],
    extras: [
      'Direct access to Dan during UK business hours for urgent visibility queries',
      'Shareable reports you can use in your own marketing',
      'Priority access to new V.O.I.C.E features',
      'No bolt-on fees for schema updates or technical changes within scope',
    ],
  },

  notIncluded: [
    'Content writing or copywriting (separate service)',
    'New page builds (charged as standard dev work)',
    'Video production, image creation, or branding',
    'Paid advertising management',
    'Social media management',
  ],
} as const;

/**
 * WEB APP FEATURES
 */
export const WEB_APP_FEATURES = {
  simple: [
    'Single-purpose tool',
    'Quote calculator or booking widget',
    'Contact qualification form',
    'Basic data capture',
    'Email notifications',
    'Mobile responsive',
    'Branded to your design',
    '1 month support',
  ],
  standard: [
    'Everything in Simple',
    'Client portal or dashboard',
    'User authentication',
    'Data storage & retrieval',
    'Multiple user roles',
    'Export functionality (CSV/PDF)',
    'Third-party integrations (up to 3)',
    '3 months support',
  ],
  complex: [
    'Everything in Standard',
    'Multi-user collaboration',
    'Advanced API integrations',
    'Custom workflow automation',
    'Real-time data sync',
    'Advanced reporting & analytics',
    'Scalable architecture',
    'Priority support',
    '6 months support',
  ],
};

/**
 * MARKET COMPARISON MESSAGING
 */
export const MARKET_COMPARISON = {
  discount: 25,
  message: "25% below UK market average",
  tagline: "Premium quality, fair pricing",
  sources: "Based on research from 348 UK agencies and industry reports",
};

/**
 * VALIDATION LIMITS
 */
export const LIMITS = {
  minPages: 1,
  minPagesSSR: 5,
  maxPages: 100,
  maxProducts: 10000,
  maxVideos: 10,
  maxApiIntegrations: 10,
};

/**
 * CALCULATE SSR PRICE FOR PAGE COUNT
 */
export function calculateSSRPrice(pages: number): number {
  const { base, perPage6to10, perPage11to20, perPage21plus } = PRICING_CONFIG.ssrWebsite;
  
  if (pages <= 5) return base;
  
  let total = base;
  
  // Pages 6-10
  if (pages > 5) {
    const pagesIn6to10 = Math.min(pages - 5, 5);
    total += pagesIn6to10 * perPage6to10;
  }
  
  // Pages 11-20
  if (pages > 10) {
    const pagesIn11to20 = Math.min(pages - 10, 10);
    total += pagesIn11to20 * perPage11to20;
  }
  
  // Pages 21+
  if (pages > 20) {
    const pagesOver20 = pages - 20;
    total += pagesOver20 * perPage21plus;
  }
  
  return total;
}

/**
 * CALCULATE PACKAGE FROM PAGE COUNT (Client-Managed)
 */
export function getPackageForPageCount(pages: number): 'starter' | 'professional' | 'enterprise' {
  if (pages <= 5) return 'starter';
  if (pages <= 10) return 'professional';
  return 'enterprise';
}

/**
 * GET ADDITIONAL PAGES BEYOND PACKAGE (Client-Managed)
 */
export function getAdditionalPages(pages: number): number {
  if (pages <= 5) return 0;
  if (pages <= 10) return Math.max(0, pages - 5);
  return Math.max(0, pages - 10);
}

/**
 * GET MARKET COMPARISON DATA
 */
export function getMarketComparison(service: keyof typeof UK_MARKET_AVERAGES, ourPrice: number): {
  marketAverage: number;
  savings: number;
  percentOff: number;
} {
  const marketAverage = UK_MARKET_AVERAGES[service];
  const savings = marketAverage - ourPrice;
  const percentOff = Math.round((savings / marketAverage) * 100);
  
  return {
    marketAverage,
    savings,
    percentOff,
  };
}
```

---

## 3. `src/lib/calculate-quote.ts` (engine)

```typescript
/**
 * SCOPESITE QUOTE CALCULATION ENGINE
 * 
 * Calculates pricing based on user selections
 * Uses pricing data from pricing-config.ts
 * 
 * Updated: January 2026 - Added SSR pricing calculations
 */

import {
  PRICING_CONFIG,
  UK_MARKET_AVERAGES,
  VOICE_SPEC,
  getPackageForPageCount,
  getAdditionalPages,
  calculateSSRPrice,
} from './pricing-config';
import type {
  QuoteRequest,
  QuoteResult,
  QuoteBreakdown,
  QuoteLineItem,
  PaymentPreference,
} from '@/types/pricing';

/**
 * Generate a unique quote ID
 */
function generateQuoteId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `QT-${timestamp}-${random}`.toUpperCase();
}

/**
 * Calculate the full quote breakdown
 */
export function calculateQuote(request: Partial<QuoteRequest>): QuoteBreakdown {
  const oneOffItems: QuoteLineItem[] = [];
  const monthlyItems: QuoteLineItem[] = [];
  const includedItems: QuoteLineItem[] = [];

  // Only calculate if we have project type
  if (!request.projectType) {
    return createEmptyBreakdown();
  }

  // === SSR AI-FIRST WEBSITE ===
  if (request.projectType === 'ssr') {
    const pageCount = Math.max(request.scope?.pageCount || 5, 5); // Minimum 5 pages
    const basePrice = calculateSSRPrice(pageCount);

    oneOffItems.push({
      id: 'ssr-website',
      label: `SSR AI-First Website (${pageCount} pages)`,
      description: 'Next.js 16, Vercel Edge, Ghost CMS',
      quantity: 1,
      unitPrice: basePrice,
      total: basePrice,
      isMonthly: false,
      isRequired: true,
    });

    // Add included features (for display)
    includedItems.push(
      { id: 'ssr-ghost', label: 'Ghost CMS Blog', quantity: 1, unitPrice: 0, total: 0, isMonthly: false, isRequired: true, isIncluded: true },
      { id: 'ssr-schema', label: 'Auto JSON-LD Schema', quantity: 1, unitPrice: 0, total: 0, isMonthly: false, isRequired: true, isIncluded: true },
      { id: 'ssr-vercel', label: 'Vercel Edge Deployment', quantity: 1, unitPrice: 0, total: 0, isMonthly: false, isRequired: true, isIncluded: true },
    );

    // Headless E-commerce (SSR only)
    if (request.scope?.headlessEcommerce && request.scope.headlessEcommerce !== 'none') {
      const ecomType = request.scope.headlessEcommerce;
      const ecomPrice = PRICING_CONFIG.headlessEcommerce[ecomType];
      oneOffItems.push({
        id: 'headless-ecommerce',
        label: `Headless E-commerce (${ecomType.charAt(0).toUpperCase() + ecomType.slice(1)})`,
        description: ecomType === 'shopify' ? 'Excludes Shopify subscription fees' : undefined,
        quantity: 1,
        unitPrice: ecomPrice,
        total: ecomPrice,
        isMonthly: false,
        isRequired: false,
      });
    }

    // SSR Web App
    if (request.scope?.ssrWebApp && request.scope.ssrWebApp !== 'none') {
      const appSize = request.scope.ssrWebApp;
      const appPrice = PRICING_CONFIG.ssrWebApps[appSize];
      oneOffItems.push({
        id: 'ssr-web-app',
        label: `Web App (${appSize === 'simple' ? 'Dashboard, Forms' : 'Portal, Integrations'})`,
        quantity: 1,
        unitPrice: appPrice,
        total: appPrice,
        isMonthly: false,
        isRequired: false,
      });
    }

    // SSR-specific add-ons
    if (request.addOns?.ssrAnimations) {
      oneOffItems.push({
        id: 'ssr-animations',
        label: 'Premium Animations Package',
        description: 'Framer Motion transitions, scroll animations',
        quantity: 1,
        unitPrice: PRICING_CONFIG.ssrAddOns.animations,
        total: PRICING_CONFIG.ssrAddOns.animations,
        isMonthly: false,
        isRequired: false,
      });
    }

    if (request.addOns?.ssrCustomerPortal) {
      oneOffItems.push({
        id: 'ssr-customer-portal',
        label: 'Client Customer Portal',
        quantity: 1,
        unitPrice: PRICING_CONFIG.ssrAddOns.customerPortal,
        total: PRICING_CONFIG.ssrAddOns.customerPortal,
        isMonthly: false,
        isRequired: false,
      });
    }

    if (request.addOns?.ssrDatabase) {
      oneOffItems.push({
        id: 'ssr-database',
        label: 'PostgreSQL Database',
        quantity: 1,
        unitPrice: PRICING_CONFIG.ssrAddOns.database,
        total: PRICING_CONFIG.ssrAddOns.database,
        isMonthly: false,
        isRequired: false,
      });
    }

    if (request.addOns?.ssrAuthentication) {
      oneOffItems.push({
        id: 'ssr-authentication',
        label: 'User Authentication System',
        quantity: 1,
        unitPrice: PRICING_CONFIG.ssrAddOns.authentication,
        total: PRICING_CONFIG.ssrAddOns.authentication,
        isMonthly: false,
        isRequired: false,
      });
    }

    if (request.addOns?.ssrApiIntegrations && request.addOns.ssrApiIntegrations > 0) {
      oneOffItems.push({
        id: 'ssr-api-integrations',
        label: 'API Integrations',
        description: 'e.g., Stripe, HubSpot, Calendly',
        quantity: request.addOns.ssrApiIntegrations,
        unitPrice: PRICING_CONFIG.ssrAddOns.apiIntegration,
        total: PRICING_CONFIG.ssrAddOns.apiIntegration * request.addOns.ssrApiIntegrations,
        isMonthly: false,
        isRequired: false,
      });
    }

    if (request.addOns?.ssrMultilanguage) {
      oneOffItems.push({
        id: 'ssr-multilanguage',
        label: 'Multi-language / i18n',
        quantity: 1,
        unitPrice: PRICING_CONFIG.ssrAddOns.multilanguage,
        total: PRICING_CONFIG.ssrAddOns.multilanguage,
        isMonthly: false,
        isRequired: false,
      });
    }

    if (request.addOns?.ssrRealtime) {
      oneOffItems.push({
        id: 'ssr-realtime',
        label: 'Real-time Features',
        quantity: 1,
        unitPrice: PRICING_CONFIG.ssrAddOns.realtime,
        total: PRICING_CONFIG.ssrAddOns.realtime,
        isMonthly: false,
        isRequired: false,
      });
    }

    if (request.addOns?.ssrAnalytics) {
      oneOffItems.push({
        id: 'ssr-analytics',
        label: 'Custom Analytics Dashboard',
        quantity: 1,
        unitPrice: PRICING_CONFIG.ssrAddOns.analytics,
        total: PRICING_CONFIG.ssrAddOns.analytics,
        isMonthly: false,
        isRequired: false,
      });
    }

    if (request.addOns?.ssrScalability) {
      oneOffItems.push({
        id: 'ssr-scalability',
        label: 'Enterprise Scalability',
        quantity: 1,
        unitPrice: PRICING_CONFIG.ssrAddOns.scalability,
        total: PRICING_CONFIG.ssrAddOns.scalability,
        isMonthly: false,
        isRequired: false,
      });
    }
  }

  // === CLIENT-MANAGED WEBSITE (Wix Studio) ===
  if (request.projectType === 'clientManaged' || request.projectType === 'upgrade') {
    const pageCount = request.scope?.pageCount || 5;
    const packageType = getPackageForPageCount(pageCount);
    const basePrice = PRICING_CONFIG.baseWebsite[packageType];
    const additionalPages = getAdditionalPages(pageCount);
    const additionalPagesPrice = additionalPages * PRICING_CONFIG.perPageRate;

    // Upgrade discount (40% of new site price)
    const upgradeMultiplier = request.projectType === 'upgrade' ? 0.6 : 1;

    oneOffItems.push({
      id: 'base-website',
      label: `${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Website Package`,
      description: request.projectType === 'upgrade' ? '40% discount for upgrade' : 'Built on Wix Studio',
      quantity: 1,
      unitPrice: Math.round(basePrice * upgradeMultiplier),
      total: Math.round(basePrice * upgradeMultiplier),
      isMonthly: false,
      isRequired: true,
    });

    if (additionalPages > 0) {
      oneOffItems.push({
        id: 'additional-pages',
        label: 'Additional Pages',
        description: `${additionalPages} pages beyond package`,
        quantity: additionalPages,
        unitPrice: PRICING_CONFIG.perPageRate,
        total: Math.round(additionalPagesPrice * upgradeMultiplier),
        isMonthly: false,
        isRequired: true,
      });
    }

    // E-commerce (Client-Managed)
    if (request.scope?.ecommerce && request.scope.ecommerce !== 'none') {
      const ecomPrice = PRICING_CONFIG.ecommerce[request.scope.ecommerce];
      oneOffItems.push({
        id: 'ecommerce',
        label: `E-commerce (${request.scope.ecommerce})`,
        quantity: 1,
        unitPrice: ecomPrice,
        total: ecomPrice,
        isMonthly: false,
        isRequired: false,
      });
    }

    // Web App (Client-Managed)
    if (request.scope?.webApp && request.scope.webApp !== 'none') {
      const webAppPrice = PRICING_CONFIG.webApps[request.scope.webApp as keyof typeof PRICING_CONFIG.webApps];
      oneOffItems.push({
        id: 'web-app',
        label: `Custom Web App (${request.scope.webApp.charAt(0).toUpperCase() + request.scope.webApp.slice(1)})`,
        quantity: 1,
        unitPrice: webAppPrice,
        total: webAppPrice,
        isMonthly: false,
        isRequired: false,
      });
    }

    // Complex Forms
    if (request.scope?.hasComplexForms) {
      oneOffItems.push({
        id: 'complex-forms',
        label: 'Advanced Logic Forms',
        quantity: 1,
        unitPrice: PRICING_CONFIG.addOns.complexForms,
        total: PRICING_CONFIG.addOns.complexForms,
        isMonthly: false,
        isRequired: false,
      });
    }

    // Automation
    if (request.scope?.hasAutomation) {
      oneOffItems.push({
        id: 'automation-setup',
        label: 'Automation Setup',
        quantity: 1,
        unitPrice: PRICING_CONFIG.addOns.automationSetup,
        total: PRICING_CONFIG.addOns.automationSetup,
        isMonthly: false,
        isRequired: false,
      });
      monthlyItems.push({
        id: 'automation-monthly',
        label: 'Automation Maintenance',
        quantity: 1,
        unitPrice: PRICING_CONFIG.addOns.automationMonthly,
        total: PRICING_CONFIG.addOns.automationMonthly,
        isMonthly: true,
        isRequired: false,
      });
    }
  }

  // === WEB APP (standalone) ===
  if (request.projectType === 'webapp') {
    const webAppSize = request.scope?.webApp || 'simple';
    if (webAppSize !== 'none') {
      const webAppPrice = PRICING_CONFIG.webApps[webAppSize as keyof typeof PRICING_CONFIG.webApps];
      oneOffItems.push({
        id: 'web-app',
        label: `Custom Web App (${webAppSize.charAt(0).toUpperCase() + webAppSize.slice(1)})`,
        quantity: 1,
        unitPrice: webAppPrice,
        total: webAppPrice,
        isMonthly: false,
        isRequired: true,
      });
    }
  }

  // === COMMON ADD-ONS (All project types) ===
  
  // V.O.I.C.Eâ„¢ AI Visibility
  // For SSR projects (or upgrades TO SSR), V.O.I.C.E is INCLUDED in base price
  const isSSRProject = request.projectType === 'ssr' || 
    (request.projectType === 'upgrade' && request.upgradeTargetType === 'ssr');
  
  if (isSSRProject) {
    // Add to included items for display
    includedItems.push({
      id: 'ssr-voice',
      label: 'V.O.I.C.Eâ„¢ AI Visibility',
      description: `Included with SSR (worth Â£${PRICING_CONFIG.addOns.voice}/mo)`,
      quantity: 1,
      unitPrice: 0,
      total: 0,
      isMonthly: true,
      isRequired: true,
      isIncluded: true,
    });
  } else if (request.addOns?.voice || request.projectType === 'visibility') {
    // For non-SSR projects, V.O.I.C.E is an optional add-on.
    // For V.O.I.C.E-only (projectType === 'visibility'), the monthly rate depends
    // on the selected commitment (defaults to 6-month rate). Standard list rate
    // matches PRICING_CONFIG.addOns.voice (Â£500/mo); setup is tracked on voiceTotals.
    const voiceMonthly =
      request.projectType === 'visibility'
        ? request.voiceCommitment === 'twelve'
          ? VOICE_SPEC.commitmentOptions.twelve.monthlyPrice
          : VOICE_SPEC.commitmentOptions.six.monthlyPrice
        : PRICING_CONFIG.addOns.voice;

    monthlyItems.push({
      id: 'voice',
      label: 'V.O.I.C.Eâ„¢ AI Visibility',
      quantity: 1,
      unitPrice: voiceMonthly,
      total: voiceMonthly,
      isMonthly: true,
      isRequired: request.projectType === 'visibility',
    });
  }

  // Branding
  if (request.addOns?.branding) {
    oneOffItems.push({
      id: 'branding',
      label: 'Full Branding Package',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.branding,
      total: PRICING_CONFIG.addOns.branding,
      isMonthly: false,
      isRequired: false,
    });
  }

  // Research
  if (request.addOns?.research) {
    oneOffItems.push({
      id: 'research',
      label: 'Market Research + Persona',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.research,
      total: PRICING_CONFIG.addOns.research,
      isMonthly: false,
      isRequired: false,
    });
  }

  // Video Long-form
  if (request.addOns?.videoLong && request.addOns.videoLong > 0) {
    oneOffItems.push({
      id: 'video-long',
      label: 'Long-form Video Production',
      quantity: request.addOns.videoLong,
      unitPrice: PRICING_CONFIG.addOns.videoLong,
      total: PRICING_CONFIG.addOns.videoLong * request.addOns.videoLong,
      isMonthly: false,
      isRequired: false,
    });
  }

  // Video Short-form Bundle
  if (request.addOns?.videoShortBundle) {
    monthlyItems.push({
      id: 'video-short',
      label: 'Short-form Video Bundle',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.videoShortBundle,
      total: PRICING_CONFIG.addOns.videoShortBundle,
      isMonthly: true,
      isRequired: false,
    });
  }

  // Image Library
  if (request.addOns?.imageLibrary) {
    oneOffItems.push({
      id: 'image-library',
      label: 'Custom Image Library',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.imageLibrary,
      total: PRICING_CONFIG.addOns.imageLibrary,
      isMonthly: false,
      isRequired: false,
    });
  }

  // === CALCULATE TOTALS ===
  const oneOffSubtotal = oneOffItems.reduce((sum, item) => sum + item.total, 0);
  const monthlySubtotal = monthlyItems.reduce((sum, item) => sum + item.total, 0);

  // One-off payment (5% discount)
  const oneOffDiscount = oneOffSubtotal * (1 - PRICING_CONFIG.contracts.oneOff.discount);
  const oneOffFinal = oneOffSubtotal * PRICING_CONFIG.contracts.oneOff.discount;

  // 6-month contract
  const sixTotal = oneOffSubtotal * PRICING_CONFIG.contracts.six.markup;
  const sixMonthly = Math.round((sixTotal / 6) + monthlySubtotal);
  const sixOngoing = PRICING_CONFIG.contracts.six.ongoingMonthly + monthlySubtotal;

  // 12-month contract
  const twelveTotal = oneOffSubtotal * PRICING_CONFIG.contracts.twelve.markup;
  const twelveMonthly = Math.round((twelveTotal / 12) + monthlySubtotal);
  const twelveOngoing = PRICING_CONFIG.contracts.twelve.ongoingMonthly + monthlySubtotal;

  // 24-month contract
  const twentyFourTotal = oneOffSubtotal * PRICING_CONFIG.contracts.twentyFour.markup;
  const twentyFourMonthly = Math.round((twentyFourTotal / 24) + monthlySubtotal);
  const twentyFourOngoing = PRICING_CONFIG.contracts.twentyFour.ongoingMonthly + monthlySubtotal;

  // 36-month contract
  const thirtySixTotal = oneOffSubtotal * PRICING_CONFIG.contracts.thirtySix.markup;
  const thirtySixMonthly = Math.round((thirtySixTotal / 36) + monthlySubtotal);
  const thirtySixOngoing = PRICING_CONFIG.contracts.thirtySix.ongoingMonthly + monthlySubtotal;

  // Apply SSR minimum monthly payments (also for upgrade-to-SSR)
  const isSSR = request.projectType === 'ssr' || 
    (request.projectType === 'upgrade' && request.upgradeTargetType === 'ssr');

  // V.O.I.C.E-only flows get a dedicated totals block read straight from VOICE_SPEC,
  // NOT the generic 4-option contracts table. Build flows never read this.
  const voiceTotals =
    request.projectType === 'visibility'
      ? {
          six: {
            monthlyPrice: VOICE_SPEC.commitmentOptions.six.monthlyPrice,
            months: 6 as const,
            totalCost: VOICE_SPEC.commitmentOptions.six.totalCost,
          },
          twelve: {
            monthlyPrice: VOICE_SPEC.commitmentOptions.twelve.monthlyPrice,
            months: 12 as const,
            totalCost: VOICE_SPEC.commitmentOptions.twelve.totalCost,
            savingsVsSixMonth:
              VOICE_SPEC.commitmentOptions.twelve.savingsVsSixMonth,
          },
          setupFee: VOICE_SPEC.setupFee,
          ukMarketAverage: VOICE_SPEC.ukMarketAverage,
        }
      : undefined;

  return {
    oneOffItems,
    oneOffSubtotal,
    monthlyItems,
    monthlySubtotal,
    includedItems: includedItems.length > 0 ? includedItems : undefined,
    totals: {
      oneOff: {
        upfront: oneOffSubtotal,
        discount: Math.round(oneOffDiscount),
        final: Math.round(oneOffFinal),
      },
      six: {
        monthly: isSSR ? Math.max(sixMonthly, PRICING_CONFIG.ssrMinimums.six) : sixMonthly,
        totalOverTerm: Math.round(sixTotal + (monthlySubtotal * 6)),
        ongoingAfter: sixOngoing,
      },
      twelve: {
        monthly: isSSR ? Math.max(twelveMonthly, PRICING_CONFIG.ssrMinimums.twelve) : twelveMonthly,
        totalOverTerm: Math.round(twelveTotal + (monthlySubtotal * 12)),
        ongoingAfter: twelveOngoing,
      },
      twentyFour: {
        monthly: isSSR ? Math.max(twentyFourMonthly, PRICING_CONFIG.ssrMinimums.twentyFour) : twentyFourMonthly,
        totalOverTerm: Math.round(twentyFourTotal + (monthlySubtotal * 24)),
        ongoingAfter: twentyFourOngoing,
      },
      thirtySix: {
        monthly: isSSR ? Math.max(thirtySixMonthly, PRICING_CONFIG.ssrMinimums.thirtySix) : thirtySixMonthly,
        totalOverTerm: Math.round(thirtySixTotal + (monthlySubtotal * 36)),
        ongoingAfter: thirtySixOngoing,
      },
    },
    voiceTotals,
  };
}

/**
 * Create empty breakdown for initial state
 */
function createEmptyBreakdown(): QuoteBreakdown {
  return {
    oneOffItems: [],
    oneOffSubtotal: 0,
    monthlyItems: [],
    monthlySubtotal: 0,
    totals: {
      oneOff: { upfront: 0, discount: 0, final: 0 },
      six: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
      twelve: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
      twentyFour: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
      thirtySix: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
    },
  };
}

/**
 * Create full quote result
 */
export function createQuoteResult(
  request: QuoteRequest,
  paymentPreference: PaymentPreference
): QuoteResult {
  const breakdown = calculateQuote(request);

  let selected: QuoteResult['selected'];

  // V.O.I.C.E-only flows short-circuit the generic contract totals and use
  // VOICE_SPEC directly via breakdown.voiceTotals.
  if (request.projectType === 'visibility' && breakdown.voiceTotals) {
    const commitment =
      request.voiceCommitment === 'twelve'
        ? breakdown.voiceTotals.twelve
        : breakdown.voiceTotals.six;

    return {
      id: generateQuoteId(),
      createdAt: new Date(),
      request,
      breakdown,
      selectedPayment: paymentPreference,
      selected: {
        monthly: commitment.monthlyPrice,
        totalOverTerm: commitment.totalCost,
        // No ongoing-after concept for V.O.I.C.E â€” it's a rolling retainer with a
        // minimum commitment, not a build contract with a post-contract tail.
        ongoingMonthly: commitment.monthlyPrice,
      },
    };
  }

  switch (paymentPreference) {
    case 'oneOff':
      selected = {
        upfront: breakdown.totals.oneOff.final,
        totalOverTerm: breakdown.totals.oneOff.final,
      };
      break;
    case 'six':
      selected = {
        monthly: breakdown.totals.six.monthly,
        totalOverTerm: breakdown.totals.six.totalOverTerm,
        ongoingMonthly: breakdown.totals.six.ongoingAfter,
      };
      break;
    case 'twelve':
      selected = {
        monthly: breakdown.totals.twelve.monthly,
        totalOverTerm: breakdown.totals.twelve.totalOverTerm,
        ongoingMonthly: breakdown.totals.twelve.ongoingAfter,
      };
      break;
    case 'twentyFour':
      selected = {
        monthly: breakdown.totals.twentyFour.monthly,
        totalOverTerm: breakdown.totals.twentyFour.totalOverTerm,
        ongoingMonthly: breakdown.totals.twentyFour.ongoingAfter,
      };
      break;
    case 'thirtySix':
      selected = {
        monthly: breakdown.totals.thirtySix.monthly,
        totalOverTerm: breakdown.totals.thirtySix.totalOverTerm,
        ongoingMonthly: breakdown.totals.thirtySix.ongoingAfter,
      };
      break;
  }

  return {
    id: generateQuoteId(),
    createdAt: new Date(),
    request,
    breakdown,
    selectedPayment: paymentPreference,
    selected,
  };
}

/**
 * Get market average for comparison
 */
export function getMarketAverage(itemId: string, quantity: number = 1): number | null {
  const mapping: Record<string, keyof typeof UK_MARKET_AVERAGES> = {
    'base-website': 'professionalWebsite',
    'ssr-website': 'ssrBase',
    'ecommerce': 'ecommerce50',
    'headless-ecommerce': 'ssrHeadlessEcommerce',
    'web-app': 'webAppStandard',
    'ssr-web-app': 'webAppStandard',
    'complex-forms': 'complexForms',
    'automation-setup': 'automationSetup',
    'automation-monthly': 'automationMonthly',
    'voice': 'aeoGeoMonthly',
    'branding': 'branding',
    'research': 'marketResearch',
    'video-long': 'videoLong',
    'video-short': 'videoShortBundle',
    'image-library': 'imageLibrary',
    'ssr-animations': 'ssrAnimations',
    'ssr-customer-portal': 'ssrCustomerPortal',
    'ssr-database': 'ssrDatabase',
    'ssr-authentication': 'ssrAuthentication',
    'ssr-api-integrations': 'ssrApiIntegration',
    'ssr-multilanguage': 'ssrMultilanguage',
    'ssr-realtime': 'ssrRealtime',
    'ssr-analytics': 'ssrAnalytics',
    'ssr-scalability': 'ssrScalability',
  };

  const key = mapping[itemId];
  if (!key) return null;
  
  return UK_MARKET_AVERAGES[key] * quantity;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
```


---

## 4. US pricing (src/lib/us-pricing-config.ts + src/lib/us-calculate-quote.ts)

The US calculator (USQuoteCalculator) uses USD config and a separate engine. USQuoteRequest is defined in src/types/pricing.ts (US QUOTE TYPES section).

### 4a. us-pricing-config.ts

```typescript
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
          'Server-Side Rendered on Next.js. 5-10 pages with full V.O.I.C.E. implementation. Auto-generated schema, 100/100 Lighthouse scores.',
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
          'Monthly V.O.I.C.E. optimization: schema updates, content strategy, AI citation monitoring, and competitor tracking.',
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
          'Full migration of your existing site to a server-side rendered Next.js build with V.O.I.C.E. AI visibility baked in.',
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
  'V.O.I.C.E. AI Visibility (worth $2,000/mo)',
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
```

### 4b. us-calculate-quote.ts

```typescript
/**
 * SCOPESITE US QUOTE CALCULATION ENGINE
 *
 * Calculates pricing for US market in USD.
 * Uses pricing data from us-pricing-config.ts.
 */

import {
  US_PRICING,
  formatUSD,
  calculateUSSSRBrochurePrice,
  calculateUSSSRExtendedPrice,
  calculateUSWixStandardPrice,
  calculateUSWixExtendedPrice,
  isUSSSRService,
  isUSWebsiteBuild,
  isUSWixService,
} from './us-pricing-config';
import type { USServiceType } from './us-pricing-config';
import type {
  USQuoteRequest,
  QuoteBreakdown,
  QuoteLineItem,
  PaymentPreference,
} from '@/types/pricing';

export { formatUSD };

/**
 * Calculate the full quote breakdown for a US quote
 */
export function calculateUSQuote(request: Partial<USQuoteRequest>): QuoteBreakdown {
  const oneOffItems: QuoteLineItem[] = [];
  const monthlyItems: QuoteLineItem[] = [];
  const includedItems: QuoteLineItem[] = [];

  if (!request.serviceType) {
    return createEmptyBreakdown();
  }

  const serviceType = request.serviceType;
  const pageCount = request.scope?.pageCount || 5;

  // === WEBSITE BUILDS ===
  if (serviceType === 'ssrBrochure') {
    const price = calculateUSSSRBrochurePrice(pageCount);
    oneOffItems.push({
      id: 'ssr-brochure',
      label: `AI-First SSR Website (${pageCount} pages)`,
      description: 'Next.js 16, Vercel Edge, Ghost CMS',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
    addSSRIncludedItems(includedItems);
  }

  if (serviceType === 'ssrExtended') {
    const price = calculateUSSSRExtendedPrice(pageCount);
    oneOffItems.push({
      id: 'ssr-extended',
      label: `AI-First SSR Website Extended (${pageCount} pages)`,
      description: 'Next.js 16, Vercel Edge, Ghost CMS, advanced features',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
    addSSRIncludedItems(includedItems);
  }

  if (serviceType === 'ssrEcommerce') {
    const price = US_PRICING.websiteBuilds.ssrEcommerce.base;
    oneOffItems.push({
      id: 'ssr-ecommerce',
      label: 'AI-First SSR Website (E-commerce)',
      description: 'Headless e-commerce with SSR, Vercel Edge, Ghost CMS',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
    addSSRIncludedItems(includedItems);
  }

  if (serviceType === 'wixStandard') {
    const price = calculateUSWixStandardPrice(pageCount);
    oneOffItems.push({
      id: 'wix-standard',
      label: `Client-Managed Website (${pageCount} pages)`,
      description: 'Built on Wix Studio',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
  }

  if (serviceType === 'wixExtended') {
    const price = calculateUSWixExtendedPrice(pageCount);
    oneOffItems.push({
      id: 'wix-extended',
      label: `Client-Managed Website Extended (${pageCount} pages)`,
      description: 'Wix Studio with blog, integrations, and CMS training',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
  }

  if (serviceType === 'websiteMigration') {
    const price = US_PRICING.customDev.websiteMigration.base;
    oneOffItems.push({
      id: 'website-migration',
      label: 'Website Migration to SSR',
      description: 'Full migration to Next.js with V.O.I.C.E. AI visibility',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
    addSSRIncludedItems(includedItems);
  }

  // === AI VISIBILITY & SEO ===
  if (serviceType === 'aiAudit') {
    const price = US_PRICING.aiVisibility.aiAudit.price;
    oneOffItems.push({
      id: 'ai-audit',
      label: 'AI Visibility Audit',
      description: 'Full audit with actionable recommendations',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
  }

  if (serviceType === 'aiRetainer') {
    const price = US_PRICING.aiVisibility.aiRetainer.monthlyPrice;
    monthlyItems.push({
      id: 'ai-retainer',
      label: 'AI Visibility Retainer (V.O.I.C.E.)',
      description: 'Monthly optimization, monitoring, and reporting',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: true,
      isRequired: true,
    });
  }

  if (serviceType === 'localSeo') {
    const price = US_PRICING.aiVisibility.localSeo.base;
    oneOffItems.push({
      id: 'local-seo',
      label: 'Local SEO Setup',
      description: 'Google Business Profile, local schema, citations',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
  }

  if (serviceType === 'schemaMarkup') {
    const price = US_PRICING.aiVisibility.schemaMarkup.base;
    oneOffItems.push({
      id: 'schema-markup',
      label: 'Schema Markup Implementation',
      description: 'JSON-LD structured data for your existing website',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
  }

  if (serviceType === 'contentStrategy') {
    const price = US_PRICING.aiVisibility.contentStrategy.base;
    oneOffItems.push({
      id: 'content-strategy',
      label: 'Content Strategy & Blog Setup',
      description: 'Blog architecture, editorial calendar, initial content',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
  }

  // === CUSTOM DEVELOPMENT ===
  if (serviceType === 'customApp') {
    const price = US_PRICING.customDev.customApp.startingFrom;
    oneOffItems.push({
      id: 'custom-app',
      label: 'Custom Web Application',
      description: 'Starting price. Final quote after requirements discussion.',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
  }

  if (serviceType === 'apiIntegration') {
    const price = US_PRICING.customDev.apiIntegration.base;
    oneOffItems.push({
      id: 'api-integration',
      label: 'API Integration & Automation',
      description: 'Connect your systems and automate workflows',
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: true,
    });
  }

  // === SSR ADD-ONS (for SSR website builds and migrations) ===
  if (isUSSSRService(serviceType) && request.addOns) {
    addSSRAddOns(oneOffItems, request.addOns);
  }

  // === GENERAL ADD-ONS (for website builds) ===
  if (isUSWebsiteBuild(serviceType) && request.addOns) {
    addGeneralAddOns(oneOffItems, monthlyItems, request.addOns);
  }

  // === WIX-SPECIFIC FEATURES ===
  if (isUSWixService(serviceType) && request.scope) {
    if (request.scope.hasComplexForms) {
      oneOffItems.push({
        id: 'complex-forms',
        label: 'Advanced Logic Forms',
        quantity: 1,
        unitPrice: US_PRICING.addOns.complexForms,
        total: US_PRICING.addOns.complexForms,
        isMonthly: false,
        isRequired: false,
      });
    }
    if (request.scope.hasAutomation) {
      oneOffItems.push({
        id: 'automation-setup',
        label: 'Automation Setup',
        quantity: 1,
        unitPrice: US_PRICING.addOns.automationSetup,
        total: US_PRICING.addOns.automationSetup,
        isMonthly: false,
        isRequired: false,
      });
      monthlyItems.push({
        id: 'automation-monthly',
        label: 'Automation Maintenance',
        quantity: 1,
        unitPrice: US_PRICING.addOns.automationMonthly,
        total: US_PRICING.addOns.automationMonthly,
        isMonthly: true,
        isRequired: false,
      });
    }
  }

  // === CALCULATE TOTALS ===
  return calculateTotals(oneOffItems, monthlyItems, includedItems, serviceType);
}

function addSSRIncludedItems(includedItems: QuoteLineItem[]) {
  includedItems.push(
    { id: 'ssr-voice', label: 'V.O.I.C.E. AI Visibility', description: 'Included with SSR (worth $2,000/mo)', quantity: 1, unitPrice: 0, total: 0, isMonthly: true, isRequired: true, isIncluded: true },
    { id: 'ssr-ghost', label: 'Ghost CMS Blog', quantity: 1, unitPrice: 0, total: 0, isMonthly: false, isRequired: true, isIncluded: true },
    { id: 'ssr-schema', label: 'Auto JSON-LD Schema', quantity: 1, unitPrice: 0, total: 0, isMonthly: false, isRequired: true, isIncluded: true },
    { id: 'ssr-vercel', label: 'Vercel Edge Deployment', quantity: 1, unitPrice: 0, total: 0, isMonthly: false, isRequired: true, isIncluded: true },
  );
}

function addSSRAddOns(oneOffItems: QuoteLineItem[], addOns: USQuoteRequest['addOns']) {
  const ssrAddOnMap: { key: keyof typeof addOns; id: string; label: string; configKey: keyof typeof US_PRICING.ssrAddOns }[] = [
    { key: 'ssrAnimations', id: 'ssr-animations', label: 'Premium Animations Package', configKey: 'animations' },
    { key: 'ssrCustomerPortal', id: 'ssr-customer-portal', label: 'Client Customer Portal', configKey: 'customerPortal' },
    { key: 'ssrDatabase', id: 'ssr-database', label: 'PostgreSQL Database', configKey: 'database' },
    { key: 'ssrAuthentication', id: 'ssr-authentication', label: 'User Authentication System', configKey: 'authentication' },
    { key: 'ssrMultilanguage', id: 'ssr-multilanguage', label: 'Multi-language / i18n', configKey: 'multilanguage' },
    { key: 'ssrRealtime', id: 'ssr-realtime', label: 'Real-time Features', configKey: 'realtime' },
    { key: 'ssrAnalytics', id: 'ssr-analytics', label: 'Custom Analytics Dashboard', configKey: 'analytics' },
    { key: 'ssrScalability', id: 'ssr-scalability', label: 'Enterprise Scalability', configKey: 'scalability' },
  ];

  for (const addon of ssrAddOnMap) {
    if (addOns[addon.key]) {
      const price = US_PRICING.ssrAddOns[addon.configKey];
      oneOffItems.push({
        id: addon.id,
        label: addon.label,
        quantity: 1,
        unitPrice: price,
        total: price,
        isMonthly: false,
        isRequired: false,
      });
    }
  }

  if (addOns.ssrApiIntegrations && addOns.ssrApiIntegrations > 0) {
    const unitPrice = US_PRICING.ssrAddOns.apiIntegration;
    oneOffItems.push({
      id: 'ssr-api-integrations',
      label: 'API Integrations',
      description: 'e.g., Stripe, HubSpot, Calendly',
      quantity: addOns.ssrApiIntegrations,
      unitPrice,
      total: unitPrice * addOns.ssrApiIntegrations,
      isMonthly: false,
      isRequired: false,
    });
  }
}

function addGeneralAddOns(
  oneOffItems: QuoteLineItem[],
  monthlyItems: QuoteLineItem[],
  addOns: USQuoteRequest['addOns']
) {
  if (addOns.branding) {
    oneOffItems.push({
      id: 'branding',
      label: 'Full Branding Package',
      quantity: 1,
      unitPrice: US_PRICING.addOns.branding,
      total: US_PRICING.addOns.branding,
      isMonthly: false,
      isRequired: false,
    });
  }

  if (addOns.research) {
    oneOffItems.push({
      id: 'research',
      label: 'Market Research + Persona',
      quantity: 1,
      unitPrice: US_PRICING.addOns.research,
      total: US_PRICING.addOns.research,
      isMonthly: false,
      isRequired: false,
    });
  }

  if (addOns.videoLong && addOns.videoLong > 0) {
    oneOffItems.push({
      id: 'video-long',
      label: 'Long-form Video Production',
      quantity: addOns.videoLong,
      unitPrice: US_PRICING.addOns.videoLong,
      total: US_PRICING.addOns.videoLong * addOns.videoLong,
      isMonthly: false,
      isRequired: false,
    });
  }

  if (addOns.videoShortBundle) {
    monthlyItems.push({
      id: 'video-short',
      label: 'Short-form Video Bundle',
      quantity: 1,
      unitPrice: US_PRICING.addOns.videoShortBundle,
      total: US_PRICING.addOns.videoShortBundle,
      isMonthly: true,
      isRequired: false,
    });
  }

  if (addOns.imageLibrary) {
    oneOffItems.push({
      id: 'image-library',
      label: 'Custom Image Library',
      quantity: 1,
      unitPrice: US_PRICING.addOns.imageLibrary,
      total: US_PRICING.addOns.imageLibrary,
      isMonthly: false,
      isRequired: false,
    });
  }
}

function calculateTotals(
  oneOffItems: QuoteLineItem[],
  monthlyItems: QuoteLineItem[],
  includedItems: QuoteLineItem[],
  serviceType: USServiceType
): QuoteBreakdown {
  const oneOffSubtotal = oneOffItems.reduce((sum, item) => sum + item.total, 0);
  const monthlySubtotal = monthlyItems.reduce((sum, item) => sum + item.total, 0);

  const { contracts, ssrMinimums } = US_PRICING;
  const isSSR = isUSSSRService(serviceType);

  const oneOffDiscount = oneOffSubtotal * (1 - contracts.oneOff.discount);
  const oneOffFinal = oneOffSubtotal * contracts.oneOff.discount;

  const sixTotal = oneOffSubtotal * contracts.six.markup;
  const sixMonthly = Math.round((sixTotal / 6) + monthlySubtotal);
  const sixOngoing = contracts.six.ongoingMonthly + monthlySubtotal;

  const twelveTotal = oneOffSubtotal * contracts.twelve.markup;
  const twelveMonthly = Math.round((twelveTotal / 12) + monthlySubtotal);
  const twelveOngoing = contracts.twelve.ongoingMonthly + monthlySubtotal;

  const twentyFourTotal = oneOffSubtotal * contracts.twentyFour.markup;
  const twentyFourMonthly = Math.round((twentyFourTotal / 24) + monthlySubtotal);
  const twentyFourOngoing = contracts.twentyFour.ongoingMonthly + monthlySubtotal;

  const thirtySixTotal = oneOffSubtotal * contracts.thirtySix.markup;
  const thirtySixMonthly = Math.round((thirtySixTotal / 36) + monthlySubtotal);
  const thirtySixOngoing = contracts.thirtySix.ongoingMonthly + monthlySubtotal;

  return {
    oneOffItems,
    oneOffSubtotal,
    monthlyItems,
    monthlySubtotal,
    includedItems: includedItems.length > 0 ? includedItems : undefined,
    totals: {
      oneOff: {
        upfront: oneOffSubtotal,
        discount: Math.round(oneOffDiscount),
        final: Math.round(oneOffFinal),
      },
      six: {
        monthly: isSSR ? Math.max(sixMonthly, ssrMinimums.six) : sixMonthly,
        totalOverTerm: Math.round(sixTotal + (monthlySubtotal * 6)),
        ongoingAfter: sixOngoing,
      },
      twelve: {
        monthly: isSSR ? Math.max(twelveMonthly, ssrMinimums.twelve) : twelveMonthly,
        totalOverTerm: Math.round(twelveTotal + (monthlySubtotal * 12)),
        ongoingAfter: twelveOngoing,
      },
      twentyFour: {
        monthly: isSSR ? Math.max(twentyFourMonthly, ssrMinimums.twentyFour) : twentyFourMonthly,
        totalOverTerm: Math.round(twentyFourTotal + (monthlySubtotal * 24)),
        ongoingAfter: twentyFourOngoing,
      },
      thirtySix: {
        monthly: isSSR ? Math.max(thirtySixMonthly, ssrMinimums.thirtySix) : thirtySixMonthly,
        totalOverTerm: Math.round(thirtySixTotal + (monthlySubtotal * 36)),
        ongoingAfter: thirtySixOngoing,
      },
    },
  };
}

function createEmptyBreakdown(): QuoteBreakdown {
  return {
    oneOffItems: [],
    oneOffSubtotal: 0,
    monthlyItems: [],
    monthlySubtotal: 0,
    totals: {
      oneOff: { upfront: 0, discount: 0, final: 0 },
      six: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
      twelve: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
      twentyFour: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
      thirtySix: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
    },
  };
}

/**
 * Generate a unique quote ID for US quotes
 */
function generateUSQuoteId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `US-${timestamp}-${random}`.toUpperCase();
}

/**
 * Create full US quote result
 */
export function createUSQuoteResult(
  request: USQuoteRequest,
  paymentPreference: PaymentPreference
) {
  const breakdown = calculateUSQuote(request);

  let selected: { upfront?: number; monthly?: number; totalOverTerm: number; ongoingMonthly?: number };

  switch (paymentPreference) {
    case 'oneOff':
      selected = {
        upfront: breakdown.totals.oneOff.final,
        totalOverTerm: breakdown.totals.oneOff.final,
      };
      break;
    case 'six':
      selected = {
        monthly: breakdown.totals.six.monthly,
        totalOverTerm: breakdown.totals.six.totalOverTerm,
        ongoingMonthly: breakdown.totals.six.ongoingAfter,
      };
      break;
    case 'twelve':
      selected = {
        monthly: breakdown.totals.twelve.monthly,
        totalOverTerm: breakdown.totals.twelve.totalOverTerm,
        ongoingMonthly: breakdown.totals.twelve.ongoingAfter,
      };
      break;
    case 'twentyFour':
      selected = {
        monthly: breakdown.totals.twentyFour.monthly,
        totalOverTerm: breakdown.totals.twentyFour.totalOverTerm,
        ongoingMonthly: breakdown.totals.twentyFour.ongoingAfter,
      };
      break;
    case 'thirtySix':
      selected = {
        monthly: breakdown.totals.thirtySix.monthly,
        totalOverTerm: breakdown.totals.thirtySix.totalOverTerm,
        ongoingMonthly: breakdown.totals.thirtySix.ongoingAfter,
      };
      break;
  }

  return {
    id: generateUSQuoteId(),
    createdAt: new Date(),
    request,
    breakdown,
    selectedPayment: paymentPreference,
    selected,
  };
}
```
