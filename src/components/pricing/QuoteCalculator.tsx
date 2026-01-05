'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, Loader2, Calendar } from 'lucide-react';
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
import { PRICING_LABELS, PRICING_CONFIG } from '@/lib/pricing-config';
import type {
  ProjectType,
  PaymentPreference,
  EcommerceSize,
  WebAppSize,
  QuoteRequest,
  ContactInfo,
  QuoteBreakdown,
} from '@/types/pricing';

// ============================================
// STEP DEFINITIONS
// ============================================

const STEPS = [
  { id: 1, title: 'Get Started', description: 'Enter your email to begin' },
  { id: 2, title: 'Project Type', description: 'What are you looking for?' },
  { id: 3, title: 'What is the Scope?', description: 'Tell us about your project' },
  { id: 4, title: 'Add-ons', description: 'Enhance your project' },
  { id: 5, title: 'Payment', description: 'Choose your payment plan' },
  { id: 6, title: 'Summary', description: 'Review and submit' },
];

// ============================================
// INITIAL STATE
// ============================================

const initialRequest: Partial<QuoteRequest> = {
  projectType: undefined,
  scope: {
    pageCount: 5,
    ecommerce: 'none',
    webApp: 'none',
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
  },
  paymentPreference: 'twelve',
};

// ============================================
// MAIN COMPONENT
// ============================================

export function QuoteCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [request, setRequest] = useState<Partial<QuoteRequest>>(initialRequest);
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

  // Calculate breakdown in real-time
  const breakdown = useMemo(() => calculateQuote(request), [request]);

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
        
        if (data.quote.selections) {
          setRequest(prev => ({
            ...prev,
            ...data.quote.selections,
          }));
        }
        
        // Resume from saved step (minimum step 2 since email is captured)
        if (data.quote.currentStep > 1) {
          setCurrentStep(data.quote.currentStep);
        } else {
          setCurrentStep(2); // Skip email step since we have it
        }
      } else if (data.isSubmitted) {
        // Quote already submitted, show message
        setIsSubmitted(true);
        setQuoteId(token);
      }
    } catch (error) {
      console.error('Failed to load saved quote:', error);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  // Update URL with quote token
  const updateUrlWithToken = (token: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', token);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  // Save progress to API
  const saveProgress = async (step: number, updatedRequest?: Partial<QuoteRequest>, updatedContact?: Partial<ContactInfo>) => {
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
          },
          contact: {
            name: updatedContact?.name ?? contact.name,
            phone: updatedContact?.phone ?? contact.phone,
            company: updatedContact?.company ?? contact.company,
            message: updatedContact?.message ?? contact.message,
          },
        }),
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Progress percentage
  const progress = (currentStep / STEPS.length) * 100;

  // Update request helper
  const updateRequest = useCallback((updates: Partial<QuoteRequest>) => {
    setRequest(prev => ({ ...prev, ...updates }));
  }, []);

  // Update scope helper
  const updateScope = useCallback((updates: Partial<QuoteRequest['scope']>) => {
    setRequest(prev => ({
      ...prev,
      scope: { ...prev.scope!, ...updates },
    }));
  }, []);

  // Update add-ons helper
  const updateAddOns = useCallback((updates: Partial<QuoteRequest['addOns']>) => {
    setRequest(prev => ({
      ...prev,
      addOns: { ...prev.addOns!, ...updates },
    }));
  }, []);

  // Email validation helper
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Navigation
  const canGoNext = useCallback(() => {
    switch (currentStep) {
      case 1:
        return contact.email.trim() !== '' && isValidEmail(contact.email);
      case 2:
        return !!request.projectType;
      case 3:
        return true; // Scope always has defaults
      case 4:
        return true; // Add-ons are optional
      case 5:
        return !!request.paymentPreference;
      case 6:
        return contact.name.trim() !== '';
      default:
        return false;
    }
  }, [currentStep, request, contact]);

  const goNext = async () => {
    if (currentStep < STEPS.length && canGoNext()) {
      const nextStep = currentStep + 1;

      // Step 1 -> 2: Create quote and get token
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

            // If returning user, restore their progress
            if (data.isExisting && data.selections) {
              setRequest(prev => ({ ...prev, ...data.selections }));
              if (data.contact) {
                setContact(prev => ({ ...prev, ...data.contact }));
              }
              // Go to their last step if they had progress
              if (data.currentStep > 2) {
                setCurrentStep(data.currentStep);
                return;
              }
            }
          } else if (data.limitExceeded) {
            // User has already submitted 2 quotes - show booking option
            setQuoteLimitExceeded(true);
            return;
          }
        } catch (error) {
          console.error('Failed to start quote:', error);
        }
      } else if (quoteToken) {
        // Save progress for other steps
        saveProgress(nextStep);
      }

      setCurrentStep(nextStep);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      // Don't go back to step 1 (email) if we have a token
      if (prevStep === 1 && quoteToken) {
        return;
      }
      if (quoteToken) {
        saveProgress(prevStep);
      }
      setCurrentStep(prevStep);
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!canGoNext()) return;

    setIsSubmitting(true);

    const fullRequest: QuoteRequest = {
      projectType: request.projectType!,
      scope: request.scope!,
      addOns: request.addOns!,
      paymentPreference: request.paymentPreference!,
      contact,
    };

    const result = createQuoteResult(fullRequest, request.paymentPreference!);

    try {
      // Mark quote as submitted in our tracking DB
      if (quoteToken) {
        // Determine package type based on page count
        const pageCount = request.scope?.pageCount || 5;
        let packageType = 'Starter';
        if (pageCount > 10) packageType = 'Enterprise';
        else if (pageCount > 5) packageType = 'Professional';

        // Get pricing based on payment preference
        const paymentPref = request.paymentPreference || 'twelve';
        const paymentTypeLabels: Record<string, string> = {
          oneOff: 'One-off',
          twelve: '12-month',
          twentyFour: '24-month',
        };
        
        let selectedTotal: number;
        let monthlyPayment: number | null = null;
        
        if (paymentPref === 'oneOff') {
          selectedTotal = breakdown.totals.oneOff.final;
        } else if (paymentPref === 'twelve') {
          selectedTotal = breakdown.totals.twelve.totalOverTerm;
          monthlyPayment = breakdown.totals.twelve.monthly;
        } else {
          selectedTotal = breakdown.totals.twentyFour.totalOverTerm;
          monthlyPayment = breakdown.totals.twentyFour.monthly;
        }

        await fetch(`/api/quote/${quoteToken}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentStep: 6,
            selections: {
              projectType: request.projectType,
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
            // Pricing data for Brevo
            pricing: {
              packageType,
              paymentType: paymentTypeLabels[paymentPref],
              selectedTotal,
              monthlyPayment,
            },
          }),
        });
      }

      // Submit full quote details
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: fullRequest,
          result,
          quoteToken, // Include token for reference
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
      // Still show success with token or local ID if API fails
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
              // Clear URL token
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

  return (
    <div className="max-w-4xl mx-auto">
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
                {/* Navy circle background for completed/active steps */}
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

      {/* Main Card */}
      <Card className="bg-white shadow-card">
        <CardHeader className="bg-brand-navy text-white rounded-t-lg">
          <CardTitle className="text-h3 font-headline">
            {STEPS[currentStep - 1].title}
          </CardTitle>
          <CardDescription className="text-white/70">
            {STEPS[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {/* Step 1: Get Started (Email) */}
          {currentStep === 1 && (
            <StepGetStarted
              email={contact.email}
              onChange={(email) => setContact({ ...contact, email })}
            />
          )}

          {/* Step 2: Project Type */}
          {currentStep === 2 && (
            <StepProjectType
              value={request.projectType}
              onChange={(value) => updateRequest({ projectType: value })}
            />
          )}

          {/* Step 3: Scope */}
          {currentStep === 3 && (
            <StepScope
              projectType={request.projectType!}
              scope={request.scope!}
              onChange={updateScope}
            />
          )}

          {/* Step 4: Add-ons */}
          {currentStep === 4 && (
            <StepAddOns
              projectType={request.projectType!}
              addOns={request.addOns!}
              onChange={updateAddOns}
            />
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <StepPayment
              value={request.paymentPreference!}
              onChange={(value) => updateRequest({ paymentPreference: value })}
              breakdown={breakdown}
            />
          )}

          {/* Step 6: Summary */}
          {currentStep === 6 && (
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
          
          {/* Live Price Display - WCAG 4.1.3 Status Messages */}
          {breakdown.oneOffSubtotal > 0 && currentStep > 1 && currentStep < 6 && (
            <div 
              className="bg-brand-navy rounded-lg p-5 mb-6"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="flex justify-between items-center">
                <span className="text-white font-medium text-body-lg">Current Estimate:</span>
                <span className="text-h2 text-brand-gold font-headline">
                  {formatCurrency(breakdown.totals.oneOff.final)}
                </span>
              </div>
              {breakdown.monthlySubtotal > 0 && (
                <div className="flex justify-between items-center text-body-sm text-white/70 mt-2">
                  <span>+ Monthly services:</span>
                  <span>{formatCurrency(breakdown.monthlySubtotal)}/mo</span>
                </div>
              )}
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
  const isValidEmail = email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError = email.trim() !== '' && !isValidEmail;

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
          placeholder="john@company.co.uk"
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
            <strong>What you&apos;ll get:</strong> A detailed quote with transparent pricing, 
            UK market comparisons, and flexible payment options.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STEP 2: PROJECT TYPE
// ============================================

interface StepProjectTypeProps {
  value?: ProjectType;
  onChange: (value: ProjectType) => void;
}

function StepProjectType({ value, onChange }: StepProjectTypeProps) {
  const options: { value: ProjectType; label: string; description: string }[] = [
    {
      value: 'new',
      label: 'New Website',
      description: 'Start fresh with a brand new website built from the ground up',
    },
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
    <RadioGroup value={value} onValueChange={(v) => onChange(v as ProjectType)}>
      <div className="grid gap-4">
        {options.map((option) => (
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
  );
}

// ============================================
// STEP 2: SCOPE
// ============================================

interface StepScopeProps {
  projectType: ProjectType;
  scope: QuoteRequest['scope'];
  onChange: (updates: Partial<QuoteRequest['scope']>) => void;
}

function StepScope({ projectType, scope, onChange }: StepScopeProps) {
  const showPageCount = projectType === 'new' || projectType === 'upgrade';
  const showEcommerce = projectType === 'new' || projectType === 'upgrade';
  const showWebApp = projectType !== 'visibility';

  return (
    <div className="space-y-8">
      {/* Page Count Slider */}
      {showPageCount && (
        <div>
          <Label className="text-body font-bold text-brand-navy mb-4 block">
            How many pages do you need?
          </Label>
          <div className="flex items-center gap-4 mb-2">
            <Slider
              value={[scope.pageCount]}
              onValueChange={([value]) => onChange({ pageCount: value })}
              min={1}
              max={50}
              step={1}
              className="flex-1"
            />
            <div className="bg-brand-gold text-brand-navy px-6 py-3 rounded-lg min-w-[100px] text-center font-headline text-h3 shadow-button">
              {scope.pageCount}
            </div>
          </div>
          <div className="flex justify-between text-caption text-brand-graphite">
            <span>1 page</span>
            <span>50+ pages</span>
          </div>
        </div>
      )}

      {/* E-commerce Dropdown */}
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

      {/* Web App Dropdown */}
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

      {/* Feature Checkboxes */}
      <div>
        <Label className="text-body font-bold text-brand-navy mb-4 block">
          Additional features
        </Label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={scope.hasBlog}
              onCheckedChange={(checked) => onChange({ hasBlog: checked as boolean })}
            />
            <span className="text-brand-navy">Blog / CMS functionality</span>
            <span className="text-body-sm text-brand-graphite">(Included in package)</span>
          </label>
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
        </div>
      </div>
    </div>
  );
}

// ============================================
// STEP 3: ADD-ONS
// ============================================

interface StepAddOnsProps {
  projectType: ProjectType;
  addOns: QuoteRequest['addOns'];
  onChange: (updates: Partial<QuoteRequest['addOns']>) => void;
}

function StepAddOns({ projectType, addOns, onChange }: StepAddOnsProps) {
  return (
    <div className="space-y-6">
      {/* V.O.I.C.E™ - Always shown, pre-selected for visibility projects */}
      <div
        className={cn(
          'p-4 rounded-lg border-2 transition-all',
          addOns.voice || projectType === 'visibility'
            ? 'border-brand-gold bg-brand-gold/5'
            : 'border-brand-graphite/20'
        )}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox
            checked={addOns.voice || projectType === 'visibility'}
            onCheckedChange={(checked) => onChange({ voice: checked as boolean })}
            disabled={projectType === 'visibility'}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-brand-navy">V.O.I.C.E™ AI Visibility</span>
              <span className="badge-gold text-xs">Popular</span>
            </div>
            <p className="text-body-sm text-brand-graphite mt-1">
              Get found by ChatGPT, Claude, Perplexity + traditional SEO
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-brand-gold font-bold">
                {formatCurrency(PRICING_CONFIG.addOns.voice)}/mo
              </span>
              <span className="text-body-sm text-brand-graphite line-through">
                UK avg: {formatCurrency(750)}/mo
              </span>
            </div>
          </div>
        </label>
      </div>

      {/* Branding */}
      <AddOnCheckbox
        label="Full Branding Package"
        description="Logo, brand guidelines, colours, typography, social templates"
        price={PRICING_CONFIG.addOns.branding}
        marketAverage={6500}
        checked={addOns.branding}
        onChange={(checked) => onChange({ branding: checked })}
      />

      {/* Research */}
      <AddOnCheckbox
        label="Market Research + Persona"
        description="Competitor analysis, market mapping, customer persona development"
        price={PRICING_CONFIG.addOns.research}
        marketAverage={4500}
        checked={addOns.research}
        onChange={(checked) => onChange({ research: checked })}
      />

      {/* Video Long-form */}
      <div
        className={cn(
          'p-4 rounded-lg border-2 transition-all',
          addOns.videoLong > 0
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
              onClick={() => onChange({ videoLong: Math.max(0, addOns.videoLong - 1) })}
              disabled={addOns.videoLong === 0}
              className="h-8 w-8 p-0"
            >
              -
            </Button>
            <span className="w-8 text-center font-bold">{addOns.videoLong}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange({ videoLong: Math.min(10, addOns.videoLong + 1) })}
              disabled={addOns.videoLong === 10}
              className="h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* Video Short-form Bundle */}
      <AddOnCheckbox
        label="Short-form Video Bundle"
        description="5-10 social media videos per month for ongoing content"
        price={PRICING_CONFIG.addOns.videoShortBundle}
        marketAverage={1500}
        isMonthly
        checked={addOns.videoShortBundle}
        onChange={(checked) => onChange({ videoShortBundle: checked })}
      />

      {/* Image Library */}
      <AddOnCheckbox
        label="Custom Image Library"
        description="20-30 branded AI-generated images for your website"
        price={PRICING_CONFIG.addOns.imageLibrary}
        marketAverage={1200}
        checked={addOns.imageLibrary}
        onChange={(checked) => onChange({ imageLibrary: checked })}
      />
    </div>
  );
}

// Add-on checkbox helper component
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
// STEP 4: PAYMENT
// ============================================

interface StepPaymentProps {
  value: PaymentPreference;
  onChange: (value: PaymentPreference) => void;
  breakdown: QuoteBreakdown;
}

function StepPayment({ value, onChange, breakdown }: StepPaymentProps) {
  const options: { value: PaymentPreference; label: string; badge?: string }[] = [
    { value: 'oneOff', label: 'One-Off Payment', badge: '5% OFF' },
    { value: 'twelve', label: '12-Month Contract' },
    { value: 'twentyFour', label: '24-Month Contract', badge: 'Best Value' },
  ];

  return (
    <div className="space-y-6">
      <p className="text-brand-graphite">
        Choose how you&apos;d like to pay. Monthly contracts spread the cost and include ongoing support.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <div
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                'relative p-6 rounded-lg border-2 cursor-pointer transition-all',
                isSelected
                  ? 'border-brand-gold bg-brand-gold/5'
                  : 'border-brand-graphite/20 hover:border-brand-gold/50'
              )}
            >
              {option.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-gold text-xs">
                  {option.badge}
                </span>
              )}
              <RadioGroup value={value} onValueChange={(v) => onChange(v as PaymentPreference)}>
                <div className="flex items-center gap-2 mb-4">
                  <RadioGroupItem value={option.value} />
                  <span className="font-bold text-brand-navy">{option.label}</span>
                </div>
              </RadioGroup>

              {option.value === 'oneOff' && (
                <div className="space-y-2">
                  <div className="text-h3 text-brand-gold font-headline">
                    {formatCurrency(breakdown.totals.oneOff.final)}
                  </div>
                  <div className="text-body-sm text-brand-graphite">
                    <span className="line-through">{formatCurrency(breakdown.totals.oneOff.upfront)}</span>
                    <span className="text-green-600 ml-2">
                      Save {formatCurrency(breakdown.totals.oneOff.discount)}
                    </span>
                  </div>
                  {breakdown.monthlySubtotal > 0 && (
                    <div className="text-body-sm text-brand-graphite">
                      + {formatCurrency(breakdown.monthlySubtotal)}/mo for services
                    </div>
                  )}
                </div>
              )}
              {option.value === 'twelve' && (
                <div className="space-y-2">
                  <div className="text-h3 text-brand-gold font-headline">
                    {formatCurrency(breakdown.totals.twelve.monthly)}<span className="text-body">/mo</span>
                  </div>
                  <div className="text-body-sm text-brand-graphite">
                    Total: {formatCurrency(breakdown.totals.twelve.totalOverTerm)}
                  </div>
                  <div className="text-body-sm text-brand-graphite">
                    Then {formatCurrency(breakdown.totals.twelve.ongoingAfter)}/mo after
                  </div>
                </div>
              )}
              {option.value === 'twentyFour' && (
                <div className="space-y-2">
                  <div className="text-h3 text-brand-gold font-headline">
                    {formatCurrency(breakdown.totals.twentyFour.monthly)}<span className="text-body">/mo</span>
                  </div>
                  <div className="text-body-sm text-brand-graphite">
                    Total: {formatCurrency(breakdown.totals.twentyFour.totalOverTerm)}
                  </div>
                  <div className="text-body-sm text-brand-graphite">
                    Then {formatCurrency(breakdown.totals.twentyFour.ongoingAfter)}/mo after
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// STEP 5: SUMMARY
// ============================================

interface StepSummaryProps {
  request: Partial<QuoteRequest>;
  breakdown: QuoteBreakdown;
  contact: ContactInfo;
  onContactChange: (contact: ContactInfo) => void;
}

function StepSummary({ request, breakdown, contact, onContactChange }: StepSummaryProps) {
  const paymentOption = request.paymentPreference || 'twelve';
  const oneOffTotals = breakdown.totals.oneOff;
  const twelveTotals = breakdown.totals.twelve;
  const twentyFourTotals = breakdown.totals.twentyFour;

  return (
    <div className="space-y-8">
      {/* Quote Breakdown */}
      <div>
        <h3 className="text-h4 text-brand-navy mb-4">Your Quote Breakdown</h3>
        
        {/* One-off items */}
        {breakdown.oneOffItems.length > 0 && (
          <div className="mb-6">
            <h4 className="text-body-sm font-bold text-brand-graphite uppercase mb-2">
              One-off Costs
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
        <div className="bg-brand-navy rounded-lg p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80">Your {PRICING_LABELS.payments[paymentOption]}:</span>
            <span className="text-h2 text-brand-gold font-headline">
              {paymentOption === 'oneOff'
                ? formatCurrency(oneOffTotals.final)
                : paymentOption === 'twelve'
                ? `${formatCurrency(twelveTotals.monthly)}/mo`
                : `${formatCurrency(twentyFourTotals.monthly)}/mo`}
            </span>
          </div>
          {paymentOption === 'oneOff' && breakdown.monthlySubtotal > 0 && (
            <div className="text-white/60 text-body-sm">
              + {formatCurrency(breakdown.monthlySubtotal)}/mo for ongoing services
            </div>
          )}
          {paymentOption === 'twelve' && (
            <div className="text-white/60 text-body-sm">
              Total over term: {formatCurrency(twelveTotals.totalOverTerm)} • 
              Then {formatCurrency(twelveTotals.ongoingAfter)}/mo
            </div>
          )}
          {paymentOption === 'twentyFour' && (
            <div className="text-white/60 text-body-sm">
              Total over term: {formatCurrency(twentyFourTotals.totalOverTerm)} • 
              Then {formatCurrency(twentyFourTotals.ongoingAfter)}/mo
            </div>
          )}
        </div>
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
              className="mt-1 w-full px-3 py-2 border border-brand-graphite/20 rounded-lg resize-none h-24 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 bg-brand-navy text-brand-gold placeholder:text-brand-gold/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

