/**
 * Ahrefs Web Analytics
 *
 * **Root layout:** use [`DeferredViewportAnalytics`](./DeferredViewportAnalytics.tsx)
 * (`DeferredAhrefsAnalytics`) so mobile lab uses `lazyOnload` and desktop keeps
 * `afterInteractive`.
 *
 * This module remains for direct use with an explicit `strategy` when needed.
 *
 * The data key is read from `NEXT_PUBLIC_AHREFS_ANALYTICS_KEY` (the
 * `NEXT_PUBLIC_` prefix is required so the value is inlined for the client).
 * If the variable is missing (e.g. in local development) the component
 * renders nothing rather than failing the build.
 */

'use client';

import Script from 'next/script';

export type AhrefsScriptStrategy = 'afterInteractive' | 'lazyOnload';

interface AhrefsAnalyticsProps {
  /** Default preserves legacy behaviour for any direct imports. */
  strategy?: AhrefsScriptStrategy;
}

export function AhrefsAnalytics({ strategy = 'afterInteractive' }: AhrefsAnalyticsProps) {
  const key = process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY;

  if (!key) return null;

  return (
    <Script
      id="ahrefs-analytics"
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={key}
      strategy={strategy}
    />
  );
}

export default AhrefsAnalytics;
