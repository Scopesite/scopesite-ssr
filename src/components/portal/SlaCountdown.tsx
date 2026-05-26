'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
interface SlaCountdownProps {
  slaDueAt: Date | string | null;
  createdAt: Date | string;
  isComplete: boolean;
}

type SlaTone = 'green' | 'amber' | 'red';

function getSlaSnapshot(
  slaDueAt: Date,
  createdAt: Date
): { label: string; tone: SlaTone } {
  const now = Date.now();
  const dueMs = slaDueAt.getTime();
  const createdMs = createdAt.getTime();
  const totalMs = Math.max(dueMs - createdMs, 1);
  const remainingMs = dueMs - now;

  if (remainingMs <= 0) {
    const breachedMs = now - dueMs;
    const hours = Math.floor(breachedMs / 3600000);
    const mins = Math.floor((breachedMs % 3600000) / 60000);
    const breachedLabel =
      hours > 0 ? `${hours}h ${mins}m ago` : `${mins}m ago`;
    return { label: `Breached ${breachedLabel}`, tone: 'red' };
  }

  const hours = Math.floor(remainingMs / 3600000);
  const mins = Math.floor((remainingMs % 3600000) / 60000);
  const label =
    hours > 0 ? `${hours}h ${mins}m remaining` : `${mins}m remaining`;

  const pctRemaining = remainingMs / totalMs;
  let tone: SlaTone = 'green';
  if (pctRemaining < 0.25) {
    tone = 'amber';
  }

  return { label, tone };
}

const toneClasses: Record<SlaTone, string> = {
  green: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  amber: 'bg-amber-50 border-amber-200 text-amber-800',
  red: 'bg-red-50 border-red-200 text-red-800',
};

export function SlaCountdown({
  slaDueAt,
  createdAt,
  isComplete,
}: SlaCountdownProps) {
  const dueMs = slaDueAt ? new Date(slaDueAt).getTime() : null;
  const createdMs = new Date(createdAt).getTime();

  const [snapshot, setSnapshot] = useState<{ label: string; tone: SlaTone } | null>(
    () => {
      if (dueMs === null || isComplete) return null;
      return getSlaSnapshot(new Date(dueMs), new Date(createdMs));
    }
  );

  useEffect(() => {
    if (dueMs === null || isComplete) {
      return;
    }

    const dueDate = new Date(dueMs);
    const createdDate = new Date(createdMs);

    const tick = () => {
      setSnapshot(getSlaSnapshot(dueDate, createdDate));
    };

    tick();
    const id = window.setInterval(tick, 60000);
    return () => window.clearInterval(id);
  }, [dueMs, createdMs, isComplete]);

  if (isComplete || dueMs === null || !snapshot) {
    return null;
  }

  const dueDate = new Date(dueMs);

  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3 flex items-start gap-3',
        toneClasses[snapshot.tone]
      )}
    >
      <Clock size={18} className="shrink-0 mt-0.5" aria-hidden />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
          SLA target
        </p>
        <p className="text-sm font-medium">{snapshot.label}</p>
        <p className="text-xs opacity-70 mt-0.5">
          Due {dueDate.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
        </p>
      </div>
    </div>
  );
}
