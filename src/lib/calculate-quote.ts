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
  
  // V.O.I.C.E™ AI Visibility
  // For SSR projects (or upgrades TO SSR), V.O.I.C.E is INCLUDED in base price
  const isSSRProject = request.projectType === 'ssr' || 
    (request.projectType === 'upgrade' && request.upgradeTargetType === 'ssr');
  
  if (isSSRProject) {
    // Add to included items for display
    includedItems.push({
      id: 'ssr-voice',
      label: 'V.O.I.C.E™ AI Visibility',
      description: 'Included with SSR (worth £562/mo)',
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
    // on the selected commitment (6-mo = £562, 12-mo = £500). Defaults to £562.
    const voiceMonthly =
      request.projectType === 'visibility'
        ? request.voiceCommitment === 'twelve'
          ? VOICE_SPEC.commitmentOptions.twelve.monthlyPrice
          : VOICE_SPEC.commitmentOptions.six.monthlyPrice
        : PRICING_CONFIG.addOns.voice;

    monthlyItems.push({
      id: 'voice',
      label: 'V.O.I.C.E™ AI Visibility',
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
        // No ongoing-after concept for V.O.I.C.E — it's a rolling retainer with a
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
