'use client';

import type { MouseEvent, ReactNode } from 'react';
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
  /** Runs after tracking. Does not replace it and does not cancel navigation. */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
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
  onClick,
  children,
}: RwdOutboundLinkProps) {
  return (
    <a
      href={RWD_DESTINATIONS[destination]}
      className={className}
      onClick={(event) => {
        trackRwdOutbound({ page, placement, destination });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
