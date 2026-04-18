'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  id: string;
  firmName: string;
  notifiedAt: string | null;
}

export function AdminWaitlistRowActions({ id, firmName, notifiedAt }: Props) {
  const router = useRouter();
  const [busyNotify, setBusyNotify] = useState(false);
  const [busyDelete, setBusyDelete] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onNotify = async () => {
    setErr(null);
    setBusyNotify(true);
    try {
      const res = await fetch(`/api/territory/admin/waitlist/${id}/notify`, {
        method: 'POST',
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErr(data.error || 'Failed');
        return;
      }
      router.refresh();
    } catch {
      setErr('Network error');
    } finally {
      setBusyNotify(false);
    }
  };

  const onDelete = async () => {
    const label = firmName.trim() || 'this entry';
    if (
      !window.confirm(
        `Remove "${label}" from the area waitlist? This cannot be undone.`,
      )
    ) {
      return;
    }
    setErr(null);
    setBusyDelete(true);
    try {
      const res = await fetch(`/api/territory/admin/waitlist/${id}`, {
        method: 'DELETE',
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErr(data.error || 'Failed to remove');
        return;
      }
      router.refresh();
    } catch {
      setErr('Network error');
    } finally {
      setBusyDelete(false);
    }
  };

  const disabled = busyNotify || busyDelete;

  return (
    <div className="flex flex-col items-end gap-2">
      {notifiedAt ? (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
          Notified
        </span>
      ) : (
        <Button
          type="button"
          variant="brand"
          size="brand"
          onClick={onNotify}
          disabled={disabled}
          className="py-1.5 px-3 text-xs"
        >
          {busyNotify ? 'Marking...' : 'Mark notified'}
        </Button>
      )}
      <Button
        type="button"
        variant="brandOutline"
        size="brand"
        onClick={onDelete}
        disabled={disabled}
        className="py-1.5 px-3 text-xs border-red-200 text-red-700 hover:bg-red-50 focus-visible:ring-red-200"
      >
        {busyDelete ? 'Removing...' : 'Remove from waitlist'}
      </Button>
      {err ? <p className="text-xs text-red-600 max-w-[12rem] text-right">{err}</p> : null}
    </div>
  );
}
