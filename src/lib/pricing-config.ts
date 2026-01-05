/**
 * SCOPESITE PRICING CONFIGURATION
 * 
 * ✅ RESEARCH COMPLETE - DATA FROM MANUS 1.6 MAX + PERPLEXITY
 * 
 * Sources: 348 UK data points (Manus) + 60 UK sources (Perplexity)
 * Research Date: January 2026
 * Positioning: 25% below UK market average (Competitive tier)
 * 
 * Last Updated: 2026-01-03
 * Research Status: COMPLETE ✅
 * 
 * UK MARKET AVERAGES (from Manus research):
 * - Basic Website (5 pages): £2,500
 * - Professional Website (10 pages): £5,500  
 * - E-commerce (50 products): £8,500
 * - Complex Forms + Automation: £3,500
 * - AEO/GEO Monthly: £750/mo
 * - Full Branding Package: £6,500
 * - Market Research + Persona: £4,500
 * - Video (Long-form): £3,500
 * - Video (Short-form bundle): £1,500
 * 
 * Our positioning: 25% below UK market average
 * This maintains healthy margins while being genuinely competitive
 */

import type { PricingConfig } from '@/types/pricing';

// ============================================
// UK MARKET REFERENCE DATA
// ============================================

export const UK_MARKET_AVERAGES = {
  basicWebsite: 2500,
  professionalWebsite: 5500,
  ecommerce50: 8500,
  ecommerce200: 12000,      // Estimated from range
  ecommerce200Plus: 18000,  // Enterprise tier
  complexForms: 3500,
  aeoGeoMonthly: 750,
  branding: 6500,
  marketResearch: 4500,
  videoLong: 3500,
  videoShortBundle: 1500,
  imageLibrary: 1200,       // Estimated from Perplexity AI images
  automationSetup: 2500,    // From AutomateNow research
  automationMonthly: 250,   // Estimated maintenance
  ongoingMaintenance: 200,  // Industry standard £150-300
  // Custom Web Apps - UK market rates for bespoke development
  webAppSimple: 3500,       // Quote calculators, booking widgets, contact qualifiers
  webAppStandard: 7500,     // Client portals, dashboards, inventory trackers
  webAppComplex: 12500,     // Multi-user apps, API integrations, custom workflows
};

// ============================================
// SCOPESITE PRICING (25% Below Market)
// ============================================

export const PRICING_CONFIG: PricingConfig = {
  /**
   * BASE WEBSITE PACKAGES
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
   * PER PAGE RATE
   * Market rate: £200-400 per page
   * Our rate: £150 (competitive)
   */
  perPageRate: 150,
  
  /**
   * E-COMMERCE ADD-ON
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
   * CUSTOM WEB APPS
   * 
   * UK Market: £3,500 (simple), £7,500 (standard), £12,500+ (complex)
   * Our Price: 25% cheaper
   * 
   * Built with: Cursor, Fillout, Zite, Next.js depending on requirements
   */
  webApps: {
    simple: 2625,     // Quote calculators, booking widgets, contact qualifiers - UK avg £3,500
    standard: 5625,   // Client portals, dashboards, inventory trackers - UK avg £7,500
    complex: 9375,    // Multi-user apps, API integrations, custom workflows - UK avg £12,500
  },
  
  /**
   * ADD-ON SERVICES
   * All priced at 25% below UK market average
   */
  addOns: {
    /**
     * V.O.I.C.E™ AI Visibility (Monthly)
     * 
     * UK SEO/AEO average: £750/mo
     * Our V.O.I.C.E™: £562/mo (25% less)
     * 
     * Includes: GEO + AEO + Traditional SEO + Schema markup
     * This is our flagship differentiator
     */
    voice: 562,
    
    /**
     * Full Branding Package
     * 
     * UK Market Average: £6,500
     * Our Price: £4,875 (25% less)
     * 
     * Includes: Logo, brand guidelines, colour palette, 
     * typography, business cards, social templates
     */
    branding: 4875,
    
    /**
     * Market Research + Customer Persona
     * 
     * UK Market Average: £4,500
     * Our Price: £3,375 (25% less)
     * 
     * Using Manus 1.6 + Perplexity Enterprise
     * Competitor analysis, market mapping, persona development
     */
    research: 3375,
    
    /**
     * Video - Long Form
     * 
     * UK Market Average: £3,500
     * Our Price: £2,625 (25% less)
     * 
     * 2-5 minute explainer/corporate video
     * Using HeyGen + ElevenLabs for AI-assisted production
     */
    videoLong: 2625,
    
    /**
     * Video - Short Form Bundle (Monthly)
     * 
     * UK Market Average: £1,500 (one-off bundle)
     * Our Price: £395/mo for ongoing content
     * 
     * 5-10 short videos per month for social media
     * Tips, tricks, promotional content
     */
    videoShortBundle: 395,
    
    /**
     * Custom Image Library
     * 
     * UK Market Average: £1,200 (AI images from Perplexity)
     * Our Price: £800 (33% less - high margin service)
     * 
     * 20-30 custom branded images
     */
    imageLibrary: 800,
    
    /**
     * Complex Logic Forms
     * 
     * UK Market Average: £3,500 (full automation suite)
     * Our Price: £2,625 (25% less) for forms only
     * 
     * Multi-step qualification forms with conditional logic
     * CRM integration included
     */
    complexForms: 2625,
    
    /**
     * Automation Setup (Customer Outreach + Abandoned Cart)
     * 
     * UK Market Average: £2,500 setup
     * Our Price: £1,875 (25% less)
     */
    automationSetup: 1875,
    
    /**
     * Automation Maintenance (Monthly)
     * 
     * UK Market Average: £250/mo
     * Our Price: £185/mo (26% less)
     */
    automationMonthly: 185,
  },
  
  /**
   * CONTRACT STRUCTURES
   * 
   * Industry standard (from Manus research):
   * - 12 months: 15-20% markup over one-off
   * - 24 months: 25-35% markup over one-off
   * - Ongoing maintenance: £150-300/mo
   * 
   * Our approach: LOWER markup than industry (competitive advantage)
   * - 12 months: 6% markup (vs industry 15-20%)
   * - 24 months: 12% markup (vs industry 25-35%)
   * - Maintenance: £95-145/mo (vs industry £150-300)
   */
  contracts: {
    oneOff: {
      discount: 0.95,  // 5% discount for paying upfront
    },
    twelve: {
      markup: 1.06,              // Only 6% markup (industry is 15-20%)
      ongoingMonthly: 95,        // £95/mo after contract (industry £150-300)
    },
    twentyFour: {
      markup: 1.12,              // Only 12% markup (industry is 25-35%)
      ongoingMonthly: 75,        // £75/mo after contract (lower for commitment)
    },
  },
};

/**
 * PRICING LABELS
 * Human-readable labels for display
 */
export const PRICING_LABELS = {
  projectTypes: {
    new: 'New Website',
    upgrade: 'Website Upgrade',
    visibility: 'AI Visibility Only (V.O.I.C.E™)',
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
  webApps: {
    none: 'No Web App',
    simple: 'Simple (Calculator, Widget, Qualifier)',
    standard: 'Standard (Portal, Dashboard, Tracker)',
    complex: 'Complex (Multi-user, API, Custom Workflows)',
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
  payments: {
    oneOff: 'One-Off Payment (5% discount)',
    twelve: '12-Month Contract',
    twentyFour: '24-Month Contract (Best Value)',
  },
};

/**
 * PACKAGE FEATURES
 * For display in the calculator
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
 * What's included in the AI visibility service
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
 * CUSTOM WEB APP FEATURES
 * What's included at each tier
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
 * For showing value vs. market average
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
  maxPages: 100,
  maxProducts: 10000,
  maxVideos: 10,
};

/**
 * CALCULATE PACKAGE FROM PAGE COUNT
 */
export function getPackageForPageCount(pages: number): 'starter' | 'professional' | 'enterprise' {
  if (pages <= 5) return 'starter';
  if (pages <= 10) return 'professional';
  return 'enterprise';
}

/**
 * GET ADDITIONAL PAGES BEYOND PACKAGE
 */
export function getAdditionalPages(pages: number): number {
  if (pages <= 5) return 0;
  if (pages <= 10) return Math.max(0, pages - 5);
  return Math.max(0, pages - 10);
}

/**
 * GET MARKET COMPARISON DATA
 * Shows how much cheaper we are than market average
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
