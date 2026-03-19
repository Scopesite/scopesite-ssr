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
    voice: number;              // V.O.I.C.E™ AI Visibility (monthly)
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
  
  /** Step 4: Payment */
  paymentPreference: PaymentPreference;
  
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

// ============================================
// DATABASE TYPES (Supabase)
// ============================================

export interface QuoteRecord {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Contact
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_company: string | null;
  contact_message: string | null;
  
  // Quote data (JSONB)
  quote_request: QuoteRequest;
  quote_result: QuoteResult;
  
  // Status
  status: QuoteStatus;
  
  // CRM sync
  crm_synced: boolean;
  crm_id: string | null;
  
  // Analytics
  source: string | null;
  utm_campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
}

export type QuoteStatus = 
  | 'new'
  | 'contacted'
  | 'meeting_booked'
  | 'proposal_sent'
  | 'won'
  | 'lost';

// ============================================
// CALCULATOR STATE TYPES
// ============================================

export interface CalculatorStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface CalculatorState {
  currentStep: number;
  steps: CalculatorStep[];
  request: Partial<QuoteRequest>;
  result: QuoteResult | null;
  isCalculating: boolean;
  isSubmitting: boolean;
  error: string | null;
}

// ============================================
// US QUOTE TYPES
// ============================================

import type { USServiceType } from '@/lib/us-pricing-config';

export interface USQuoteRequest {
  serviceType: USServiceType;
  scope: {
    pageCount: number;
    hasEcommerce: boolean;
    hasComplexForms: boolean;
    hasAutomation: boolean;
    requirements?: string;
  };
  addOns: {
    branding: boolean;
    research: boolean;
    videoLong: number;
    videoShortBundle: boolean;
    imageLibrary: boolean;
    ssrAnimations: boolean;
    ssrCustomerPortal: boolean;
    ssrDatabase: boolean;
    ssrAuthentication: boolean;
    ssrApiIntegrations: number;
    ssrMultilanguage: boolean;
    ssrRealtime: boolean;
    ssrAnalytics: boolean;
    ssrScalability: boolean;
  };
  paymentPreference: PaymentPreference;
  contact?: ContactInfo;
}

// ============================================
// FORM VALIDATION SCHEMAS (Zod)
// ============================================

// These will be defined using Zod in a separate file
// /src/lib/validation.ts
