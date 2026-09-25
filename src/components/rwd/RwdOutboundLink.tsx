'use client';

import type { ReactNode } from 'react';
import {
  RWD_DESTINATIONS,
  trackRwdOutbound,
  type RwdDestinationCategory,
  type RwdPageCategory,
  type RwdPlacementCategory,
} from '@/lib/rwd-outbound';

interface RwdOutboundLinkProps {
  destination: RwdDestinationCategory;
  page: RwdPageCategory;
  placement: RwdPlacementCategory;
  className?: string;
  children: ReactNode;
}

/**
 * Crawlable anchor. The href is the canonical specialist URL with no tracking
 * parameters. Click tracking never calls preventDefault and never awaits.
 */
export function RwdOutboundLink({
  destination,
  page,
  placement,
  className,
  children,
}: RwdOutboundLinkProps) {
  return (
    <a
      href={RWD_DESTINATIONS[destination]}
      className={className}
      onClick={() => {
        trackRwdOutbound({ page, placement, destination });
      }}
    >
      {children}
    </a>
  );
}
