/**
 * SCOPESITE QUOTE CALCULATION ENGINE
 * 
 * Calculates pricing based on user selections
 * Uses pricing data from pricing-config.ts
 */

import {
  PRICING_CONFIG,
  UK_MARKET_AVERAGES,
  getPackageForPageCount,
  getAdditionalPages,
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

  // Only calculate if we have project type
  if (!request.projectType) {
    return createEmptyBreakdown();
  }

  // === BASE WEBSITE PACKAGE ===
  if (request.projectType === 'new' || request.projectType === 'upgrade') {
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
      description: request.projectType === 'upgrade' ? '40% discount for upgrade' : undefined,
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
  }

  // === WEB APP (standalone or add-on) ===
  if (request.projectType === 'webapp' || (request.scope?.webApp && request.scope.webApp !== 'none')) {
    const webAppSize = request.projectType === 'webapp' 
      ? (request.scope?.webApp || 'simple')
      : request.scope?.webApp;
    
    if (webAppSize && webAppSize !== 'none') {
      const webAppPrice = PRICING_CONFIG.webApps[webAppSize as keyof typeof PRICING_CONFIG.webApps];
      oneOffItems.push({
        id: 'web-app',
        label: `Custom Web App (${webAppSize.charAt(0).toUpperCase() + webAppSize.slice(1)})`,
        quantity: 1,
        unitPrice: webAppPrice,
        total: webAppPrice,
        isMonthly: false,
        isRequired: request.projectType === 'webapp',
      });
    }
  }

  // === E-COMMERCE ===
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

  // === COMPLEX FORMS ===
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

  // === AUTOMATION ===
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

  // === ADD-ONS ===
  
  // V.O.I.C.E™ AI Visibility (always available)
  if (request.addOns?.voice || request.projectType === 'visibility') {
    monthlyItems.push({
      id: 'voice',
      label: 'V.O.I.C.E™ AI Visibility',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.voice,
      total: PRICING_CONFIG.addOns.voice,
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

  // 12-month contract
  const twelveTotal = oneOffSubtotal * PRICING_CONFIG.contracts.twelve.markup;
  const twelveMonthly = Math.round((twelveTotal / 12) + monthlySubtotal);
  const twelveOngoing = PRICING_CONFIG.contracts.twelve.ongoingMonthly + monthlySubtotal;

  // 24-month contract
  const twentyFourTotal = oneOffSubtotal * PRICING_CONFIG.contracts.twentyFour.markup;
  const twentyFourMonthly = Math.round((twentyFourTotal / 24) + monthlySubtotal);
  const twentyFourOngoing = PRICING_CONFIG.contracts.twentyFour.ongoingMonthly + monthlySubtotal;

  return {
    oneOffItems,
    oneOffSubtotal,
    monthlyItems,
    monthlySubtotal,
    totals: {
      oneOff: {
        upfront: oneOffSubtotal,
        discount: Math.round(oneOffDiscount),
        final: Math.round(oneOffFinal),
      },
      twelve: {
        monthly: twelveMonthly,
        totalOverTerm: Math.round(twelveTotal + (monthlySubtotal * 12)),
        ongoingAfter: twelveOngoing,
      },
      twentyFour: {
        monthly: twentyFourMonthly,
        totalOverTerm: Math.round(twentyFourTotal + (monthlySubtotal * 24)),
        ongoingAfter: twentyFourOngoing,
      },
    },
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
      twelve: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
      twentyFour: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
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
  
  switch (paymentPreference) {
    case 'oneOff':
      selected = {
        upfront: breakdown.totals.oneOff.final,
        totalOverTerm: breakdown.totals.oneOff.final,
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
    'ecommerce': 'ecommerce50',
    'web-app': 'webAppStandard',
    'complex-forms': 'complexForms',
    'automation-setup': 'automationSetup',
    'automation-monthly': 'automationMonthly',
    'voice': 'aeoGeoMonthly',
    'branding': 'branding',
    'research': 'marketResearch',
    'video-long': 'videoLong',
    'video-short': 'videoShortBundle',
    'image-library': 'imageLibrary',
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



