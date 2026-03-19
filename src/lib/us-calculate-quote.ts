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
