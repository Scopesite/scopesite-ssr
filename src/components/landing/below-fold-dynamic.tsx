import dynamic from 'next/dynamic';
import { BelowFoldSectionSkeleton } from './BelowFoldSectionSkeleton';

const loading = () => <BelowFoldSectionSkeleton />;

/** Split client bundles so geo landing routes defer parse cost for stacked sections. */

export const DynamicLandingProblem = dynamic(
  () => import('./LandingProblem').then((m) => ({ default: m.LandingProblem })),
  { loading }
);

export const DynamicLandingSolution = dynamic(
  () => import('./LandingSolution').then((m) => ({ default: m.LandingSolution })),
  { loading }
);

export const DynamicLandingWhatYouGet = dynamic(
  () => import('./LandingWhatYouGet').then((m) => ({ default: m.LandingWhatYouGet })),
  { loading }
);

export const DynamicLandingAreasServed = dynamic(
  () => import('./LandingAreasServed').then((m) => ({ default: m.LandingAreasServed })),
  { loading }
);

export const DynamicLandingProof = dynamic(
  () => import('./LandingProof').then((m) => ({ default: m.LandingProof })),
  { loading }
);

export const DynamicLandingCaseStudy = dynamic(
  () => import('./LandingCaseStudy').then((m) => ({ default: m.LandingCaseStudy })),
  { loading }
);

export const DynamicLandingRelatedServices = dynamic(
  () => import('./LandingRelatedServices').then((m) => ({ default: m.LandingRelatedServices })),
  { loading }
);

export const DynamicFAQSection = dynamic(
  () => import('./FAQAccordion').then((m) => ({ default: m.FAQSection })),
  { loading }
);

export const DynamicLandingCTA = dynamic(
  () => import('./LandingCTA').then((m) => ({ default: m.LandingCTA })),
  { loading }
);
