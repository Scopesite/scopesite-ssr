'use client';

import { useEffect, useRef } from 'react';
import { useBrowserTime } from '@/hooks/useBrowserTime';

function formatRemaining(ms: number): string {
  if (ms <= 0) return '0h 00m 00s';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h >= 24) {
    const d = Math.floor(h / 24);
    const rh = h % 24;
    return `${d}d ${rh}h`;
  }
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

interface Props {
  expiresAt: string;
  /** Called once when countdown hits zero (server is source of truth). */
  onExpired?: () => void;
}

export function PromotionCountdown({ expiresAt, onExpired }: Props) {
  const fired = useRef<string | null>(null);
  const end = new Date(expiresAt).getTime();
  const now = useBrowserTime(1000, Number.isFinite(end) ? end : undefined);
  useEffect(() => {
    if (now !== null && Number.isFinite(end) && now >= end && fired.current !== expiresAt) {
      fired.current = expiresAt;
      onExpired?.();
    }
  }, [now, end, expiresAt, onExpired]);
  const label = now === null || !Number.isFinite(end) ? '…' : formatRemaining(end - now);
  return <span className="tabular-nums font-semibold">{label}</span>;
}
