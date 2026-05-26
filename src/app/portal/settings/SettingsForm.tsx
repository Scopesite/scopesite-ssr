'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';

interface SettingsFormProps {
  initialPhone: string | null;
  initialSmsOptIn: boolean;
  setupMode?: boolean;
}

export function SettingsForm({
  initialPhone,
  initialSmsOptIn,
  setupMode = false,
}: SettingsFormProps) {
  const router = useRouter();
  const [phone, setPhone] = useState(initialPhone ?? '');
  const [smsOptIn, setSmsOptIn] = useState(initialSmsOptIn);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (smsOptIn && !phone.trim()) {
      setError('Enter your mobile number to enable SMS updates');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/portal/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim() || null,
          sms_opt_in: smsOptIn,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      if (data.data?.phone) {
        setPhone(data.data.phone);
      }

      if (setupMode) {
        router.push('/portal/dashboard?sms=saved');
        router.refresh();
        return;
      }

      setMessage(
        smsOptIn
          ? 'SMS updates enabled. You will receive texts when your request status changes.'
          : 'Preferences saved.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {setupMode && (
        <div className="rounded-lg bg-brand-navy/5 border border-brand-navy/10 p-4 text-sm text-brand-navy/80">
          <p className="font-medium text-brand-navy mb-1">Welcome to the portal</p>
          <p>
            SMS is optional. Add your mobile if you want quick text alerts on top of email.
            You can skip and set this up later from Settings.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-brand-navy mb-1">
          Mobile number {setupMode && <span className="text-brand-navy/50 font-normal">(if opting in)</span>}
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="07xxx xxxxxx or +44 7…"
          className="input-brand w-full"
          autoComplete="tel"
        />
        <p className="text-xs text-brand-navy/50 mt-1">
          UK mobile numbers are fine. We store as +44 for reliable delivery.
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={smsOptIn}
          onChange={(e) => setSmsOptIn(e.target.checked)}
          className="mt-1 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
        />
        <span className="text-sm text-brand-navy">
          <span className="font-medium block">Send me SMS updates on my requests</span>
          <span className="text-brand-navy/60">
            When status changes to in progress, awaiting your info, in review, or completed.
            Opt out anytime by unticking this box.
          </span>
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="text-sm text-green-700" role="status">
          {message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-graphite transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {setupMode ? 'Save and continue' : 'Save preferences'}
        </button>
        {setupMode && (
          <Link
            href="/portal/dashboard"
            className="text-sm font-medium text-brand-navy/60 hover:text-brand-navy"
          >
            Skip for now
          </Link>
        )}
      </div>
    </form>
  );
}
