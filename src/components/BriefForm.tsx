'use client';

/**
 * Brief Submission Form Component
 * 
 * Full-featured form for project brief submissions with:
 * - Client-side validation
 * - File uploads
 * - Loading and success states
 * - Error handling
 */

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { FileUpload, type UploadedFile } from '@/components/FileUpload';

// Form options
const PROJECT_TYPES = [
  { value: 'Website', label: 'Website' },
  { value: 'Web Application', label: 'Web Application' },
  { value: 'Branding', label: 'Branding' },
  { value: 'SEO/GEO', label: 'SEO/GEO (AI Visibility)' },
  { value: 'Other', label: 'Other' },
];

const BUDGET_RANGES = [
  { value: 'Under £1k', label: 'Under £1,000' },
  { value: '£1k-£3k', label: '£1,000 - £3,000' },
  { value: '£3k-£5k', label: '£3,000 - £5,000' },
  { value: '£5k-£10k', label: '£5,000 - £10,000' },
  { value: '£10k+', label: '£10,000+' },
  { value: 'Not sure', label: "Not sure yet" },
];

const TIMELINES = [
  { value: 'ASAP', label: 'ASAP' },
  { value: '1-2 weeks', label: '1-2 weeks' },
  { value: '1 month', label: '1 month' },
  { value: '2-3 months', label: '2-3 months' },
  { value: 'Flexible', label: 'Flexible' },
];

const REFERRAL_SOURCES = [
  { value: 'Google', label: 'Google Search' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Referral', label: 'Referral / Word of mouth' },
  { value: 'Other', label: 'Other' },
];

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  project_type: string;
  budget_range: string;
  timeline: string;
  description: string;
  referral_source: string;
}

interface FormErrors {
  [key: string]: string;
}

export function BriefForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    project_type: '',
    budget_range: '',
    timeline: '',
    description: '',
    referral_source: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = useCallback(
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Handle select changes
  const handleSelectChange = useCallback(
    (field: keyof FormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Handle file uploads
  const handleFilesChange = useCallback((files: UploadedFile[]) => {
    setUploadedFiles(files);
  }, []);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.project_type) {
      newErrors.project_type = 'Please select a project type';
    }

    if (!formData.description.trim() || formData.description.trim().length < 50) {
      newErrors.description = 'Please describe your project (minimum 50 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/briefs/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          file_urls: uploadedFiles.map((f) => f.url),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(result.error || 'Something went wrong. Please try again.');
        if (result.errors) {
          const fieldErrors: FormErrors = {};
          result.errors.forEach((err: string) => {
            if (err.toLowerCase().includes('name')) fieldErrors.name = err;
            else if (err.toLowerCase().includes('email')) fieldErrors.email = err;
            else if (err.toLowerCase().includes('project type')) fieldErrors.project_type = err;
            else if (err.toLowerCase().includes('description')) fieldErrors.description = err;
          });
          setErrors(fieldErrors);
        }
      }
    } catch (error) {
      setSubmitError('Failed to submit. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-brand-navy" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-headline text-brand-navy mb-4">
          BRIEF RECEIVED!
        </h2>
        <p className="text-brand-navy/80 text-lg mb-6">
          Thanks for sending us your project brief, {formData.name.split(' ')[0]}!
        </p>
        <p className="text-brand-graphite mb-8">
          We&apos;ll review your brief and get back to you within <strong>2 business days</strong>.
          Check your email at <strong>{formData.email}</strong> for a confirmation.
        </p>

        <div className="bg-brand-navy/5 rounded-xl p-6 mb-8">
          <p className="text-brand-navy font-medium mb-4">Want to speed things up?</p>
          <Button asChild className="bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white">
            <Link href="/book">
              <Calendar className="w-4 h-4 mr-2" />
              Book a Call Now
            </Link>
          </Button>
          <p className="text-brand-graphite text-sm mt-2">Skip ahead to a free strategy call</p>
        </div>

        <Link
          href="/"
          className="text-brand-gold hover:text-brand-orange transition-colors inline-flex items-center gap-2"
        >
          Back to Home
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Contact Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-brand-navy border-b border-brand-navy/10 pb-2">
          Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-brand-navy flex items-center gap-1">
              Full Name
              <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="John Smith"
              className={cn('mt-1', errors.name && 'border-red-500')}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              autoComplete="name"
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-brand-navy flex items-center gap-1">
              Email Address
              <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="john@company.co.uk"
              className={cn('mt-1', errors.email && 'border-red-500')}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company" className="text-brand-navy">
              Company / Business Name
            </Label>
            <Input
              id="company"
              type="text"
              value={formData.company}
              onChange={handleChange('company')}
              placeholder="Your Company Ltd"
              className="mt-1"
              autoComplete="organization"
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-brand-navy">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="07123 456789"
              className="mt-1"
              autoComplete="tel"
            />
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-brand-navy border-b border-brand-navy/10 pb-2">
          Project Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Type */}
          <div>
            <Label htmlFor="project_type" className="text-brand-navy flex items-center gap-1">
              Project Type
              <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Select value={formData.project_type} onValueChange={handleSelectChange('project_type')}>
              <SelectTrigger
                id="project_type"
                className={cn('mt-1', errors.project_type && 'border-red-500')}
                aria-required="true"
                aria-invalid={!!errors.project_type}
              >
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.project_type && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {errors.project_type}
              </p>
            )}
          </div>

          {/* Budget Range */}
          <div>
            <Label htmlFor="budget_range" className="text-brand-navy">
              Budget Range
            </Label>
            <Select value={formData.budget_range} onValueChange={handleSelectChange('budget_range')}>
              <SelectTrigger id="budget_range" className="mt-1">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeline */}
          <div>
            <Label htmlFor="timeline" className="text-brand-navy">
              Timeline
            </Label>
            <Select value={formData.timeline} onValueChange={handleSelectChange('timeline')}>
              <SelectTrigger id="timeline" className="mt-1">
                <SelectValue placeholder="When do you need this?" />
              </SelectTrigger>
              <SelectContent>
                {TIMELINES.map((timeline) => (
                  <SelectItem key={timeline.value} value={timeline.value}>
                    {timeline.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Referral Source */}
          <div>
            <Label htmlFor="referral_source" className="text-brand-navy">
              How did you hear about us?
            </Label>
            <Select
              value={formData.referral_source}
              onValueChange={handleSelectChange('referral_source')}
            >
              <SelectTrigger id="referral_source" className="mt-1">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {REFERRAL_SOURCES.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-brand-navy flex items-center gap-1">
            Project Description
            <span className="text-red-500" aria-hidden="true">*</span>
          </Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Tell us about your project. What are your goals? What problems are you trying to solve? Any specific features or functionality you need?"
            rows={6}
            className={cn(
              'mt-1 w-full px-3 py-2 border rounded-lg resize-none',
              'text-brand-navy placeholder:text-brand-graphite/50',
              'focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold',
              errors.description ? 'border-red-500' : 'border-brand-graphite/20'
            )}
            aria-required="true"
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : 'description-hint'}
          />
          <p id="description-hint" className="text-brand-graphite text-sm mt-1">
            Minimum 50 characters. The more detail, the better we can help!
          </p>
          {errors.description && (
            <p id="description-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* File Uploads */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-brand-navy border-b border-brand-navy/10 pb-2">
          Attachments (Optional)
        </h2>
        <p className="text-brand-graphite text-sm">
          Share any relevant documents, designs, or references that might help us understand your
          project better.
        </p>
        <FileUpload onFilesChange={handleFilesChange} />
      </div>

      {/* Submit Error */}
      {submitError && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4"
          role="alert"
        >
          {submitError}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white shadow-button py-6 px-8 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Brief'
          )}
        </Button>
        <p className="text-brand-graphite text-sm mt-3">
          We&apos;ll respond within 2 business days. No spam, ever.
        </p>
      </div>
    </form>
  );
}

export default BriefForm;

