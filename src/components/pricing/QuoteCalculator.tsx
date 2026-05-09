'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, ChevronDown, Loader2, Calendar, Rocket, Globe, Zap, Star, Sparkles, ArrowRight } from 'lucide-react';
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
import { calculateQuote, createQuoteResult, formatCurrency, getMarketAverage } from '@/lib/calculate-quote';
import { PRICING_LABELS, PRICING_CONFIG, SSR_INCLUDED_FEATURES, VOICE_SPEC, calculateSSRPrice } from '@/lib/pricing-config';
import { VoiceCommitmentPicker } from './VoiceCommitmentPicker';
import { VoiceGuaranteeCallout } from './VoiceGuaranteeCallout';
import { QuoteEmailCaptureModal } from '@/components/quote/QuoteEmailCaptureModal';
import type {
  ProjectType,
  PaymentPreference,
  VoiceCommitment,
  EcommerceSize,
  HeadlessEcommerceType,
  WebAppSize,
  SSRWebAppSize,
  UpgradeTargetType,
  QuoteRequest,
  ContactInfo,
  QuoteBreakdown,
} from '@/types/pricing';

// ============================================
// STEP DEFINITIONS — dynamic based on project type
// ============================================
//
// Build flows (clientManaged / ssr / upgrade / webapp) use the 6-step flow.
// V.O.I.C.E-only (visibility) uses a 4-step flow that swaps the contract
// picker for a commitment picker and skips scope/add-ons entirely.
//
// The email capture modal is an INTERSTITIAL that fires on the Next click
// from the Project Type page. It is NOT counted as a step.
//

interface StepDef {
  id: number;
  title: string;
  description: string;
}

const STEPS_BUILD: StepDef[] = [
  { id: 1, title: 'Get Started', description: 'Build your instant quote' },
  { id: 2, title: 'Project Type', description: 'What are you looking for?' },
  { id: 3, title: 'Scope', description: 'Tell us about your project' },
  { id: 4, title: 'Add-ons', description: 'Enhance your project' },
  { id: 5, title: 'Payment Plan', description: 'Choose your payment plan' },
  { id: 6, title: 'Summary', description: 'Review and submit' },
];

const STEPS_VOICE: StepDef[] = [
  { id: 1, title: 'Get Started', description: 'Build your instant quote' },
  { id: 2, title: 'Project Type', description: 'What are you looking for?' },
  { id: 3, title: 'Commitment', description: 'Choose your V.O.I.C.E retainer' },
  { id: 4, title: 'Summary', description: 'Review and submit' },
];

function getSteps(projectType?: ProjectType): StepDef[] {
  return projectType === 'visibility' ? STEPS_VOICE : STEPS_BUILD;
}

// ============================================
// INITIAL STATE
// ============================================

const initialRequest: Partial<QuoteRequest> = {
  projectType: undefined,
  scope: {
    pageCount: 5,
    ecommerce: 'none',
    headlessEcommerce: 'none',
    webApp: 'none',
    ssrWebApp: 'none',
    hasBlog: false,
    hasComplexForms: false,
    hasAutomation: false,
  },
  addOns: {
    voice: false,
    branding: false,
    research: false,
    videoLong: 0,
    videoShortBundle: false,
    imageLibrary: false,
    ssrAnimations: false,
    ssrCustomerPortal: false,
    ssrDatabase: false,
    ssrAuthentication: false,
    ssrApiIntegrations: 0,
    ssrMultilanguage: false,
    ssrRealtime: false,
    ssrAnalytics: false,
    ssrScalability: false,
  },
  paymentPreference: 'twelve',
  voiceCommitment: 'six', // default V.O.I.C.E-only commitment
};

// ============================================
// MAIN COMPONENT
// ============================================

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
  // Optional website URL captured in the email modal. Persisted via the quote
  // record's contact JSONB (no new DB column).
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [quoteToken, setQuoteToken] = useState<string | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteLimitExceeded, setQuoteLimitExceeded] = useState(false);
  // Email-capture interstitial (hard gate) state
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  // Calculate breakdown in real-time
  const breakdown = useMemo(() => calculateQuote(request), [request]);

  // Current steps depend on project type (visibility = 4 steps, everything else = 6)
  const steps = useMemo(() => getSteps(request.projectType), [request.projectType]);
  const totalSteps = steps.length;

  // Check if SSR project
  const isSSR = request.projectType === 'ssr';
  const isVoiceOnly = request.projectType === 'visibility';

  // Load saved quote from URL token on mount
  useEffect(() => {
    const token = searchParams.get('q');
    if (token && !quoteToken) {
      loadSavedQuote(token);
    }
  }, [searchParams, quoteToken]);

  // Load saved quote from API
  const loadSavedQuote = async (token: string) => {
    setIsLoadingQuote(true);
    try {
      const response = await fetch(`/api/quote/${token}`);
      const data = await response.json();

      if (data.success && !data.isSubmitted) {
        setQuoteToken(token);
        setContact(prev => ({
          ...prev,
          email: data.quote.email,
          ...data.quote.contact,
        }));
        // Restore websiteUrl from contact JSONB (if present)
        if (data.quote.contact?.websiteUrl) {
          setWebsiteUrl(data.quote.contact.websiteUrl);
        }

        if (data.quote.selections) {
          setRequest(prev => ({
            ...prev,
            ...data.quote.selections,
          }));
        }
        
        if (data.quote.currentStep > 1) {
          setCurrentStep(data.quote.currentStep);
        } else {
          setCurrentStep(2);
        }
      } else if (data.isSubmitted) {
        setIsSubmitted(true);
        setQuoteId(token);
      }
    } catch (error) {
      console.error('Failed to load saved quote:', error);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const updateUrlWithToken = (token: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', token);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const saveProgress = async (
    step: number,
    updatedRequest?: Partial<QuoteRequest>,
    updatedContact?: Partial<ContactInfo & { websiteUrl?: string }>
  ) => {
    if (!quoteToken) return;

    try {
      await fetch(`/api/quote/${quoteToken}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep: step,
          selections: {
            projectType: updatedRequest?.projectType ?? request.projectType,
            scope: updatedRequest?.scope ?? request.scope,
            addOns: updatedRequest?.addOns ?? request.addOns,
            paymentPreference: updatedRequest?.paymentPreference ?? request.paymentPreference,
            voiceCommitment: updatedRequest?.voiceCommitment ?? request.voiceCommitment,
          },
          contact: {
            name: updatedContact?.name ?? contact.name,
            phone: updatedContact?.phone ?? contact.phone,
            company: updatedContact?.company ?? contact.company,
            message: updatedContact?.message ?? contact.message,
            websiteUrl: updatedContact?.websiteUrl ?? websiteUrl,
          },
        }),
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  const updateRequest = useCallback((updates: Partial<QuoteRequest>) => {
    setRequest(prev => ({ ...prev, ...updates }));
  }, []);

  const updateScope = useCallback((updates: Partial<QuoteRequest['scope']>) => {
    setRequest(prev => ({
      ...prev,
      scope: { ...prev.scope!, ...updates },
    }));
  }, []);

  const updateAddOns = useCallback((updates: Partial<QuoteRequest['addOns']>) => {
    setRequest(prev => ({
      ...prev,
      addOns: { ...prev.addOns!, ...updates },
    }));
  }, []);

  const canGoNext = useCallback(() => {
    // Welcome page: always passable — it's a frictionless click-through
    if (currentStep === 1) return true;

    // Project Type: must have a choice, and Upgrade requires a sub-choice
    if (currentStep === 2) {
      if (request.projectType === 'upgrade') {
        return !!request.upgradeTargetType;
      }
      return !!request.projectType;
    }

    // V.O.I.C.E-only flow (4 steps):
    //   3 = Commitment picker, 4 = Summary
    if (isVoiceOnly) {
      if (currentStep === 3) return !!request.voiceCommitment;
      if (currentStep === 4) return contact.name.trim() !== '';
      return false;
    }

    // Build flow (6 steps):
    //   3 = Scope, 4 = Add-ons, 5 = Payment, 6 = Summary
    switch (currentStep) {
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return !!request.paymentPreference;
      case 6:
        return contact.name.trim() !== '';
      default:
        return false;
    }
  }, [currentStep, request, contact, isVoiceOnly]);

  // Scroll to top of component when step changes
  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  /**
   * Create (or resume) a quote record for this email.
   *
   * Called from the email-capture modal with the optional website URL and the
   * already-chosen projectType. On the server side, /api/quote/start:
   *   - If no in-progress quote exists for the email, creates one, persists
   *     projectType + websiteUrl, and fires warm-lead emails (prospect + dan@).
   *   - If an existing in-progress quote is found, returns its token without
   *     re-sending emails (idempotent).
   */
  const startQuoteWithEmail = useCallback(
    async (email: string, url: string, projectType?: ProjectType) => {
      try {
        const response = await fetch('/api/quote/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            websiteUrl: url || undefined,
            projectType,
          }),
        });
        const data = await response.json();

        if (data.success) {
          setQuoteToken(data.quoteId);
          updateUrlWithToken(data.quoteId);

          if (data.isExisting && data.selections) {
            setRequest(prev => ({ ...prev, ...data.selections }));
            if (data.contact) {
              setContact(prev => ({ ...prev, ...data.contact }));
              if (data.contact.websiteUrl) {
                setWebsiteUrl(data.contact.websiteUrl);
              }
            }
          }
          return { success: true as const, data };
        } else if (data.limitExceeded) {
          setQuoteLimitExceeded(true);
          return { success: false as const, limitExceeded: true };
        }
        return { success: false as const };
      } catch (error) {
        console.error('Failed to start quote:', error);
        return { success: false as const };
      }
    },
    []
  );

  const goNext = async () => {
    if (!canGoNext() || currentStep >= totalSteps) return;

    // On the Next click from Project Type (step 2), fire the email-capture modal
    // unless we already have a quote token (i.e. the user came back via ?q=…
    // or has already submitted the modal earlier in this session). The modal is
    // a HARD GATE — advancement only happens inside handleEmailModalSubmit.
    if (currentStep === 2 && !quoteToken) {
      setEmailModalOpen(true);
      return;
    }

    const nextStep = currentStep + 1;

    if (quoteToken) {
      saveProgress(nextStep);
    }

    setCurrentStep(nextStep);
    scrollToTop();
  };

  const goBack = () => {
    if (currentStep <= 1) return;
    const prevStep = currentStep - 1;
    if (quoteToken) {
      saveProgress(prevStep);
    }
    setCurrentStep(prevStep);
    scrollToTop();
  };

  /**
   * Handle submission of the email capture modal.
   * Called with the email and optional website URL from the modal.
   * Hard gate: returns an error object to keep the modal open on failure.
   */
  const handleEmailModalSubmit = useCallback(
    async (submittedEmail: string, submittedUrl: string) => {
      setContact(prev => ({ ...prev, email: submittedEmail }));
      setWebsiteUrl(submittedUrl);

      const result = await startQuoteWithEmail(
        submittedEmail,
        submittedUrl,
        request.projectType
      );

      if (!result.success) {
        if (result.limitExceeded) {
          // quoteLimitExceeded state is set inside startQuoteWithEmail — the
          // parent component will switch to the limit-exceeded screen.
          // Close the modal so the limit-exceeded screen is visible.
          setEmailModalOpen(false);
          return { ok: true as const };
        }
        return {
          ok: false as const,
          error: 'We couldn\'t start your quote. Please try again or contact us.',
        };
      }

      // Resume case: if the server resumed an existing in-progress quote
      // further ahead in the flow, jump straight there.
      if (result.data?.isExisting && result.data.currentStep > 2) {
        setEmailModalOpen(false);
        setCurrentStep(result.data.currentStep);
        scrollToTop();
        return { ok: true as const };
      }

      // Fresh quote: advance to step 3 (Scope for builds, Commitment for V.O.I.C.E-only).
      // Persist step 3 on the server too so a resume link lands on the page the
      // user was about to see, not back on project type.
      const newToken = result.data?.quoteId;
      if (newToken) {
        fetch(`/api/quote/${newToken}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentStep: 3,
            selections: {
              projectType: request.projectType,
              scope: request.scope,
              addOns: request.addOns,
              paymentPreference: request.paymentPreference,
              voiceCommitment: request.voiceCommitment,
            },
            contact: {
              websiteUrl: submittedUrl,
            },
          }),
        }).catch((err) => console.error('Failed to save step 3:', err));
      }

      setEmailModalOpen(false);
      setCurrentStep(3);
      scrollToTop();
      return { ok: true as const };
    },
    [
      request.projectType,
      request.scope,
      request.addOns,
      request.paymentPreference,
      request.voiceCommitment,
      startQuoteWithEmail,
      scrollToTop,
    ]
  );

  const handleSubmit = async () => {
    if (!canGoNext()) return;

    setIsSubmitting(true);

    const fullRequest: QuoteRequest = {
      projectType: request.projectType!,
      scope: request.scope!,
      addOns: request.addOns!,
      paymentPreference: request.paymentPreference!,
      voiceCommitment: request.voiceCommitment,
      contact,
    };

    const result = createQuoteResult(fullRequest, request.paymentPreference!);

    try {
      if (quoteToken) {
        const pageCount = request.scope?.pageCount || 5;
        let packageType: string;
        if (isVoiceOnly) {
          packageType = 'V.O.I.C.E™ AI Visibility';
        } else if (request.projectType === 'ssr') {
          packageType = 'SSR AI-First';
        } else if (request.projectType === 'clientManaged') {
          if (pageCount > 10) packageType = 'Enterprise';
          else if (pageCount > 5) packageType = 'Professional';
          else packageType = 'Starter';
        } else {
          packageType = 'Client-Managed';
        }

        const paymentPref = request.paymentPreference || 'twelve';
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

        if (isVoiceOnly && breakdown.voiceTotals) {
          // V.O.I.C.E-only: use voiceTotals rather than the generic contract table
          const commitment =
            request.voiceCommitment === 'twelve'
              ? breakdown.voiceTotals.twelve
              : breakdown.voiceTotals.six;
          selectedTotal = commitment.totalCost;
          monthlyPayment = commitment.monthlyPrice;
          paymentTypeLabel =
            request.voiceCommitment === 'twelve'
              ? 'V.O.I.C.E 12-Month Commitment'
              : 'V.O.I.C.E 6-Month Commitment';
        } else if (paymentPref === 'oneOff') {
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
        } else {
          selectedTotal = breakdown.totals.twentyFour.totalOverTerm;
          monthlyPayment = breakdown.totals.twentyFour.monthly;
          paymentTypeLabel = paymentTypeLabels.twentyFour;
        }

        await fetch(`/api/quote/${quoteToken}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentStep: totalSteps,
            selections: {
              projectType: request.projectType,
              scope: request.scope,
              addOns: request.addOns,
              paymentPreference: request.paymentPreference,
              voiceCommitment: request.voiceCommitment,
            },
            contact: {
              name: contact.name,
              phone: contact.phone,
              company: contact.company,
              message: contact.message,
              websiteUrl,
            },
            submit: true,
            pricing: {
              packageType,
              paymentType: paymentTypeLabel,
              selectedTotal,
              monthlyPayment,
            },
          }),
        });
      }

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: fullRequest,
          result,
          quoteToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote');
      }

      const data = await response.json();
      setQuoteId(quoteToken || data.quoteId || result.id);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
      setQuoteId(quoteToken || result.id);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
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

  // Render quote limit exceeded state
  if (quoteLimitExceeded) {
    return (
      <Card className="max-w-2xl mx-auto bg-brand-navy text-white">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-brand-navy" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-h2 text-white mb-4">STRUGGLING TO FIND WHAT YOU&apos;RE LOOKING FOR?</h2>
          <p className="text-white/80 text-body-lg mb-6 max-w-lg mx-auto">
            Book a free 1:1 Google Meet with <strong className="text-brand-gold">Dan Cartwright</strong>, 
            the director of ScopeSite, where he will be able to best determine the demands of your project.
          </p>
          <div className="space-y-4">
            <Button
              asChild
              className="bg-brand-gold text-brand-navy hover:bg-white w-full sm:w-auto"
            >
              <a 
                href={`/book${contact.email ? `?email=${encodeURIComponent(contact.email)}` : ''}`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Strategy Call
              </a>
            </Button>
            <p className="text-white/50 text-body-sm">
              No obligation • 30 minutes • Completely free
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render submitted state
  if (isSubmitted && quoteId) {
    return (
      <Card className="max-w-2xl mx-auto bg-brand-navy text-white">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-brand-navy" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-h2 text-white mb-4">QUOTE SUBMITTED!</h2>
          <p className="text-white/80 text-body-lg mb-6">
            Your quote reference is:
          </p>
          <div className="bg-brand-graphite rounded-lg px-6 py-4 inline-block mb-8">
            <span className="font-mono text-brand-gold text-xl">{quoteId}</span>
          </div>
          <p className="text-white/70 mb-8">
            We&apos;ll be in touch within 24 hours. Check your email for a copy of your quote.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setQuoteId(null);
              setQuoteToken(null);
              setCurrentStep(1);
              setRequest(initialRequest);
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

  // Page-renderer helpers — driven by project type, not hardcoded step numbers
  const currentStepDef = steps[currentStep - 1];

  // Map a currentStep to the page ID (keeps the render switch readable for
  // both 4-step visibility flow and 6-step build flow).
  type PageId =
    | 'welcome'
    | 'projectType'
    | 'scope'
    | 'addOns'
    | 'payment'
    | 'commitment'
    | 'summary';

  const pageIdForStep: PageId = (() => {
    if (currentStep === 1) return 'welcome';
    if (currentStep === 2) return 'projectType';
    if (isVoiceOnly) {
      if (currentStep === 3) return 'commitment';
      if (currentStep === 4) return 'summary';
    } else {
      if (currentStep === 3) return 'scope';
      if (currentStep === 4) return 'addOns';
      if (currentStep === 5) return 'payment';
      if (currentStep === 6) return 'summary';
    }
    return 'welcome';
  })();

  return (
    <div ref={quoteRef} className="max-w-4xl mx-auto scroll-mt-4">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 text-caption text-brand-graphite">
          <span>
            Step <span className="text-brand-navy font-bold">{currentStep}</span> of{' '}
            <span className="text-brand-navy font-bold">{totalSteps}</span>
          </span>
          <span className="hidden sm:inline font-medium">{currentStepDef?.title}</span>
        </div>
        <Progress value={progress} className="h-2 mb-6" />
        <div className="flex justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                'flex flex-col items-center',
                step.id === currentStep && 'text-brand-navy',
                step.id < currentStep && 'text-brand-navy',
                step.id > currentStep && 'text-brand-graphite'
              )}
            >
              <div className="relative">
                {step.id <= currentStep && (
                  <div
                    className="absolute inset-0 w-7 h-7 sm:w-10 sm:h-10 -m-0.5 sm:-m-1 rounded-full bg-brand-navy animate-scale-in"
                    style={{
                      animation: step.id === currentStep ? 'pulse 2s ease-in-out infinite' : 'none',
                    }}
                  />
                )}
                <div
                  className={cn(
                    'relative w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mb-1 transition-all duration-300',
                    step.id === currentStep && 'bg-brand-gold text-brand-navy scale-110 shadow-button',
                    step.id < currentStep && 'bg-brand-gold text-brand-navy',
                    step.id > currentStep && 'bg-brand-graphite/30 text-brand-graphite'
                  )}
                >
                  {step.id < currentStep ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : step.id}
                </div>
              </div>
              <span
                className={cn(
                  'text-caption hidden sm:block mt-1 font-medium',
                  step.id <= currentStep && 'text-brand-navy',
                  step.id > currentStep && 'text-brand-graphite'
                )}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Type Badge */}
      {request.projectType && currentStep > 2 && (
        <div className="mb-4 flex justify-center">
          <span className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
            isSSR 
              ? "bg-brand-gold/20 text-brand-gold border border-brand-gold/40"
              : "bg-brand-navy/10 text-brand-navy border border-brand-navy/20"
          )}>
            {isSSR ? <Rocket className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            {PRICING_LABELS.projectTypes[request.projectType]}
          </span>
        </div>
      )}

      {/* Main Card */}
      <Card className={cn(
        "bg-white shadow-card",
        isSSR && currentStep > 2 && "ring-2 ring-brand-gold/30"
      )}>
        <CardHeader className="bg-brand-navy text-white rounded-t-lg">
          <CardTitle className="text-h3 font-headline font-black">
            {currentStepDef?.title}
          </CardTitle>
          <CardDescription className="text-white/70">
            {currentStepDef?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {pageIdForStep === 'welcome' && (
            <StepWelcome onStart={goNext} />
          )}

          {pageIdForStep === 'projectType' && (
            <StepProjectType
              value={request.projectType}
              onChange={(value) => {
                updateRequest({ projectType: value });
                // Reset scope when changing project type
                if (value === 'ssr') {
                  updateScope({ pageCount: 5, hasBlog: true }); // Blog included with SSR
                }
                // Clear upgradeTargetType if not an upgrade project
                if (value !== 'upgrade') {
                  updateRequest({ upgradeTargetType: undefined });
                }
              }}
              upgradeTargetType={request.upgradeTargetType}
              onUpgradeTargetChange={(value) => {
                updateRequest({ upgradeTargetType: value });
                // Apply SSR defaults if upgrading to SSR
                if (value === 'ssr') {
                  updateScope({ pageCount: 5, hasBlog: true });
                }
              }}
            />
          )}

          {pageIdForStep === 'scope' && (
            <StepScope
              projectType={request.projectType!}
              scope={request.scope!}
              onChange={updateScope}
            />
          )}

          {pageIdForStep === 'addOns' && (
            <StepAddOns
              projectType={request.projectType!}
              upgradeTargetType={request.upgradeTargetType}
              addOns={request.addOns!}
              onChange={updateAddOns}
            />
          )}

          {pageIdForStep === 'payment' && (
            <StepPayment
              value={request.paymentPreference!}
              onChange={(value) => updateRequest({ paymentPreference: value })}
              breakdown={breakdown}
              isSSR={isSSR}
            />
          )}

          {pageIdForStep === 'commitment' && (
            <StepVoiceCommitment
              value={request.voiceCommitment}
              onChange={(value) => updateRequest({ voiceCommitment: value })}
            />
          )}

          {pageIdForStep === 'summary' && (
            <StepSummary
              request={request}
              breakdown={breakdown}
              contact={contact}
              onContactChange={setContact}
            />
          )}
        </CardContent>

        {/* Navigation Footer */}
        <div className="px-6 pb-6 md:px-8 md:pb-8">
          <Separator className="mb-6" />

          {/* Live Price Display — V.O.I.C.E-only variant */}
          {isVoiceOnly && currentStep > 2 && currentStep < totalSteps && breakdown.voiceTotals && (() => {
            const commitment =
              request.voiceCommitment === 'twelve'
                ? breakdown.voiceTotals.twelve
                : breakdown.voiceTotals.six;
            return (
              <div
                className="rounded-lg p-5 mb-6 bg-brand-navy"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium text-body-lg">
                    V.O.I.C.E™ Retainer:
                  </span>
                  <span className="text-h2 text-brand-gold font-headline">
                    {formatCurrency(commitment.monthlyPrice)}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center text-body-sm text-white/70 mt-2 pt-2 border-t border-white/10">
                  <span>Total over {commitment.months} months:</span>
                  <span>{formatCurrency(commitment.totalCost)}</span>
                </div>
                <div className="flex justify-between items-center text-body-sm text-white/60 mt-1">
                  <span>Setup fee:</span>
                  <span>{formatCurrency(breakdown.voiceTotals.setupFee)}</span>
                </div>
              </div>
            );
          })()}

          {/* Live Price Display — build flows */}
          {!isVoiceOnly && breakdown.oneOffSubtotal > 0 && currentStep > 1 && currentStep < totalSteps && (() => {
            const plan = request.paymentPreference || 'twelve';
            const isPaymentStep = currentStep === 5;
            const showContract = isPaymentStep && plan !== 'oneOff';
            const monthsMap: Record<string, number> = { six: 6, twelve: 12, twentyFour: 24, thirtySix: 36 };
            const planLabels: Record<string, string> = { oneOff: 'Pay in Full', six: '6-Month', twelve: '12-Month', twentyFour: '24-Month', thirtySix: '36-Month' };

            if (isPaymentStep && plan === 'oneOff') {
              const savings = breakdown.totals.oneOff.upfront - breakdown.totals.oneOff.final;
              return (
                <div className={cn("rounded-lg p-5 mb-6 transition-all duration-300", isSSR ? "bg-gradient-to-r from-brand-navy to-brand-graphite" : "bg-brand-navy")} role="status" aria-live="polite" aria-atomic="true">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium text-body-lg">Pay in Full (5% OFF):</span>
                      {isSSR && <span className="ml-2 text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded">SSR Premium</span>}
                    </div>
                    <div className="text-right">
                      <span className="text-h2 text-brand-gold font-headline">{formatCurrency(breakdown.totals.oneOff.final)}</span>
                      {savings > 0 && <span className="ml-2 text-body-sm text-white/50 line-through">{formatCurrency(breakdown.totals.oneOff.upfront)}</span>}
                    </div>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between items-center text-body-sm text-green-400 mt-1">
                      <span>You save:</span>
                      <span>{formatCurrency(savings)}</span>
                    </div>
                  )}
                  {breakdown.monthlySubtotal > 0 && (
                    <div className="flex justify-between items-center text-body-sm text-white/70 mt-2 pt-2 border-t border-white/10">
                      <span>+ Ongoing monthly services:</span>
                      <span>{formatCurrency(breakdown.monthlySubtotal)}/mo</span>
                    </div>
                  )}
                </div>
              );
            }

            if (showContract) {
              const planData = breakdown.totals[plan as keyof typeof breakdown.totals] as { monthly: number; totalOverTerm: number; ongoingAfter: number };
              const months = monthsMap[plan] || 12;
              const buildMonthly = planData.monthly - breakdown.monthlySubtotal;
              const buildTotal = Math.round(buildMonthly * months);
              const servicesTotal = Math.round(breakdown.monthlySubtotal * months);

              return (
                <div className={cn("rounded-lg p-5 mb-6 transition-all duration-300", isSSR ? "bg-gradient-to-r from-brand-navy to-brand-graphite" : "bg-brand-navy")} role="status" aria-live="polite" aria-atomic="true">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-medium text-body-lg">{planLabels[plan]} Contract:</span>
                      {isSSR && <span className="ml-2 text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded">SSR Premium</span>}
                    </div>
                    <span className="text-h2 text-brand-gold font-headline">{formatCurrency(planData.monthly)}/mo</span>
                  </div>
                  {breakdown.monthlySubtotal > 0 && (
                    <div className="text-body-sm text-white/60 mt-1 space-y-0.5">
                      <div className="flex justify-between"><span>Build: {formatCurrency(buildMonthly)}/mo</span><span>Services: {formatCurrency(breakdown.monthlySubtotal)}/mo</span></div>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-body-sm text-white/70 mt-2 pt-2 border-t border-white/10">
                    <span>Total over {months} months:</span>
                    <span>
                      {formatCurrency(planData.totalOverTerm)}
                      {breakdown.monthlySubtotal > 0 && <span className="text-white/50 ml-1">({formatCurrency(buildTotal)} build + {formatCurrency(servicesTotal)} services)</span>}
                    </span>
                  </div>
                  {planData.ongoingAfter > 0 && (
                    <div className="flex justify-between items-center text-body-sm text-white/60 mt-1">
                      <span>Then ongoing:</span>
                      <span>{formatCurrency(planData.ongoingAfter)}/mo</span>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div className={cn("rounded-lg p-5 mb-6 transition-all duration-300", isSSR ? "bg-gradient-to-r from-brand-navy to-brand-graphite" : "bg-brand-navy")} role="status" aria-live="polite" aria-atomic="true">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-white font-medium text-body-lg">Current Estimate:</span>
                    {isSSR && <span className="ml-2 text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded">SSR Premium</span>}
                  </div>
                  <span className="text-h2 text-brand-gold font-headline">{formatCurrency(breakdown.totals.oneOff.final)}</span>
                </div>
                {breakdown.monthlySubtotal > 0 && (
                  <div className="flex justify-between items-center text-body-sm text-white/70 mt-2">
                    <span>+ Monthly services:</span>
                    <span>{formatCurrency(breakdown.monthlySubtotal)}/mo</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Navigation Buttons. Welcome page (step 1) has its own CTA inside
              the StepWelcome component, so we hide the footer nav there. */}
          {currentStep > 1 && (
            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={currentStep === 1}
                className="border-brand-graphite text-brand-navy hover:bg-brand-navy hover:text-white min-h-[44px]"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={goNext}
                  disabled={!canGoNext()}
                  className="bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white shadow-button min-h-[44px]"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canGoNext() || isSubmitting}
                  className="bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white shadow-button min-h-[44px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Quote Request'
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Email capture modal — hard-gate interstitial on Next from Project Type */}
      <QuoteEmailCaptureModal
        open={emailModalOpen}
        onSubmit={handleEmailModalSubmit}
      />
    </div>
  );
}

// ============================================
// STEP 1: WELCOME (frictionless click-through, no email form)
// ============================================
//
// The email field is now captured in the interstitial modal that fires on
// Next from Project Type (step 2). This page is pure intent-signal — one CTA.

interface StepWelcomeProps {
  onStart: () => void;
}

function StepWelcome({ onStart }: StepWelcomeProps) {
  return (
    <div className="space-y-8 max-w-xl mx-auto py-8 text-center">
      <div>
        <h3 className="text-h2 text-brand-navy font-headline mb-3">
          Build Your Instant Quote
        </h3>
        <p className="text-body-lg text-brand-graphite">
          Answer a few quick questions about your business and we&apos;ll show
          you exactly what it costs. Takes about 2 minutes.
        </p>
      </div>

      <div>
        <Button
          onClick={onStart}
          className="bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white shadow-button text-lg px-10 py-7 min-h-[44px]"
          autoFocus
        >
          Let&apos;s Go
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <p className="text-caption text-brand-graphite/70">
        No sales calls. No hidden fees. Just an honest price.
      </p>
    </div>
  );
}

// ============================================
// STEP 2: PROJECT TYPE (UPDATED)
// ============================================

interface StepProjectTypeProps {
  value?: ProjectType;
  onChange: (value: ProjectType) => void;
  upgradeTargetType?: UpgradeTargetType;
  onUpgradeTargetChange: (value: UpgradeTargetType) => void;
}

function StepProjectType({ value, onChange, upgradeTargetType, onUpgradeTargetChange }: StepProjectTypeProps) {
  const websiteOptions: { 
    value: ProjectType; 
    label: string; 
    tagline: string;
    description: string;
    badge?: string;
    includedBadge?: string;
    recommended?: boolean;
    icon: typeof Globe;
  }[] = [
    {
      value: 'clientManaged',
      label: 'Client-Managed Website',
      tagline: 'Easy to edit yourself',
      description: 'Built on Wix Studio. Update content yourself without touching code. Great performance, GEO-ready structure.',
      badge: '60+ Lighthouse Mobile',
      icon: Globe,
    },
    {
      value: 'ssr',
      label: 'SSR AI-First Website',
      tagline: 'Maximum AI visibility',
      description: 'Server-Side Rendered on Next.js. Auto-generated schema on every page. 100/100 Lighthouse scores. AI crawlers see your full content instantly.',
      badge: '99+ Lighthouse Mobile',
      includedBadge: `Includes V.O.I.C.E™ AI Visibility (worth ${formatCurrency(PRICING_CONFIG.addOns.voice)}/mo)`,
      recommended: true,
      icon: Rocket,
    },
  ];

  const otherOptions: { value: ProjectType; label: string; description: string }[] = [
    {
      value: 'upgrade',
      label: 'Website Upgrade',
      description: 'Modernize your existing site with new features and design (40% discount)',
    },
    {
      value: 'visibility',
      label: 'AI Visibility Only (V.O.I.C.E™)',
      description: 'Get found by ChatGPT, Claude, and other AI assistants',
    },
    {
      value: 'webapp',
      label: 'Custom Web App',
      description: 'Bespoke tools and applications to automate your business',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Website Options Group */}
      <div>
        <Label className="text-body-sm font-bold text-brand-graphite uppercase mb-3 block">
          New Website
        </Label>
        <RadioGroup value={value} onValueChange={(v) => onChange(v as ProjectType)}>
          <div className="grid md:grid-cols-2 gap-4">
            {websiteOptions.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'relative flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all',
                  value === option.value
                    ? option.recommended 
                      ? 'border-brand-gold bg-brand-gold/10 shadow-[0_0_20px_rgba(236,182,21,0.2)]'
                      : 'border-brand-gold bg-brand-gold/5'
                    : option.recommended
                      ? 'border-brand-gold/30 hover:border-brand-gold/60 bg-brand-gold/[0.02]'
                      : 'border-brand-graphite/20 hover:border-brand-gold/50'
                )}
              >
                {/* Recommended Badge */}
                {option.recommended && (
                  <span className="absolute -top-3 right-4 bg-brand-gold text-brand-navy text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> RECOMMENDED
                  </span>
                )}
                
                <div className="flex items-start gap-3">
                  <RadioGroupItem value={option.value} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <option.icon className={cn(
                        "w-5 h-5",
                        option.recommended ? "text-brand-gold" : "text-brand-navy"
                      )} />
                      <span className="font-bold text-brand-navy">{option.label}</span>
                    </div>
                    <p className="text-sm text-brand-gold font-medium mb-2">{option.tagline}</p>
                    <p className="text-body-sm text-brand-graphite">{option.description}</p>
                    {option.badge && (
                      <span className={cn(
                        "inline-block mt-3 text-xs font-medium px-2 py-1 rounded",
                        option.recommended 
                          ? "bg-green-100 text-green-700"
                          : "bg-brand-navy/10 text-brand-navy"
                      )}>
                        {option.badge}
                      </span>
                    )}
                    {option.includedBadge && (
                      <span className="inline-block mt-2 ml-2 text-xs font-medium px-2 py-1 rounded bg-brand-gold/20 text-brand-gold">
                        {option.includedBadge}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Other Options */}
      <div>
        <Label className="text-body-sm font-bold text-brand-graphite uppercase mb-3 block">
          Other Services
        </Label>
        <RadioGroup value={value} onValueChange={(v) => onChange(v as ProjectType)}>
          <div className="grid gap-3">
            {otherOptions.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  value === option.value
                    ? 'border-brand-gold bg-brand-gold/5'
                    : 'border-brand-graphite/20 hover:border-brand-gold/50'
                )}
              >
                <RadioGroupItem value={option.value} className="mt-1" />
                <div>
                  <div className="font-bold text-brand-navy">{option.label}</div>
                  <div className="text-body-sm text-brand-graphite">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Sub-question for Upgrade projects */}
      {value === 'upgrade' && (
        <div className="mt-6 p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-xl">
          <Label className="text-body font-bold text-brand-navy mb-3 block">
            What type of website are you upgrading to?
          </Label>
          <p className="text-body-sm text-brand-graphite mb-4">
            This determines which features and add-ons will be available. The 40% discount applies to your chosen type.
          </p>
          <RadioGroup 
            value={upgradeTargetType} 
            onValueChange={(v) => onUpgradeTargetChange(v as UpgradeTargetType)}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <label
                className={cn(
                  'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  upgradeTargetType === 'clientManaged'
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'border-brand-graphite/20 hover:border-brand-gold/50 bg-white'
                )}
              >
                <RadioGroupItem value="clientManaged" className="mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-navy" />
                    <span className="font-bold text-brand-navy">Client-Managed (Wix Studio)</span>
                  </div>
                  <p className="text-body-sm text-brand-graphite mt-1">
                    Easy to edit yourself. Great performance.
                  </p>
                </div>
              </label>
              <label
                className={cn(
                  'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  upgradeTargetType === 'ssr'
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'border-brand-graphite/20 hover:border-brand-gold/50 bg-white'
                )}
              >
                <RadioGroupItem value="ssr" className="mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-brand-gold" />
                    <span className="font-bold text-brand-navy">SSR AI-First (Next.js)</span>
                  </div>
                  <p className="text-body-sm text-brand-graphite mt-1">
                    Maximum AI visibility. Includes V.O.I.C.E™.
                  </p>
                </div>
              </label>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP 3: SCOPE (UPDATED FOR SSR)
// ============================================

interface StepScopeProps {
  projectType: ProjectType;
  scope: QuoteRequest['scope'];
  onChange: (updates: Partial<QuoteRequest['scope']>) => void;
}

function StepScope({ projectType, scope, onChange }: StepScopeProps) {
  const isSSR = projectType === 'ssr';
  const isClientManaged = projectType === 'clientManaged';
  const showPageCount = projectType === 'clientManaged' || projectType === 'upgrade' || projectType === 'ssr';
  const showEcommerce = projectType === 'clientManaged' || projectType === 'upgrade';
  const showHeadlessEcommerce = projectType === 'ssr';
  const showWebApp = projectType !== 'visibility' && projectType !== 'ssr';
  const showSSRWebApp = projectType === 'ssr';

  // Calculate SSR price for display
  const ssrPrice = isSSR ? calculateSSRPrice(scope.pageCount) : 0;

  return (
    <div className="space-y-8">
      {/* SSR Included Features */}
      {isSSR && (
        <div className="bg-brand-gold/10 rounded-xl p-5 border border-brand-gold/30">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <span className="font-bold text-brand-navy">Included in SSR Base Price</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {SSR_INCLUDED_FEATURES.slice(0, 6).map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-brand-navy/80">
                <Check className="w-4 h-4 text-green-600 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Page Count Slider */}
      {showPageCount && (
        <div>
          <Label className="text-body font-bold text-brand-navy mb-4 block">
            How many pages do you need?
          </Label>
          <div className="flex items-center gap-4 mb-2">
            <Slider
              value={[scope.pageCount]}
              onValueChange={([value]) => onChange({ pageCount: isSSR ? Math.max(5, value) : value })}
              min={isSSR ? 5 : 1}
              max={50}
              step={1}
              className="flex-1"
            />
            <div className="bg-brand-gold text-brand-navy px-6 py-3 rounded-lg min-w-[100px] text-center font-headline text-h3 shadow-button">
              {scope.pageCount}
            </div>
          </div>
          <div className="flex justify-between text-caption text-brand-graphite">
            <span>{isSSR ? '5 pages (min)' : '1 page'}</span>
            <span>50+ pages</span>
          </div>
          {isSSR && (
            <div className="mt-3 text-sm text-brand-navy/70">
              SSR Base Price ({scope.pageCount} pages): <strong className="text-brand-gold">{formatCurrency(ssrPrice)}</strong>
            </div>
          )}
        </div>
      )}

      {/* E-commerce Dropdown (Client-Managed) */}
      {showEcommerce && (
        <div>
          <Label className="text-body font-bold text-brand-navy mb-2 block">
            Do you need e-commerce?
          </Label>
          <Select
            value={scope.ecommerce}
            onValueChange={(value) => onChange({ ecommerce: value as EcommerceSize })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select e-commerce tier" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRICING_LABELS.ecommerce).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                  {key !== 'none' && (
                    <span className="text-brand-graphite ml-2">
                      (+{formatCurrency(PRICING_CONFIG.ecommerce[key as keyof typeof PRICING_CONFIG.ecommerce])})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Headless E-commerce Dropdown (SSR) */}
      {showHeadlessEcommerce && (
        <div>
          <Label className="text-body font-bold text-brand-navy mb-2 block">
            Do you need e-commerce?
          </Label>
          <Select
            value={scope.headlessEcommerce}
            onValueChange={(value) => onChange({ headlessEcommerce: value as HeadlessEcommerceType })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select e-commerce option" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRICING_LABELS.headlessEcommerce).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                  {key !== 'none' && (
                    <span className="text-brand-graphite ml-2">
                      (+{formatCurrency(PRICING_CONFIG.headlessEcommerce[key as keyof typeof PRICING_CONFIG.headlessEcommerce])})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {scope.headlessEcommerce === 'shopify' && (
            <p className="text-xs text-brand-graphite mt-2">* Excludes Shopify subscription fees</p>
          )}
        </div>
      )}

      {/* Web App Dropdown (Client-Managed) */}
      {showWebApp && (
        <div>
          <Label className="text-body font-bold text-brand-navy mb-2 block">
            {projectType === 'webapp' ? 'Web App Complexity' : 'Need a custom web app?'}
          </Label>
          <Select
            value={scope.webApp}
            onValueChange={(value) => onChange({ webApp: value as WebAppSize })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select web app tier" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRICING_LABELS.webApps).map(([key, label]) => (
                <SelectItem key={key} value={key} disabled={projectType === 'webapp' && key === 'none'}>
                  {label}
                  {key !== 'none' && (
                    <span className="text-brand-graphite ml-2">
                      (+{formatCurrency(PRICING_CONFIG.webApps[key as keyof typeof PRICING_CONFIG.webApps])})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* SSR Web App Dropdown */}
      {showSSRWebApp && (
        <div>
          <Label className="text-body font-bold text-brand-navy mb-2 block">
            Need a custom web app?
          </Label>
          <Select
            value={scope.ssrWebApp}
            onValueChange={(value) => onChange({ ssrWebApp: value as SSRWebAppSize })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select web app tier" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRICING_LABELS.ssrWebApps).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                  {key !== 'none' && (
                    <span className="text-brand-graphite ml-2">
                      (+{formatCurrency(PRICING_CONFIG.ssrWebApps[key as keyof typeof PRICING_CONFIG.ssrWebApps])})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Feature Checkboxes */}
      <div>
        <Label className="text-body font-bold text-brand-navy mb-4 block">
          Additional features
        </Label>
        <div className="space-y-3">
          {/* Blog - Included for SSR */}
          <label className={cn(
            "flex items-center gap-3",
            isSSR ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          )}>
            <Checkbox
              checked={isSSR ? true : scope.hasBlog}
              onCheckedChange={isSSR ? undefined : (checked) => onChange({ hasBlog: checked as boolean })}
              disabled={isSSR}
            />
            <span className="text-brand-navy">Blog / CMS functionality</span>
            <span className={cn(
              "text-body-sm px-2 py-0.5 rounded",
              isSSR ? "bg-green-100 text-green-700" : "text-brand-graphite"
            )}>
              {isSSR ? '✓ Included with SSR' : '(Included in package)'}
            </span>
          </label>

          {/* Client-Managed specific features */}
          {isClientManaged && (
            <>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={scope.hasComplexForms}
                  onCheckedChange={(checked) => onChange({ hasComplexForms: checked as boolean })}
                />
                <span className="text-brand-navy">Advanced logic forms</span>
                <span className="text-body-sm bg-brand-navy text-white px-2 py-0.5 rounded">
                  +{formatCurrency(PRICING_CONFIG.addOns.complexForms)}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={scope.hasAutomation}
                  onCheckedChange={(checked) => onChange({ hasAutomation: checked as boolean })}
                />
                <span className="text-brand-navy">Email automation (outreach + abandoned cart)</span>
                <span className="text-body-sm bg-brand-navy text-white px-2 py-0.5 rounded">
                  +{formatCurrency(PRICING_CONFIG.addOns.automationSetup)} + {formatCurrency(PRICING_CONFIG.addOns.automationMonthly)}/mo
                </span>
              </label>
            </>
          )}

          {/* SSR included features (greyed out) */}
          {isSSR && (
            <>
              <label className="flex items-center gap-3 opacity-60 cursor-not-allowed">
                <Checkbox checked disabled />
                <span className="text-brand-navy">Auto Schema Generation</span>
                <span className="text-body-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  ✓ Included with SSR
                </span>
              </label>
              <label className="flex items-center gap-3 opacity-60 cursor-not-allowed">
                <Checkbox checked disabled />
                <span className="text-brand-navy">Edge Deployment (Vercel)</span>
                <span className="text-body-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  ✓ Included with SSR
                </span>
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// STEP 4: ADD-ONS (REFACTORED WITH ACCORDIONS)
// ============================================

interface StepAddOnsProps {
  projectType: ProjectType;
  upgradeTargetType?: UpgradeTargetType;
  addOns: QuoteRequest['addOns'];
  onChange: (updates: Partial<QuoteRequest['addOns']>) => void;
}

// Collapsible Section Component
function AddOnSection({ 
  title, 
  isOpen, 
  onToggle, 
  children,
  selectedCount,
  selectedTotal,
}: { 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
  selectedCount: number;
  selectedTotal: number;
}) {
  return (
    <div className="border border-brand-graphite/20 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-brand-navy/5 hover:bg-brand-navy/10 transition-colors"
      >
        <span className="font-bold text-brand-navy">{title}</span>
        <div className="flex items-center gap-3">
          {selectedCount > 0 && (
            <span className="text-sm text-brand-gold font-medium">
              {selectedCount} selected — {formatCurrency(selectedTotal)} added
            </span>
          )}
          <ChevronDown className={cn(
            "w-5 h-5 text-brand-graphite transition-transform",
            isOpen && "rotate-180"
          )} />
        </div>
      </button>
      {isOpen && (
        <div className="p-4 space-y-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

function StepAddOns({ projectType, upgradeTargetType, addOns, onChange }: StepAddOnsProps) {
  // For upgrade projects, use the target type to determine features
  const effectiveType = projectType === 'upgrade' && upgradeTargetType ? upgradeTargetType : projectType;
  
  const isSSR = effectiveType === 'ssr';
  const isWebApp = projectType === 'webapp';
  const isClientManaged = effectiveType === 'clientManaged';
  const isUpgrade = projectType === 'upgrade';
  const isUpgradeToSSR = isUpgrade && upgradeTargetType === 'ssr';
  
  // Show technical add-ons for SSR, webapp, or upgrade-to-SSR
  const showTechnical = isSSR || isWebApp;
  // Show V.O.I.C.E as add-on for non-SSR (clientManaged, upgrade-to-clientManaged)
  const showOngoingServices = isClientManaged && !isUpgradeToSSR;
  const showContent = isClientManaged || isSSR || isUpgrade;

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    technical: false,
    branding: true,
    content: false,
    ongoing: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate selected counts and totals for each section
  const technicalSelected = [
    addOns.ssrAnimations && PRICING_CONFIG.ssrAddOns.animations,
    addOns.ssrCustomerPortal && PRICING_CONFIG.ssrAddOns.customerPortal,
    addOns.ssrDatabase && PRICING_CONFIG.ssrAddOns.database,
    addOns.ssrAuthentication && PRICING_CONFIG.ssrAddOns.authentication,
    (addOns.ssrApiIntegrations || 0) * PRICING_CONFIG.ssrAddOns.apiIntegration,
    addOns.ssrMultilanguage && PRICING_CONFIG.ssrAddOns.multilanguage,
    addOns.ssrRealtime && PRICING_CONFIG.ssrAddOns.realtime,
    addOns.ssrAnalytics && PRICING_CONFIG.ssrAddOns.analytics,
    addOns.ssrScalability && PRICING_CONFIG.ssrAddOns.scalability,
  ].filter((v): v is number => typeof v === 'number' && v > 0);
  const technicalCount = technicalSelected.length - (addOns.ssrApiIntegrations ? 1 : 0) + (addOns.ssrApiIntegrations || 0);
  const technicalTotal = technicalSelected.reduce((sum, val) => sum + val, 0);

  const brandingSelected = [
    addOns.branding && PRICING_CONFIG.addOns.branding,
    addOns.research && PRICING_CONFIG.addOns.research,
  ].filter((v): v is number => typeof v === 'number' && v > 0);
  const brandingCount = brandingSelected.length;
  const brandingTotal = brandingSelected.reduce((sum, val) => sum + val, 0);

  const contentSelected = [
    (addOns.videoLong || 0) * PRICING_CONFIG.addOns.videoLong,
    addOns.videoShortBundle && PRICING_CONFIG.addOns.videoShortBundle,
    addOns.imageLibrary && PRICING_CONFIG.addOns.imageLibrary,
  ].filter((v): v is number => typeof v === 'number' && v > 0);
  const contentCount = (addOns.videoLong || 0) + (addOns.videoShortBundle ? 1 : 0) + (addOns.imageLibrary ? 1 : 0);
  const contentTotal = contentSelected.reduce((sum, val) => sum + val, 0);

  const ongoingCount = addOns.voice ? 1 : 0;
  const ongoingTotal = addOns.voice ? PRICING_CONFIG.addOns.voice : 0;

  return (
    <div className="space-y-4">
      {/* V.O.I.C.E Included Notice for SSR */}
      {isSSR && (
        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <div>
              <span className="font-bold text-brand-navy">V.O.I.C.E™ AI Visibility</span>
              <span className="text-brand-gold ml-2 text-sm font-medium">Included with your SSR website</span>
            </div>
          </div>
          <p className="text-sm text-brand-navy/70 mt-2 ml-8">
            Get found by ChatGPT, Claude, Perplexity + traditional SEO — worth{' '}
            {formatCurrency(PRICING_CONFIG.addOns.voice)}/mo, included in your base price.
          </p>
        </div>
      )}

      {/* Technical Enhancements (SSR/WebApp only) */}
      {showTechnical && (
        <AddOnSection
          title="Technical Enhancements"
          isOpen={openSections.technical}
          onToggle={() => toggleSection('technical')}
          selectedCount={technicalCount}
          selectedTotal={technicalTotal}
        >
          <SSRAddOnCheckbox
            label={PRICING_LABELS.ssrAddOns.animations}
            description={PRICING_LABELS.ssrAddOnDescriptions.animations}
            price={PRICING_CONFIG.ssrAddOns.animations}
            marketAverage={PRICING_CONFIG.ssrAddOnsMarket.animations}
            checked={addOns.ssrAnimations}
            onChange={(checked) => onChange({ ssrAnimations: checked })}
          />
          <SSRAddOnCheckbox
            label={PRICING_LABELS.ssrAddOns.customerPortal}
            description={PRICING_LABELS.ssrAddOnDescriptions.customerPortal}
            price={PRICING_CONFIG.ssrAddOns.customerPortal}
            marketAverage={PRICING_CONFIG.ssrAddOnsMarket.customerPortal}
            checked={addOns.ssrCustomerPortal}
            onChange={(checked) => onChange({ ssrCustomerPortal: checked })}
          />
          <SSRAddOnCheckbox
            label={PRICING_LABELS.ssrAddOns.database}
            description={PRICING_LABELS.ssrAddOnDescriptions.database}
            price={PRICING_CONFIG.ssrAddOns.database}
            marketAverage={PRICING_CONFIG.ssrAddOnsMarket.database}
            checked={addOns.ssrDatabase}
            onChange={(checked) => onChange({ ssrDatabase: checked })}
          />
          <SSRAddOnCheckbox
            label={PRICING_LABELS.ssrAddOns.authentication}
            description={PRICING_LABELS.ssrAddOnDescriptions.authentication}
            price={PRICING_CONFIG.ssrAddOns.authentication}
            marketAverage={PRICING_CONFIG.ssrAddOnsMarket.authentication}
            checked={addOns.ssrAuthentication}
            onChange={(checked) => onChange({ ssrAuthentication: checked })}
          />
          
          {/* Connect Your Tools - Quantity selector */}
          <div
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              (addOns.ssrApiIntegrations || 0) > 0
                ? 'border-brand-gold bg-brand-gold/5'
                : 'border-brand-graphite/20'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-bold text-brand-navy">{PRICING_LABELS.ssrAddOns.apiIntegration}</div>
                <p className="text-body-sm text-brand-graphite mt-1">
                  {PRICING_LABELS.ssrAddOnDescriptions.apiIntegration}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="text-brand-gold font-bold">
                    {formatCurrency(PRICING_CONFIG.ssrAddOns.apiIntegration)} each
                  </span>
                  <span className="text-body-sm text-brand-graphite line-through">
                    UK avg: {formatCurrency(PRICING_CONFIG.ssrAddOnsMarket.apiIntegration)}
                  </span>
                  <span className="text-body-sm text-green-600">
                    Save {formatCurrency(PRICING_CONFIG.ssrAddOnsMarket.apiIntegration - PRICING_CONFIG.ssrAddOns.apiIntegration)} each
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChange({ ssrApiIntegrations: Math.max(0, (addOns.ssrApiIntegrations || 0) - 1) })}
                  disabled={(addOns.ssrApiIntegrations || 0) === 0}
                  className="h-8 w-8 p-0"
                >
                  -
                </Button>
                <span className="w-8 text-center font-bold">{addOns.ssrApiIntegrations || 0}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChange({ ssrApiIntegrations: Math.min(10, (addOns.ssrApiIntegrations || 0) + 1) })}
                  disabled={(addOns.ssrApiIntegrations || 0) === 10}
                  className="h-8 w-8 p-0"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <SSRAddOnCheckbox
            label={PRICING_LABELS.ssrAddOns.multilanguage}
            description={PRICING_LABELS.ssrAddOnDescriptions.multilanguage}
            price={PRICING_CONFIG.ssrAddOns.multilanguage}
            marketAverage={PRICING_CONFIG.ssrAddOnsMarket.multilanguage}
            checked={addOns.ssrMultilanguage}
            onChange={(checked) => onChange({ ssrMultilanguage: checked })}
          />
          <SSRAddOnCheckbox
            label={PRICING_LABELS.ssrAddOns.realtime}
            description={PRICING_LABELS.ssrAddOnDescriptions.realtime}
            price={PRICING_CONFIG.ssrAddOns.realtime}
            marketAverage={PRICING_CONFIG.ssrAddOnsMarket.realtime}
            checked={addOns.ssrRealtime}
            onChange={(checked) => onChange({ ssrRealtime: checked })}
          />
          <SSRAddOnCheckbox
            label={PRICING_LABELS.ssrAddOns.analytics}
            description={PRICING_LABELS.ssrAddOnDescriptions.analytics}
            price={PRICING_CONFIG.ssrAddOns.analytics}
            marketAverage={PRICING_CONFIG.ssrAddOnsMarket.analytics}
            checked={addOns.ssrAnalytics}
            onChange={(checked) => onChange({ ssrAnalytics: checked })}
          />
          <SSRAddOnCheckbox
            label={PRICING_LABELS.ssrAddOns.scalability}
            description={PRICING_LABELS.ssrAddOnDescriptions.scalability}
            price={PRICING_CONFIG.ssrAddOns.scalability}
            marketAverage={PRICING_CONFIG.ssrAddOnsMarket.scalability}
            checked={addOns.ssrScalability}
            onChange={(checked) => onChange({ ssrScalability: checked })}
          />
        </AddOnSection>
      )}

      {/* Branding & Strategy */}
      <AddOnSection
        title="Branding & Strategy"
        isOpen={openSections.branding}
        onToggle={() => toggleSection('branding')}
        selectedCount={brandingCount}
        selectedTotal={brandingTotal}
      >
        <AddOnCheckbox
          label="Full Branding Package"
          description="Logo, brand guidelines, colours, typography, social templates"
          price={PRICING_CONFIG.addOns.branding}
          marketAverage={6500}
          checked={addOns.branding}
          onChange={(checked) => onChange({ branding: checked })}
        />
        <AddOnCheckbox
          label="Market Research + Persona"
          description="Competitor analysis, market mapping, customer persona development"
          price={PRICING_CONFIG.addOns.research}
          marketAverage={4500}
          checked={addOns.research}
          onChange={(checked) => onChange({ research: checked })}
        />
      </AddOnSection>

      {/* Content & Media */}
      {showContent && (
        <AddOnSection
          title="Content & Media"
          isOpen={openSections.content}
          onToggle={() => toggleSection('content')}
          selectedCount={contentCount}
          selectedTotal={contentTotal}
        >
          {/* Video Long-form */}
          <div
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              (addOns.videoLong || 0) > 0
                ? 'border-brand-gold bg-brand-gold/5'
                : 'border-brand-graphite/20'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-bold text-brand-navy">Long-form Video Production</div>
                <p className="text-body-sm text-brand-graphite mt-1">
                  2-5 minute explainer or corporate videos
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-brand-gold font-bold">
                    {formatCurrency(PRICING_CONFIG.addOns.videoLong)} each
                  </span>
                  <span className="text-body-sm text-brand-graphite line-through">
                    UK avg: {formatCurrency(3500)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChange({ videoLong: Math.max(0, (addOns.videoLong || 0) - 1) })}
                  disabled={(addOns.videoLong || 0) === 0}
                  className="h-8 w-8 p-0"
                >
                  -
                </Button>
                <span className="w-8 text-center font-bold">{addOns.videoLong || 0}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChange({ videoLong: Math.min(10, (addOns.videoLong || 0) + 1) })}
                  disabled={(addOns.videoLong || 0) === 10}
                  className="h-8 w-8 p-0"
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <AddOnCheckbox
            label="Short-form Video Bundle"
            description="5-10 social media videos per month for ongoing content"
            price={PRICING_CONFIG.addOns.videoShortBundle}
            marketAverage={1500}
            isMonthly
            checked={addOns.videoShortBundle}
            onChange={(checked) => onChange({ videoShortBundle: checked })}
          />

          <AddOnCheckbox
            label="Custom Image Library"
            description="20-30 branded AI-generated images for your website"
            price={PRICING_CONFIG.addOns.imageLibrary}
            marketAverage={1200}
            checked={addOns.imageLibrary}
            onChange={(checked) => onChange({ imageLibrary: checked })}
          />
        </AddOnSection>
      )}

      {/* Ongoing Services (V.O.I.C.E for non-SSR) */}
      {showOngoingServices && (
        <AddOnSection
          title="Ongoing Services"
          isOpen={openSections.ongoing}
          onToggle={() => toggleSection('ongoing')}
          selectedCount={ongoingCount}
          selectedTotal={ongoingTotal}
        >
          <div
            className={cn(
              'p-4 rounded-lg border-2 transition-all',
              addOns.voice
                ? 'border-brand-gold bg-brand-gold/5'
                : 'border-brand-graphite/20'
            )}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={addOns.voice}
                onCheckedChange={(checked) => onChange({ voice: checked as boolean })}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-navy">V.O.I.C.E™ AI Visibility</span>
                  <span className="bg-brand-gold text-brand-navy text-xs font-bold px-2 py-0.5 rounded">RECOMMENDED</span>
                </div>
                <p className="text-body-sm text-brand-graphite mt-1">
                  Get found by ChatGPT, Claude, Perplexity + traditional SEO
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-brand-gold font-bold">
                    {formatCurrency(PRICING_CONFIG.addOns.voice)}/mo
                  </span>
                  <span className="text-body-sm text-brand-graphite line-through">
                    UK avg: {formatCurrency(VOICE_SPEC.ukMarketAverage)}/mo
                  </span>
                  <span className="text-body-sm text-green-600">
                    Save {formatCurrency(VOICE_SPEC.ukMarketAverage - PRICING_CONFIG.addOns.voice)}/mo
                  </span>
                </div>
              </div>
            </label>
          </div>
        </AddOnSection>
      )}
    </div>
  );
}

// SSR Add-on checkbox helper
interface SSRAddOnCheckboxProps {
  label: string;
  description: string;
  price: number;
  marketAverage: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SSRAddOnCheckbox({
  label,
  description,
  price,
  marketAverage,
  checked,
  onChange,
}: SSRAddOnCheckboxProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 transition-all',
        checked ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-graphite/20'
      )}
    >
      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox checked={checked} onCheckedChange={(c) => onChange(c as boolean)} />
        <div className="flex-1">
          <div className="font-bold text-brand-navy">{label}</div>
          <p className="text-body-sm text-brand-graphite mt-1">{description}</p>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <span className="text-brand-gold font-bold">
              {formatCurrency(price)}
            </span>
            <span className="text-body-sm text-brand-graphite line-through">
              UK avg: {formatCurrency(marketAverage)}
            </span>
            <span className="text-body-sm text-green-600">
              Save {formatCurrency(marketAverage - price)}
            </span>
          </div>
        </div>
      </label>
    </div>
  );
}

// Standard Add-on checkbox helper
interface AddOnCheckboxProps {
  label: string;
  description: string;
  price: number;
  marketAverage: number;
  isMonthly?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function AddOnCheckbox({
  label,
  description,
  price,
  marketAverage,
  isMonthly,
  checked,
  onChange,
}: AddOnCheckboxProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 transition-all',
        checked ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-graphite/20'
      )}
    >
      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox checked={checked} onCheckedChange={(c) => onChange(c as boolean)} />
        <div className="flex-1">
          <div className="font-bold text-brand-navy">{label}</div>
          <p className="text-body-sm text-brand-graphite mt-1">{description}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-brand-gold font-bold">
              {formatCurrency(price)}{isMonthly ? '/mo' : ''}
            </span>
            <span className="text-body-sm text-brand-graphite line-through">
              UK avg: {formatCurrency(marketAverage)}{isMonthly ? '/mo' : ''}
            </span>
            <span className="text-body-sm text-green-600">
              Save {formatCurrency(marketAverage - price)}
            </span>
          </div>
        </div>
      </label>
    </div>
  );
}

// ============================================
// STEP 5: PAYMENT (UPDATED)
// ============================================

interface StepPaymentProps {
  value: PaymentPreference;
  onChange: (value: PaymentPreference) => void;
  breakdown: QuoteBreakdown;
  isSSR: boolean;
}

function StepPayment({ value, onChange, breakdown, isSSR }: StepPaymentProps) {
  const options: { value: PaymentPreference; label: string; badge?: string; reassurance?: string }[] = [
    { value: 'oneOff', label: 'Pay in Full', badge: '5% OFF' },
    { value: 'six', label: '6-Month Contract' },
    { value: 'twelve', label: '12-Month Contract', badge: 'MOST POPULAR' },
    { value: 'twentyFour', label: '24-Month Contract', badge: 'Best Value', reassurance: 'Lock in today\'s prices — no increases during your term' },
  ];

  // Get totals for each option
  const getTotals = (optionValue: PaymentPreference) => {
    switch (optionValue) {
      case 'oneOff':
        return breakdown.totals.oneOff;
      case 'six':
        return breakdown.totals.six;
      case 'twelve':
        return breakdown.totals.twelve;
      case 'twentyFour':
        return breakdown.totals.twentyFour;
      case 'thirtySix':
        return breakdown.totals.thirtySix;
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-brand-graphite">
        Choose how you&apos;d like to pay. Monthly contracts spread the cost and include ongoing support.
      </p>

      {isSSR && (
        <div className="bg-brand-gold/10 rounded-lg p-4 border border-brand-gold/20">
          <p className="text-sm text-brand-navy">
            <strong>SSR Project Minimums:</strong> 6-month min £1,200/mo • 12-month min £750/mo • 24-month min £400/mo
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((option) => {
          const isSelected = value === option.value;
          const totals = getTotals(option.value);

          return (
            <div
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                'relative p-4 rounded-lg border-2 cursor-pointer transition-all',
                isSelected
                  ? 'border-brand-gold bg-brand-gold/5 shadow-lg'
                  : 'border-brand-graphite/20 hover:border-brand-gold/50'
              )}
            >
              {option.badge && (
                <span className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap",
                  option.badge === 'MOST POPULAR' 
                    ? "bg-brand-gold text-brand-navy"
                    : "bg-brand-navy text-white"
                )}>
                  {option.badge}
                </span>
              )}
              <RadioGroup value={value} onValueChange={(v) => onChange(v as PaymentPreference)}>
                <div className="flex items-center gap-2 mb-3">
                  <RadioGroupItem value={option.value} />
                  <span className="font-bold text-brand-navy text-sm">{option.label}</span>
                </div>
              </RadioGroup>

              {option.value === 'oneOff' ? (
                <div className="space-y-1">
                  <div className="text-xl text-brand-gold font-headline font-bold">
                    {formatCurrency(breakdown.totals.oneOff.final)}
                  </div>
                  <div className="text-xs text-brand-graphite">
                    <span className="line-through">{formatCurrency(breakdown.totals.oneOff.upfront)}</span>
                  </div>
                  <div className="text-xs text-green-600">
                    Save {formatCurrency(breakdown.totals.oneOff.discount)}
                  </div>
                  {breakdown.monthlySubtotal > 0 && (
                    <div className="text-xs text-brand-graphite pt-1">
                      + {formatCurrency(breakdown.monthlySubtotal)}/mo services
                    </div>
                  )}
                </div>
              ) : (
                (() => {
                  const monthly = (totals as { monthly: number }).monthly;
                  const totalOverTerm = (totals as { totalOverTerm: number }).totalOverTerm;
                  const ongoingAfter = (totals as { ongoingAfter: number }).ongoingAfter;
                  const buildMonthly = monthly - breakdown.monthlySubtotal;
                  const hasServices = breakdown.monthlySubtotal > 0;

                  return (
                    <div className="space-y-1">
                      <div className="text-xl text-brand-gold font-headline font-bold">
                        {formatCurrency(monthly)}<span className="text-sm font-normal">/mo</span>
                      </div>
                      {hasServices && (
                        <div className="text-[11px] text-brand-navy/60 leading-tight">
                          {formatCurrency(buildMonthly)} build + {formatCurrency(breakdown.monthlySubtotal)} services
                        </div>
                      )}
                      <div className="text-xs text-brand-graphite">
                        Total: {formatCurrency(totalOverTerm)}
                      </div>
                      {hasServices && (
                        <div className="text-[11px] text-brand-navy/50 leading-tight">
                          Build: {formatCurrency(totalOverTerm - (breakdown.monthlySubtotal * ({ six: 6, twelve: 12, twentyFour: 24, thirtySix: 36 } as Record<string, number>)[option.value]))} + Services: {formatCurrency(breakdown.monthlySubtotal * ({ six: 6, twelve: 12, twentyFour: 24, thirtySix: 36 } as Record<string, number>)[option.value])}
                        </div>
                      )}
                      <div className="text-xs text-brand-graphite">
                        Then {formatCurrency(ongoingAfter)}/mo
                      </div>
                    </div>
                  );
                })()
              )}
              
              {option.reassurance && isSelected && (
                <p className="text-xs text-green-600 mt-2 leading-tight">{option.reassurance}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// STEP 3 (V.O.I.C.E-ONLY): COMMITMENT PICKER
// ============================================
//
// Swaps the generic 4-option contract picker for the 2-option V.O.I.C.E
// commitment picker + 80 Score Guarantee callout. Used when projectType === 'visibility'.

interface StepVoiceCommitmentProps {
  value?: VoiceCommitment;
  onChange: (value: VoiceCommitment) => void;
}

function StepVoiceCommitment({ value, onChange }: StepVoiceCommitmentProps) {
  return (
    <div className="space-y-8">
      <VoiceCommitmentPicker value={value} onChange={onChange} />
      <VoiceGuaranteeCallout />
    </div>
  );
}

// ============================================
// STEP 6: SUMMARY (UPDATED)
// ============================================

interface StepSummaryProps {
  request: Partial<QuoteRequest>;
  breakdown: QuoteBreakdown;
  contact: ContactInfo;
  onContactChange: (contact: ContactInfo) => void;
}

function StepSummary({ request, breakdown, contact, onContactChange }: StepSummaryProps) {
  const paymentOption = request.paymentPreference || 'twelve';
  const isSSR = request.projectType === 'ssr';
  const isVoiceOnly = request.projectType === 'visibility';

  // Helper to get the selected totals based on payment option (build flows only)
  const getSelectedTotals = () => {
    switch (paymentOption) {
      case 'oneOff':
        return { type: 'oneOff' as const, ...breakdown.totals.oneOff };
      case 'six':
        return { type: 'contract' as const, ...breakdown.totals.six, months: 6 };
      case 'twelve':
        return { type: 'contract' as const, ...breakdown.totals.twelve, months: 12 };
      case 'twentyFour':
        return { type: 'contract' as const, ...breakdown.totals.twentyFour, months: 24 };
      case 'thirtySix':
        return { type: 'contract' as const, ...breakdown.totals.thirtySix, months: 36 };
    }
  };

  const selectedTotals = getSelectedTotals();

  // V.O.I.C.E-only selected commitment data (read from voiceTotals)
  const voiceCommitmentData =
    isVoiceOnly && breakdown.voiceTotals
      ? request.voiceCommitment === 'twelve'
        ? breakdown.voiceTotals.twelve
        : breakdown.voiceTotals.six
      : null;

  return (
    <div className="space-y-8">
      {/* Project Type Header */}
      <div className={cn(
        "rounded-lg p-4 flex items-center gap-3",
        isSSR || isVoiceOnly ? "bg-brand-gold/10 border border-brand-gold/30" : "bg-brand-navy/5"
      )}>
        {isSSR ? <Rocket className="w-5 h-5 text-brand-gold" /> : isVoiceOnly ? <Sparkles className="w-5 h-5 text-brand-gold" /> : <Globe className="w-5 h-5 text-brand-navy" />}
        <div>
          <span className="font-bold text-brand-navy">
            {PRICING_LABELS.projectTypes[request.projectType!]}
          </span>
          {isSSR && <span className="ml-2 text-xs text-brand-gold">(Next.js)</span>}
          {request.projectType === 'clientManaged' && <span className="ml-2 text-xs text-brand-graphite">(Wix Studio)</span>}
          {isVoiceOnly && <span className="ml-2 text-xs text-brand-gold">(Monthly retainer)</span>}
        </div>
      </div>

      {/* SSR Included Features */}
      {isSSR && breakdown.includedItems && breakdown.includedItems.length > 0 && (
        <div>
          <h4 className="text-body-sm font-bold text-brand-graphite uppercase mb-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            Included with SSR
          </h4>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="grid sm:grid-cols-2 gap-2">
              {SSR_INCLUDED_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-green-800">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          V.O.I.C.E-only Summary (no Pay-in-Full block, no £0 build line)
          ============================================ */}
      {isVoiceOnly && voiceCommitmentData && breakdown.voiceTotals ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-h4 text-brand-navy mb-4">Your Quote Breakdown</h3>
            <div className="bg-white border-2 border-brand-navy/10 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-start pb-3 border-b border-brand-graphite/10">
                <div>
                  <div className="font-bold text-brand-navy">V.O.I.C.E™ AI Visibility</div>
                  <div className="text-body-sm text-brand-graphite mt-1">
                    Monthly retainer —{' '}
                    {request.voiceCommitment === 'twelve'
                      ? `${VOICE_SPEC.commitmentOptions.twelve.label}`
                      : `${VOICE_SPEC.commitmentOptions.six.label}`}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-brand-navy text-lg">
                    {formatCurrency(voiceCommitmentData.monthlyPrice)}
                  </span>
                  <span className="text-body-sm text-brand-graphite">/mo</span>
                </div>
              </div>

              <div className="flex justify-between text-body-sm">
                <span className="text-brand-navy">Setup fee</span>
                <span className="font-medium text-brand-navy">
                  {formatCurrency(breakdown.voiceTotals.setupFee)}
                </span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-brand-navy">Minimum commitment</span>
                <span className="font-medium text-brand-navy">
                  {voiceCommitmentData.months} months
                </span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-brand-navy">Total commitment cost</span>
                <span className="font-bold text-brand-navy">
                  {formatCurrency(voiceCommitmentData.totalCost)}
                </span>
              </div>

              <div className="pt-3 mt-2 border-t border-brand-graphite/10 space-y-1">
                <div className="flex justify-between text-body-sm">
                  <span className="text-brand-graphite">UK market average</span>
                  <span className="text-brand-graphite line-through">
                    {formatCurrency(breakdown.voiceTotals.ukMarketAverage)}/mo
                  </span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-green-700 font-medium">You save vs UK avg</span>
                  <span className="text-green-700 font-bold">
                    {formatCurrency(
                      breakdown.voiceTotals.ukMarketAverage - voiceCommitmentData.monthlyPrice
                    )}
                    /mo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly headline */}
          <div className="rounded-lg p-6 bg-brand-navy">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80">Your monthly V.O.I.C.E™ retainer:</span>
              <span className="text-h2 text-brand-gold font-headline">
                {formatCurrency(voiceCommitmentData.monthlyPrice)}/mo
              </span>
            </div>
            <div className="text-white/60 text-body-sm">
              Total over {voiceCommitmentData.months} months (including setup):{' '}
              {formatCurrency(voiceCommitmentData.totalCost)} • Setup{' '}
              {formatCurrency(VOICE_SPEC.setupFee)} • {VOICE_SPEC.noticePeriodDays}-day notice after
              minimum term
            </div>
          </div>

          {/* 80 Score Guarantee — prominent on V.O.I.C.E-only summary */}
          <VoiceGuaranteeCallout variant="highlight" />
        </div>
      ) : (
        /* ============================================
           Build flow Summary (existing behaviour)
           ============================================ */
        <div>
          <h3 className="text-h4 text-brand-navy mb-4">Your Quote Breakdown</h3>

          {/* One-off items */}
          {breakdown.oneOffItems.length > 0 && (
            <div className="mb-6">
              <h4 className="text-body-sm font-bold text-brand-graphite uppercase mb-2">
                {isSSR ? 'Project Costs' : 'One-off Costs'}
              </h4>
              <div className="space-y-2">
                {breakdown.oneOffItems.map((item) => {
                  const marketAvg = getMarketAverage(item.id, item.quantity);
                  return (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-brand-graphite/10">
                      <div>
                        <span className="text-brand-navy">{item.label}</span>
                        {item.quantity > 1 && (
                          <span className="text-brand-graphite text-body-sm ml-2">
                            x{item.quantity}
                          </span>
                        )}
                        {item.description && (
                          <div className="text-body-sm text-brand-graphite">{item.description}</div>
                        )}
                        {marketAvg && (
                          <div className="text-body-sm">
                            <span className="text-brand-graphite line-through">
                              UK avg: {formatCurrency(marketAvg)}
                            </span>
                            <span className="text-green-600 ml-2">
                              Save {formatCurrency(marketAvg - item.total)}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-brand-navy">{formatCurrency(item.total)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Monthly items */}
          {breakdown.monthlyItems.length > 0 && (
            <div className="mb-6">
              <h4 className="text-body-sm font-bold text-brand-graphite uppercase mb-2">
                Monthly Services
              </h4>
              <div className="space-y-2">
                {breakdown.monthlyItems.map((item) => {
                  const marketAvg = getMarketAverage(item.id);
                  return (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-brand-graphite/10">
                      <div>
                        <span className="text-brand-navy">{item.label}</span>
                        {marketAvg && (
                          <div className="text-body-sm">
                            <span className="text-brand-graphite line-through">
                              UK avg: {formatCurrency(marketAvg)}/mo
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-brand-navy">{formatCurrency(item.total)}/mo</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Total */}
          <div className={cn(
            "rounded-lg p-6",
            isSSR ? "bg-gradient-to-r from-brand-navy to-brand-graphite" : "bg-brand-navy"
          )}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80">Your {PRICING_LABELS.payments[paymentOption]}:</span>
              <span className="text-h2 text-brand-gold font-headline">
                {selectedTotals!.type === 'oneOff'
                  ? formatCurrency(selectedTotals!.final)
                  : `${formatCurrency(selectedTotals!.monthly)}/mo`}
              </span>
            </div>
            {selectedTotals!.type === 'oneOff' && breakdown.monthlySubtotal > 0 && (
              <div className="text-white/60 text-body-sm">
                + {formatCurrency(breakdown.monthlySubtotal)}/mo for ongoing services
              </div>
            )}
            {selectedTotals!.type === 'contract' && (
              <div className="text-white/60 text-body-sm">
                Total over {selectedTotals!.months} months: {formatCurrency(selectedTotals!.totalOverTerm)} •
                Then {formatCurrency(selectedTotals!.ongoingAfter)}/mo
              </div>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Contact Form */}
      <div>
        <h3 id="contact-form-heading" className="text-h4 text-brand-navy mb-4">Your Details</h3>
        <div className="bg-brand-gold/10 rounded-lg p-3 mb-4 border border-brand-gold/20">
          <span className="text-body-sm text-brand-navy">
            Sending quote to: <strong>{contact.email}</strong>
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-4" role="group" aria-labelledby="contact-form-heading">
          <div>
            <Label htmlFor="contact-name" className="text-brand-navy flex items-center gap-1">
              Name
              <span className="text-red-500" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </Label>
            <Input
              id="contact-name"
              value={contact.name}
              onChange={(e) => onContactChange({ ...contact, name: e.target.value })}
              placeholder="John Smith"
              className="mt-1"
              aria-required="true"
              autoComplete="name"
            />
          </div>
          <div>
            <Label htmlFor="contact-phone" className="text-brand-navy">Phone (optional)</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={contact.phone}
              onChange={(e) => onContactChange({ ...contact, phone: e.target.value })}
              placeholder="07123 456789"
              className="mt-1"
              autoComplete="tel"
            />
          </div>
          <div>
            <Label htmlFor="contact-company" className="text-brand-navy">Company (optional)</Label>
            <Input
              id="contact-company"
              value={contact.company}
              onChange={(e) => onContactChange({ ...contact, company: e.target.value })}
              placeholder="Your Company Ltd"
              className="mt-1"
              autoComplete="organization"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="contact-message" className="text-brand-navy">
              Anything else we should know? (optional)
            </Label>
            <textarea
              id="contact-message"
              value={contact.message}
              onChange={(e) => onContactChange({ ...contact, message: e.target.value })}
              placeholder="Tell us about your project, timeline, or any specific requirements..."
              className="mt-1 w-full px-3 py-2 border border-brand-graphite/20 rounded-lg resize-none h-24 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 bg-white text-brand-navy placeholder:text-brand-graphite/60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
