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

import type {
  IntentAddOnKey,
  PricingConfig,
  QuoteAddOns,
  QuoteIntent,
  WaaSConfig,
} from '@/types/pricing';

/** Cap for standard SSR tier — above this triggers enterprise quote flow */
export const SSR_PRICE_CEILING = 8000;

export type AddOnCategory =
  | 'leadGen'
  | 'booking'
  | 'recruitment'
  | 'onlineShop'
  | 'crossCutting'
  | 'brandContent';

export const ADDON_CATEGORY_LABELS: Record<AddOnCategory, string> = {
  leadGen: 'Lead Generation',
  booking: 'Booking',
  recruitment: 'Recruitment',
  onlineShop: 'Online Shop',
  crossCutting: 'Cross-Cutting',
  brandContent: 'Brand & Content',
};

export const ADDON_CATALOG: Record<
  IntentAddOnKey,
  { label: string; price: number; category: AddOnCategory; isMonthly?: boolean }
> = {
  livePromotions: {
    label: 'Live Promotions (expiry, promo codes, Stripe)',
    price: 1500,
    category: 'leadGen',
  },
  smartLeadMagnets: {
    label: 'Smart Lead Magnets (download forms with email automation)',
    price: 495,
    category: 'leadGen',
  },
  aiChatbot: {
    label: 'AI Chatbot trained on your business',
    price: 1499,
    category: 'leadGen',
  },
  multiStepQuoteCalc: {
    label: 'Multi-step Quote Calculator',
    price: 1999,
    category: 'leadGen',
  },
  livePricingPages: {
    label: 'Live Pricing Pages',
    price: 995,
    category: 'leadGen',
  },
  onlineBooking: {
    label: 'Online Booking with Calendar Sync',
    price: 1499,
    category: 'booking',
  },
  smartForms: {
    label: 'Smart Forms (multi-step, conditional logic)',
    price: 495,
    category: 'booking',
  },
  intakeWorkflows: {
    label: 'Intake Workflows (form → email → CRM → booking)',
    price: 995,
    category: 'booking',
  },
  reminderSystem: {
    label: 'Reminder System (SMS + email automation)',
    price: 795,
    category: 'booking',
  },
  jobsBoard: {
    label: 'Live Jobs Board with auto-schema',
    price: 1999,
    category: 'recruitment',
  },
  cvUpload: {
    label: 'CV Upload + Parsing',
    price: 495,
    category: 'recruitment',
  },
  applicationPortal: {
    label: 'Application Portal',
    price: 995,
    category: 'recruitment',
  },
  candidateTracker: {
    label: 'Candidate Status Tracker',
    price: 795,
    category: 'recruitment',
  },
  stripeCheckout: {
    label: 'Stripe Live Pricing & Checkout',
    price: 0,
    category: 'onlineShop',
  },
  livePromotionsShop: {
    label: 'Live Promotions + Expiry + Promo Codes',
    price: 1500,
    category: 'onlineShop',
  },
  subscriptionManagement: {
    label: 'Subscription Management',
    price: 1499,
    category: 'onlineShop',
  },
  inventorySync: {
    label: 'Inventory & Stock Sync',
    price: 995,
    category: 'onlineShop',
  },
  membersOnlyPricing: {
    label: 'Members-Only Pricing',
    price: 995,
    category: 'onlineShop',
  },
  membersArea: {
    label: 'Members Area / Login Section',
    price: 995,
    category: 'crossCutting',
  },
  clientPortal: {
    label: 'Client Portal (case files, secure docs, messaging)',
    price: 1499,
    category: 'crossCutting',
  },
  documentSign: {
    label: 'Document Upload & E-Sign',
    price: 1499,
    category: 'crossCutting',
  },
  imageLibrary: {
    label: 'Custom Image Library (no stock photos)',
    price: 800,
    category: 'crossCutting',
  },
  sectorDeepDive: {
    label: 'Sector Deep Dive (we research your competitors before we build)',
    price: 3375,
    category: 'crossCutting',
  },
  brandIdentity: {
    label: 'Brand Identity Pack (logo, colours, style guide)',
    price: 4875,
    category: 'brandContent',
  },
  videoShortBundle: {
    label: 'Social Video Bundle',
    price: 395,
    category: 'brandContent',
    isMonthly: true,
  },
  ssrAnimations: {
    label: 'Smooth Scroll Animations',
    price: 2250,
    category: 'crossCutting',
  },
  ssrI18n: {
    label: 'Multi-language Site',
    price: 2750,
    category: 'crossCutting',
  },
  automationSetup: {
    label: 'Automate emails / calendar / lead routing',
    price: 1875,
    category: 'crossCutting',
  },
};

const ALL_INTENT_ADDON_KEYS = Object.keys(ADDON_CATALOG) as IntentAddOnKey[];

export function createDefaultAddOns(): QuoteAddOns {
  const o = {} as Record<IntentAddOnKey, boolean>;
  for (const k of ALL_INTENT_ADDON_KEYS) {
    o[k] = false;
  }
  return {
    ...o,
    voice: false,
    videoLong: 0,
  };
}

/** Pre-ticked and highlighted (recommended but not auto-ticked) keys per intent */
export function getIntentAddOnDefaults(intent: QuoteIntent | undefined): {
  preTicked: IntentAddOnKey[];
  recommended: IntentAddOnKey[];
} {
  switch (intent) {
    case 'leads':
      return {
        preTicked: [],
        recommended: ['smartLeadMagnets', 'aiChatbot', 'livePricingPages', 'multiStepQuoteCalc'],
      };
    case 'bookings':
      return {
        preTicked: [],
        recommended: ['onlineBooking', 'smartForms', 'intakeWorkflows', 'reminderSystem', 'clientPortal'],
      };
    case 'candidates':
      return {
        preTicked: ['jobsBoard'],
        recommended: ['cvUpload', 'applicationPortal', 'candidateTracker'],
      };
    case 'shop':
      return {
        preTicked: ['stripeCheckout', 'livePromotionsShop'],
        recommended: ['subscriptionManagement', 'inventorySync', 'membersOnlyPricing'],
      };
    default:
      return { preTicked: [], recommended: [] };
  }
}

export function mergeAddOnsWithIntentDefaults(
  addOns: QuoteAddOns,
  intent: QuoteIntent | undefined
): QuoteAddOns {
  const { preTicked } = getIntentAddOnDefaults(intent);
  const next = { ...addOns };
  for (const k of preTicked) {
    next[k] = true;
  }
  return next;
}

export const INTENT_PATH_COPY: Record<
  QuoteIntent,
  { title: string; subhead: string; defaultProjectType: 'ssr' | 'clientManaged' }
> = {
  leads: {
    title: 'Get More Leads',
    subhead: 'Highly AI-visible, content-led, found by ChatGPT and Google',
    defaultProjectType: 'ssr',
  },
  bookings: {
    title: 'Process Bookings',
    subhead: 'Smart forms, calendar sync, automated workflows',
    defaultProjectType: 'ssr',
  },
  candidates: {
    title: 'Attract Candidates',
    subhead:
      "Recruitment site with auto-schema'd Live Jobs Board — appears in Google for Jobs same day",
    defaultProjectType: 'ssr',
  },
  shop: {
    title: 'Online Shop',
    subhead: 'Live pricing, promo codes, real-time inventory',
    defaultProjectType: 'ssr',
  },
  unspecified: {
    title: 'General',
    subhead: 'Choose what matters most next.',
    defaultProjectType: 'ssr',
  },
};

export type SSRPriceResult = {
  price: number;
  rawPrice: number;
  exceedsStandardTier: boolean;
};

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
   * SSR (Ultra Fast) — compressed tiers, £8,000 ceiling on standard calculator
   */
  ssrWebsite: {
    base: 2000,
    perPage6to10: 250,
    perPage11to20: 200,
    perPage21plus: 150,
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
   * ADD-ON SERVICES (Both website types)
   * All priced at 25% below UK market average
   */
  addOns: {
    /**
     * V.O.I.C.E™ AI Visibility (Monthly) — Standard tier list rate
     */
    voice: 500,
    
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
   * CONTRACT STRUCTURES
   */
  contracts: {
    oneOff: {
      discount: 0.95, // 5% discount for paying upfront
      requiresLimitedCompany: false,
    },
    six: {
      markup: 1.03, // 3% markup for 6 months
      ongoingMonthly: 125, // £125/mo after contract
      requiresLimitedCompany: true,
    },
    twelve: {
      markup: 1.06, // 6% markup (industry is 15-20%)
      ongoingMonthly: 95, // £95/mo after contract
      requiresLimitedCompany: true,
    },
    twentyFour: {
      markup: 1.12, // 12% markup (industry is 25-35%)
      ongoingMonthly: 75, // £75/mo after contract
      requiresLimitedCompany: true,
    },
    thirtySix: {
      markup: 1.18, // 18% markup for longest term
      ongoingMonthly: 65, // £65/mo after contract
      requiresLimitedCompany: true,
    },
  },
  
  /**
   * SSR MINIMUM MONTHLY PAYMENTS
   * Minimum monthly amounts for SSR projects by contract length
   */
  ssrMinimums: {
    six: 600,
    twelve: 400,
    twentyFour: 250,
    thirtySix: 200,
  },

  waas: {
    setupFee: 795,
    monthlyFee: 99,
    eligibleBuilds: ['wixStarter', 'ssr'],
    ssrPageCap: 20,
    buyoutFees: {
      wixStarter: 1500,
      ssrBase: 2500,
      ssrPlus: 3500,
      ssrPremium: 4500,
    },
    allowedAddOns: ['smartForms', 'aiChatbot'],
  } satisfies WaaSConfig,
};

/**
 * PRICING LABELS
 * Human-readable labels for display
 */
export const PRICING_LABELS = {
  projectTypes: {
    clientManaged: 'Manage Yourself After Build',
    ssr: 'Ultra Fast — AI Visible Premium Site',
  },
  projectDescriptions: {
    clientManaged:
      'A site you can update yourself after we hand it over. No code, no agency dependency for content changes. Great performance, search-friendly structure.',
    ssr:
      'Built so ChatGPT, Claude, and Google AI Overview actually cite your business when prospects ask. 100/100 Lighthouse score. AI crawlers see your full content instantly.',
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
  webApps: {
    none: 'No Web App',
    simple: 'Simple (Calculator, Widget, Qualifier)',
    standard: 'Standard (Portal, Dashboard, Tracker)',
    complex: 'Complex (Multi-user, API, Custom Workflows)',
  },
  addOns: {
    voice: 'AI SEO — Be the answer ChatGPT and Google AI cite',
    branding: 'Brand Identity Pack (logo, colours, style guide)',
    research: 'Sector Deep Dive (competitor research before we build)',
    videoLong: 'Long-form Video Production',
    videoShortBundle: 'Short-form Video Bundle',
    imageLibrary: 'Custom Image Library',
    complexForms: 'Advanced Logic Forms',
    automationSetup: 'Automate emails / calendar / lead routing',
    automationMonthly: 'Automation Maintenance',
  },
  includedFeatureLabels: {
    ssrVoice: 'AI SEO methodology (worth £500/mo)',
    ssrSchema: 'Get cited by AI (schema markup, hand-coded)',
    ssrGhost: 'Blog you can write yourself',
    ssrVercel: 'Premium hosting',
  },
  payments: {
    oneOff: 'Pay in Full (5% discount)',
    six: '6-Month Contract',
    twelve: '12-Month Contract',
    twentyFour: '24-Month Contract',
    thirtySix: '36-Month Contract',
    waas: 'Website-as-a-Service (£795 setup + £99/mo)',
  },
};

/**
 * SSR INCLUDED FEATURES
 * What's included in the SSR base price
 */
export const SSR_INCLUDED_FEATURES = [
  'Includes AI SEO (worth £500/mo)',
  'Ultra Fast — Server-Side Rendering (Next.js 16)',
  PRICING_LABELS.includedFeatureLabels.ssrGhost,
  PRICING_LABELS.includedFeatureLabels.ssrSchema,
  PRICING_LABELS.includedFeatureLabels.ssrVercel,
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
 * V.O.I.C.E™ STANDALONE RETAINER SPEC
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
 * CALCULATE SSR PRICE FOR PAGE COUNT (raw + £8,000 ceiling)
 */
export function calculateSSRPrice(pages: number): SSRPriceResult {
  const { base, perPage6to10, perPage11to20, perPage21plus } = PRICING_CONFIG.ssrWebsite;

  let raw = base;
  if (pages > 5) {
    const pagesIn6to10 = Math.min(pages - 5, 5);
    raw += pagesIn6to10 * perPage6to10;
  }
  if (pages > 10) {
    const pagesIn11to20 = Math.min(pages - 10, 10);
    raw += pagesIn11to20 * perPage11to20;
  }
  if (pages > 20) {
    raw += (pages - 20) * perPage21plus;
  }

  if (raw > SSR_PRICE_CEILING) {
    return {
      price: SSR_PRICE_CEILING,
      rawPrice: raw,
      exceedsStandardTier: true,
    };
  }
  return { price: raw, rawPrice: raw, exceedsStandardTier: false };
}

/**
 * CALCULATE PACKAGE FROM PAGE COUNT (Client-Managed)
 */
export function getPackageForPageCount(pages: number): 'starter' | 'professional' | 'enterprise' {
  if (pages <= 5) return 'starter';
  if (pages <= 10) return 'professional';
  return 'enterprise';
}

/** Minimum one-off build subtotal (£) for the 36-month payment option */
export const THIRTY_SIX_MONTH_MIN_SUBTOTAL_GBP = 2000;

/**
 * GET ADDITIONAL PAGES BEYOND PACKAGE (Client-Managed)
 *
 * Starter (≤5): flat — no per-page line.
 * Professional (6–10): flat — no per-page line within band.
 * Enterprise (11+): £7,500 base includes up to 10 pages; £150 per page above 10.
 */
export function getAdditionalPages(pages: number): number {
  if (pages <= 5) return 0;
  if (pages <= 10) return 0;
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
