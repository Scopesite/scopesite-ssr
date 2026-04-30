'use client';

/**
 * Ahrefs: always `lazyOnload` — same load timing mobile already used; cuts desktop TBT.
 * Speed Insights: desktop mounts in useLayoutEffect; mobile after requestIdleCallback.
 */

import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useLayoutEffect, useState } from 'react';

/** Aligns with Tailwind `md` and useIsMobile() */
const MOBILE_MAX_PX = 768;

export function DeferredAhrefsAnalytics() {
  const key = process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY;

  if (!key) return null;

  return (
    <Script
      id="ahrefs-analytics"
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={key}
      strategy="lazyOnload"
    />
  );
}

export function DeferredSpeedInsights() {
  const [mount, setMount] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= MOBILE_MAX_PX) {
      setMount(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= MOBILE_MAX_PX) return;

    let cancelled = false;
    const run = () => {
      if (!cancelled) setMount(true);
    };

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 5000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const w = window as Window & typeof globalThis;
    const id = w.setTimeout(run, 200);
    return () => {
      cancelled = true;
      w.clearTimeout(id);
    };
  }, []);

  if (!mount) return null;
  return <SpeedInsights />;
}
