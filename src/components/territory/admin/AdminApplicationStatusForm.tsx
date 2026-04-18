'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ApplicationStatus } from '@/lib/territory/types';
import { Button } from '@/components/ui/button';

interface Props {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

const OPTIONS: Array<{ value: ApplicationStatus; label: string }> = [
  { value: 'received', label: 'New (received)' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
];

export function AdminApplicationStatusForm({
  applicationId,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [value, setValue] = useState<ApplicationStatus>(currentStatus);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const dirty = value !== currentStatus;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty) return;
    setMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/territory/admin/applications/${applicationId}/status`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: value }),
        },
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMessage({ kind: 'err', text: data.error || 'Update failed' });
        return;
      }
      setMessage({ kind: 'ok', text: 'Status updated.' });
      router.refresh();
    } catch {
      setMessage({ kind: 'err', text: 'Network error.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label htmlFor="app-status" className="sr-only">
        Status
      </label>
      <select
        id="app-status"
        value={value}
        onChange={(e) => setValue(e.target.value as ApplicationStatus)}
        className="w-full rounded-md border border-slate-300 bg-white text-brand-navy px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Button
        type="submit"
        variant="brand"
        size="brand"
        disabled={!dirty || submitting}
        className="w-full justify-center py-2 text-sm"
      >
        {submitting ? 'Saving...' : 'Save status'}
      </Button>
      {message ? (
        <p
          className={`text-sm ${
            message.kind === 'ok' ? 'text-emerald-700' : 'text-red-600'
          }`}
          role="status"
        >
          {message.text}
        </p>
      ) : null}
    </form>
  );
}
