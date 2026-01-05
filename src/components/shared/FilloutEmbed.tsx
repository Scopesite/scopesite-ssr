'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

/**
 * Fillout Scheduling Embed Component
 * 
 * Embeds the Fillout scheduling form for booking strategy calls.
 * Uses the official Fillout embed script for proper rendering.
 * 
 * Calendar URL: https://scopesite.fillout.com/strategy
 * 
 * Note: Uses a key-based remount strategy to ensure the embed
 * reinitializes on every page visit (fixes client-side nav caching).
 */

const FILLOUT_FORM_ID = 'e8ypoPbzjWus';

export function FilloutEmbed() {
  // Generate unique key on each mount to force embed reinitialization
  const [mountKey, setMountKey] = useState(() => Date.now());

  useEffect(() => {
    // Reset key on mount to force fresh embed
    setMountKey(Date.now());
    
    // Small delay to let the DOM update, then initialize Fillout
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const win = window as unknown as { Fillout?: { initialize?: () => void } };
        if (win.Fillout?.initialize) {
          win.Fillout.initialize();
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script 
        src="https://server.fillout.com/embed/v1/" 
        strategy="lazyOnload"
        onLoad={() => {
          // Initialize when script loads
          const win = window as unknown as { Fillout?: { initialize?: () => void } };
          if (win.Fillout?.initialize) {
            win.Fillout.initialize();
          }
        }}
      />
      <div 
        key={mountKey}
        className="w-full rounded-2xl overflow-hidden"
        style={{ 
          borderRadius: '20px',
        }}
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
