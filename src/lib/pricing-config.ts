/**
 * SCOPESITE PRICING CONFIGURATION
 * 
 * ✅ RESEARCH COMPLETE - DATA FROM MANUS 1.6 MAX + PERPLEXITY
 * 
 * Sources: 348 UK data points (Manus) + 60 UK sources (Perplexity)
 * Research Date: January 2026
 * 
 * TWO WEBSITE TIERS:
 * 1. Client-Managed (Wix Studio) - Budget-friendly, 25% below market
 * 2. SSR AI-First (Next.js) - Premium, market-rate pricing
 * 
 * Last Updated: 2026-01-06
 * Research Status: COMPLETE ✅
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
   * UK Market: £2,500 (basic), £5,500 (pro), £10,000+ (enterprise)
   * Our Price: 25% cheaper = £1,875, £4,125, £7,500
   */
  baseWebsite: {
    starter: 1875,       // 5 pages - UK avg £2,500, we're 25% less
    professional: 4125,  // 10 pages - UK avg £5,500, we're 25% less
    enterprise: 7500,    // Unlimited - UK avg £10,000, we're 25% less
  },
  
  /**
   * SSR AI-FIRST WEBSITE (Next.js)
   * Premium pricing - competitive market rates
   * 
   * Base: £8,000 for up to 5 pages
   * Pages 6-10: +£500 per page
   * Pages 11-20: +£400 per page
   * Pages 21+: +£350 per page
   */
  ssrWebsite: {
    base: 8000,           // Up to 5 pages
    perPage6to10: 500,    // Pages 6-10
    perPage11to20: 400,   // Pages 11-20
    perPage21plus: 350,   // Pages 21+
  },
  
  /**
   * PER PAGE RATE (Client-Managed only)
   * Market rate: £200-400 per page
   * Our rate: £150 (competitive)
   */
  perPageRate: 150,
  
  /**
   * E-COMMERCE (Client-Managed - Wix)
   * 
   * UK Market: £8,500 (50 products), £12,000 (200), £18,000+ (200+)
   * Our Price: 25% cheaper
   */
  ecommerce: {
    small: 6375,    // Up to 50 products - UK avg £8,500
    medium: 9000,   // 51-200 products - UK avg £12,000
    large: 13500,   // 200+ products - UK avg £18,000
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
   * UK Market: £3,500 (simple), £7,500 (standard), £12,500+ (complex)
   * Our Price: 25% cheaper
   */
  webApps: {
    simple: 2625,     // Quote calculators, booking widgets - UK avg £3,500
    standard: 5625,   // Client portals, dashboards - UK avg £7,500
    complex: 9375,    // Multi-user apps, API integrations - UK avg £12,500
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
     * V.O.I.C.E™ AI Visibility (Monthly)
     * UK SEO/AEO average: £750/mo
     * Our V.O.I.C.E™: £562/mo (25% less)
     */
    voice: 562,
    
    /**
     * Full Branding Package
     * UK Market Average: £6,500
     * Our Price: £4,875 (25% less)
     */
    branding: 4875,
    
    /**
     * Market Research + Customer Persona
     * UK Market Average: £4,500
     * Our Price: £3,375 (25% less)
     */
    research: 3375,
    
    /**
     * Video - Long Form
     * UK Market Average: £3,500
     * Our Price: £2,625 (25% less)
     */
    videoLong: 2625,
    
    /**
     * Video - Short Form Bundle (Monthly)
     * UK Market Average: £1,500 (one-off bundle)
     * Our Price: £395/mo for ongoing content
     */
    videoShortBundle: 395,
    
    /**
     * Custom Image Library
     * UK Market Average: £1,200
     * Our Price: £800 (33% less)
     */
    imageLibrary: 800,
    
    /**
     * Complex Logic Forms
     * UK Market Average: £3,500
     * Our Price: £2,625 (25% less)
     */
    complexForms: 2625,
    
    /**
     * Automation Setup
     * UK Market Average: £2,500
     * Our Price: £1,875 (25% less)
     */
    automationSetup: 1875,
    
    /**
     * Automation Maintenance (Monthly)
     * UK Market Average: £250/mo
     * Our Price: £185/mo (26% less)
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
    twelve: {
      markup: 1.06,              // Only 6% markup (industry is 15-20%)
      ongoingMonthly: 95,        // £95/mo after contract
    },
    twentyFour: {
      markup: 1.12,              // Only 12% markup (industry is 25-35%)
      ongoingMonthly: 75,        // £75/mo after contract
    },
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
    visibility: 'AI Visibility Only (V.O.I.C.E™)',
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
    voice: 'V.O.I.C.E™ AI Visibility',
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
    animations: 'Premium Animations Package',
    customerPortal: 'Client Customer Portal',
    database: 'PostgreSQL Database',
    authentication: 'User Authentication System',
    apiIntegration: 'API Integrations',
    multilanguage: 'Multi-language / i18n',
    realtime: 'Real-time Features',
    analytics: 'Custom Analytics Dashboard',
    scalability: 'Enterprise Scalability',
  },
  ssrAddOnDescriptions: {
    animations: 'Page transitions, scroll-triggered animations, micro-interactions, hover effects. Makes your site feel alive.',
    customerPortal: 'Secure login area for your customers. Dashboard, account management, order history, document access.',
    database: 'Persistent data storage for user data, custom records, application state. Scales infinitely.',
    authentication: 'Secure user login, OAuth (Google/Apple/Microsoft), password reset, session management.',
    apiIntegration: 'Connect to CRMs, payment gateways, booking systems, or any third-party service.',
    multilanguage: 'Internationalized routing, language switcher, content translation ready. Reach global audiences.',
    realtime: 'WebSocket connections, live updates, notifications, chat functionality.',
    analytics: 'Beyond Google Analytics. Conversion tracking, funnel visualization, custom events, heatmaps integration.',
    scalability: 'Load balancing configuration, advanced CDN setup, auto-scaling, performance monitoring.',
  },
  payments: {
    oneOff: 'One-Off Payment (5% discount)',
    twelve: '12-Month Contract',
    twentyFour: '24-Month Contract (Best Value)',
  },
};

/**
 * SSR INCLUDED FEATURES
 * What's included in the SSR base price
 */
export const SSR_INCLUDED_FEATURES = [
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
 * V.O.I.C.E™ FEATURES
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
