'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  id: string;
  notifiedAt: string | null;
}

export function AdminWaitlistRowActions({ id, notifiedAt }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (notifiedAt) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
        Notified
      </span>
    );
  }

  const onClick = async () => {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(
        `/api/territory/admin/waitlist/${id}/notify`,
        { method: 'POST' },
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErr(data.error || 'Failed');
        return;
      }
      router.refresh();
    } catch {
      setErr('Network error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="brand"
        size="brand"
        onClick={onClick}
        disabled={busy}
        className="py-1.5 px-3 text-xs"
      >
        {busy ? 'Marking...' : 'Mark notified'}
      </Button>
      {err ? <p className="text-xs text-red-600">{err}</p> : null}
    </div>
  );
}
