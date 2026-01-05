/**
 * SCOPESITE PRICING CALCULATOR
 * 
 * Core calculation logic for the quote tool.
 * Uses pricing config to calculate totals based on user selections.
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  QuoteRequest,
  QuoteResult,
  QuoteBreakdown,
  QuoteLineItem,
  PaymentPreference,
  EcommerceSize,
} from '@/types/pricing';
import {
  PRICING_CONFIG,
  PRICING_LABELS,
  getPackageForPageCount,
  getAdditionalPages,
} from './pricing-config';

/**
 * MAIN CALCULATION FUNCTION
 * Takes a quote request and returns a fully calculated quote result
 */
export function calculateQuote(request: QuoteRequest): QuoteResult {
  const breakdown = calculateBreakdown(request);
  
  return {
    id: uuidv4(),
    createdAt: new Date(),
    request,
    breakdown,
    selectedPayment: request.paymentPreference,
    selected: getSelectedTotals(breakdown, request.paymentPreference),
  };
}

/**
 * CALCULATE FULL BREAKDOWN
 * Returns line items and totals for all payment options
 */
function calculateBreakdown(request: QuoteRequest): QuoteBreakdown {
  const oneOffItems: QuoteLineItem[] = [];
  const monthlyItems: QuoteLineItem[] = [];
  
  // 1. BASE WEBSITE PACKAGE
  if (request.projectType !== 'visibility') {
    const packageType = getPackageForPageCount(request.scope.pageCount);
    const basePrice = PRICING_CONFIG.baseWebsite[packageType];
    
    oneOffItems.push({
      id: 'base-package',
      label: PRICING_LABELS.packages[packageType],
      description: `Base website build with ${request.scope.pageCount} pages`,
      quantity: 1,
      unitPrice: basePrice,
      total: basePrice,
      isMonthly: false,
      isRequired: true,
    });
    
    // Additional pages beyond package
    const additionalPages = getAdditionalPages(request.scope.pageCount);
    if (additionalPages > 0) {
      const additionalCost = additionalPages * PRICING_CONFIG.perPageRate;
      oneOffItems.push({
        id: 'additional-pages',
        label: 'Additional Pages',
        description: `${additionalPages} pages beyond package`,
        quantity: additionalPages,
        unitPrice: PRICING_CONFIG.perPageRate,
        total: additionalCost,
        isMonthly: false,
        isRequired: true,
      });
    }
  }
  
  // 2. E-COMMERCE
  if (request.scope.ecommerce !== 'none' && request.projectType !== 'visibility') {
    const ecomPrice = PRICING_CONFIG.ecommerce[request.scope.ecommerce];
    oneOffItems.push({
      id: 'ecommerce',
      label: PRICING_LABELS.ecommerce[request.scope.ecommerce],
      description: request.scope.productCount 
        ? `E-commerce functionality for ${request.scope.productCount} products`
        : 'E-commerce functionality',
      quantity: 1,
      unitPrice: ecomPrice,
      total: ecomPrice,
      isMonthly: false,
      isRequired: false,
    });
  }
  
  // 3. COMPLEX FORMS
  if (request.scope.hasComplexForms && request.projectType !== 'visibility') {
    oneOffItems.push({
      id: 'complex-forms',
      label: PRICING_LABELS.addOns.complexForms,
      description: 'Multi-step qualification forms with logic',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.complexForms,
      total: PRICING_CONFIG.addOns.complexForms,
      isMonthly: false,
      isRequired: false,
    });
  }
  
  // 4. AUTOMATION
  if (request.scope.hasAutomation) {
    oneOffItems.push({
      id: 'automation-setup',
      label: PRICING_LABELS.addOns.automationSetup,
      description: 'Customer outreach & abandoned cart setup',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.automationSetup,
      total: PRICING_CONFIG.addOns.automationSetup,
      isMonthly: false,
      isRequired: false,
    });
    
    monthlyItems.push({
      id: 'automation-monthly',
      label: PRICING_LABELS.addOns.automationMonthly,
      description: 'Ongoing automation maintenance',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.automationMonthly,
      total: PRICING_CONFIG.addOns.automationMonthly,
      isMonthly: true,
      isRequired: false,
    });
  }
  
  // 5. V.O.I.C.E™
  if (request.addOns.voice) {
    monthlyItems.push({
      id: 'voice',
      label: PRICING_LABELS.addOns.voice,
      description: 'AI visibility optimization (GEO + AEO + SEO)',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.voice,
      total: PRICING_CONFIG.addOns.voice,
      isMonthly: true,
      isRequired: false,
    });
  }
  
  // 6. BRANDING
  if (request.addOns.branding) {
    oneOffItems.push({
      id: 'branding',
      label: PRICING_LABELS.addOns.branding,
      description: 'Logo, guidelines, visual identity',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.branding,
      total: PRICING_CONFIG.addOns.branding,
      isMonthly: false,
      isRequired: false,
    });
  }
  
  // 7. MARKET RESEARCH
  if (request.addOns.research) {
    oneOffItems.push({
      id: 'research',
      label: PRICING_LABELS.addOns.research,
      description: 'AI-powered market research & customer personas',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.research,
      total: PRICING_CONFIG.addOns.research,
      isMonthly: false,
      isRequired: false,
    });
  }
  
  // 8. VIDEO - LONG FORM
  if (request.addOns.videoLong > 0) {
    const videoTotal = request.addOns.videoLong * PRICING_CONFIG.addOns.videoLong;
    oneOffItems.push({
      id: 'video-long',
      label: PRICING_LABELS.addOns.videoLong,
      description: `${request.addOns.videoLong} explainer video(s) with HeyGen + ElevenLabs`,
      quantity: request.addOns.videoLong,
      unitPrice: PRICING_CONFIG.addOns.videoLong,
      total: videoTotal,
      isMonthly: false,
      isRequired: false,
    });
  }
  
  // 9. VIDEO - SHORT BUNDLE
  if (request.addOns.videoShortBundle) {
    monthlyItems.push({
      id: 'video-short',
      label: PRICING_LABELS.addOns.videoShortBundle,
      description: 'Monthly tips & tricks video content',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.videoShortBundle,
      total: PRICING_CONFIG.addOns.videoShortBundle,
      isMonthly: true,
      isRequired: false,
    });
  }
  
  // 10. IMAGE LIBRARY
  if (request.addOns.imageLibrary) {
    oneOffItems.push({
      id: 'image-library',
      label: PRICING_LABELS.addOns.imageLibrary,
      description: 'Bespoke graphics, icons, imagery',
      quantity: 1,
      unitPrice: PRICING_CONFIG.addOns.imageLibrary,
      total: PRICING_CONFIG.addOns.imageLibrary,
      isMonthly: false,
      isRequired: false,
    });
  }
  
  // CALCULATE SUBTOTALS
  const oneOffSubtotal = oneOffItems.reduce((sum, item) => sum + item.total, 0);
  const monthlySubtotal = monthlyItems.reduce((sum, item) => sum + item.total, 0);
  
  // CALCULATE PAYMENT OPTIONS
  const totals = calculatePaymentOptions(oneOffSubtotal, monthlySubtotal);
  
  return {
    oneOffItems,
    oneOffSubtotal,
    monthlyItems,
    monthlySubtotal,
    totals,
  };
}

/**
 * CALCULATE PAYMENT OPTIONS
 * Returns totals for each payment structure
 */
function calculatePaymentOptions(
  oneOffSubtotal: number,
  monthlySubtotal: number
): QuoteBreakdown['totals'] {
  const { contracts } = PRICING_CONFIG;
  
  // ONE-OFF: Full payment with discount
  const oneOffDiscount = oneOffSubtotal * (1 - contracts.oneOff.discount);
  const oneOffFinal = oneOffSubtotal * contracts.oneOff.discount;
  
  // 12-MONTH: Spread one-off over 12 months + monthly costs
  const twelveOneOffPart = (oneOffSubtotal * contracts.twelve.markup) / 12;
  const twelveMonthly = twelveOneOffPart + monthlySubtotal;
  const twelveTotalOverTerm = twelveMonthly * 12;
  
  // 24-MONTH: Spread one-off over 24 months + monthly costs
  const twentyFourOneOffPart = (oneOffSubtotal * contracts.twentyFour.markup) / 24;
  const twentyFourMonthly = twentyFourOneOffPart + monthlySubtotal;
  const twentyFourTotalOverTerm = twentyFourMonthly * 24;
  
  return {
    oneOff: {
      upfront: oneOffSubtotal,
      discount: oneOffDiscount,
      final: oneOffFinal,
    },
    twelve: {
      monthly: Math.ceil(twelveMonthly),
      totalOverTerm: Math.ceil(twelveTotalOverTerm),
      ongoingAfter: contracts.twelve.ongoingMonthly + monthlySubtotal,
    },
    twentyFour: {
      monthly: Math.ceil(twentyFourMonthly),
      totalOverTerm: Math.ceil(twentyFourTotalOverTerm),
      ongoingAfter: contracts.twentyFour.ongoingMonthly + monthlySubtotal,
    },
  };
}

/**
 * GET SELECTED TOTALS
 * Returns the figures for the user's selected payment option
 */
function getSelectedTotals(
  breakdown: QuoteBreakdown,
  preference: PaymentPreference
): QuoteResult['selected'] {
  const { totals } = breakdown;
  
  switch (preference) {
    case 'oneOff':
      return {
        upfront: totals.oneOff.final,
        totalOverTerm: totals.oneOff.final,
      };
    
    case 'twelve':
      return {
        monthly: totals.twelve.monthly,
        totalOverTerm: totals.twelve.totalOverTerm,
        ongoingMonthly: totals.twelve.ongoingAfter,
      };
    
    case 'twentyFour':
      return {
        monthly: totals.twentyFour.monthly,
        totalOverTerm: totals.twentyFour.totalOverTerm,
        ongoingMonthly: totals.twentyFour.ongoingAfter,
      };
  }
}

/**
 * FORMAT CURRENCY
 * Formats number as GBP currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * GET SAVINGS VS MARKET
 * Shows how much cheaper we are than market average
 * (To be implemented when research data arrives)
 */
export function calculateMarketSavings(quoteTotal: number): {
  marketAverage: number;
  savings: number;
  percentageOff: number;
} {
  // PLACEHOLDER - will be updated with research data
  const estimatedMarketMultiplier = 1.35; // Assume market is 35% higher
  const marketAverage = quoteTotal * estimatedMarketMultiplier;
  const savings = marketAverage - quoteTotal;
  const percentageOff = Math.round((savings / marketAverage) * 100);
  
  return {
    marketAverage,
    savings,
    percentageOff,
  };
}
