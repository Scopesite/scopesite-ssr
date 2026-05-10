/**
 * ScopeSite QuoteCalculator — worked examples + Pay Monthly Service tiers.
 * Run: npx tsx scripts/verify-quote-scenarios.ts
 */

import { calculateQuote, createQuoteResult } from '../src/lib/calculate-quote';
import { createDefaultAddOns, mergeAddOnsWithIntentDefaults, resolvePayMonthlyTier } from '../src/lib/pricing-config';
import {
  resolveUkResumeDisplayStep,
  UK_CALCULATOR_SCHEMA_VERSION,
  UK_CALCULATOR_TOTAL_STEPS,
} from '../src/lib/uk-quote-resume-step';
import type { PaymentPreference, QuoteAddOns, QuoteRequest, QuoteResult } from '../src/types/pricing';

const TITLE = 'ScopeSite QuoteCalculator UK parity verification';

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;

function defaultScope(pages: number): QuoteRequest['scope'] {
  return {
    pageCount: pages,
    ecommerce: 'none',
    webApp: 'none',
    hasBlog: false,
    hasComplexForms: false,
    hasAutomation: false,
  };
}

function mergeAddOns(partial?: Partial<QuoteAddOns>): QuoteAddOns {
  return { ...createDefaultAddOns(), ...partial };
}

export type ScenarioResult = {
  name: string;
  request: QuoteRequest;
  paymentPreference: PaymentPreference;
  expected: Record<string, unknown>;
  actual: Record<string, unknown>;
  pass: boolean;
  failReasons: string[];
};

function jsonResult(r: QuoteResult): string {
  return JSON.stringify(
    r,
    (_k, v) => (v instanceof Date ? v.toISOString() : v),
    2
  );
}

/** No paid AI SEO / voice line on one-off billables (bundled AI SEO is in includedItems only). */
function noPaidAiSeoVoiceInOneOff(b: ReturnType<typeof calculateQuote>): boolean {
  return !b.oneOffItems.some((i) => {
    const looksAiSeo =
      i.id === 'voice' || i.id === 'ssr-voice' || (i.label && /ai seo/i.test(i.label));
    return looksAiSeo && !i.isIncluded && (i.unitPrice > 0 || i.total > 0);
  });
}

function includedItemsHasSsrVoice(b: ReturnType<typeof calculateQuote>): boolean {
  return !!(b.includedItems?.some((i) => i.id === 'ssr-voice'));
}

function test1(): ScenarioResult {
  const request: QuoteRequest = {
    projectType: 'ssr',
    intent: 'unspecified',
    scope: defaultScope(5),
    addOns: mergeAddOns({}),
    paymentPreference: 'twelve',
  };
  const b = calculateQuote(request);
  createQuoteResult(request, 'twelve');
  const expected = {
    oneOffSubtotal: 2000,
    twelveTotalOverTerm: 2000,
    twelveMonthly: 400,
    exceedsStandardTier: false,
  };
  const actual = {
    oneOffSubtotal: b.oneOffSubtotal,
    twelveTotalOverTerm: b.totals.twelve.totalOverTerm,
    twelveMonthly: b.totals.twelve.monthly,
    exceedsStandardTier: b.exceedsStandardTier,
  };
  const failReasons: string[] = [];
  if (b.oneOffSubtotal !== 2000) failReasons.push(`oneOffSubtotal want 2000 got ${b.oneOffSubtotal}`);
  if (b.totals.twelve.totalOverTerm !== 2000) failReasons.push(`twelve.totalOverTerm want 2000 got ${b.totals.twelve.totalOverTerm}`);
  if (b.totals.twelve.monthly !== 400) failReasons.push(`twelve.monthly want 400 got ${b.totals.twelve.monthly}`);
  if (b.exceedsStandardTier !== false) failReasons.push(`exceedsStandardTier want false got ${b.exceedsStandardTier}`);
  return {
    name: 'Test 1: 5-page SSR / 12-month / no existing site',
    request,
    paymentPreference: 'twelve',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function test2(): ScenarioResult {
  const request: QuoteRequest = {
    projectType: 'ssr',
    intent: 'unspecified',
    scope: defaultScope(5),
    addOns: mergeAddOns({}),
    paymentPreference: 'oneOff',
  };
  const b = calculateQuote(request);
  createQuoteResult(request, 'oneOff');
  const expected = { oneOffFinal: 2000 };
  const actual = { oneOffFinal: b.totals.oneOff.final };
  const failReasons: string[] = [];
  if (b.totals.oneOff.final !== 2000) failReasons.push(`oneOff.final want 2000 got ${b.totals.oneOff.final}`);
  return {
    name: 'Test 2: 5-page SSR / pay in full / no existing site',
    request,
    paymentPreference: 'oneOff',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function test3(): ScenarioResult {
  const request: QuoteRequest = {
    projectType: 'clientManaged',
    intent: 'unspecified',
    scope: defaultScope(10),
    addOns: mergeAddOns({}),
    paymentPreference: 'oneOff',
  };
  const b = calculateQuote(request);
  createQuoteResult(request, 'oneOff');
  const expected = { oneOffFinal: 4125 };
  const actual = { oneOffFinal: b.totals.oneOff.final };
  const failReasons: string[] = [];
  if (b.totals.oneOff.final !== 4125) failReasons.push(`oneOff.final want 4125 got ${b.totals.oneOff.final}`);
  return {
    name: 'Test 3: 10-page Wix / pay in full / no existing site',
    request,
    paymentPreference: 'oneOff',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function test4(): ScenarioResult {
  const request: QuoteRequest = {
    projectType: 'ssr',
    intent: 'unspecified',
    scope: defaultScope(15),
    addOns: mergeAddOns({}),
    paymentPreference: 'twelve',
  };
  const b = calculateQuote(request);
  createQuoteResult(request, 'twelve');
  const expected = {
    oneOffSubtotal: 4250,
    twelveTotalOverTerm: 4250,
    twelveMonthly: 400,
  };
  const actual = {
    oneOffSubtotal: b.oneOffSubtotal,
    twelveTotalOverTerm: b.totals.twelve.totalOverTerm,
    twelveMonthly: b.totals.twelve.monthly,
  };
  const failReasons: string[] = [];
  if (b.oneOffSubtotal !== 4250) failReasons.push(`oneOffSubtotal want 4250 got ${b.oneOffSubtotal}`);
  if (b.totals.twelve.totalOverTerm !== 4250) failReasons.push(`twelve.totalOverTerm want 4250 got ${b.totals.twelve.totalOverTerm}`);
  if (b.totals.twelve.monthly !== 400) failReasons.push(`twelve.monthly want 400 got ${b.totals.twelve.monthly}`);
  return {
    name: 'Test 4: 15-page SSR / 12-month / no existing site',
    request,
    paymentPreference: 'twelve',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function test5(): ScenarioResult {
  const request: QuoteRequest = {
    projectType: 'ssr',
    intent: 'unspecified',
    scope: defaultScope(40),
    addOns: mergeAddOns({}),
    paymentPreference: 'oneOff',
  };
  const b = calculateQuote(request);
  createQuoteResult(request, 'oneOff');
  const expected = {
    exceedsStandardTier: true,
    oneOffSubtotal: 8000,
  };
  const actual = {
    exceedsStandardTier: b.exceedsStandardTier,
    oneOffSubtotal: b.oneOffSubtotal,
  };
  const failReasons: string[] = [];
  if (b.exceedsStandardTier !== true) failReasons.push(`exceedsStandardTier want true got ${b.exceedsStandardTier}`);
  if (b.oneOffSubtotal !== 8000) failReasons.push(`oneOffSubtotal capped want 8000 got ${b.oneOffSubtotal}`);
  return {
    name: 'Test 5: 40-page SSR / ceiling triggered / one-off',
    request,
    paymentPreference: 'oneOff',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function test8(): ScenarioResult {
  const request: QuoteRequest = {
    projectType: 'ssr',
    intent: 'candidates',
    scope: defaultScope(10),
    addOns: mergeAddOns({ jobsBoard: true }),
    paymentPreference: 'oneOff',
  };
  const b = calculateQuote(request);
  const markerOk = includedItemsHasSsrVoice(b);
  const noPaidAi = noPaidAiSeoVoiceInOneOff(b);
  const expected = {
    oneOffSubtotal: 5249,
    oneOffFinal: 5249,
    includedSsrVoice: true,
    noPaidVoiceLine: true,
  };
  const actual = {
    oneOffSubtotal: b.oneOffSubtotal,
    oneOffFinal: b.totals.oneOff.final,
    includedSsrVoice: markerOk,
    noPaidVoiceLine: noPaidAi,
  };
  const failReasons: string[] = [];
  if (b.oneOffSubtotal !== 5249) failReasons.push(`oneOffSubtotal want 5249 got ${b.oneOffSubtotal}`);
  if (b.totals.oneOff.final !== 5249) failReasons.push(`oneOff.final want 5249 got ${b.totals.oneOff.final}`);
  if (!markerOk) failReasons.push('breakdown.includedItems missing id ssr-voice');
  if (!noPaidAi) failReasons.push('oneOffItems contains paid voice / AI SEO line (should be bundled only)');
  return {
    name: 'Test 8: Recruitment / candidates intent / 10-page SSR + jobsBoard',
    request,
    paymentPreference: 'oneOff',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function test9(): ScenarioResult {
  const addOns = mergeAddOnsWithIntentDefaults(
    { ...createDefaultAddOns(), livePromotions: true, livePromotionsShop: true },
    'shop'
  );
  const request: QuoteRequest = {
    projectType: 'ssr',
    intent: 'shop',
    scope: defaultScope(15),
    addOns,
    paymentPreference: 'oneOff',
  };
  const b = calculateQuote(request);
  createQuoteResult(request, 'oneOff');
  const promoLines = b.oneOffItems.filter(
    (i) => i.id === 'live-promotions' || /live promotions/i.test(i.label)
  );
  const stripeLine = b.oneOffItems.find((i) => i.id === 'addon-stripeCheckout');
  const subtotalOk = b.oneOffSubtotal === 5750;
  const expected = {
    livePromotionsLineCount: 1,
    stripeIncluded: true,
    promoUnitPrice: 1500,
    oneOffSubtotal: 5750,
  };
  const actual = {
    livePromotionsLineCount: promoLines.length,
    stripeIncluded: !!(stripeLine?.isIncluded && stripeLine.total === 0),
    promoUnitPrice: promoLines[0]?.unitPrice,
    oneOffSubtotal: b.oneOffSubtotal,
  };
  const failReasons: string[] = [];
  if (promoLines.length !== 1) {
    failReasons.push(`want exactly 1 Live Promotions line, got ${promoLines.length}`);
  }
  if (promoLines.length === 1 && promoLines[0].unitPrice !== 1500) {
    failReasons.push(`promo unit want 1500 got ${promoLines[0].unitPrice}`);
  }
  if (!stripeLine || !stripeLine.isIncluded || stripeLine.total !== 0) {
    failReasons.push('missing £0 Included stripeCheckout line item');
  }
  if (!subtotalOk) {
    failReasons.push(`oneOffSubtotal want 5750 (4250+1500) got ${b.oneOffSubtotal}`);
  }
  return {
    name: 'Test 9: Shop intent / 15-page SSR / both promotion toggles + intent merge',
    request,
    paymentPreference: 'oneOff',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function test10(): ScenarioResult {
  const tier = resolvePayMonthlyTier({
    projectType: 'clientManaged',
    scope: defaultScope(4),
  });
  const expected = { tierId: 'pms-wix-starter' };
  const actual = { tierId: tier?.tierId };
  const failReasons: string[] = [];
  if (tier?.tierId !== 'pms-wix-starter') failReasons.push(`want pms-wix-starter got ${tier?.tierId}`);
  return {
    name: 'Test 10: Pay Monthly tier — 4-page Wix Starter band',
    request: {
      projectType: 'clientManaged',
      scope: defaultScope(4),
      addOns: mergeAddOns({}),
      paymentPreference: 'oneOff',
    } as QuoteRequest,
    paymentPreference: 'oneOff',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function test11(): ScenarioResult {
  const tier = resolvePayMonthlyTier({
    projectType: 'ssr',
    scope: defaultScope(7),
  });
  const expected = { tierId: 'pms-ssr-plus' };
  const actual = { tierId: tier?.tierId };
  const failReasons: string[] = [];
  if (tier?.tierId !== 'pms-ssr-plus') failReasons.push(`want pms-ssr-plus got ${tier?.tierId}`);
  return {
    name: 'Test 11: Pay Monthly tier — 7-page SSR Plus band',
    request: {
      projectType: 'ssr',
      scope: defaultScope(7),
      addOns: mergeAddOns({}),
      paymentPreference: 'oneOff',
    } as QuoteRequest,
    paymentPreference: 'oneOff',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function test12(): ScenarioResult {
  const tier = resolvePayMonthlyTier({
    projectType: 'ssr',
    scope: defaultScope(25),
  });
  const expected = { tierId: null };
  const actual = { tierId: tier?.tierId ?? null };
  const failReasons: string[] = [];
  if (tier !== null) failReasons.push(`want null eligibility for 25-page SSR got ${tier?.tierId}`);
  return {
    name: 'Test 12: Pay Monthly tier — 25-page SSR ineligible',
    request: {
      projectType: 'ssr',
      scope: defaultScope(25),
      addOns: mergeAddOns({}),
      paymentPreference: 'oneOff',
    } as QuoteRequest,
    paymentPreference: 'oneOff',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function test13(): ScenarioResult {
  const legacyAddonsStep = resolveUkResumeDisplayStep(7, undefined, false, UK_CALCULATOR_TOTAL_STEPS);
  const expected = { resumeStep: 6 };
  const actual = { resumeStep: legacyAddonsStep };
  const failReasons: string[] = [];
  if (legacyAddonsStep !== 6) {
    failReasons.push(`want step 6 (add-ons) got ${legacyAddonsStep}`);
  }
  const stubRequest = {
    projectType: 'ssr' as const,
    intent: 'unspecified' as const,
    scope: defaultScope(5),
    addOns: mergeAddOns({}),
    paymentPreference: 'oneOff' as const,
  };
  return {
    name: 'Test 13: Legacy 9-step stored step 7 → 8-step UI step 6 (add-ons)',
    request: stubRequest as QuoteRequest,
    paymentPreference: 'oneOff',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function test14(): ScenarioResult {
  const paymentStep = resolveUkResumeDisplayStep(
    7,
    { calculatorSchemaVersion: UK_CALCULATOR_SCHEMA_VERSION },
    false,
    UK_CALCULATOR_TOTAL_STEPS
  );
  const expected = { resumeStep: 7 };
  const actual = { resumeStep: paymentStep };
  const failReasons: string[] = [];
  if (paymentStep !== 7) {
    failReasons.push(`schema v2 stored step 7 should remain 7 (payment), got ${paymentStep}`);
  }
  const stubRequest = {
    projectType: 'ssr' as const,
    intent: 'unspecified' as const,
    scope: defaultScope(5),
    addOns: mergeAddOns({}),
    paymentPreference: 'oneOff' as const,
  };
  return {
    name: 'Test 14: Resume without +1 — schema v2 step 7 stays on payment (not bumped to summary)',
    request: stubRequest as QuoteRequest,
    paymentPreference: 'oneOff',
    expected,
    actual,
    pass: failReasons.length === 0,
    failReasons,
  };
}

function formatExpectedLine(sr: ScenarioResult): string {
  const e = sr.expected;
  if (sr.name.startsWith('Test 1:')) {
    return `expected: subtotal=${e.oneOffSubtotal}, total=${e.twelveTotalOverTerm}, monthly=${e.twelveMonthly}`;
  }
  if (sr.name.startsWith('Test 2:')) return `expected: oneOff.final=${e.oneOffFinal}`;
  if (sr.name.startsWith('Test 3:')) return `expected: oneOff.final=${e.oneOffFinal}`;
  if (sr.name.startsWith('Test 4:')) {
    return `expected: subtotal=${e.oneOffSubtotal}, total=${e.twelveTotalOverTerm}, monthly=${e.twelveMonthly}`;
  }
  if (sr.name.startsWith('Test 5:')) {
    return `expected: exceedsStandardTier=${e.exceedsStandardTier}, oneOffSubtotal=${e.oneOffSubtotal}`;
  }
  if (sr.name.startsWith('Test 8:')) {
    return `expected: subtotal=${e.oneOffSubtotal}, final=${e.oneOffFinal}, includedItems ssr-voice, no paid AI SEO in oneOff`;
  }
  if (sr.name.startsWith('Test 9:')) {
    return `expected: 1× Live Promotions @1500, stripe included £0, subtotal 5750`;
  }
  if (sr.name.startsWith('Test 10:') || sr.name.startsWith('Test 11:')) {
    return `expected: tierId=${e.tierId}`;
  }
  if (sr.name.startsWith('Test 12:')) return `expected: tierId=${e.tierId}`;
  if (sr.name.startsWith('Test 13:') || sr.name.startsWith('Test 14:')) return `expected: resumeStep=${e.resumeStep}`;
  return `expected: ${JSON.stringify(e)}`;
}

function formatActualLine(sr: ScenarioResult): string {
  const a = sr.actual;
  if (sr.name.startsWith('Test 1:')) {
    return `actual:   subtotal=${a.oneOffSubtotal}, total=${a.twelveTotalOverTerm}, monthly=${a.twelveMonthly}`;
  }
  if (sr.name.startsWith('Test 2:')) return `actual:   oneOff.final=${a.oneOffFinal}`;
  if (sr.name.startsWith('Test 3:')) return `actual:   oneOff.final=${a.oneOffFinal}`;
  if (sr.name.startsWith('Test 4:')) {
    return `actual:   subtotal=${a.oneOffSubtotal}, total=${a.twelveTotalOverTerm}, monthly=${a.twelveMonthly}`;
  }
  if (sr.name.startsWith('Test 5:')) {
    return `actual:   exceedsStandardTier=${a.exceedsStandardTier}, oneOffSubtotal=${a.oneOffSubtotal}`;
  }
  if (sr.name.startsWith('Test 8:')) {
    return `actual:   subtotal=${a.oneOffSubtotal}, final=${a.oneOffFinal}, ssr-voice=${a.includedSsrVoice}, noPaidAi=${a.noPaidVoiceLine}`;
  }
  if (sr.name.startsWith('Test 9:')) {
    return `actual:   promoLines=${a.livePromotionsLineCount}, stripeIncluded=${a.stripeIncluded}, subtotal=${a.oneOffSubtotal}`;
  }
  if (sr.name.startsWith('Test 10:') || sr.name.startsWith('Test 11:') || sr.name.startsWith('Test 12:')) {
    return `actual:   tierId=${a.tierId}`;
  }
  if (sr.name.startsWith('Test 13:') || sr.name.startsWith('Test 14:')) return `actual:   resumeStep=${a.resumeStep}`;
  return `actual:   ${JSON.stringify(a)}`;
}

function main() {
  console.log(TITLE);
  const runners = [
    test1,
    test2,
    test3,
    test4,
    test5,
    test8,
    test9,
    test10,
    test11,
    test12,
    test13,
    test14,
  ];
  let passed = 0;
  const failed: ScenarioResult[] = [];

  for (const run of runners) {
    const sr = run();
    const label = sr.pass ? green('[PASS]') : red('[FAIL]');
    console.log(`${label} ${sr.name}`);
    console.log(formatExpectedLine(sr));
    console.log(formatActualLine(sr));
    for (const reason of sr.failReasons) {
      console.log(red(`BUT: ${reason}`));
    }
    if (!sr.pass) {
      const r = createQuoteResult(sr.request, sr.paymentPreference);
      console.log('(full QuoteResult JSON for debug)');
      console.log(jsonResult(r));
      failed.push(sr);
    }
    console.log('');
    if (sr.pass) passed++;
  }

  console.log('=============================================');
  const summary = `Result: ${passed}/${runners.length} passed, ${failed.length} failed`;
  console.log(failed.length === 0 ? green(summary) : red(summary));
  process.exit(failed.length === 0 ? 0 : 1);
}

main();
