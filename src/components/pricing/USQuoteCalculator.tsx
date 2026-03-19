'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, ChevronDown, Loader2, Calendar, Rocket, Globe, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { calculateUSQuote, createUSQuoteResult, formatUSD } from '@/lib/us-calculate-quote';
import {
  US_PRICING,
  US_SERVICE_CATEGORIES,
  US_PRICING_LABELS,
  US_SSR_INCLUDED_FEATURES,
  isUSSSRService,
  isUSWebsiteBuild,
  isUSWixService,
  supportsContracts,
  getUSServicePrice,
} from '@/lib/us-pricing-config';
import type { USServiceType } from '@/lib/us-pricing-config';
import type { USQuoteRequest, PaymentPreference, ContactInfo, QuoteBreakdown } from '@/types/pricing';

// ============================================
// STEP DEFINITIONS
// ============================================

const STEPS = [
  { id: 1, title: 'Get Started', description: 'Enter your email to begin' },
  { id: 2, title: 'Service', description: 'What do you need?' },
  { id: 3, title: 'Configure', description: 'Customize your project' },
  { id: 4, title: 'Add-ons', description: 'Enhance your project' },
  { id: 5, title: 'Payment', description: 'Choose your payment plan' },
  { id: 6, title: 'Summary', description: 'Review and submit' },
];

// ============================================
// INITIAL STATE
// ============================================

const initialRequest: Partial<USQuoteRequest> = {
  serviceType: undefined,
  scope: {
    pageCount: 5,
    hasEcommerce: false,
    hasComplexForms: false,
    hasAutomation: false,
  },
  addOns: {
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
};

// ============================================
// MAIN COMPONENT
// ============================================

export function USQuoteCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quoteRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [request, setRequest] = useState<Partial<USQuoteRequest>>(initialRequest);
  const [contact, setContact] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [quoteToken, setQuoteToken] = useState<string | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteLimitExceeded, setQuoteLimitExceeded] = useState(false);

  const breakdown = useMemo(() => calculateUSQuote(request), [request]);

  const isSSR = request.serviceType ? isUSSSRService(request.serviceType) : false;
  const isWebBuild = request.serviceType ? isUSWebsiteBuild(request.serviceType) : false;
  const isEnquiryBased = request.serviceType === 'customApp';
  const showAddOns = isWebBuild && !isEnquiryBased;
  const showPaymentOptions = request.serviceType ? supportsContracts(request.serviceType) : false;

  useEffect(() => {
    const token = searchParams.get('q');
    if (token && !quoteToken) {
      loadSavedQuote(token);
    }
  }, [searchParams, quoteToken]);

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

        if (data.quote.selections) {
          setRequest(prev => ({ ...prev, ...data.quote.selections }));
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

  const saveProgress = async (step: number, updatedRequest?: Partial<USQuoteRequest>, updatedContact?: Partial<ContactInfo>) => {
    if (!quoteToken) return;

    try {
      await fetch(`/api/quote/${quoteToken}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep: step,
          selections: {
            serviceType: updatedRequest?.serviceType ?? request.serviceType,
            scope: updatedRequest?.scope ?? request.scope,
            addOns: updatedRequest?.addOns ?? request.addOns,
            paymentPreference: updatedRequest?.paymentPreference ?? request.paymentPreference,
          },
          contact: {
            name: updatedContact?.name ?? contact.name,
            phone: updatedContact?.phone ?? contact.phone,
            company: updatedContact?.company ?? contact.company,
            message: updatedContact?.message ?? contact.message,
          },
          locale: 'us',
        }),
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  const updateRequest = useCallback((updates: Partial<USQuoteRequest>) => {
    setRequest(prev => ({ ...prev, ...updates }));
  }, []);

  const updateScope = useCallback((updates: Partial<USQuoteRequest['scope']>) => {
    setRequest(prev => ({
      ...prev,
      scope: { ...prev.scope!, ...updates },
    }));
  }, []);

  const updateAddOns = useCallback((updates: Partial<USQuoteRequest['addOns']>) => {
    setRequest(prev => ({
      ...prev,
      addOns: { ...prev.addOns!, ...updates },
    }));
  }, []);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canGoNext = useCallback(() => {
    switch (currentStep) {
      case 1:
        return contact.email.trim() !== '' && isValidEmail(contact.email);
      case 2:
        return !!request.serviceType;
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
  }, [currentStep, request, contact]);

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const getNextStep = (fromStep: number): number => {
    let next = fromStep + 1;
    // Skip add-ons for non-website-build services
    if (next === 4 && !showAddOns) next = 5;
    // Skip payment for non-contract services or enquiry-based
    if (next === 5 && (!showPaymentOptions || isEnquiryBased)) next = 6;
    return next;
  };

  const getPrevStep = (fromStep: number): number => {
    let prev = fromStep - 1;
    if (prev === 5 && (!showPaymentOptions || isEnquiryBased)) prev = 4;
    if (prev === 4 && !showAddOns) prev = 3;
    return prev;
  };

  const goNext = async () => {
    if (currentStep < STEPS.length && canGoNext()) {
      const nextStep = getNextStep(currentStep);

      if (currentStep === 1 && !quoteToken) {
        try {
          const response = await fetch('/api/quote/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: contact.email }),
          });
          const data = await response.json();

          if (data.success) {
            setQuoteToken(data.quoteId);
            updateUrlWithToken(data.quoteId);

            if (data.isExisting && data.selections) {
              setRequest(prev => ({ ...prev, ...data.selections }));
              if (data.contact) {
                setContact(prev => ({ ...prev, ...data.contact }));
              }
              if (data.currentStep > 2) {
                setCurrentStep(data.currentStep);
                scrollToTop();
                return;
              }
            }
          } else if (data.limitExceeded) {
            setQuoteLimitExceeded(true);
            return;
          }
        } catch (error) {
          console.error('Failed to start quote:', error);
        }
      } else if (quoteToken) {
        saveProgress(nextStep);
      }

      setCurrentStep(nextStep);
      scrollToTop();
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      const prevStep = getPrevStep(currentStep);
      if (prevStep === 1 && quoteToken) return;
      if (quoteToken) saveProgress(prevStep);
      setCurrentStep(prevStep);
      scrollToTop();
    }
  };

  const handleSubmit = async () => {
    if (!canGoNext()) return;
    setIsSubmitting(true);

    const fullRequest: USQuoteRequest = {
      serviceType: request.serviceType!,
      scope: request.scope!,
      addOns: request.addOns!,
      paymentPreference: request.paymentPreference!,
      contact,
    };

    const result = createUSQuoteResult(fullRequest, request.paymentPreference!);

    try {
      if (quoteToken) {
        const serviceLabel = US_SERVICE_CATEGORIES
          .flatMap(c => c.services)
          .find(s => s.id === request.serviceType)?.label || 'US Service';

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

        if (isEnquiryBased) {
          selectedTotal = US_PRICING.customDev.customApp.startingFrom;
        } else if (paymentPref === 'oneOff' || !showPaymentOptions) {
          selectedTotal = breakdown.totals.oneOff.final;
        } else if (paymentPref === 'twelve') {
          selectedTotal = breakdown.totals.twelve.totalOverTerm;
          monthlyPayment = breakdown.totals.twelve.monthly;
        } else {
          const totals = breakdown.totals[paymentPref as keyof typeof breakdown.totals];
          selectedTotal = 'totalOverTerm' in totals ? totals.totalOverTerm : 0;
          monthlyPayment = 'monthly' in totals ? totals.monthly : null;
        }

        await fetch(`/api/quote/${quoteToken}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentStep: 6,
            selections: {
              serviceType: request.serviceType,
              scope: request.scope,
              addOns: request.addOns,
              paymentPreference: request.paymentPreference,
            },
            contact: {
              name: contact.name,
              phone: contact.phone,
              company: contact.company,
              message: contact.message,
            },
            submit: true,
            locale: 'us',
            pricing: {
              packageType: serviceLabel,
              paymentType: paymentTypeLabels[paymentPref],
              selectedTotal,
              monthlyPayment,
            },
          }),
        });
      }

      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: fullRequest,
          result,
          quoteToken,
          locale: 'us',
        }),
      });

      setQuoteId(quoteToken || result.id);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
      setQuoteId(quoteToken || result.id);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
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
          <h2 className="text-xl sm:text-2xl md:text-h2 text-white mb-4">LET&apos;S TALK DIRECTLY</h2>
          <p className="text-white/80 text-body-lg mb-6 max-w-lg mx-auto">
            Book a free 1:1 Google Meet with <strong className="text-brand-gold">Dan Cartwright</strong>,
            the director of ScopeSite. We&apos;ll find a time that works across time zones.
          </p>
          <div className="space-y-4">
            <Button asChild className="bg-brand-gold text-brand-navy hover:bg-white w-full sm:w-auto">
              <a href={`/book${contact.email ? `?email=${encodeURIComponent(contact.email)}` : ''}`}>
                <Calendar className="w-4 h-4 mr-2" />
                Book Strategy Call
              </a>
            </Button>
            <p className="text-white/50 text-body-sm">
              No obligation • 30 minutes • We work across time zones
            </p>
          </div>
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
          <p className="text-white/80 text-body-lg mb-6">
            Your quote reference is:
          </p>
          <div className="bg-brand-graphite rounded-lg px-6 py-4 inline-block mb-8">
            <span className="font-mono text-brand-gold text-xl">{quoteId}</span>
          </div>
          <p className="text-white/70 mb-4">
            We&apos;ll be in touch within 24 hours. Check your email for a copy of your quote.
          </p>
          <p className="text-white/50 text-sm mb-8">
            All prices are in USD.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setQuoteId(null);
              setQuoteToken(null);
              setCurrentStep(1);
              setRequest(initialRequest);
              setContact({ name: '', email: '', phone: '', company: '', message: '' });
              router.replace('/us/quote', { scroll: false });
            }}
            className="bg-brand-gold text-brand-navy hover:bg-white"
          >
            Get Another Quote
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={quoteRef} className="max-w-4xl mx-auto scroll-mt-4">
      {/* Progress Header */}
      <div className="mb-8">
        <Progress value={progress} className="h-2 mb-6" />
        <div className="flex justify-between">
          {STEPS.map((step) => (
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
                      animation: step.id === currentStep ? 'pulse 2s ease-in-out infinite' : 'none'
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
              <span className={cn(
                "text-caption hidden sm:block mt-1 font-medium",
                step.id <= currentStep && "text-brand-navy",
                step.id > currentStep && "text-brand-graphite"
              )}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Service Type Badge */}
      {request.serviceType && currentStep > 2 && (
        <div className="mb-4 flex justify-center">
          <span className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
            isSSR
              ? "bg-brand-gold/20 text-brand-gold border border-brand-gold/40"
              : "bg-brand-navy/10 text-brand-navy border border-brand-navy/20"
          )}>
            {isSSR ? <Rocket className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            {US_SERVICE_CATEGORIES.flatMap(c => c.services).find(s => s.id === request.serviceType)?.label}
          </span>
        </div>
      )}

      {/* Main Card */}
      <Card className={cn(
        "bg-white shadow-card",
        isSSR && currentStep > 2 && "ring-2 ring-brand-gold/30"
      )}>
        <CardHeader className="bg-brand-navy text-white rounded-t-lg">
          <CardTitle className="text-h3 font-headline">
            {STEPS[currentStep - 1].title}
          </CardTitle>
          <CardDescription className="text-white/70">
            {STEPS[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {currentStep === 1 && (
            <StepGetStarted
              email={contact.email}
              onChange={(email) => setContact({ ...contact, email })}
            />
          )}

          {currentStep === 2 && (
            <StepServiceSelection
              value={request.serviceType}
              onChange={(value) => updateRequest({ serviceType: value })}
            />
          )}

          {currentStep === 3 && (
            <StepConfigure
              serviceType={request.serviceType!}
              scope={request.scope!}
              onChange={updateScope}
            />
          )}

          {currentStep === 4 && (
            <StepAddOns
              serviceType={request.serviceType!}
              addOns={request.addOns!}
              onChange={updateAddOns}
            />
          )}

          {currentStep === 5 && (
            <StepPayment
              value={request.paymentPreference!}
              onChange={(value) => updateRequest({ paymentPreference: value })}
              breakdown={breakdown}
              isSSR={isSSR}
            />
          )}

          {currentStep === 6 && (
            <StepSummary
              request={request}
              breakdown={breakdown}
              contact={contact}
              onContactChange={setContact}
              isEnquiryBased={isEnquiryBased}
            />
          )}
        </CardContent>

        {/* Navigation Footer */}
        <div className="px-6 pb-6 md:px-8 md:pb-8">
          <Separator className="mb-6" />

          {/* Live Price Display */}
          {breakdown.oneOffSubtotal > 0 && currentStep > 1 && currentStep < 6 && !isEnquiryBased && (
            <div
              className={cn(
                "rounded-lg p-5 mb-6",
                isSSR ? "bg-gradient-to-r from-brand-navy to-brand-graphite" : "bg-brand-navy"
              )}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-white font-medium text-body-lg">Current Estimate:</span>
                  {isSSR && (
                    <span className="ml-2 text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded">
                      SSR Premium
                    </span>
                  )}
                </div>
                <span className="text-h2 text-brand-gold font-headline">
                  {formatUSD(breakdown.totals.oneOff.final)}
                </span>
              </div>
              {breakdown.monthlySubtotal > 0 && (
                <div className="flex justify-between items-center text-body-sm text-white/70 mt-2">
                  <span>+ Monthly services:</span>
                  <span>{formatUSD(breakdown.monthlySubtotal)}/mo</span>
                </div>
              )}
            </div>
          )}

          {/* Enquiry-based notice */}
          {isEnquiryBased && currentStep > 1 && currentStep < 6 && (
            <div className="rounded-lg p-5 mb-6 bg-brand-navy">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium text-body-lg">Starting from:</span>
                <span className="text-h2 text-brand-gold font-headline">
                  {formatUSD(US_PRICING.customDev.customApp.startingFrom)}
                </span>
              </div>
              <p className="text-white/60 text-sm mt-2">
                Final pricing will be provided after discussing your requirements.
              </p>
            </div>
          )}

          {/* Monthly-only services */}
          {request.serviceType === 'aiRetainer' && currentStep > 1 && currentStep < 6 && (
            <div className="rounded-lg p-5 mb-6 bg-brand-navy">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium text-body-lg">Monthly Retainer:</span>
                <span className="text-h2 text-brand-gold font-headline">
                  {formatUSD(US_PRICING.aiVisibility.aiRetainer.monthlyPrice)}/mo
                </span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={currentStep === 1 || (currentStep === 2 && !!quoteToken)}
              className="border-brand-graphite text-brand-navy hover:bg-brand-navy hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                onClick={goNext}
                disabled={!canGoNext()}
                className="bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white shadow-button"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canGoNext() || isSubmitting}
                className="bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white shadow-button"
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
        </div>
      </Card>
    </div>
  );
}

// ============================================
// STEP 1: GET STARTED (EMAIL)
// ============================================

interface StepGetStartedProps {
  email: string;
  onChange: (email: string) => void;
}

function StepGetStarted({ email, onChange }: StepGetStartedProps) {
  const isValid = email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError = email.trim() !== '' && !isValid;

  return (
    <div className="space-y-6 max-w-md mx-auto py-8">
      <div className="text-center mb-8">
        <h3 className="text-h3 text-brand-navy font-headline mb-2">
          Build Your Instant Quote
        </h3>
        <p className="text-brand-graphite" id="email-step-description">
          Enter your email to get started. We&apos;ll save your quote so you can return to it anytime.
        </p>
      </div>

      <div>
        <Label htmlFor="email" className="text-brand-navy font-bold flex items-center gap-1">
          Email Address
          <span className="text-red-500" aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onChange(e.target.value)}
          placeholder="john@company.com"
          className="mt-2 text-lg py-6"
          autoFocus
          aria-required="true"
          aria-invalid={showError ? true : undefined}
          aria-describedby="email-hint email-error"
        />
        <p id="email-hint" className="text-body-sm text-brand-graphite mt-2">
          We&apos;ll send your quote to this address. No spam, ever.
        </p>
        {showError && (
          <p id="email-error" role="alert" className="text-body-sm text-red-500 mt-1">
            Please enter a valid email address.
          </p>
        )}
      </div>

      <div className="bg-brand-gold/10 rounded-lg p-4 border border-brand-gold/20">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
          <div className="text-body-sm text-brand-navy">
            <strong>What you&apos;ll get:</strong> A detailed quote with transparent pricing
            in USD and flexible payment options. All prices include our full service.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STEP 2: SERVICE SELECTION
// ============================================

interface StepServiceSelectionProps {
  value?: USServiceType;
  onChange: (value: USServiceType) => void;
}

function StepServiceSelection({ value, onChange }: StepServiceSelectionProps) {
  return (
    <div className="space-y-8">
      {US_SERVICE_CATEGORIES.map((category) => (
        <div key={category.id}>
          <Label className="text-body-sm font-bold text-brand-graphite uppercase mb-3 block">
            {category.label}
          </Label>
          <RadioGroup value={value} onValueChange={(v) => onChange(v as USServiceType)}>
            <div className={cn(
              "grid gap-4",
              category.id === 'websiteBuilds' ? "md:grid-cols-2" : "grid-cols-1"
            )}>
              {category.services.map((service) => (
                <label
                  key={service.id}
                  className={cn(
                    'relative flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all',
                    value === service.id
                      ? service.recommended
                        ? 'border-brand-gold bg-brand-gold/10 shadow-[0_0_20px_rgba(236,182,21,0.2)]'
                        : 'border-brand-gold bg-brand-gold/5'
                      : service.recommended
                        ? 'border-brand-gold/30 hover:border-brand-gold/60 bg-brand-gold/[0.02]'
                        : 'border-brand-graphite/20 hover:border-brand-gold/50'
                  )}
                >
                  {service.recommended && (
                    <span className="absolute -top-3 right-4 bg-brand-gold text-brand-navy text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> RECOMMENDED
                    </span>
                  )}

                  <div className="flex items-start gap-3">
                    <RadioGroupItem value={service.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isUSSSRService(service.id) ? (
                          <Rocket className="w-5 h-5 text-brand-gold" />
                        ) : (
                          <Globe className="w-5 h-5 text-brand-navy" />
                        )}
                        <span className="font-bold text-brand-navy">{service.label}</span>
                      </div>
                      <p className="text-sm text-brand-gold font-medium mb-2">{service.tagline}</p>
                      <p className="text-body-sm text-brand-graphite">{service.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-sm font-bold text-brand-navy bg-brand-gold/10 px-3 py-1 rounded">
                          {getUSServicePrice(service.id)}
                        </span>
                        {service.badge && (
                          <span className={cn(
                            "text-xs font-medium px-2 py-1 rounded",
                            isUSSSRService(service.id)
                              ? "bg-green-100 text-green-700"
                              : "bg-brand-navy/10 text-brand-navy"
                          )}>
                            {service.badge}
                          </span>
                        )}
                        {service.isEnquiryBased && (
                          <span className="text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-700">
                            Quoted after discussion
                          </span>
                        )}
                        {service.isMonthly && (
                          <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">
                            Monthly retainer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}

// ============================================
// STEP 3: CONFIGURE
// ============================================

interface StepConfigureProps {
  serviceType: USServiceType;
  scope: USQuoteRequest['scope'];
  onChange: (updates: Partial<USQuoteRequest['scope']>) => void;
}

function StepConfigure({ serviceType, scope, onChange }: StepConfigureProps) {
  const isSSR = isUSSSRService(serviceType);
  const isWix = isUSWixService(serviceType);
  const showPageCount = isUSWebsiteBuild(serviceType) && serviceType !== 'ssrEcommerce';

  const minPages = serviceType === 'ssrBrochure' ? 5
    : serviceType === 'ssrExtended' ? 10
    : serviceType === 'wixStandard' ? 5
    : serviceType === 'wixExtended' ? 10
    : serviceType === 'websiteMigration' ? 5
    : 1;

  const maxPages = serviceType === 'ssrBrochure' ? 15
    : serviceType === 'ssrExtended' ? 30
    : serviceType === 'wixStandard' ? 15
    : serviceType === 'wixExtended' ? 25
    : serviceType === 'websiteMigration' ? 30
    : 50;

  const getBasePrice = (): number => {
    switch (serviceType) {
      case 'ssrBrochure': {
        const cfg = US_PRICING.websiteBuilds.ssrBrochure;
        if (scope.pageCount <= 10) return cfg.base;
        return cfg.base + (scope.pageCount - 10) * cfg.perPageAbove10;
      }
      case 'ssrExtended': {
        const cfg = US_PRICING.websiteBuilds.ssrExtended;
        if (scope.pageCount <= 20) return cfg.base;
        return cfg.base + (scope.pageCount - 20) * cfg.perPageAbove20;
      }
      case 'wixStandard': {
        const cfg = US_PRICING.websiteBuilds.wixStandard;
        if (scope.pageCount <= 10) return cfg.base;
        return cfg.base + (scope.pageCount - 10) * cfg.perPageAbove10;
      }
      case 'wixExtended': {
        const cfg = US_PRICING.websiteBuilds.wixExtended;
        if (scope.pageCount <= 15) return cfg.base;
        return cfg.base + (scope.pageCount - 15) * cfg.perPageAbove15;
      }
      default: return 0;
    }
  };

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
            {US_SSR_INCLUDED_FEATURES.slice(0, 6).map((feature) => (
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
              onValueChange={([value]) => onChange({ pageCount: Math.max(minPages, value) })}
              min={minPages}
              max={maxPages}
              step={1}
              className="flex-1"
            />
            <div className="bg-brand-gold text-brand-navy px-6 py-3 rounded-lg min-w-[100px] text-center font-headline text-h3 shadow-button">
              {scope.pageCount}
            </div>
          </div>
          <div className="flex justify-between text-caption text-brand-graphite">
            <span>{minPages} pages (min)</span>
            <span>{maxPages}+ pages</span>
          </div>
          {(serviceType === 'ssrBrochure' || serviceType === 'ssrExtended' || serviceType === 'wixStandard' || serviceType === 'wixExtended') && (
            <div className="mt-3 text-sm text-brand-navy/70">
              Base Price ({scope.pageCount} pages): <strong className="text-brand-gold">{formatUSD(getBasePrice())}</strong>
            </div>
          )}
        </div>
      )}

      {/* Enquiry-based (Custom App) */}
      {serviceType === 'customApp' && (
        <div className="space-y-6">
          <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
            <h3 className="font-bold text-brand-navy mb-2">Custom Web Application</h3>
            <p className="text-brand-navy/70 text-sm mb-4">
              Custom web applications start from {formatUSD(US_PRICING.customDev.customApp.startingFrom)}. We&apos;ll provide a detailed
              quote after discussing your requirements. Tell us about your project below.
            </p>
            <textarea
              value={scope.requirements || ''}
              onChange={(e) => onChange({ requirements: e.target.value })}
              placeholder="Describe your project requirements, key features, integrations needed, number of users, etc."
              className="w-full px-3 py-2 border border-brand-graphite/20 rounded-lg resize-none h-32 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 bg-white text-brand-navy placeholder:text-brand-graphite/60"
            />
          </div>
        </div>
      )}

      {/* Standalone services (audit, local SEO, schema, content, migration, API) */}
      {(serviceType === 'aiAudit' || serviceType === 'aiRetainer' || serviceType === 'localSeo' || serviceType === 'schemaMarkup' || serviceType === 'contentStrategy' || serviceType === 'apiIntegration') && (
        <div className="space-y-6">
          <div className="bg-brand-navy/5 rounded-xl p-5">
            <h3 className="font-bold text-brand-navy mb-2">
              {US_SERVICE_CATEGORIES.flatMap(c => c.services).find(s => s.id === serviceType)?.label}
            </h3>
            <p className="text-brand-navy/70 text-sm mb-4">
              {US_SERVICE_CATEGORIES.flatMap(c => c.services).find(s => s.id === serviceType)?.description}
            </p>
            <div className="text-lg font-bold text-brand-gold">
              {getUSServicePrice(serviceType)}
              {serviceType === 'aiRetainer' && <span className="text-sm font-normal text-brand-navy/60 ml-2">billed monthly</span>}
            </div>
          </div>

          <div>
            <Label htmlFor="requirements" className="text-body font-bold text-brand-navy mb-2 block">
              Tell us about your project (optional)
            </Label>
            <textarea
              id="requirements"
              value={scope.requirements || ''}
              onChange={(e) => onChange({ requirements: e.target.value })}
              placeholder="Current website URL, specific goals, timeline, or any other details..."
              className="w-full px-3 py-2 border border-brand-graphite/20 rounded-lg resize-none h-24 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 bg-white text-brand-navy placeholder:text-brand-graphite/60"
            />
          </div>
        </div>
      )}

      {/* Wix-specific features */}
      {isWix && (
        <div>
          <Label className="text-body font-bold text-brand-navy mb-4 block">
            Additional features
          </Label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={scope.hasComplexForms}
                onCheckedChange={(checked) => onChange({ hasComplexForms: checked as boolean })}
              />
              <span className="text-brand-navy">Advanced logic forms</span>
              <span className="text-body-sm bg-brand-navy text-white px-2 py-0.5 rounded">
                +{formatUSD(US_PRICING.addOns.complexForms)}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={scope.hasAutomation}
                onCheckedChange={(checked) => onChange({ hasAutomation: checked as boolean })}
              />
              <span className="text-brand-navy">Email automation (outreach + abandoned cart)</span>
              <span className="text-body-sm bg-brand-navy text-white px-2 py-0.5 rounded">
                +{formatUSD(US_PRICING.addOns.automationSetup)} + {formatUSD(US_PRICING.addOns.automationMonthly)}/mo
              </span>
            </label>
          </div>
        </div>
      )}

      {/* SSR included features (greyed out) */}
      {isSSR && (
        <div>
          <Label className="text-body font-bold text-brand-navy mb-4 block">
            Included with SSR
          </Label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 opacity-60 cursor-not-allowed">
              <Checkbox checked disabled />
              <span className="text-brand-navy">V.O.I.C.E. AI Visibility</span>
              <span className="text-body-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">
                Included
              </span>
            </label>
            <label className="flex items-center gap-3 opacity-60 cursor-not-allowed">
              <Checkbox checked disabled />
              <span className="text-brand-navy">Auto Schema Generation</span>
              <span className="text-body-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">
                Included
              </span>
            </label>
            <label className="flex items-center gap-3 opacity-60 cursor-not-allowed">
              <Checkbox checked disabled />
              <span className="text-brand-navy">Blog / CMS (Ghost)</span>
              <span className="text-body-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">
                Included
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP 4: ADD-ONS
// ============================================

interface StepAddOnsProps {
  serviceType: USServiceType;
  addOns: USQuoteRequest['addOns'];
  onChange: (updates: Partial<USQuoteRequest['addOns']>) => void;
}

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
              {selectedCount} selected - {formatUSD(selectedTotal)} added
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

function USAddOnCheckbox({
  label,
  description,
  price,
  checked,
  onChange,
  isMonthly,
}: {
  label: string;
  description: string;
  price: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isMonthly?: boolean;
}) {
  return (
    <div className={cn(
      'p-4 rounded-lg border-2 transition-all',
      checked ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-graphite/20'
    )}>
      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox checked={checked} onCheckedChange={(c) => onChange(c as boolean)} />
        <div className="flex-1">
          <div className="font-bold text-brand-navy">{label}</div>
          <p className="text-body-sm text-brand-graphite mt-1">{description}</p>
          <span className="text-brand-gold font-bold mt-2 inline-block">
            {formatUSD(price)}{isMonthly ? '/mo' : ''}
          </span>
        </div>
      </label>
    </div>
  );
}

function StepAddOns({ serviceType, addOns, onChange }: StepAddOnsProps) {
  const isSSR = isUSSSRService(serviceType);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    technical: false,
    branding: true,
    content: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const technicalSelected = [
    addOns.ssrAnimations && US_PRICING.ssrAddOns.animations,
    addOns.ssrCustomerPortal && US_PRICING.ssrAddOns.customerPortal,
    addOns.ssrDatabase && US_PRICING.ssrAddOns.database,
    addOns.ssrAuthentication && US_PRICING.ssrAddOns.authentication,
    (addOns.ssrApiIntegrations || 0) * US_PRICING.ssrAddOns.apiIntegration,
    addOns.ssrMultilanguage && US_PRICING.ssrAddOns.multilanguage,
    addOns.ssrRealtime && US_PRICING.ssrAddOns.realtime,
    addOns.ssrAnalytics && US_PRICING.ssrAddOns.analytics,
    addOns.ssrScalability && US_PRICING.ssrAddOns.scalability,
  ].filter((v): v is number => typeof v === 'number' && v > 0);
  const technicalTotal = technicalSelected.reduce((sum, val) => sum + val, 0);
  const technicalCount = technicalSelected.length;

  const brandingSelected = [
    addOns.branding && US_PRICING.addOns.branding,
    addOns.research && US_PRICING.addOns.research,
  ].filter((v): v is number => typeof v === 'number' && v > 0);
  const brandingTotal = brandingSelected.reduce((sum, val) => sum + val, 0);
  const brandingCount = brandingSelected.length;

  const contentSelected = [
    (addOns.videoLong || 0) * US_PRICING.addOns.videoLong,
    addOns.videoShortBundle && US_PRICING.addOns.videoShortBundle,
    addOns.imageLibrary && US_PRICING.addOns.imageLibrary,
  ].filter((v): v is number => typeof v === 'number' && v > 0);
  const contentTotal = contentSelected.reduce((sum, val) => sum + val, 0);
  const contentCount = (addOns.videoLong || 0) + (addOns.videoShortBundle ? 1 : 0) + (addOns.imageLibrary ? 1 : 0);

  return (
    <div className="space-y-4">
      {isSSR && (
        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <div>
              <span className="font-bold text-brand-navy">V.O.I.C.E. AI Visibility</span>
              <span className="text-brand-gold ml-2 text-sm font-medium">Included with your SSR website</span>
            </div>
          </div>
          <p className="text-sm text-brand-navy/70 mt-2 ml-8">
            Get found by ChatGPT, Claude, Perplexity + traditional SEO - worth {formatUSD(US_PRICING.aiVisibility.aiRetainer.monthlyPrice)}/mo, included in your base price.
          </p>
        </div>
      )}

      {/* Technical Enhancements (SSR only) */}
      {isSSR && (
        <AddOnSection
          title="Technical Enhancements"
          isOpen={openSections.technical}
          onToggle={() => toggleSection('technical')}
          selectedCount={technicalCount}
          selectedTotal={technicalTotal}
        >
          {Object.entries(US_PRICING_LABELS.ssrAddOns).map(([key, label]) => {
            if (key === 'apiIntegration') {
              return (
                <div
                  key={key}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all',
                    (addOns.ssrApiIntegrations || 0) > 0
                      ? 'border-brand-gold bg-brand-gold/5'
                      : 'border-brand-graphite/20'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-bold text-brand-navy">{label}</div>
                      <p className="text-body-sm text-brand-graphite mt-1">
                        {US_PRICING_LABELS.ssrAddOnDescriptions[key as keyof typeof US_PRICING_LABELS.ssrAddOnDescriptions]}
                      </p>
                      <span className="text-brand-gold font-bold mt-2 inline-block">
                        {formatUSD(US_PRICING.ssrAddOns.apiIntegration)} each
                      </span>
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
              );
            }

            const addonKey = `ssr${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof USQuoteRequest['addOns'];
            return (
              <USAddOnCheckbox
                key={key}
                label={label}
                description={US_PRICING_LABELS.ssrAddOnDescriptions[key as keyof typeof US_PRICING_LABELS.ssrAddOnDescriptions]}
                price={US_PRICING.ssrAddOns[key as keyof typeof US_PRICING.ssrAddOns]}
                checked={!!addOns[addonKey]}
                onChange={(checked) => onChange({ [addonKey]: checked })}
              />
            );
          })}
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
        <USAddOnCheckbox
          label="Full Branding Package"
          description="Logo, brand guidelines, colors, typography, social templates"
          price={US_PRICING.addOns.branding}
          checked={addOns.branding}
          onChange={(checked) => onChange({ branding: checked })}
        />
        <USAddOnCheckbox
          label="Market Research + Persona"
          description="Competitor analysis, market mapping, customer persona development"
          price={US_PRICING.addOns.research}
          checked={addOns.research}
          onChange={(checked) => onChange({ research: checked })}
        />
      </AddOnSection>

      {/* Content & Media */}
      <AddOnSection
        title="Content & Media"
        isOpen={openSections.content}
        onToggle={() => toggleSection('content')}
        selectedCount={contentCount}
        selectedTotal={contentTotal}
      >
        <div className={cn(
          'p-4 rounded-lg border-2 transition-all',
          (addOns.videoLong || 0) > 0
            ? 'border-brand-gold bg-brand-gold/5'
            : 'border-brand-graphite/20'
        )}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="font-bold text-brand-navy">Long-form Video Production</div>
              <p className="text-body-sm text-brand-graphite mt-1">2-5 minute explainer or corporate videos</p>
              <span className="text-brand-gold font-bold mt-2 inline-block">
                {formatUSD(US_PRICING.addOns.videoLong)} each
              </span>
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

        <USAddOnCheckbox
          label="Short-form Video Bundle"
          description="5-10 social media videos per month for ongoing content"
          price={US_PRICING.addOns.videoShortBundle}
          checked={addOns.videoShortBundle}
          onChange={(checked) => onChange({ videoShortBundle: checked })}
          isMonthly
        />

        <USAddOnCheckbox
          label="Custom Image Library"
          description="20-30 branded AI-generated images for your website"
          price={US_PRICING.addOns.imageLibrary}
          checked={addOns.imageLibrary}
          onChange={(checked) => onChange({ imageLibrary: checked })}
        />
      </AddOnSection>
    </div>
  );
}

// ============================================
// STEP 5: PAYMENT
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
    { value: 'twentyFour', label: '24-Month Contract' },
    { value: 'thirtySix', label: '36-Month Contract', badge: 'Best Value', reassurance: "Lock in today's prices. No increases during your term." },
  ];

  const getTotals = (optionValue: PaymentPreference) => {
    switch (optionValue) {
      case 'oneOff': return breakdown.totals.oneOff;
      case 'six': return breakdown.totals.six;
      case 'twelve': return breakdown.totals.twelve;
      case 'twentyFour': return breakdown.totals.twentyFour;
      case 'thirtySix': return breakdown.totals.thirtySix;
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
            <strong>SSR Project Minimums:</strong> 6-month min {formatUSD(US_PRICING.ssrMinimums.six)}/mo • 12-month min {formatUSD(US_PRICING.ssrMinimums.twelve)}/mo • 24-month min {formatUSD(US_PRICING.ssrMinimums.twentyFour)}/mo • 36-month min {formatUSD(US_PRICING.ssrMinimums.thirtySix)}/mo
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
                    {formatUSD(breakdown.totals.oneOff.final)}
                  </div>
                  <div className="text-xs text-brand-graphite">
                    <span className="line-through">{formatUSD(breakdown.totals.oneOff.upfront)}</span>
                  </div>
                  <div className="text-xs text-green-600">
                    Save {formatUSD(breakdown.totals.oneOff.discount)}
                  </div>
                  {breakdown.monthlySubtotal > 0 && (
                    <div className="text-xs text-brand-graphite pt-1">
                      + {formatUSD(breakdown.monthlySubtotal)}/mo services
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-xl text-brand-gold font-headline font-bold">
                    {formatUSD((totals as { monthly: number }).monthly)}<span className="text-sm font-normal">/mo</span>
                  </div>
                  <div className="text-xs text-brand-graphite">
                    Total: {formatUSD((totals as { totalOverTerm: number }).totalOverTerm)}
                  </div>
                  <div className="text-xs text-brand-graphite">
                    Then {formatUSD((totals as { ongoingAfter: number }).ongoingAfter)}/mo
                  </div>
                </div>
              )}

              {option.reassurance && isSelected && (
                <p className="text-xs text-green-600 mt-2 leading-tight">{option.reassurance}</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-brand-graphite">
        All prices are in USD.
      </p>
    </div>
  );
}

// ============================================
// STEP 6: SUMMARY
// ============================================

interface StepSummaryProps {
  request: Partial<USQuoteRequest>;
  breakdown: QuoteBreakdown;
  contact: ContactInfo;
  onContactChange: (contact: ContactInfo) => void;
  isEnquiryBased: boolean;
}

function StepSummary({ request, breakdown, contact, onContactChange, isEnquiryBased }: StepSummaryProps) {
  const paymentOption = request.paymentPreference || 'twelve';
  const isSSR = request.serviceType ? isUSSSRService(request.serviceType) : false;
  const showPayment = request.serviceType ? supportsContracts(request.serviceType) : false;

  const getSelectedTotals = () => {
    if (!showPayment || isEnquiryBased) {
      return { type: 'oneOff' as const, ...breakdown.totals.oneOff };
    }
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
  const serviceLabel = US_SERVICE_CATEGORIES
    .flatMap(c => c.services)
    .find(s => s.id === request.serviceType)?.label || '';

  return (
    <div className="space-y-8">
      {/* Service Header */}
      <div className={cn(
        "rounded-lg p-4 flex items-center gap-3",
        isSSR ? "bg-brand-gold/10 border border-brand-gold/30" : "bg-brand-navy/5"
      )}>
        {isSSR ? <Rocket className="w-5 h-5 text-brand-gold" /> : <Globe className="w-5 h-5 text-brand-navy" />}
        <div>
          <span className="font-bold text-brand-navy">{serviceLabel}</span>
          {isSSR && <span className="ml-2 text-xs text-brand-gold">(Next.js)</span>}
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
              {US_SSR_INCLUDED_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-green-800">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quote Breakdown */}
      <div>
        <h3 className="text-h4 text-brand-navy mb-4">Your Quote Breakdown</h3>

        {breakdown.oneOffItems.length > 0 && (
          <div className="mb-6">
            <h4 className="text-body-sm font-bold text-brand-graphite uppercase mb-2">
              {isSSR ? 'Project Costs' : 'One-off Costs'}
            </h4>
            <div className="space-y-2">
              {breakdown.oneOffItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-brand-graphite/10">
                  <div>
                    <span className="text-brand-navy">{item.label}</span>
                    {item.quantity > 1 && (
                      <span className="text-brand-graphite text-body-sm ml-2">x{item.quantity}</span>
                    )}
                    {item.description && (
                      <div className="text-body-sm text-brand-graphite">{item.description}</div>
                    )}
                  </div>
                  <span className="font-bold text-brand-navy">{formatUSD(item.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {breakdown.monthlyItems.length > 0 && (
          <div className="mb-6">
            <h4 className="text-body-sm font-bold text-brand-graphite uppercase mb-2">
              Monthly Services
            </h4>
            <div className="space-y-2">
              {breakdown.monthlyItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-brand-graphite/10">
                  <span className="text-brand-navy">{item.label}</span>
                  <span className="font-bold text-brand-navy">{formatUSD(item.total)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        {!isEnquiryBased && (
          <div className={cn(
            "rounded-lg p-6",
            isSSR ? "bg-gradient-to-r from-brand-navy to-brand-graphite" : "bg-brand-navy"
          )}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80">
                {showPayment ? `Your ${US_PRICING_LABELS.payments[paymentOption]}:` : 'Total:'}
              </span>
              <span className="text-h2 text-brand-gold font-headline">
                {selectedTotals?.type === 'oneOff'
                  ? formatUSD(selectedTotals.final)
                  : `${formatUSD((selectedTotals as { monthly: number }).monthly)}/mo`}
              </span>
            </div>
            {selectedTotals?.type === 'oneOff' && breakdown.monthlySubtotal > 0 && (
              <div className="text-white/60 text-body-sm">
                + {formatUSD(breakdown.monthlySubtotal)}/mo for ongoing services
              </div>
            )}
            {selectedTotals?.type === 'contract' && (
              <div className="text-white/60 text-body-sm">
                Total over {(selectedTotals as { months: number }).months} months: {formatUSD(selectedTotals.totalOverTerm)} •
                Then {formatUSD(selectedTotals.ongoingAfter)}/mo
              </div>
            )}
            <div className="text-white/40 text-xs mt-3">
              All prices are in USD.
            </div>
          </div>
        )}

        {isEnquiryBased && (
          <div className="rounded-lg p-6 bg-brand-navy">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80">Starting from:</span>
              <span className="text-h2 text-brand-gold font-headline">
                {formatUSD(US_PRICING.customDev.customApp.startingFrom)}
              </span>
            </div>
            <p className="text-white/60 text-sm">
              We&apos;ll provide a detailed quote after reviewing your requirements.
            </p>
          </div>
        )}
      </div>

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
              placeholder="(555) 123-4567"
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
              placeholder="Your Company Inc."
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
