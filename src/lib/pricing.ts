/**
 * SCOPESITE PRICING SYSTEM
 * Types and interfaces for the quote calculator
 * 
 * NOTE: Actual pricing values are in /src/lib/pricing-config.ts
 * This file defines the shape of the data only
 */

// ============================================
// PRICING CONFIGURATION TYPES
// ============================================

export interface PricingConfig {
  /** Base website packages */
  baseWebsite: {
    starter: number;      // 5 pages
    professional: number; // 10 pages  
    enterprise: number;   // Unlimited pages
  };
  
  /** Cost per additional page beyond package */
  perPageRate: number;
  
  /** E-commerce pricing tiers */
  ecommerce: {
    small: number;        // Up to 50 products
    medium: number;       // 51-200 products
    large: number;        // 200+ products
  };
  
  /** Custom web app pricing tiers */
  webApps: {
    simple: number;       // Quote calculators, booking widgets, contact qualifiers
    standard: number;     // Client portals, dashboards, inventory trackers
    complex: number;      // Multi-user apps, API integrations, custom workflows
  };
  
  /** Add-on services */
  addOns: {
    voice: number;              // AI visibility (monthly)
    branding: number;           // Full branding package (one-off)
    research: number;           // Market research + persona (one-off)
    videoLong: number;          // Long-form video (per video)
    videoShortBundle: number;   // Short-form bundle (monthly)
    imageLibrary: number;       // Custom image library (one-off)
    complexForms: number;       // Advanced logic forms (one-off)
    automationSetup: number;    // Outreach + cart setup (one-off)
    automationMonthly: number;  // Automation maintenance (monthly)
  };
  
  /** Contract payment structures */
  contracts: {
    oneOff: {
      discount: number;   // Multiplier (e.g., 0.95 = 5% discount)
    };
    twelve: {
      markup: number;     // Multiplier (e.g., 1.05 = 5% markup)
      ongoingMonthly: number; // Post-contract maintenance
    };
    twentyFour: {
      markup: number;     // Multiplier (e.g., 1.10 = 10% markup)
      ongoingMonthly: number; // Post-contract maintenance
    };
  };
}

// ============================================
// QUOTE REQUEST TYPES (User Input)
// ============================================

export type ProjectType = 'new' | 'upgrade' | 'visibility' | 'webapp';
export type PaymentPreference = 'oneOff' | 'twelve' | 'twentyFour';
export type EcommerceSize = 'none' | 'small' | 'medium' | 'large';
export type WebAppSize = 'none' | 'simple' | 'standard' | 'complex';

export interface QuoteRequest {
  /** Step 1: Project Type */
  projectType: ProjectType;
  
  /** Step 2: Scope */
  scope: {
    pageCount: number;
    ecommerce: EcommerceSize;
    productCount?: number;
    webApp: WebAppSize;
    hasBlog: boolean;
    hasComplexForms: boolean;
    hasAutomation: boolean;
  };
  
  /** Step 3: Add-Ons */
  addOns: {
    voice: boolean;
    branding: boolean;
    research: boolean;
    videoLong: number;        // Quantity (0-10)
    videoShortBundle: boolean;
    imageLibrary: boolean;
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
}

export interface QuoteBreakdown {
  /** One-off costs */
  oneOffItems: QuoteLineItem[];
  oneOffSubtotal: number;
  
  /** Monthly costs */
  monthlyItems: QuoteLineItem[];
  monthlySubtotal: number;
  
  /** Totals by payment type */
  totals: {
    oneOff: {
      upfront: number;
      discount: number;
      final: number;
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
// FORM VALIDATION SCHEMAS (Zod)
// ============================================

// These will be defined using Zod in a separate file
// /src/lib/validation.ts
