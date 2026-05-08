'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
  const fired = useRef(false);
  const [label, setLabel] = useState(() =>
    formatRemaining(new Date(expiresAt).getTime() - Date.now()),
  );

  const tick = useCallback(() => {
    const end = new Date(expiresAt).getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) {
      setLabel('0h 00m 00s');
      if (!fired.current) {
        fired.current = true;
        onExpired?.();
      }
      return false;
    }
    setLabel(formatRemaining(diff));
    return true;
  }, [expiresAt, onExpired]);

  useEffect(() => {
    fired.current = false;
    tick();
    const id = window.setInterval(() => {
      if (!tick()) {
        window.clearInterval(id);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [tick]);

  return <span className="tabular-nums font-semibold">{label}</span>;
}