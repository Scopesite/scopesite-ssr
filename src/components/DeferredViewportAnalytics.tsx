'use client';

/**
 * Viewport-aware third-party loading:
 * - Ahrefs: `lazyOnload` on narrow viewports, `afterInteractive` on desktop.
 * - Vercel Analytics: immediate on desktop; after idle on mobile (same pattern as Speed Insights).
 * - Speed Insights: unchanged — desktop sync mount, mobile idle.
 */

import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useEffect, useLayoutEffect, useState } from 'react';

/** Aligns with Tailwind `md` and useIsMobile() */
const MOBILE_MAX_PX = 768;

export function DeferredAhrefsAnalytics() {
  const key = process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY;
  const [strategy, setStrategy] = useState<'afterInteractive' | 'lazyOnload' | null>(null);

  useLayoutEffect(() => {
    queueMicrotask(() => {
      setStrategy(
        window.innerWidth < MOBILE_MAX_PX ? 'lazyOnload' : 'afterInteractive',
      );
    });
  }, []);

  if (!key || !strategy) return null;

  return (
    <Script
      id="ahrefs-analytics"
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={key}
      strategy={strategy}
    />
  );
}

/** Defers Vercel Analytics on mobile so it does not compete with hero LCP / hydration. */
export function DeferredVercelAnalytics() {
  const [mount, setMount] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= MOBILE_MAX_PX) {
      queueMicrotask(() => setMount(true));
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
  return <Analytics />;
}

export function DeferredSpeedInsights() {
  const [mount, setMount] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= MOBILE_MAX_PX) {
      queueMicrotask(() => setMount(true));
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
