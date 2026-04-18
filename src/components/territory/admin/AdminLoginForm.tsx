'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  redirectTo: string;
}

export function AdminLoginForm({ redirectTo }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/territory/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="admin-password"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Passphrase
        </label>
        <input
          id="admin-password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white text-brand-navy placeholder:text-slate-400 px-3 py-2.5 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        variant="brand"
        size="brand"
        disabled={submitting || !password}
        className="w-full justify-center"
      >
        {submitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
