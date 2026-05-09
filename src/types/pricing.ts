/**
 * SCOPESITE PRICING SYSTEM
 *
 * NOTE: Numeric config lives in /src/lib/pricing-config.ts
 */

// ============================================
// PRICING CONFIGURATION TYPES
// ============================================

export interface PricingConfig {
  baseWebsite: {
    starter: number;
    professional: number;
    enterprise: number;
  };
  ssrWebsite: {
    base: number;
    perPage6to10: number;
    perPage11to20: number;
    perPage21plus: number;
  };
  perPageRate: number;
  ecommerce: {
    small: number;
    medium: number;
    large: number;
  };
  webApps: {
    simple: number;
    standard: number;
    complex: number;
  };
  addOns: {
    voice: number;
    branding: number;
    research: number;
    videoLong: number;
    videoShortBundle: number;
    imageLibrary: number;
    complexForms: number;
    automationSetup: number;
    automationMonthly: number;
  };
  contracts: {
    oneOff: { discount: number; requiresLimitedCompany?: false };
    six: { markup: number; ongoingMonthly: number; requiresLimitedCompany: true };
    twelve: { markup: number; ongoingMonthly: number; requiresLimitedCompany: true };
    twentyFour: { markup: number; ongoingMonthly: number; requiresLimitedCompany: true };
    thirtySix: { markup: number; ongoingMonthly: number; requiresLimitedCompany: true };
  };
  ssrMinimums: {
    six: number;
    twelve: number;
    twentyFour: number;
    thirtySix: number;
  };
  /** Website-as-a-Service (Pay-As-You-Go) — not a regulated credit product */
  waas: WaaSConfig;
}

// ============================================
// QUOTE REQUEST TYPES (User Input)
// ============================================

export type ProjectType = 'clientManaged' | 'ssr';

export type WebsiteType = 'clientManaged' | 'ssr';

/** UK quote payment / subscription term (stored as `paymentPreference` on QuoteRequest for API compatibility). */
export type PaymentTerm =
  | 'oneOff'
  | 'six'
  | 'twelve'
  | 'twentyFour'
  | 'thirtySix'
  | 'waas';

export type PaymentPreference = PaymentTerm;

export type VoiceCommitment = 'six' | 'twelve';
export type EcommerceSize = 'none' | 'small' | 'medium' | 'large';
export type WebAppSize = 'none' | 'simple' | 'standard' | 'complex';

export type QuoteIntent = 'leads' | 'bookings' | 'candidates' | 'shop' | 'unspecified';

/** Keys for intent catalog add-ons (boolean toggles unless noted) */
export type IntentAddOnKey =
  | 'livePromotions'
  | 'livePromotionsShop'
  | 'smartLeadMagnets'
  | 'aiChatbot'
  | 'multiStepQuoteCalc'
  | 'livePricingPages'
  | 'onlineBooking'
  | 'smartForms'
  | 'intakeWorkflows'
  | 'reminderSystem'
  | 'jobsBoard'
  | 'cvUpload'
  | 'applicationPortal'
  | 'candidateTracker'
  | 'stripeCheckout'
  | 'subscriptionManagement'
  | 'inventorySync'
  | 'membersOnlyPricing'
  | 'membersArea'
  | 'clientPortal'
  | 'documentSign'
  | 'imageLibrary'
  | 'sectorDeepDive'
  | 'brandIdentity'
  | 'videoShortBundle'
  | 'ssrAnimations'
  | 'ssrI18n'
  | 'automationSetup';

export interface WaaSConfig {
  setupFee: number;
  monthlyFee: number;
  eligibleBuilds: readonly ('wixStarter' | 'ssr')[];
  ssrPageCap: number;
  buyoutFees: {
    wixStarter: number;
    ssrBase: number;
    ssrPlus: number;
    ssrPremium: number;
  };
  /** Add-ons permitted on WaaS (standard catalogue prices) */
  allowedAddOns: readonly IntentAddOnKey[];
}

export type QuoteAddOns = {
  [K in IntentAddOnKey]: boolean;
} & {
  /** Optional monthly AI SEO retainer for non-SSR builds */
  voice: boolean;
  /** Quantity 0–10 */
  videoLong: number;
} & {
  /** Persisted quote rows / Sheets export may include legacy keys */
  branding?: boolean;
  research?: boolean;
  ssrCustomerPortal?: boolean;
  ssrDatabase?: boolean;
  ssrAuthentication?: boolean;
  ssrApiIntegrations?: number;
  ssrMultilanguage?: boolean;
  ssrRealtime?: boolean;
  ssrAnalytics?: boolean;
  ssrScalability?: boolean;
};

export interface QuoteRequest {
  projectType: ProjectType;
  /**
   * Legal entity for UK compliance (CCA 1974 / FSMA). `null` = not yet confirmed (Step 0).
   * Omitted on legacy saved quotes → migration assumes `limited` when payment term is present.
   */
  entityType?: 'limited' | 'sole_trader' | null;
  /** Required when `entityType === 'limited'`; otherwise `null`. */
  companyName?: string | null;
  /** Existing website → 40% discount on core build (and SSR catalog add-ons when SSR) */
  hasExistingSite?: boolean;
  intent?: QuoteIntent;
  scope: {
    websiteType?: WebsiteType;
    pageCount: number;
    ecommerce: EcommerceSize;
    /** Legacy / persisted selections */
    headlessEcommerce?: EcommerceSize;
    webApp: WebAppSize;
    ssrWebApp?: WebAppSize;
    hasBlog: boolean;
    hasComplexForms: boolean;
    hasAutomation: boolean;
  };
  addOns: QuoteAddOns;
  /** Payment or subscription term (`PaymentTerm` — field name kept for JSON / DB compatibility). */
  paymentPreference: PaymentPreference;
  voiceCommitment?: VoiceCommitment;
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
  isIncluded?: boolean;
}

export interface QuoteBreakdown {
  oneOffItems: QuoteLineItem[];
  oneOffSubtotal: number;
  monthlyItems: QuoteLineItem[];
  monthlySubtotal: number;
  includedItems?: QuoteLineItem[];
  exceedsStandardTier?: boolean;
  recommendedAddOns?: IntentAddOnKey[];
  includedAddOnKeys?: IntentAddOnKey[];
  /** False when one-off subtotal is below £2,000 — 36-month term hidden in UI */
  thirtySixAvailable?: boolean;
  /** Populated when `paymentPreference === 'waas'` */
  waasDetails?: {
    setupFee: number;
    monthlyFee: number;
    buyoutFee: number;
  };
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
  id: string;
  createdAt: Date;
  request: QuoteRequest;
  breakdown: QuoteBreakdown;
  selectedPayment: PaymentTerm;
  exceedsStandardTier?: boolean;
  /** Mirrors breakdown.thirtySixAvailable */
  thirtySixAvailable?: boolean;
  recommendedAddOns?: IntentAddOnKey[];
  includedAddOns?: IntentAddOnKey[];
  selected: {
    upfront?: number;
    monthly?: number;
    totalOverTerm: number;
    ongoingMonthly?: number;
  };
}

// ============================================
// DATABASE TYPES (Supabase)
// ============================================

export interface QuoteRecord {
  id: string;
  created_at: string;
  updated_at: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_company: string | null;
  contact_message: string | null;
  quote_request: QuoteRequest;
  quote_result: QuoteResult;
  status: QuoteStatus;
  crm_synced: boolean;
  crm_id: string | null;
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

import type { USServiceType, USPaymentTerm } from '@/lib/us-pricing-config';

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
  paymentPreference: USPaymentTerm;
  contact?: ContactInfo;
}
