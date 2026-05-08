import Link from 'next/link';
import type { SiteBannerRow } from '@/lib/territory/siteConfig';
import { Button } from '@/components/ui/button';

interface Props {
  banner: SiteBannerRow;
}

/**
 * Site-wide marketing strip on /territory. Admin-controlled visibility only (no timer, no dismiss).
 */
export function TerritorySiteBanner({ banner }: Props) {
  if (!banner.bannerEnabled) {
    return null;
  }

  const label = banner.bannerCtaLabel?.trim();
  const url = banner.bannerCtaUrl?.trim();
  const hasCta = Boolean(label && url);

  return (
    <div className="mt-8 rounded-xl bg-brand-gold px-5 py-5 text-brand-navy shadow-md sm:px-6 sm:py-6">
      {banner.bannerHeadline ? (
        <p className="font-headline text-xl sm:text-2xl leading-snug">{banner.bannerHeadline}</p>
      ) : null}
      {banner.bannerDescription ? (
        <p className="mt-2 text-sm sm:text-base text-brand-navy/90 leading-relaxed">
          {banner.bannerDescription}
        </p>
      ) : null}
      {hasCta && url && label ? (
        <div className="mt-4">
          {url.startsWith('/') ? (
            <Button asChild variant="brand" size="sm" className="bg-brand-navy text-white hover:bg-brand-navy/90">
              <Link href={url}>{label}</Link>
            </Button>
          ) : (
            <Button asChild variant="brand" size="sm" className="bg-brand-navy text-white hover:bg-brand-navy/90">
              <a href={url} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
