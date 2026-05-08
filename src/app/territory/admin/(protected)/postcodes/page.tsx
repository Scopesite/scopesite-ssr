import type { Metadata } from 'next';
import Link from 'next/link';
import { listTerritoriesForAdmin } from '@/lib/territory/queries';
import { PostcodesAdminTable } from '@/components/territory/admin/PostcodesAdminTable';

export const metadata: Metadata = {
  title: 'Territory Admin - Postcodes',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{
    q?: string;
    tier?: string;
    promotion?: string;
    offset?: string;
  }>;
}

const PAGE = 200;

export default async function TerritoryAdminPostcodesPage({ searchParams }: Props) {
  const p = await searchParams;
  const q = (p.q || '').trim();
  const tier =
    p.tier === 'standard' || p.tier === 'premium' ? p.tier : ('all' as const);
  const promotion =
    p.promotion === 'active' || p.promotion === 'none' ? p.promotion : ('all' as const);
  const offset = Math.max(parseInt(p.offset || '0', 10) || 0, 0);

  const rows = await listTerritoriesForAdmin({
    q: q || undefined,
    tier,
    promotion,
    limit: PAGE + 1,
    offset,
  });
  const hasMore = rows.length > PAGE;
  const visible = hasMore ? rows.slice(0, PAGE) : rows;

  const buildHref = (patch: Record<string, string | null>) => {
    const sp = new URLSearchParams();
    const base: Record<string, string | null> = {
      q: q || null,
      tier: tier === 'all' ? null : tier,
      promotion: promotion === 'all' ? null : promotion,
      offset: offset ? String(offset) : null,
    };
    const merged = { ...base, ...patch };
    for (const [k, v] of Object.entries(merged)) {
      if (v !== null && v !== undefined && v !== '') sp.set(k, v);
    }
    const qs = sp.toString();
    return qs ? `/territory/admin/postcodes?${qs}` : '/territory/admin/postcodes';
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl text-brand-navy">Postcodes</h1>
        <p className="mt-1 text-sm text-slate-600">
          Edit base pricing, tier, pilot visibility, and postcode-level promotions.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <form method="get" className="flex flex-wrap items-end gap-2">
          <label className="text-sm text-slate-600">
            Search
            <input
              name="q"
              defaultValue={q}
              placeholder="Postcode, town, county"
              className="mt-1 block w-56 rounded-md border border-slate-300 px-3 py-2 text-sm text-brand-navy"
            />
          </label>
          {tier !== 'all' ? <input type="hidden" name="tier" value={tier} /> : null}
          {promotion !== 'all' ? (
            <input type="hidden" name="promotion" value={promotion} />
          ) : null}
          {offset > 0 ? <input type="hidden" name="offset" value={String(offset)} /> : null}
          <button
            type="submit"
            className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90"
          >
            Apply
          </button>
        </form>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-slate-500 py-2">Tier:</span>
          <Link
            href={buildHref({ tier: null, offset: null })}
            className={`rounded-md px-3 py-2 ${tier === 'all' ? 'bg-slate-200 font-medium' : 'text-brand-navy link-navy'}`}
          >
            All
          </Link>
          <Link
            href={buildHref({ tier: 'standard', offset: null })}
            className={`rounded-md px-3 py-2 ${tier === 'standard' ? 'bg-slate-200 font-medium' : 'text-brand-navy link-navy'}`}
          >
            Standard
          </Link>
          <Link
            href={buildHref({ tier: 'premium', offset: null })}
            className={`rounded-md px-3 py-2 ${tier === 'premium' ? 'bg-slate-200 font-medium' : 'text-brand-navy link-navy'}`}
          >
            Premium
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-slate-500 py-2">Promotion:</span>
          <Link
            href={buildHref({ promotion: null, offset: null })}
            className={`rounded-md px-3 py-2 ${promotion === 'all' ? 'bg-slate-200 font-medium' : 'text-brand-navy link-navy'}`}
          >
            All
          </Link>
          <Link
            href={buildHref({ promotion: 'active', offset: null })}
            className={`rounded-md px-3 py-2 ${promotion === 'active' ? 'bg-slate-200 font-medium' : 'text-brand-navy link-navy'}`}
          >
            Active
          </Link>
          <Link
            href={buildHref({ promotion: 'none', offset: null })}
            className={`rounded-md px-3 py-2 ${promotion === 'none' ? 'bg-slate-200 font-medium' : 'text-brand-navy link-navy'}`}
          >
            None
          </Link>
        </div>
      </div>

      <PostcodesAdminTable rows={visible} />

      {hasMore ? (
        <p className="text-sm">
          <Link
            href={buildHref({ offset: String(offset + PAGE) })}
            className="text-brand-navy link-navy font-medium hover:underline"
          >
            Load more
          </Link>
        </p>
      ) : null}
    </div>
  );
}
