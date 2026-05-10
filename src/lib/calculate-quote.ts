/**
 * SCOPESITE QUOTE CALCULATION ENGINE (UK)
 */

import {
  PRICING_CONFIG,
  UK_MARKET_AVERAGES,
  ADDON_CATALOG,
  calculateSSRPrice,
  getIntentAddOnDefaults,
  createDefaultAddOns,
  getAdditionalPages,
  resolvePayMonthlyTier,
} from './pricing-config';
import type {
  QuoteRequest,
  QuoteResult,
  QuoteBreakdown,
  QuoteLineItem,
  PaymentPreference,
  IntentAddOnKey,
  QuoteAddOns,
} from '@/types/pricing';

function generateQuoteId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `QT-${timestamp}-${random}`.toUpperCase();
}

function normalizeAddOns(partial?: Partial<QuoteAddOns>): QuoteAddOns {
  const d = createDefaultAddOns();
  if (!partial) return d;
  return { ...d, ...partial };
}

const ALL_CALC_ADDON_KEYS = Object.keys(ADDON_CATALOG) as IntentAddOnKey[];

/**
 * UK compliance backstop (entity + Pay Monthly Service eligibility). Instalment terms
 * are the same total as pay in full — no regulated credit premium (CCA 1974 / FSMA).
 */
export function assertUkQuoteRequestValid(request: QuoteRequest): void {
  if (request.entityType === 'limited' && !request.companyName?.trim()) {
    throw new Error('Company name is required for Limited Company / LLP quotes.');
  }
  if (request.paymentPreference === 'waas') {
    assertWaaSRequest(request);
  }
}

function assertWaaSRequest(request: QuoteRequest): void {
  const cfg = PRICING_CONFIG.waas;
  const addOns = normalizeAddOns(request.addOns);

  if (addOns.voice) {
    throw new Error(
      'Optional AI SEO retainer is not available on Website-as-a-Service in this calculator — choose Pay in Full or speak to us about a retainer alongside WaaS.'
    );
  }
  if ((addOns.videoLong ?? 0) > 0) {
    throw new Error('Long-form video packages are not available on Website-as-a-Service plans.');
  }
  if (addOns.livePromotions || addOns.livePromotionsShop) {
    throw new Error('Live Promotions is not available on Website-as-a-Service plans.');
  }
  if (addOns.stripeCheckout) {
    throw new Error('Shop checkout modules are not available on Website-as-a-Service plans.');
  }

  for (const key of ALL_CALC_ADDON_KEYS) {
    if (key === 'livePromotions' || key === 'livePromotionsShop' || key === 'stripeCheckout') continue;
    if (addOns[key] === true && !cfg.allowedAddOns.includes(key)) {
      throw new Error(
        'This add-on is not available on Website-as-a-Service plans — only Smart Forms and AI Chatbot are offered at catalogue prices.'
      );
    }
  }

  if (!resolvePayMonthlyTier(request)) {
    throw new Error(
      'This build is not eligible for Pay Monthly Service. Choose Pay in Full or a fixed 6- or 12-month contract, or adjust scope to Wix Starter / Professional (no shop or custom app) or Ultra Fast SSR within the standard published tier (up to 20 pages).'
    );
  }
}

function calculateWaaSBreakdown(request: QuoteRequest): QuoteBreakdown {
  assertWaaSRequest(request);
  const cfg = PRICING_CONFIG.waas;
  const tier = resolvePayMonthlyTier(request)!;
  const addOns = normalizeAddOns(request.addOns);
  const um = upgradeMult(request.hasExistingSite);

  const setupCharge = Math.round(tier.setupFee * um);

  const oneOffItems: QuoteLineItem[] = [
    {
      id: 'waas-setup',
      label: `Pay Monthly Service — setup (${tier.customerLabel})`,
      quantity: 1,
      unitPrice: setupCharge,
      total: setupCharge,
      isMonthly: false,
      isRequired: true,
    },
  ];

  if (addOns.smartForms) {
    const meta = ADDON_CATALOG.smartForms;
    const unit = Math.round(meta.price * um);
    oneOffItems.push({
      id: 'addon-smartForms',
      label: meta.label,
      quantity: 1,
      unitPrice: unit,
      total: unit,
      isMonthly: false,
      isRequired: false,
    });
  }
  if (addOns.aiChatbot) {
    const meta = ADDON_CATALOG.aiChatbot;
    const unit = Math.round(meta.price * um);
    oneOffItems.push({
      id: 'addon-aiChatbot',
      label: meta.label,
      quantity: 1,
      unitPrice: unit,
      total: unit,
      isMonthly: false,
      isRequired: false,
    });
  }

  const monthlyItems: QuoteLineItem[] = [
    {
      id: 'waas-subscription',
      label: `Pay Monthly Service — subscription (${tier.customerLabel})`,
      quantity: 1,
      unitPrice: tier.monthlyFee,
      total: tier.monthlyFee,
      isMonthly: true,
      isRequired: true,
    },
  ];

  const oneOffSubtotal = oneOffItems.reduce((sum, item) => sum + item.total, 0);
  const monthlySubtotal = tier.monthlyFee;
  const z = { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 };

  return {
    oneOffItems,
    oneOffSubtotal,
    monthlyItems,
    monthlySubtotal,
    waasDetails: {
      tierId: tier.tierId,
      customerLabel: tier.customerLabel,
      setupFee: setupCharge,
      monthlyFee: tier.monthlyFee,
      buyoutFee: tier.buyoutFee,
      minimumTermMonths: cfg.minimumTermMonths,
    },
    totals: {
      oneOff: {
        upfront: oneOffSubtotal,
        discount: 0,
        final: oneOffSubtotal,
      },
      six: { ...z },
      twelve: { ...z },
      twentyFour: { ...z },
      thirtySix: { ...z },
    },
  };
}

/**
 * Apply 40% discount to build (existing site refresh)
 */
function upgradeMult(hasExistingSite: boolean | undefined): number {
  return hasExistingSite ? 0.6 : 1;
}

function pushCatalogAddOns(
  oneOffItems: QuoteLineItem[],
  monthlyItems: QuoteLineItem[],
  addOns: QuoteAddOns,
  opts: {
    projectType: 'ssr' | 'clientManaged';
    intent: QuoteRequest['intent'];
    upgradeMult: number;
  }
): void {
  const { projectType, intent, upgradeMult: um } = opts;

  const promotionsSelected = addOns.livePromotions || addOns.livePromotionsShop;
  if (promotionsSelected) {
    const price = Math.round(1500 * um);
    oneOffItems.push({
      id: 'live-promotions',
      label: ADDON_CATALOG.livePromotionsShop.label,
      quantity: 1,
      unitPrice: price,
      total: price,
      isMonthly: false,
      isRequired: false,
    });
  }

  const keys = ALL_CALC_ADDON_KEYS.filter((k) => {
    if (k === 'livePromotions' || k === 'livePromotionsShop') return false;
    if (k === 'stripeCheckout') {
      return (
        projectType === 'ssr' &&
        intent === 'shop' &&
        addOns.stripeCheckout
      );
    }
    return addOns[k] === true;
  });

  for (const key of keys) {
    const meta = ADDON_CATALOG[key];
    if (meta.price === 0 && key === 'stripeCheckout') {
      oneOffItems.push({
        id: `addon-${key}`,
        label: meta.label,
        description: 'Included',
        quantity: 1,
        unitPrice: 0,
        total: 0,
        isMonthly: false,
        isRequired: false,
        isIncluded: true,
      });
      continue;
    }

    const unit = Math.round(meta.price * um);
    if (meta.isMonthly) {
      monthlyItems.push({
        id: `addon-${key}`,
        label: meta.label,
        quantity: 1,
        unitPrice: unit,
        total: unit,
        isMonthly: true,
        isRequired: false,
      });
    } else {
      oneOffItems.push({
        id: `addon-${key}`,
        label: meta.label,
        quantity: 1,
        unitPrice: unit,
        total: unit,
        isMonthly: false,
        isRequired: false,
      });
    }
  }

  const vl = addOns.videoLong || 0;
  if (vl > 0) {
    const unit = Math.round(PRICING_CONFIG.addOns.videoLong * um);
    oneOffItems.push({
      id: 'video-long',
      label: 'Long-form Video Production',
      quantity: vl,
      unitPrice: unit,
      total: unit * vl,
      isMonthly: false,
      isRequired: false,
    });
  }
}

export function calculateQuote(request: Partial<QuoteRequest>): QuoteBreakdown {
  const oneOffItems: QuoteLineItem[] = [];
  const monthlyItems: QuoteLineItem[] = [];
  const includedItems: QuoteLineItem[] = [];

  if (!request.projectType) {
    return createEmptyBreakdown();
  }

  if (request.paymentPreference === 'waas') {
    return calculateWaaSBreakdown(request as QuoteRequest);
  }

  const addOns = normalizeAddOns(request.addOns);
  const intent = request.intent;
  const um = upgradeMult(request.hasExistingSite);
  const { recommended, preTicked } = getIntentAddOnDefaults(intent);
  const includedAddOnKeys: IntentAddOnKey[] = [...preTicked];

  let exceedsStandardTier = false;

  if (request.projectType === 'ssr') {
    const pageCount = Math.max(request.scope?.pageCount || 5, 5);
    const ssr = calculateSSRPrice(pageCount);
    exceedsStandardTier = ssr.exceedsStandardTier;

    const buildPrice = Math.round(ssr.price * um);
    oneOffItems.push({
      id: 'ssr-website',
      label: `Ultra Fast — AI Visible Premium Site (${pageCount} pages)`,
      description: 'Next.js 16, premium hosting, blog',
      quantity: 1,
      unitPrice: buildPrice,
      total: buildPrice,
      isMonthly: false,
      isRequired: true,
    });

    includedItems.push(
      {
        id: 'ssr-ghost',
        label: 'Blog you can write yourself',
        quantity: 1,
        unitPrice: 0,
        total: 0,
        isMonthly: false,
        isRequired: true,
        isIncluded: true,
      },
      {
        id: 'ssr-schema',
        label: 'Get cited by AI (schema markup, hand-coded)',
        quantity: 1,
        unitPrice: 0,
        total: 0,
        isMonthly: false,
        isRequired: true,
        isIncluded: true,
      },
      {
        id: 'ssr-vercel',
        label: 'Premium hosting',
        quantity: 1,
        unitPrice: 0,
        total: 0,
        isMonthly: false,
        isRequired: true,
        isIncluded: true,
      }
    );

    if (intent === 'leads') {
      includedItems.push({
        id: 'ssr-ai-seo-bundle',
        label: 'AI SEO bundle (methodology included)',
        description: `Included with Ultra Fast build (worth £${PRICING_CONFIG.addOns.voice}/mo)`,
        quantity: 1,
        unitPrice: 0,
        total: 0,
        isMonthly: true,
        isRequired: true,
        isIncluded: true,
      });
    } else {
      includedItems.push({
        id: 'ssr-voice',
        label: 'AI SEO — Be the answer ChatGPT and Google AI cite',
        description: `Included with Ultra Fast (worth £${PRICING_CONFIG.addOns.voice}/mo)`,
        quantity: 1,
        unitPrice: 0,
        total: 0,
        isMonthly: true,
        isRequired: true,
        isIncluded: true,
      });
    }

    pushCatalogAddOns(oneOffItems, monthlyItems, addOns, {
      projectType: 'ssr',
      intent,
      upgradeMult: um,
    });
  }

  if (request.projectType === 'clientManaged') {
    const pageCount = request.scope?.pageCount || 5;
    const packageType =
      pageCount <= 5 ? 'starter' : pageCount <= 10 ? 'professional' : 'enterprise';
    const basePrice = PRICING_CONFIG.baseWebsite[packageType];
    const additionalPages = getAdditionalPages(pageCount);
    const additionalPagesPrice = additionalPages * PRICING_CONFIG.perPageRate;

    oneOffItems.push({
      id: 'base-website',
      label: `${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Website Package`,
      description: 'Built on Wix Studio',
      quantity: 1,
      unitPrice: Math.round(basePrice * um),
      total: Math.round(basePrice * um),
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
        total: Math.round(additionalPagesPrice * um),
        isMonthly: false,
        isRequired: true,
      });
    }

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

    if (request.scope?.webApp && request.scope.webApp !== 'none') {
      const webAppPrice = PRICING_CONFIG.webApps[request.scope.webApp];
      oneOffItems.push({
        id: 'web-app',
        label: `Custom Web App (${request.scope.webApp})`,
        quantity: 1,
        unitPrice: webAppPrice,
        total: webAppPrice,
        isMonthly: false,
        isRequired: false,
      });
    }

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

    if (request.scope?.hasAutomation) {
      oneOffItems.push({
        id: 'automation-setup',
        label: 'Automate emails / calendar / lead routing',
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

    pushCatalogAddOns(oneOffItems, monthlyItems, addOns, {
      projectType: 'clientManaged',
      intent,
      upgradeMult: 1,
    });

    if (addOns.voice) {
      monthlyItems.push({
        id: 'voice',
        label: 'AI SEO — Be the answer ChatGPT and Google AI cite',
        quantity: 1,
        unitPrice: PRICING_CONFIG.addOns.voice,
        total: PRICING_CONFIG.addOns.voice,
        isMonthly: true,
        isRequired: false,
      });
    }
  }

  const oneOffSubtotal = oneOffItems.reduce((sum, item) => sum + item.total, 0);
  const monthlySubtotal = monthlyItems.reduce((sum, item) => sum + item.total, 0);

  const oneOffDiscount = oneOffSubtotal * (1 - PRICING_CONFIG.contracts.oneOff.discount);
  const oneOffFinal = oneOffSubtotal * PRICING_CONFIG.contracts.oneOff.discount;

  const sixTotal = oneOffSubtotal * PRICING_CONFIG.contracts.six.markup;
  const sixMonthly = Math.round(sixTotal / 6 + monthlySubtotal);
  const sixOngoing = PRICING_CONFIG.contracts.six.ongoingMonthly + monthlySubtotal;

  const twelveTotal = oneOffSubtotal * PRICING_CONFIG.contracts.twelve.markup;
  const twelveMonthly = Math.round(twelveTotal / 12 + monthlySubtotal);
  const twelveOngoing = PRICING_CONFIG.contracts.twelve.ongoingMonthly + monthlySubtotal;

  const isSSR = request.projectType === 'ssr';

  return {
    oneOffItems,
    oneOffSubtotal,
    monthlyItems,
    monthlySubtotal,
    includedItems: includedItems.length > 0 ? includedItems : undefined,
    exceedsStandardTier: isSSR ? exceedsStandardTier : undefined,
    recommendedAddOns: recommended,
    includedAddOnKeys,
    totals: {
      oneOff: {
        upfront: oneOffSubtotal,
        discount: Math.round(oneOffDiscount),
        final: Math.round(oneOffFinal),
      },
      six: {
        monthly: isSSR
          ? Math.max(sixMonthly, PRICING_CONFIG.ssrMinimums.six)
          : sixMonthly,
        totalOverTerm: Math.round(sixTotal + monthlySubtotal * 6),
        ongoingAfter: sixOngoing,
      },
      twelve: {
        monthly: isSSR
          ? Math.max(twelveMonthly, PRICING_CONFIG.ssrMinimums.twelve)
          : twelveMonthly,
        totalOverTerm: Math.round(twelveTotal + monthlySubtotal * 12),
        ongoingAfter: twelveOngoing,
      },
      twentyFour: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
      thirtySix: { monthly: 0, totalOverTerm: 0, ongoingAfter: 0 },
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

export function createQuoteResult(
  request: QuoteRequest,
  paymentPreference: PaymentPreference
): QuoteResult {
  assertUkQuoteRequestValid(request);

  const breakdown = calculateQuote(request);
  const { recommended, preTicked } = getIntentAddOnDefaults(request.intent);
  const includedAddOns = [...preTicked];
  if (request.intent === 'shop' && request.projectType === 'ssr') {
    if (!includedAddOns.includes('stripeCheckout')) includedAddOns.push('stripeCheckout');
  }

  let selected: QuoteResult['selected'];

  const term = paymentPreference;
  switch (term) {
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
    case 'waas':
      selected = {
        upfront: breakdown.oneOffSubtotal,
        monthly: breakdown.monthlySubtotal,
        totalOverTerm: breakdown.oneOffSubtotal + breakdown.monthlySubtotal * 12,
        ongoingMonthly: breakdown.monthlySubtotal,
      };
      break;
    default: {
      const _exhaustive: never = term;
      throw new Error(`Unknown payment term: ${_exhaustive}`);
    }
  }

  return {
    id: generateQuoteId(),
    createdAt: new Date(),
    request,
    breakdown,
    selectedPayment: paymentPreference,
    exceedsStandardTier: breakdown.exceedsStandardTier,
    recommendedAddOns: recommended,
    includedAddOns,
    selected,
  };
}

export function getMarketAverage(itemId: string, quantity: number = 1): number | null {
  const mapping: Record<string, keyof typeof UK_MARKET_AVERAGES> = {
    'base-website': 'professionalWebsite',
    'ssr-website': 'ssrBase',
    ecommerce: 'ecommerce50',
    'web-app': 'webAppStandard',
    'complex-forms': 'complexForms',
    'automation-setup': 'automationSetup',
    'automation-monthly': 'automationMonthly',
    voice: 'aeoGeoMonthly',
    branding: 'branding',
    research: 'marketResearch',
    'video-long': 'videoLong',
    'video-short': 'videoShortBundle',
    'image-library': 'imageLibrary',
  };

  const key = mapping[itemId];
  if (!key) return null;
  return UK_MARKET_AVERAGES[key] * quantity;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
