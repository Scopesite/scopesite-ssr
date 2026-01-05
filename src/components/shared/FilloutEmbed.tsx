'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

/**
 * Fillout Scheduling Embed Component
 * 
 * Embeds the Fillout scheduling form for booking strategy calls.
 * Uses the official Fillout embed script for proper rendering.
 * 
 * Calendar URL: https://scopesite.fillout.com/strategy
 */

const FILLOUT_FORM_ID = 'e8ypoPbzjWus';

export function FilloutEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger Fillout to initialize after script loads
    if (typeof window !== 'undefined' && (window as unknown as { Fillout?: { initialize?: () => void } }).Fillout?.initialize) {
      (window as unknown as { Fillout: { initialize: () => void } }).Fillout.initialize();
    }
  }, []);

  return (
    <>
      <Script 
        src="https://server.fillout.com/embed/v1/" 
        strategy="lazyOnload"
      />
      <div 
        ref={containerRef}
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


