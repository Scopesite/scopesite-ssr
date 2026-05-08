import type { Metadata } from 'next';
import { PAGE_META } from '@/lib/territory/copy';
import { getHeroPriceStrip } from '@/lib/territory/heroCopy';
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
import { getSiteBanner } from '@/lib/territory/siteConfig';
import { buildAreaAvailability } from '@/lib/territory/map-builder';
import { derivePromotionRegionBadges } from '@/lib/territory/derivePromotionRegionBadges';

const BASE_URL = 'https://scopesite.co.uk';

/** Data depends on Neon; avoid build-time prerender before migrations are applied. */
export const dynamic = 'force-dynamic';

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

export default async function TerritoryPage() {
  const [featuredSectors, allSectorsByCategory, areas, priceStrip, siteBanner] = await Promise.all([
    getFeaturedSectors(),
    getAllSectorsForBrowse(),
    buildAreaAvailability(),
    getHeroPriceStrip(),
    getSiteBanner(),
  ]);

  const promotionRegionBadges = derivePromotionRegionBadges(areas);

  return (
    <>
      <SchemaOrgMarkup />
      <TerritoryHero
        featuredSectors={featuredSectors}
        allSectorsByCategory={allSectorsByCategory}
        priceStrip={priceStrip}
        siteBanner={siteBanner}
      />
      <TerritoryMap areas={areas} promotionRegionBadges={promotionRegionBadges} />
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
