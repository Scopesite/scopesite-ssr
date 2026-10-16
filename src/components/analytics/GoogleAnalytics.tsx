'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useSyncExternalStore, Suspense } from 'react';
import { isProductionAnalyticsHostname } from '@/lib/analytics-hostname';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const subscribeToHostname = () => () => {};
const getProductionHostSnapshot = () => isProductionAnalyticsHostname(window.location.hostname);
const getServerHostSnapshot = () => false;

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

function GoogleAnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    if (typeof window.gtag !== 'function') return;

    const url =
      pathname +
      (searchParams.toString() ? `?${searchParams.toString()}` : '');

    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  const isProductionHost = useSyncExternalStore(
    subscribeToHostname,
    getProductionHostSnapshot,
    getServerHostSnapshot
  );

  if (!GA_MEASUREMENT_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[GA4] NEXT_PUBLIC_GA_MEASUREMENT_ID is not set. GA4 tracking disabled.'
      );
    }
    return null;
  }

  if (!isProductionHost) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsInner />
      </Suspense>
    </>
  );
}
