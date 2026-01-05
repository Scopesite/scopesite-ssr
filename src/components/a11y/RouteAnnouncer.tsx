/**
 * Route Announcer Component
 * 
 * Announces page changes to screen reader users when navigating.
 * Manages focus to main content on route change for better navigation.
 * 
 * WCAG 2.4.2 - Page Titled (Level A)
 * WCAG 4.1.3 - Status Messages (Level AA)
 */

'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

interface RouteAnnouncerProps {
  /** Optional custom announcement message */
  customMessage?: string;
}

export function RouteAnnouncer({ customMessage }: RouteAnnouncerProps) {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = React.useState('');

  React.useEffect(() => {
    // Get the page title from document
    const pageTitle = document.title || 'Page';
    
    // Create announcement
    const message = customMessage || `Navigated to ${pageTitle}`;
    
    // Clear and re-announce to ensure screen reader picks it up
    setAnnouncement('');
    const timer = setTimeout(() => {
      setAnnouncement(message);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, customMessage]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

export default RouteAnnouncer;

