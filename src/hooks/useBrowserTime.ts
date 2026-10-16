'use client';

import { useEffect, useState } from 'react';

/** A browser clock with the same empty initial snapshot on server and client. */
export function useBrowserTime(intervalMs = 1000, stopAt?: number): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const update = () => {
      const current = Date.now();
      setNow(current);
      if (stopAt !== undefined && current >= stopAt) window.clearInterval(timer);
    };
    const timer = window.setInterval(update, intervalMs);
    const frame = window.requestAnimationFrame(update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, [intervalMs, stopAt]);
  return now;
}
