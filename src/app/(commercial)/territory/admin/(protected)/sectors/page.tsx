import type { Metadata } from 'next';
import { listSectorsForAdmin, type AdminSectorRow } from '@/lib/territory/queries';
import { SectorsAdminGrid } from '@/components/territory/admin/SectorsAdminGrid';

export const metadata: Metadata = {
  title: 'Territory Admin - Sectors',
  robots: { index: false, follow: false },
};

export default async function TerritoryAdminSectorsPage() {
  const rows = await listSectorsForAdmin();
  const grouped = rows.reduce<Record<string, AdminSectorRow[]>>((acc, r) => {
    const c = r.category?.trim() || 'Other';
    if (!acc[c]) acc[c] = [];
    acc[c].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl text-brand-navy">Sectors</h1>
        <p className="mt-1 text-sm text-slate-600">
          Toggle which sectors appear on the public map and browse lists. You cannot deactivate a
          sector while it still has pending or claimed seats.
        </p>
      </header>
      <SectorsAdminGrid grouped={grouped} />
    </div>
  );
}
