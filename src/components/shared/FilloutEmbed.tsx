'use client';

import { useEffect, useState } from 'react';

/**
 * Fillout Scheduling Embed Component
 * 
 * Embeds the Fillout scheduling form for booking strategy calls.
 * Uses a direct iframe approach to guarantee fresh loads on navigation.
 * 
 * Calendar URL: https://scopesite.fillout.com/strategy
 */

const FILLOUT_FORM_ID = 'e8ypoPbzjWus';
const FILLOUT_EMBED_URL = `https://forms.fillout.com/t/${FILLOUT_FORM_ID}?embed=true`;

export function FilloutEmbed() {
  // Generate unique key on mount to force iframe reload on navigation
  const [iframeKey, setIframeKey] = useState<number | null>(null);

  useEffect(() => {
    // Set key on client-side mount to force fresh iframe
    setIframeKey(Date.now());
  }, []);

  // Don't render until client-side to avoid hydration mismatch
  if (iframeKey === null) {
    return (
      <div 
        className="w-full rounded-2xl overflow-hidden bg-white/5"
        style={{ height: '900px', borderRadius: '20px' }}
      >
        <div className="h-full flex items-center justify-center text-white/60">
          Loading booking calendar...
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full rounded-2xl overflow-hidden"
      style={{ borderRadius: '20px' }}
    >
      <iframe
        key={iframeKey}
        src={FILLOUT_EMBED_URL}
        title="Book a Strategy Call"
        width="100%"
        height="900"
        style={{ 
          border: 'none', 
          borderRadius: '20px',
          background: 'transparent'
        }}
        allow="camera; microphone; autoplay; encrypted-media"
      />
    </div>
  );
}
