'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { APPLICATION } from '@/lib/territory/copy';
import { normalisePostcode, isPlausibleUkPostcode } from '@/lib/territory/postcode';
import { Spinner } from './Spinner';
import { Button } from '@/components/ui/button';

/** Discriminated union shared with /territory/apply/page.tsx. Seat-mode
 *  holds a real territory.seats row (48h hold on submit). Freeform-mode is
 *  seat-less; the submit just inserts a freeform row in applications. */
export type ResolvedApplyContext =
  | {
      mode: 'seat';
      seatId: string;
      postcodeDistrict: string;
      sectorSlug: string;
      sectorLabel: string;
    }
  | {
      mode: 'freeform';
      postcodeDistrict: string;
      freeformIndustry: string;
    };

interface Props {
  context: ResolvedApplyContext;
}

export function TerritoryApplicationForm({ context }: Props) {
  const router = useRouter();
  const [firmName, setFirmName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState<string>('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [firmPostcode, setFirmPostcode] = useState('');
  const [aiApproach, setAiApproach] = useState<string>('');
  const [additionalContext, setAdditionalContext] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState<string | null>(null);

  const bannerLabel =
    context.mode === 'seat' ? context.sectorLabel : context.freeformIndustry;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!firmName.trim()) e.firmName = 'Required';
    if (!contactName.trim()) e.contactName = 'Required';
    if (!contactEmail.trim()) e.contactEmail = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      e.contactEmail = 'Enter a valid email address';
    }
    const pc = normalisePostcode(firmPostcode);
    if (!pc || !isPlausibleUkPostcode(pc)) {
      e.firmPostcode = 'Enter a valid UK postcode';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setTopError(null);
    if (!validate()) return;

    const base = {
      firmName: firmName.trim(),
      contactName: contactName.trim(),
      contactRole: contactRole || null,
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim() || null,
      websiteUrl: websiteUrl.trim() || null,
      firmPostcode: normalisePostcode(firmPostcode),
      aiVisibilityApproach: aiApproach || null,
      additionalContext: additionalContext.trim() || null,
    };

    const payload =
      context.mode === 'seat'
        ? {
            entryType: 'seat' as const,
            seatId: context.seatId,
            sectorSlug: context.sectorSlug,
            ...base,
          }
        : {
            entryType: 'freeform' as const,
            postcode: context.postcodeDistrict,
            freeformIndustry: context.freeformIndustry,
            ...base,
          };

    setSubmitting(true);
    try {
      const res = await fetch('/api/territory/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        applicationId?: string;
        error?: string;
      };
      if (res.status === 429) {
        setTopError(data.error || 'An application from this email is already in review.');
        return;
      }
      if (res.status === 409) {
        setTopError(
          'This territory was just claimed by another applicant. Please go back and check availability again.',
        );
        return;
      }
      if (!res.ok || !data.ok || !data.applicationId) {
        setTopError(data.error || 'Could not submit your application. Please try again.');
        return;
      }
      router.push(`/territory/confirmed?application=${encodeURIComponent(data.applicationId)}`);
    } catch {
      setTopError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    'w-full rounded-md border border-slate-300 bg-white text-brand-navy placeholder:text-slate-400 px-3 py-2.5 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40';
  const errClass = 'mt-1 text-sm text-red-600';

  return (
    <form onSubmit={onSubmit} data-territory-form className="space-y-5" noValidate>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-700">
          Applying for <strong>{context.postcodeDistrict} {bannerLabel}</strong>.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="app-firm" className="block text-sm font-medium text-slate-700 mb-1">
            {APPLICATION.labels.firmName} *
          </label>
          <input
            id="app-firm"
            type="text"
            required
            maxLength={200}
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
            className={fieldClass}
          />
          {errors.firmName ? <p className={errClass}>{errors.firmName}</p> : null}
        </div>
        <div>
          <label htmlFor="app-name" className="block text-sm font-medium text-slate-700 mb-1">
            {APPLICATION.labels.contactName} *
          </label>
          <input
            id="app-name"
            type="text"
            required
            maxLength={200}
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className={fieldClass}
          />
          {errors.contactName ? <p className={errClass}>{errors.contactName}</p> : null}
        </div>
        <div>
          <label htmlFor="app-role" className="block text-sm font-medium text-slate-700 mb-1">
            {APPLICATION.labels.contactRole}
          </label>
          <select
            id="app-role"
            value={contactRole}
            onChange={(e) => setContactRole(e.target.value)}
            className={`${fieldClass} bg-white`}
          >
            <option value="">Select...</option>
            {APPLICATION.rolesOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="app-email" className="block text-sm font-medium text-slate-700 mb-1">
            {APPLICATION.labels.contactEmail} *
          </label>
          <input
            id="app-email"
            type="email"
            required
            maxLength={320}
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className={fieldClass}
          />
          {errors.contactEmail ? <p className={errClass}>{errors.contactEmail}</p> : null}
        </div>
        <div>
          <label htmlFor="app-phone" className="block text-sm font-medium text-slate-700 mb-1">
            {APPLICATION.labels.contactPhone}
          </label>
          <input
            id="app-phone"
            type="tel"
            maxLength={50}
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="app-url" className="block text-sm font-medium text-slate-700 mb-1">
            {APPLICATION.labels.websiteUrl}
          </label>
          <input
            id="app-url"
            type="url"
            maxLength={500}
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="app-postcode" className="block text-sm font-medium text-slate-700 mb-1">
            {APPLICATION.labels.firmPostcode} *
          </label>
          <input
            id="app-postcode"
            type="text"
            required
            maxLength={12}
            value={firmPostcode}
            onChange={(e) => setFirmPostcode(e.target.value.toUpperCase())}
            className={`${fieldClass} uppercase tracking-wide`}
          />
          {errors.firmPostcode ? <p className={errClass}>{errors.firmPostcode}</p> : null}
        </div>
        <div>
          <label htmlFor="app-ai" className="block text-sm font-medium text-slate-700 mb-1">
            {APPLICATION.labels.aiVisibilityApproach}
          </label>
          <select
            id="app-ai"
            value={aiApproach}
            onChange={(e) => setAiApproach(e.target.value)}
            className={`${fieldClass} bg-white`}
          >
            <option value="">Select...</option>
            {APPLICATION.aiApproachOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="app-context" className="block text-sm font-medium text-slate-700 mb-1">
          {APPLICATION.labels.additionalContext}
        </label>
        <textarea
          id="app-context"
          rows={4}
          maxLength={5000}
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          placeholder={APPLICATION.additionalContextPlaceholder}
          className={fieldClass}
        />
      </div>
      <p className="text-sm text-slate-600">{APPLICATION.disclaimer}</p>
      {topError ? (
        <p className="text-sm text-red-600" role="alert">
          {topError}
        </p>
      ) : null}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" variant="brand" size="brand" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner className="text-brand-navy" label="Submitting" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>{APPLICATION.submit}</span>
          )}
        </Button>
        <Button asChild variant="brandOutline" size="brand">
          <Link href="/territory">Back to Territory Command</Link>
        </Button>
      </div>
    </form>
  );
}

export default TerritoryApplicationForm;
