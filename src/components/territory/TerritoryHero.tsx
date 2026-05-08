import { HERO } from '@/lib/territory/copy';
import type { SectorTile } from '@/lib/territory/types';
import { TerritoryChecker } from './TerritoryChecker';

interface Props {
  featuredSectors: SectorTile[];
  allSectorsByCategory: Record<string, SectorTile[]>;
  priceStrip: string;
}

export function TerritoryHero({ featuredSectors, allSectorsByCategory, priceStrip }: Props) {
  return (
    <section
      id="territory-hero"
      className="relative bg-brand-navy text-white pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pb-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="inline-block rounded-full bg-brand-gold/20 border border-brand-gold/40 px-3 py-1 text-xs sm:text-sm font-semibold tracking-wide text-brand-gold uppercase">
          {HERO.eyebrow}
        </p>
        <h1 className="mt-5 font-headline text-4xl sm:text-5xl lg:text-6xl leading-tight">
          {HERO.headline}
        </h1>
        <p className="mt-5 mx-auto max-w-2xl text-lg sm:text-xl text-white/85 leading-relaxed">
          {HERO.subHeadline}
        </p>
        <div className="mt-10 max-w-3xl mx-auto text-left">
          <TerritoryChecker
            featuredSectors={featuredSectors}
            allSectorsByCategory={allSectorsByCategory}
          />
        </div>
        <p
          id="territory-price-strip"
          className="mt-6 text-sm sm:text-base text-white/80"
        >
          {priceStrip}
        </p>
      </div>
    </section>
  );
}

export default TerritoryHero;
