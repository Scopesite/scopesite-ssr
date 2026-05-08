import type { Metadata } from 'next';
import { getSiteBannerUncached } from '@/lib/territory/siteConfig';
import { BannerAdminForm } from '@/components/territory/admin/BannerAdminForm';

export const metadata: Metadata = {
  title: 'Territory Admin - Banner',
  robots: { index: false, follow: false },
};

export default async function TerritoryAdminBannerPage() {
  const initial = await getSiteBannerUncached();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl text-brand-navy">Site banner</h1>
        <p className="mt-1 text-sm text-slate-600">
          Promotional strip on the public /territory page (below the hero text, above the postcode
          checker). Independent of postcode-level gold promotions.
        </p>
      </header>
      <BannerAdminForm initial={initial} />
    </div>
  );
}
