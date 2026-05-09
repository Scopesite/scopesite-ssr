'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  Zap,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { calculateQuote, createQuoteResult, formatCurrency } from '@/lib/calculate-quote';
import {
  PRICING_LABELS,
  SSR_INCLUDED_FEATURES,
  ADDON_CATALOG,
  ADDON_CATEGORY_LABELS,
  type AddOnCategory,
  INTENT_PATH_COPY,
  LIMITS,
  mergeAddOnsWithIntentDefaults,
  createDefaultAddOns,
  getIntentAddOnDefaults,
  THIRTY_SIX_MONTH_MIN_SUBTOTAL_GBP,
} from '@/lib/pricing-config';
import { QuoteEmailCaptureModal } from '@/components/quote/QuoteEmailCaptureModal';
import type {
  ProjectType,
  PaymentPreference,
  EcommerceSize,
  WebAppSize,
  QuoteRequest,
  ContactInfo,
  QuoteIntent,
  QuoteAddOns,
  IntentAddOnKey,
} from '@/types/pricing';

const STORAGE_REDIRECT_NOTICE = 'scopesite_quote_redirect_notice';
const TOTAL_STEPS = 8;

interface StepDef {
  id: number;
  title: string;
  description: string;
}

const STEPS: StepDef[] = [
  { id: 1, title: 'Welcome', description: 'Your instant quote' },
  { id: 2, title: 'Existing site', description: 'Refresh discount eligibility' },
  { id: 3, title: 'Your goal', description: 'What you want the site to do' },
  { id: 4, title: 'Build type', description: 'Ultra Fast vs manage yourself' },
  { id: 5, title: 'Scope', description: 'Pages and features' },
  { id: 6, title: 'Add-ons', description: 'Optional extras' },
  { id: 7, title: 'Payment plan', description: 'How you prefer to pay' },
  { id: 8, title: 'Summary', description: 'Review and send' },
];

const CATEGORY_ORDER: AddOnCategory[] = [
  'leadGen',
  'booking',
  'recruitment',
  'onlineShop',
  'crossCutting',
  'brandContent',
];

/** Payment options always shown; 36-month appended only when build subtotal allows */
const PAYMENT_OPTIONS_BASE: PaymentPreference[] = ['oneOff', 'six', 'twelve', 'twentyFour'];

const initialRequest: Partial<QuoteRequest> = {
  hasExistingSite: false,
  intent: 'unspecified',
  scope: {
    pageCount: 5,
    ecommerce: 'none',
    webApp: 'none',
    hasBlog: false,
    hasComplexForms: false,
    hasAutomation: false,
  },
  addOns: createDefaultAddOns(),
  paymentPreference: 'twelve',
};

function mapLegacySixStepToEight(oldStep: number): number {
  if (oldStep <= 1) return oldStep;
  if (oldStep === 2) return 4;
  if (oldStep === 3) return 5;
  if (oldStep === 4) return 6;
  if (oldStep === 5) return 7;
  return 8;
}

function normalizeLoadedAddOns(raw: unknown): QuoteAddOns {
  const d = createDefaultAddOns();
  if (!raw || typeof raw !== 'object') return d;
  const p = raw as Record<string, unknown>;
  const merged = { ...d, ...(raw as Partial<QuoteAddOns>) };
  if (p.branding === true) merged.brandIdentity = true;
  if (p.research === true) merged.sectorDeepDive = true;
  if (p.ssrCustomerPortal === true) merged.clientPortal = true;
  if (p.ssrAuthentication === true) merged.membersArea = true;
  if (p.ssrMultilanguage === true) merged.ssrI18n = true;
  return merged;
}

function normalizeLoadedScope(
  raw: Partial<QuoteRequest['scope']> | undefined
): NonNullable<QuoteRequest['scope']> {
  const base = { ...initialRequest.scope! };
  if (!raw || typeof raw !== 'object') return base;
  const { headlessEcommerce: _h, ssrWebApp: _s, ...rest } = raw as Record<string, unknown>;
  return { ...base, ...rest } as NonNullable<QuoteRequest['scope']>;
}

function addonKeyVisible(
  key: IntentAddOnKey,
  projectType: ProjectType | undefined,
  intent: QuoteIntent | undefined
): boolean {
  if (key === 'stripeCheckout') {
    return projectType === 'ssr' && intent === 'shop';
  }
  return true;
}

export function QuoteCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quoteRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [request, setRequest] = useState<Partial<QuoteRequest>>(initialRequest);
  const [contact, setContact] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [quoteToken, setQuoteToken] = useState<string | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteLimitExceeded, setQuoteLimitExceeded] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [legacyNotice, setLegacyNotice] = useState<string | null>(null);

  const breakdown = useMemo(() => calculateQuote(request), [request]);
  const isSSR = request.projectType === 'ssr';
  const exceedsTier = !!breakdown.exceedsStandardTier;

  const paymentPlanOptions = useMemo((): PaymentPreference[] => {
    if (breakdown.thirtySixAvailable) {
      return [...PAYMENT_OPTIONS_BASE, 'thirtySix'];
    }
    return PAYMENT_OPTIONS_BASE;
  }, [breakdown.thirtySixAvailable]);

  const { recommended, preTicked } = useMemo(
    () => getIntentAddOnDefaults(request.intent),
    [request.intent]
  );
  const suggestedKeys = useMemo(() => {
    const s = new Set<IntentAddOnKey>([...recommended, ...preTicked]);
    return Array.from(s);
  }, [recommended, preTicked]);

  useEffect(() => {
    const token = searchParams.get('q');
    if (token && !quoteToken) {
      void loadSavedQuote(token);
    }
  }, [searchParams, quoteToken]);

  const updateUrlWithToken = (token: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', token);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const saveProgress = useCallback(
    async (step: number, reqSnapshot: Partial<QuoteRequest>) => {
      if (!quoteToken) return;
      try {
        await fetch(`/api/quote/${quoteToken}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentStep: step,
            selections: {
              projectType: reqSnapshot.projectType,
              hasExistingSite: reqSnapshot.hasExistingSite ?? false,
              intent: reqSnapshot.intent ?? 'unspecified',
              scope: reqSnapshot.scope ?? initialRequest.scope,
              addOns: reqSnapshot.addOns ?? createDefaultAddOns(),
              paymentPreference: reqSnapshot.paymentPreference ?? 'twelve',
            },
            contact: {
              name: contact.name,
              phone: contact.phone,
              company: contact.company,
              message: contact.message,
              websiteUrl,
            },
          }),
        });
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
    },
    [quoteToken, contact.name, contact.phone, contact.company, contact.message, websiteUrl]
  );

  const loadSavedQuote = async (token: string) => {
    setIsLoadingQuote(true);
    try {
      const response = await fetch(`/api/quote/${token}`);
      const data = await response.json();

      if (data.success && !data.isSubmitted) {
        const sel = data.quote.selections as Record<string, unknown> & {
          projectType?: string;
          scope?: Partial<QuoteRequest['scope']>;
          addOns?: unknown;
        };

        if (sel.projectType === 'visibility') {
          try {
            sessionStorage.setItem(
              STORAGE_REDIRECT_NOTICE,
              'AI SEO and retainer quotes now use this dedicated path — your saved link still works.'
            );
          } catch {
            /* ignore */
          }
          router.replace(`/ai-seo-services?q=${encodeURIComponent(token)}`);
          return;
        }
        if (sel.projectType === 'webapp') {
          try {
            sessionStorage.setItem(
              STORAGE_REDIRECT_NOTICE,
              'Custom web app quotes now use this page — your saved link still works.'
            );
          } catch {
            /* ignore */
          }
          router.replace(`/web-apps?q=${encodeURIComponent(token)}`);
          return;
        }

        let projectType = sel.projectType as ProjectType | undefined;
        let hasExistingSite = sel.hasExistingSite as boolean | undefined;
        if (sel.projectType === 'upgrade') {
          projectType = 'clientManaged';
          hasExistingSite = true;
          setLegacyNotice('Quote refreshed for new pricing — please review your selections.');
        }

        const scopeRaw = normalizeLoadedScope(sel.scope);
        const addOnsNorm = normalizeLoadedAddOns(sel.addOns);

        const legacyShape =
          sel.projectType === 'upgrade' ||
          !!(sel.scope && typeof sel.scope === 'object' && 'headlessEcommerce' in sel.scope) ||
          !!(sel.addOns && typeof sel.addOns === 'object' && 'branding' in (sel.addOns as object));

        let step = data.quote.currentStep as number;
        if (legacyShape && step > 1) {
          step = mapLegacySixStepToEight(step);
        }

        setQuoteToken(token);
        setContact((prev) => ({
          ...prev,
          email: data.quote.email,
          ...data.quote.contact,
        }));
        if (data.quote.contact?.websiteUrl) {
          setWebsiteUrl(data.quote.contact.websiteUrl);
        }

        setRequest({
          ...initialRequest,
          ...sel,
          projectType: projectType === 'ssr' || projectType === 'clientManaged' ? projectType : undefined,
          hasExistingSite: hasExistingSite ?? false,
          intent: (sel.intent as QuoteIntent) || 'unspecified',
          scope: scopeRaw,
          addOns: addOnsNorm,
          paymentPreference: (sel.paymentPreference as PaymentPreference) || 'twelve',
        });

        setCurrentStep(step > 1 ? step : 2);
      } else if (data.isSubmitted) {
        setIsSubmitted(true);
        setQuoteId(token);
      }
    } catch (e) {
      console.error('Failed to load saved quote:', e);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const updateRequest = useCallback((updates: Partial<QuoteRequest>) => {
    setRequest((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    if (currentStep !== 7 || exceedsTier) return;
    if (breakdown.thirtySixAvailable) return;
    if (request.paymentPreference === 'thirtySix') {
      updateRequest({ paymentPreference: 'twelve' });
    }
  }, [currentStep, exceedsTier, breakdown.thirtySixAvailable, request.paymentPreference, updateRequest]);

  const updateScope = useCallback((updates: Partial<NonNullable<QuoteRequest['scope']>>) => {
    setRequest((prev) => ({
      ...prev,
      scope: { ...prev.scope!, ...updates },
    }));
  }, []);

  const updateAddOns = useCallback((updates: Partial<QuoteAddOns>) => {
    setRequest((prev) => ({
      ...prev,
      addOns: { ...prev.addOns!, ...updates },
    }));
  }, []);

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const canGoNext = useCallback(() => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return typeof request.hasExistingSite === 'boolean';
    if (currentStep === 3) return !!request.intent;
    if (currentStep === 4) return request.projectType === 'ssr' || request.projectType === 'clientManaged';
    if (currentStep === 5) return true;
    if (currentStep === 6) return true;
    if (currentStep === 7) {
      if (exceedsTier) return true;
      return !!request.paymentPreference;
    }
    if (currentStep === 8) return contact.name.trim() !== '';
    return false;
  }, [currentStep, request, contact.name, exceedsTier]);

  const startQuoteWithEmail = useCallback(
    async (
      email: string,
      url: string,
      payload: {
        projectType: ProjectType;
        hasExistingSite?: boolean;
        intent?: QuoteIntent;
      }
    ) => {
      try {
        const response = await fetch('/api/quote/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            websiteUrl: url || undefined,
            projectType: payload.projectType,
            hasExistingSite: payload.hasExistingSite,
            intent: payload.intent,
          }),
        });
        const data = await response.json();

        if (data.success) {
          setQuoteToken(data.quoteId);
          updateUrlWithToken(data.quoteId);

          if (data.isExisting && data.selections) {
            setRequest((prev) => ({ ...prev, ...data.selections }));
            if (data.contact) {
              setContact((prev) => ({ ...prev, ...data.contact }));
              if (data.contact.websiteUrl) setWebsiteUrl(data.contact.websiteUrl);
            }
          }
          return { success: true as const, data };
        }
        if (data.limitExceeded) {
          setQuoteLimitExceeded(true);
          return { success: false as const, limitExceeded: true };
        }
        return { success: false as const };
      } catch (e) {
        console.error('Failed to start quote:', e);
        return { success: false as const };
      }
    },
    []
  );

  const goNext = () => {
    if (!canGoNext() || currentStep >= TOTAL_STEPS) return;

    if (currentStep === 4 && !quoteToken) {
      setEmailModalOpen(true);
      return;
    }

    let nextReq = request;
    if (currentStep === 3) {
      nextReq = {
        ...request,
        addOns: mergeAddOnsWithIntentDefaults(
          request.addOns ?? createDefaultAddOns(),
          request.intent
        ),
      };
      setRequest(nextReq);
    }

    const nextStep = currentStep + 1;
    if (quoteToken) {
      void saveProgress(nextStep, nextReq);
    }
    setCurrentStep(nextStep);
    scrollToTop();
  };

  const goBack = () => {
    if (currentStep <= 1) return;
    const prevStep = currentStep - 1;
    if (quoteToken) {
      void saveProgress(prevStep, request);
    }
    setCurrentStep(prevStep);
    scrollToTop();
  };

  const handleEmailModalSubmit = useCallback(
    async (submittedEmail: string, submittedUrl: string) => {
      setContact((prev) => ({ ...prev, email: submittedEmail }));
      setWebsiteUrl(submittedUrl);

      if (!request.projectType) {
        return { ok: false as const, error: 'Choose a build type first.' };
      }

      const result = await startQuoteWithEmail(submittedEmail, submittedUrl, {
        projectType: request.projectType,
        hasExistingSite: request.hasExistingSite,
        intent: request.intent,
      });

      if (!result.success) {
        if (result.limitExceeded) {
          setEmailModalOpen(false);
          return { ok: true as const };
        }
        return {
          ok: false as const,
          error: "We couldn't start your quote. Please try again or contact us.",
        };
      }

      if (result.data?.isExisting) {
        const raw = result.data.currentStep as number;
        const sel = result.data.selections as { scope?: Record<string, unknown> } | undefined;
        const legacyScope = sel?.scope && 'headlessEcommerce' in sel.scope;
        let step: number;
        if (raw >= 5) {
          step = Math.min(raw, TOTAL_STEPS);
        } else if (raw === 4 && !legacyScope) {
          step = 5;
        } else {
          step = Math.max(mapLegacySixStepToEight(Math.max(raw, 1)), 5);
        }
        setCurrentStep(step);
        setEmailModalOpen(false);
        scrollToTop();
        return { ok: true as const };
      }

      const newToken = result.data?.quoteId as string | undefined;
      const merged = {
        ...request,
        addOns: request.addOns ?? createDefaultAddOns(),
      };
      if (newToken) {
        void fetch(`/api/quote/${newToken}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentStep: 5,
            selections: {
              projectType: merged.projectType,
              hasExistingSite: merged.hasExistingSite ?? false,
              intent: merged.intent ?? 'unspecified',
              scope: merged.scope ?? initialRequest.scope,
              addOns: merged.addOns,
              paymentPreference: merged.paymentPreference ?? 'twelve',
            },
            contact: { websiteUrl: submittedUrl },
          }),
        }).catch((err) => console.error('Failed to save step after email:', err));
      }

      setEmailModalOpen(false);
      setCurrentStep(5);
      scrollToTop();
      return { ok: true as const };
    },
    [request, startQuoteWithEmail, scrollToTop]
  );

  const handleSubmit = async () => {
    if (!canGoNext()) return;
    if (!request.projectType || !request.scope || !request.addOns || !request.paymentPreference) return;

    setIsSubmitting(true);

    const fullRequest: QuoteRequest = {
      projectType: request.projectType,
      hasExistingSite: request.hasExistingSite,
      intent: request.intent ?? 'unspecified',
      scope: request.scope,
      addOns: request.addOns,
      paymentPreference: request.paymentPreference,
      contact,
    };

    const result = createQuoteResult(fullRequest, request.paymentPreference);

    try {
      if (quoteToken) {
        const pageCount = request.scope?.pageCount || 5;
        let packageType: string;
        if (request.projectType === 'ssr') {
          packageType = exceedsTier
            ? 'Ultra Fast (enterprise consult)'
            : 'Ultra Fast — AI Visible';
        } else if (pageCount > 10) packageType = 'Enterprise';
        else if (pageCount > 5) packageType = 'Professional';
        else packageType = 'Starter';

        const paymentPref = request.paymentPreference;
        const paymentTypeLabels: Record<string, string> = {
          oneOff: 'One-off',
          six: '6-month',
          twelve: '12-month',
          twentyFour: '24-month',
          thirtySix: '36-month',
        };

        let selectedTotal: number;
        let monthlyPayment: number | null = null;
        let paymentTypeLabel: string;

        if (paymentPref === 'oneOff') {
          selectedTotal = breakdown.totals.oneOff.final;
          paymentTypeLabel = paymentTypeLabels.oneOff;
        } else if (paymentPref === 'twelve') {
          selectedTotal = breakdown.totals.twelve.totalOverTerm;
          monthlyPayment = breakdown.totals.twelve.monthly;
          paymentTypeLabel = paymentTypeLabels.twelve;
        } else if (paymentPref === 'six') {
          selectedTotal = breakdown.totals.six.totalOverTerm;
          monthlyPayment = breakdown.totals.six.monthly;
          paymentTypeLabel = paymentTypeLabels.six;
        } else if (paymentPref === 'twentyFour') {
          selectedTotal = breakdown.totals.twentyFour.totalOverTerm;
          monthlyPayment = breakdown.totals.twentyFour.monthly;
          paymentTypeLabel = paymentTypeLabels.twentyFour;
        } else {
          selectedTotal = breakdown.totals.thirtySix.totalOverTerm;
          monthlyPayment = breakdown.totals.thirtySix.monthly;
          paymentTypeLabel = paymentTypeLabels.thirtySix;
        }

        await fetch(`/api/quote/${quoteToken}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentStep: TOTAL_STEPS,
            selections: {
              projectType: request.projectType,
              hasExistingSite: request.hasExistingSite ?? false,
              intent: request.intent ?? 'unspecified',
              scope: request.scope,
              addOns: request.addOns,
              paymentPreference: request.paymentPreference,
            },
            contact: {
              name: contact.name,
              phone: contact.phone,
              company: contact.company,
              message: exceedsTier
                ? `${contact.message ? contact.message + '\n\n' : ''}[Enterprise tier — raw Ultra Fast build over £8k cap; custom scope]`
                : contact.message,
              websiteUrl,
            },
            submit: true,
            pricing: {
              packageType,
              paymentType: paymentTypeLabel,
              selectedTotal,
              monthlyPayment,
            },
            locale: 'uk',
          }),
        });
      }

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: fullRequest,
          result,
          quoteToken,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit quote');

      const data = await response.json();
      setQuoteId(quoteToken || data.quoteId || result.id);
      setIsSubmitted(true);
    } catch (e) {
      console.error('Submit error:', e);
      setQuoteId(quoteToken || result.id);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAddonToggle = (key: IntentAddOnKey) => {
    const meta = ADDON_CATALOG[key];
    const visible = addonKeyVisible(key, request.projectType, request.intent);
    if (!visible) return null;

    const checked = !!request.addOns?.[key];
    const isSuggested = suggestedKeys.includes(key);
    const disabled =
      key === 'stripeCheckout' && !(request.projectType === 'ssr' && request.intent === 'shop');

    return (
      <label
        key={key}
        className={cn(
          'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
          checked ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-graphite/15 hover:border-brand-gold/40',
          isSuggested && !checked && 'ring-1 ring-brand-gold/30',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Checkbox
          checked={checked}
          disabled={disabled}
          onCheckedChange={(v) => updateAddOns({ [key]: v === true } as Partial<QuoteAddOns>)}
          className="mt-1"
        />
        <span className="flex-1 min-w-0">
          <span className="font-medium text-brand-navy block">{meta.label}</span>
          <span className="text-sm text-brand-graphite">
            {meta.isMonthly ? `${formatCurrency(meta.price)}/mo` : formatCurrency(meta.price)} build
            {isSuggested && !checked ? ' · Suggested for your goal' : ''}
          </span>
        </span>
      </label>
    );
  };

  const renderStepBody = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/20 mb-2">
              <Sparkles className="w-8 h-8 text-brand-gold" />
            </div>
            <p className="text-brand-navy/80 text-body-lg max-w-lg mx-auto">
              Answer a few questions — we&apos;ll show transparent pricing for an Ultra Fast (Next.js) site or a
              manage-yourself build, with optional extras matched to your goal.
            </p>
            <p className="text-sm text-brand-graphite max-w-md mx-auto">
              Estimates are indicative; final statement of work confirms scope.
            </p>
            <Card className="text-left border-brand-navy/10 bg-brand-navy/[0.02]">
              <CardContent className="pt-6 flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-navy">UK-first delivery</p>
                  <p className="text-sm text-brand-graphite mt-1">
                    We work with businesses across the UK. See{' '}
                    <Link href="/territory" className="text-brand-gold font-medium underline-offset-2 hover:underline">
                      where we operate
                    </Link>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-brand-graphite">
              Do you already have a live website we&apos;re refreshing or replacing? Existing sites qualify for a{' '}
              <strong>40% discount</strong> on the core build (and on Ultra Fast catalog add-ons when you choose Ultra
              Fast).
            </p>
            <RadioGroup
              value={
                request.hasExistingSite === true ? 'yes' : request.hasExistingSite === false ? 'no' : undefined
              }
              onValueChange={(v) => updateRequest({ hasExistingSite: v === 'yes' })}
              className="grid sm:grid-cols-2 gap-3"
            >
              <label
                className={cn(
                  'flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all',
                  request.hasExistingSite === true ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-graphite/15'
                )}
              >
                <RadioGroupItem value="yes" id="ex-yes" />
                <span className="font-medium text-brand-navy">Yes — existing site</span>
              </label>
              <label
                className={cn(
                  'flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all',
                  request.hasExistingSite === false ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-graphite/15'
                )}
              >
                <RadioGroupItem value="no" id="ex-no" />
                <span className="font-medium text-brand-navy">No — new build</span>
              </label>
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(INTENT_PATH_COPY) as QuoteIntent[]).map((intent) => {
              const copy = INTENT_PATH_COPY[intent];
              const selected = request.intent === intent;
              return (
                <button
                  key={intent}
                  type="button"
                  onClick={() => updateRequest({ intent })}
                  className={cn(
                    'text-left rounded-xl border-2 p-4 transition-all hover:border-brand-gold/50',
                    selected ? 'border-brand-gold bg-brand-gold/5 shadow-sm' : 'border-brand-graphite/15'
                  )}
                >
                  <div className="font-headline font-bold text-brand-navy">{copy.title}</div>
                  <p className="text-sm text-brand-graphite mt-2">{copy.subhead}</p>
                </button>
              );
            })}
          </div>
        );

      case 4:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {(['ssr', 'clientManaged'] as ProjectType[]).map((pt) => {
              const selected = request.projectType === pt;
              return (
                <button
                  key={pt}
                  type="button"
                  onClick={() => {
                    updateRequest({
                      projectType: pt,
                      scope: {
                        ...request.scope!,
                        websiteType: pt,
                      },
                    });
                  }}
                  className={cn(
                    'relative text-left rounded-2xl border-2 p-6 transition-all hover:border-brand-gold/60',
                    selected ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-graphite/15'
                  )}
                >
                  {pt === 'ssr' && (
                    <span className="absolute -top-3 right-4 text-xs font-bold bg-brand-gold text-brand-navy px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" /> AI-visible
                    </span>
                  )}
                  <h3 className="font-headline text-lg font-black text-brand-navy mb-2">
                    {PRICING_LABELS.projectTypes[pt]}
                  </h3>
                  <p className="text-sm text-brand-graphite">{PRICING_LABELS.projectDescriptions[pt]}</p>
                  <p className="text-xs text-brand-gold font-semibold mt-3">{PRICING_LABELS.projectBadges[pt]}</p>
                </button>
              );
            })}
          </div>
        );

      case 5: {
        const minP = isSSR ? LIMITS.minPagesSSR : LIMITS.minPages;
        const maxP = LIMITS.maxPages;
        const pages = Math.min(maxP, Math.max(minP, request.scope?.pageCount ?? minP));
        return (
          <div className="space-y-8">
            <div>
              <Label className="text-brand-navy font-semibold">
                Pages: <span className="text-brand-gold">{pages}</span>
                {isSSR ? <span className="text-brand-graphite font-normal"> (min {LIMITS.minPagesSSR} for Ultra Fast)</span> : null}
              </Label>
              <Slider
                value={[pages]}
                min={minP}
                max={maxP}
                step={1}
                onValueChange={([n]) => updateScope({ pageCount: n })}
                className="mt-4"
              />
            </div>

            {isSSR && (
              <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/5 p-4">
                <p className="text-sm font-semibold text-brand-navy mb-2">Included with Ultra Fast</p>
                <ul className="text-sm text-brand-graphite space-y-1 list-disc pl-5">
                  {SSR_INCLUDED_FEATURES.slice(0, 6).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-brand-navy">E-commerce</Label>
                <Select
                  value={request.scope?.ecommerce || 'none'}
                  onValueChange={(v) => updateScope({ ecommerce: v as EcommerceSize })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PRICING_LABELS.ecommerce) as EcommerceSize[]).map((k) => (
                      <SelectItem key={k} value={k}>
                        {PRICING_LABELS.ecommerce[k]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-brand-navy">Custom web app</Label>
                <Select
                  value={request.scope?.webApp || 'none'}
                  onValueChange={(v) => updateScope({ webApp: v as WebAppSize })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PRICING_LABELS.webApps) as WebAppSize[]).map((k) => (
                      <SelectItem key={k} value={k}>
                        {PRICING_LABELS.webApps[k]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="blog"
                  checked={!!request.scope?.hasBlog}
                  onCheckedChange={(v) => updateScope({ hasBlog: v === true })}
                />
                <Label htmlFor="blog">Blog / news section</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="forms"
                  checked={!!request.scope?.hasComplexForms}
                  onCheckedChange={(v) => updateScope({ hasComplexForms: v === true })}
                />
                <Label htmlFor="forms">{PRICING_LABELS.addOns.complexForms}</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="auto"
                  checked={!!request.scope?.hasAutomation}
                  onCheckedChange={(v) => updateScope({ hasAutomation: v === true })}
                />
                <Label htmlFor="auto">{PRICING_LABELS.addOns.automationSetup}</Label>
              </div>
            </div>
          </div>
        );
      }

      case 6:
        return (
          <div className="space-y-8">
            {suggestedKeys.length > 0 && (
              <div>
                <h4 className="font-headline font-bold text-brand-navy mb-3">Suggested for your goal</h4>
                <div className="grid gap-2 sm:grid-cols-2">{suggestedKeys.map(renderAddonToggle)}</div>
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <h4 className="font-headline font-bold text-brand-navy">Full add-on catalogue</h4>
              {CATEGORY_ORDER.map((cat) => {
                const keys = (Object.keys(ADDON_CATALOG) as IntentAddOnKey[]).filter(
                  (k) => ADDON_CATALOG[k].category === cat
                );
                const inSuggested = new Set(suggestedKeys);
                const rest = keys.filter((k) => !inSuggested.has(k));
                if (rest.length === 0) return null;
                return (
                  <div key={cat}>
                    <p className="text-sm font-semibold text-brand-navy/80 mb-2">{ADDON_CATEGORY_LABELS[cat]}</p>
                    <div className="grid gap-2 sm:grid-cols-2">{rest.map(renderAddonToggle)}</div>
                  </div>
                );
              })}
            </div>

            {request.projectType === 'clientManaged' && (
              <div className="rounded-xl border border-brand-navy/10 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="voice"
                    checked={!!request.addOns?.voice}
                    onCheckedChange={(v) => updateAddOns({ voice: v === true })}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="voice" className="font-semibold text-brand-navy cursor-pointer">
                      {PRICING_LABELS.addOns.voice}
                    </Label>
                    <p className="text-sm text-brand-graphite mt-1">
                      Optional monthly AI SEO retainer on manage-yourself builds (included with Ultra Fast).
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label className="text-brand-navy font-semibold">
                Long-form video packages: {request.addOns?.videoLong ?? 0}
              </Label>
              <Slider
                value={[request.addOns?.videoLong ?? 0]}
                min={0}
                max={LIMITS.maxVideos}
                step={1}
                onValueChange={([n]) => updateAddOns({ videoLong: n })}
                className="mt-4"
              />
            </div>

            {exceedsTier && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-brand-navy">
                <strong>Enterprise tier:</strong> your Ultra Fast core build exceeds our standard £8,000 published cap
                before add-ons. On the next steps we&apos;ll route you to a custom scope — online checkout may not
                apply.
              </div>
            )}

            <p className="text-xs text-brand-graphite">
              Prices shown are estimates. Promotions / live pricing modules count once even if both related options
              appear in the list.
            </p>
          </div>
        );

      case 7:
        if (exceedsTier) {
          return (
            <div className="space-y-6 text-center py-4">
              <p className="text-brand-navy font-semibold text-lg">Custom enterprise quote</p>
              <p className="text-brand-graphite max-w-md mx-auto">
                This configuration is beyond our standard published Ultra Fast tier. Book a short call and we&apos;ll
                scope it properly — your selections are saved on the next page.
              </p>
              <Button asChild className="bg-brand-gold text-brand-navy hover:bg-white">
                <a href={contact.email ? `/book?email=${encodeURIComponent(contact.email)}` : '/book'}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a call
                </a>
              </Button>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            {!breakdown.thirtySixAvailable && (
              <p className="text-sm text-brand-graphite rounded-lg border border-brand-navy/10 bg-brand-navy/[0.03] px-3 py-2">
                Builds under £{THIRTY_SIX_MONTH_MIN_SUBTOTAL_GBP.toLocaleString('en-GB')} are available on 6, 12 or
                24-month terms.
              </p>
            )}
            <RadioGroup
              value={request.paymentPreference}
              onValueChange={(v) => updateRequest({ paymentPreference: v as PaymentPreference })}
              className="space-y-3"
            >
              {paymentPlanOptions.map((pref) => (
                <label
                  key={pref}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all',
                    request.paymentPreference === pref ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-graphite/15'
                  )}
                >
                  <RadioGroupItem value={pref} id={`pay-${pref}`} />
                  <span className="font-medium text-brand-navy">{PRICING_LABELS.payments[pref]}</span>
                </label>
              ))}
            </RadioGroup>
            <p className="text-xs text-brand-graphite pt-2">
              Monthly figures include recurring add-ons (e.g. video bundle, automation maintenance, optional AI SEO on
              manage-yourself builds). Ultra Fast contracts apply minimum monthly floors shown in your summary.
            </p>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="rounded-xl bg-brand-navy/5 border border-brand-navy/10 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-graphite">One-off subtotal</span>
                <span className="font-medium">{formatCurrency(breakdown.oneOffSubtotal)}</span>
              </div>
              {breakdown.monthlySubtotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-brand-graphite">Monthly add-ons (recurring)</span>
                  <span className="font-medium">{formatCurrency(breakdown.monthlySubtotal)}/mo</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-headline font-bold text-brand-navy">
                <span>
                  {request.paymentPreference === 'oneOff'
                    ? 'Pay in full'
                    : `${PRICING_LABELS.payments[request.paymentPreference!]}`}
                </span>
                <span>
                  {request.paymentPreference === 'oneOff'
                    ? formatCurrency(breakdown.totals.oneOff.final)
                    : `${formatCurrency(
                        breakdown.totals[request.paymentPreference === 'six' ? 'six' : request.paymentPreference === 'twelve' ? 'twelve' : request.paymentPreference === 'twentyFour' ? 'twentyFour' : 'thirtySix'].monthly
                      )}/mo`}
                </span>
              </div>
              {request.paymentPreference !== 'oneOff' && (
                <p className="text-xs text-brand-graphite">
                  Total over term:{' '}
                  {formatCurrency(
                    breakdown.totals[
                      request.paymentPreference === 'six'
                        ? 'six'
                        : request.paymentPreference === 'twelve'
                          ? 'twelve'
                          : request.paymentPreference === 'twentyFour'
                            ? 'twentyFour'
                            : 'thirtySix'
                    ].totalOverTerm
                  )}
                </p>
              )}
            </div>

            {exceedsTier && (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                Enterprise path: totals use the published £8,000 Ultra Fast cap for the core build; final pricing is
                agreed after scoping.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={contact.name}
                  onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={contact.company}
                  onChange={(e) => setContact((c) => ({ ...c, company: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="msg">Message</Label>
                <Input
                  id="msg"
                  value={contact.message}
                  onChange={(e) => setContact((c) => ({ ...c, message: e.target.value }))}
                  className="mt-1"
                  placeholder="Anything else we should know?"
                />
              </div>
            </div>

            <p className="text-xs text-brand-graphite">
              By submitting, you agree we may contact you about this quote. This is not a binding contract.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoadingQuote) {
    return (
      <Card className="max-w-2xl mx-auto bg-white">
        <CardContent className="pt-12 pb-12 text-center">
          <Loader2 className="w-12 h-12 text-brand-gold animate-spin mx-auto mb-4" />
          <p className="text-brand-navy">Loading your saved quote...</p>
        </CardContent>
      </Card>
    );
  }

  if (quoteLimitExceeded) {
    return (
      <Card className="max-w-2xl mx-auto bg-brand-navy text-white">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-brand-navy" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-h2 text-white mb-4">STRUGGLING TO FIND WHAT YOU&apos;RE LOOKING FOR?</h2>
          <p className="text-white/80 text-body-lg mb-6 max-w-lg mx-auto">
            Book a free 1:1 Google Meet with <strong className="text-brand-gold">Dan Cartwright</strong>, the director of
            ScopeSite, where he will be able to best determine the demands of your project.
          </p>
          <Button asChild className="bg-brand-gold text-brand-navy hover:bg-white w-full sm:w-auto">
            <a href={contact.email ? `/book?email=${encodeURIComponent(contact.email)}` : '/book'}>
              <Calendar className="w-4 h-4 mr-2" />
              Book Strategy Call
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isSubmitted && quoteId) {
    return (
      <Card className="max-w-2xl mx-auto bg-brand-navy text-white">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-brand-navy" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-h2 text-white mb-4">QUOTE SUBMITTED!</h2>
          <p className="text-white/80 text-body-lg mb-6">Your quote reference is:</p>
          <div className="bg-brand-graphite rounded-lg px-6 py-4 inline-block mb-8">
            <span className="font-mono text-brand-gold text-xl">{quoteId}</span>
          </div>
          <p className="text-white/70 mb-8">We&apos;ll be in touch within 24 hours. Check your email for a copy of your quote.</p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setQuoteId(null);
              setQuoteToken(null);
              setCurrentStep(1);
              setRequest({ ...initialRequest, addOns: createDefaultAddOns() });
              setContact({ name: '', email: '', phone: '', company: '', message: '' });
              router.replace('/pricing', { scroll: false });
            }}
            className="bg-brand-gold text-brand-navy hover:bg-white"
          >
            Get Another Quote
          </Button>
        </CardContent>
      </Card>
    );
  }

  const stepMeta = STEPS[currentStep - 1];

  return (
    <div ref={quoteRef}>
      <QuoteEmailCaptureModal open={emailModalOpen} onSubmit={handleEmailModalSubmit} />

      <Card className="max-w-3xl mx-auto bg-white shadow-lg border-brand-navy/10">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-brand-navy font-headline text-xl md:text-2xl">{stepMeta.title}</CardTitle>
              <CardDescription className="text-brand-graphite">{stepMeta.description}</CardDescription>
            </div>
            <span className="text-sm text-brand-graphite whitespace-nowrap">
              Step {currentStep} / {TOTAL_STEPS}
            </span>
          </div>
          <Progress value={progress} className="h-2 mt-2" />
          {legacyNotice && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
              {legacyNotice}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-8 pb-8">
          {renderStepBody()}

          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentStep <= 1}
              className="border-brand-navy text-brand-navy"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={!canGoNext()}
                className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!canGoNext() || isSubmitting}
                className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Submit quote'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
