/**
 * Live Region Component
 * 
 * Provides ARIA live regions for screen reader announcements.
 * Use for dynamic content updates, form submissions, and error notifications.
 * 
 * WCAG 4.1.3 - Status Messages (Level AA)
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface LiveRegionProps {
  /** The message to announce */
  message: string;
  /** Politeness level - 'polite' waits for user idle, 'assertive' interrupts */
  politeness?: 'polite' | 'assertive';
  /** Whether the region is visible or screen-reader only */
  visible?: boolean;
  /** Additional class names */
  className?: string;
  /** Clear message after delay (ms) - 0 means never */
  clearAfter?: number;
}

export function LiveRegion({
  message,
  politeness = 'polite',
  visible = false,
  className,
  clearAfter = 0,
}: LiveRegionProps) {
  const [currentMessage, setCurrentMessage] = React.useState(message);

  React.useEffect(() => {
    setCurrentMessage(message);

    if (clearAfter > 0 && message) {
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, clearAfter);
      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={cn(
        visible
          ? className
          : 'sr-only',
      )}
    >
      {currentMessage}
    </div>
  );
}

/**
 * Hook for managing live region announcements
 */
export function useLiveAnnouncer() {
  const [announcement, setAnnouncement] = React.useState('');

  const announce = React.useCallback((message: string) => {
    // Clear first to ensure re-announcement of same message
    setAnnouncement('');
    // Use timeout to ensure the clear is processed first
    setTimeout(() => setAnnouncement(message), 50);
  }, []);

  const clear = React.useCallback(() => {
    setAnnouncement('');
  }, []);

  return { announcement, announce, clear };
}

export default LiveRegion;

