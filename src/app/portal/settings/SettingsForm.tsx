'use client';

import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';

interface SettingsFormProps {
  initialPhone: string | null;
  initialSmsOptIn: boolean;
}

export function SettingsForm({ initialPhone, initialSmsOptIn }: SettingsFormProps) {
  const [phone, setPhone] = useState(initialPhone ?? '');
  const [smsOptIn, setSmsOptIn] = useState(initialSmsOptIn);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

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

      setMessage('Settings saved');
      if (data.data?.phone) {
        setPhone(data.data.phone);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-brand-navy mb-1">
          Mobile number
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+44 7…"
          className="input-brand w-full"
          autoComplete="tel"
        />
        <p className="text-xs text-brand-navy/50 mt-1">
          UK numbers can start with 07… We store as E.164 for SMS delivery.
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
            Status changes (in progress, awaiting info, in review, completed). You can opt out
            anytime.
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

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-graphite transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Save preferences
      </button>
    </form>
  );
}
