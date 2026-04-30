/**
 * Ahrefs Web Analytics
 *
 * Loads the Ahrefs Web Analytics script in the document head using Next.js's
 * <Script> component with `afterInteractive` so it never blocks the initial
 * render or affects LCP (contrast with `beforeInteractive` marketing trackers).
 *
 * The data key is read from `NEXT_PUBLIC_AHREFS_ANALYTICS_KEY` (the
 * `NEXT_PUBLIC_` prefix is required so the value is inlined for the client).
 * If the variable is missing (e.g. in local development) the component
 * renders nothing rather than failing the build.
 */

'use client';

import Script from 'next/script';

export function AhrefsAnalytics() {
  const key = process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY;

  if (!key) return null;

  return (
    <Script
      id="ahrefs-analytics"
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={key}
      strategy="afterInteractive"
    />
  );
}

export default AhrefsAnalytics;
