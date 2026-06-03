'use client';

import dynamic from 'next/dynamic';
import { useIsMobile } from '@/hooks';
import { HomeBelowFoldStatic } from './HomeBelowFoldStatic';

// Dynamically import animated version - only loaded on desktop
const HomeBelowFoldAnimated = dynamic(
  () => import('./HomeBelowFold').then(mod => mod.HomeBelowFold),
  { 
    ssr: false, // Don't SSR the animated version
    loading: () => null // Static version is already rendered
  }
);

interface Review {
  author: string;
  reviewBody: string;
  datePublished: string;
}

interface HomeBelowFoldWrapperProps {
  reviews: Review[];
}

/**
 * Smart wrapper that:
 * - Mobile: Shows static content (no Framer Motion loaded)
 * - Desktop: Dynamically loads animated version
 */
export function HomeBelowFoldWrapper({ reviews }: HomeBelowFoldWrapperProps) {
  const isMobile = useIsMobile();

  // On mobile, just render static - Framer Motion never loads
  if (isMobile) {
    return <HomeBelowFoldStatic reviews={reviews} />;
  }

  // On desktop, render animated version
  return <HomeBelowFoldAnimated reviews={reviews} />;
}

export default HomeBelowFoldWrapper;



