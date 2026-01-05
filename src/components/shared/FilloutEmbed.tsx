'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

/**
 * Fillout Scheduling Embed Component
 * 
 * Embeds the Fillout scheduling form for booking strategy calls.
 * Uses the official Fillout embed script for proper rendering.
 * 
 * Calendar URL: https://scopesite.fillout.com/strategy
 * 
 * Note: Uses pathname + timestamp keying to force complete remount
 * on every page visit (fixes client-side navigation caching).
 */

const FILLOUT_FORM_ID = 'e8ypoPbzjWus';

export function FilloutEmbed() {
  const pathname = usePathname();
  const [embedKey, setEmbedKey] = useState(0);
  const hasInitialized = useRef(false);

  // Force remount on every navigation to this page
  useEffect(() => {
    // Generate new key to force complete DOM remount
    setEmbedKey(Date.now());
    hasInitialized.current = false;
  }, [pathname]);

  // Initialize Fillout after the embed mounts
  useEffect(() => {
    if (hasInitialized.current) return;
    
    const initFillout = () => {
      const win = window as unknown as { Fillout?: { initialize?: () => void } };
      if (win.Fillout?.initialize) {
        win.Fillout.initialize();
        hasInitialized.current = true;
      }
    };

    // Try immediately, then retry with delay
    initFillout();
    const timer = setTimeout(initFillout, 500);
    const timer2 = setTimeout(initFillout, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [embedKey]);

  return (
    <>
      <Script 
        src="https://server.fillout.com/embed/v1/" 
        strategy="afterInteractive"
        onLoad={() => {
          const win = window as unknown as { Fillout?: { initialize?: () => void } };
          if (win.Fillout?.initialize) {
            win.Fillout.initialize();
            hasInitialized.current = true;
          }
        }}
      />
      <div 
        key={embedKey}
        className="w-full rounded-2xl overflow-hidden"
        style={{ borderRadius: '20px' }}
      >
        <div 
          data-fillout-id={FILLOUT_FORM_ID}
          data-fillout-embed-type="standard"
          data-fillout-inherit-parameters
          style={{ width: '100%', height: '900px', borderRadius: '20px' }}
        />
      </div>
    </>
  );
}
