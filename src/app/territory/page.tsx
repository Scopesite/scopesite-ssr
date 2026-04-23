import type { Metadata } from 'next';
import { PAGE_META } from '@/lib/territory/copy';
import { TerritoryHero } from '@/components/territory/TerritoryHero';
import { TerritoryMap } from '@/components/territory/TerritoryMap';
import { MechanismSection } from '@/components/territory/MechanismSection';
import { WhatYouGetSection } from '@/components/territory/WhatYouGetSection';
import { ProofSection } from '@/components/territory/ProofSection';
import { GuaranteeSection } from '@/components/territory/GuaranteeSection';
import { FAQSection } from '@/components/territory/FAQSection';
import { FinalCTA } from '@/components/territory/FinalCTA';
import { AreaWaitlistForm } from '@/components/territory/AreaWaitlistForm';
import { PilotCheckerModal } from '@/components/territory/PilotCheckerModal';
import { SchemaOrgMarkup } from '@/components/territory/SchemaOrgMarkup';
import {
  getFeaturedSectors,
  getAllSectorsForBrowse,
} from '@/lib/territory/queries';
import { buildAreaAvailability } from '@/lib/territory/map-builder';

const BASE_URL = 'https://scopesite.co.uk';

export const metadata: Metadata = {
  title: PAGE_META.title,
  description: PAGE_META.description,
  alternates: {
    canonical: `${BASE_URL}${PAGE_META.canonicalPath}`,
  },
  openGraph: {
    title: PAGE_META.title,
    description: PAGE_META.description,
    url: `${BASE_URL}${PAGE_META.canonicalPath}`,
    siteName: 'ScopeSite Digital Studios',
    images: [
      {
        url: `${BASE_URL}${PAGE_META.ogImage}`,
        width: 1200,
        height: 630,
        alt: 'Territory Command - ScopeSite Digital Studios',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_META.title,
    description: PAGE_META.description,
    images: [`${BASE_URL}${PAGE_META.ogImage}`],
  },
};

// Revalidate the server-rendered HTML every 60s so pin state, available
// counts and featured sectors stay fresh without a client round-trip.
export const revalidate = 60;

export default async function TerritoryPage() {
  const [featuredSectors, allSectorsByCategory, areas] = await Promise.all([
    getFeaturedSectors(),
    getAllSectorsForBrowse(),
    buildAreaAvailability(),
  ]);

  return (
    <>
      <SchemaOrgMarkup />
      <TerritoryHero
        featuredSectors={featuredSectors}
        allSectorsByCategory={allSectorsByCategory}
      />
      <TerritoryMap areas={areas} />
      <MechanismSection />
      <WhatYouGetSection />
      <ProofSection />
      <GuaranteeSection />
      <FAQSection />
      <FinalCTA />
      <AreaWaitlistForm allSectorsByCategory={allSectorsByCategory} />
      <PilotCheckerModal allSectorsByCategory={allSectorsByCategory} />
    </>
  );
}
