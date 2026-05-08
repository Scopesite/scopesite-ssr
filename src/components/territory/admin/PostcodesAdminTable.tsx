'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { AdminPostcodeListRow } from '@/lib/territory/postcodePricing';
import { PromotionCountdown } from '@/components/territory/PromotionCountdown';
import { Button } from '@/components/ui/button';

type Row = AdminPostcodeListRow;

interface Props {
  rows: Row[];
}

function adminPostcodePath(postcode: string, ...segments: string[]) {
  const enc = encodeURIComponent(postcode);
  return `/api/territory/admin/postcodes/${enc}${segments.length ? `/${segments.join('/')}` : ''}`;
}

async function parseJson(res: Response): Promise<{ error?: string }> {
  return (await res.json().catch(() => ({}))) as { error?: string };
}

function ExpiryPreview({ hours }: { hours: number }) {
  const safe = Number.isFinite(hours) && hours >= 1 ? hours : 1;
  const d = new Date(Date.now() + safe * 3600000);
  return (
    <span className="font-medium text-slate-800">
      {d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
    </span>
  );
}

export function PostcodesAdminTable({ rows }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [promoRow, setPromoRow] = useState<Row | null>(null);
  const [promoHours, setPromoHours] = useState(24);
  const [copyRow, setCopyRow] = useState<Row | null>(null);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const onSaveRow = async (row: Row, form: HTMLFormElement) => {
    setMessage(null);
    setBusyKey(`save-${row.postcode}`);
    const fd = new FormData(form);
    const monthlyRaw = String(fd.get('monthly') ?? '').trim();
    const setupRaw = String(fd.get('setup') ?? '').trim();
    const tier = String(fd.get('tier') ?? row.tier) as 'standard' | 'premium';
    const isActive = fd.get('is_active') === 'on';

    const monthlyPriceGbp = Number(monthlyRaw);
    if (!Number.isFinite(monthlyPriceGbp) || monthlyPriceGbp <= 0) {
      setMessage({ kind: 'err', text: 'Monthly price must be a positive number.' });
      setBusyKey(null);
      return;
    }
    let setupFeeGbp: number | null = null;
    if (setupRaw !== '') {
      const n = Number(setupRaw);
      if (!Number.isFinite(n) || n < 0) {
        setMessage({ kind: 'err', text: 'Setup fee must be empty or a non-negative number.' });
        setBusyKey(null);
        return;
      }
      setupFeeGbp = n;
    }

    try {
      const [rPrice, rTier, rActive] = await Promise.all([
        fetch(adminPostcodePath(row.postcode, 'price'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ monthlyPriceGbp, setupFeeGbp }),
        }),
        fetch(adminPostcodePath(row.postcode, 'tier'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier }),
        }),
        fetch(adminPostcodePath(row.postcode, 'active'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive }),
        }),
      ]);
      if (!rPrice.ok) {
        const j = await parseJson(rPrice);
        throw new Error(j.error || 'Price update failed');
      }
      if (!rTier.ok) {
        const j = await parseJson(rTier);
        throw new Error(j.error || 'Tier update failed');
      }
      if (!rActive.ok) {
        const j = await parseJson(rActive);
        throw new Error(j.error || 'Active toggle failed');
      }
      setMessage({ kind: 'ok', text: `Saved ${row.postcode}.` });
      refresh();
    } catch (e) {
      setMessage({
        kind: 'err',
        text: e instanceof Error ? e.message : 'Save failed.',
      });
    } finally {
      setBusyKey(null);
    }
  };

  const onCancelPromo = async (row: Row) => {
    setMessage(null);
    setBusyKey(`cancel-${row.postcode}`);
    try {
      const res = await fetch(adminPostcodePath(row.postcode, 'promotion', 'cancel'), {
        method: 'POST',
      });
      const j = await parseJson(res);
      if (!res.ok) throw new Error(j.error || 'Cancel failed');
      setMessage({ kind: 'ok', text: `Cancelled promotion for ${row.postcode}.` });
      refresh();
    } catch (e) {
      setMessage({
        kind: 'err',
        text: e instanceof Error ? e.message : 'Cancel failed.',
      });
    } finally {
      setBusyKey(null);
    }
  };

  const onStartPromo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!promoRow) return;
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    const promotionalMonthlyPriceGbp = Number(String(fd.get('promo_monthly')));
    const promoSetupRaw = String(fd.get('promo_setup') ?? '').trim();
    const promotionalSetupFeeGbp = promoSetupRaw === '' ? null : Number(promoSetupRaw);
    const durationHours = promoHours;
    const headline = String(fd.get('headline') ?? '');
    const description = String(fd.get('description') ?? '');

    if (!Number.isFinite(promotionalMonthlyPriceGbp) || promotionalMonthlyPriceGbp <= 0) {
      setMessage({ kind: 'err', text: 'Promotional monthly price must be a positive number.' });
      return;
    }
    if (
      promotionalSetupFeeGbp !== null &&
      (!Number.isFinite(promotionalSetupFeeGbp) || promotionalSetupFeeGbp < 0)
    ) {
      setMessage({ kind: 'err', text: 'Promotional setup fee must be empty or non-negative.' });
      return;
    }
    if (!Number.isFinite(durationHours) || durationHours < 1) {
      setMessage({ kind: 'err', text: 'Duration must be a whole number of hours (at least 1).' });
      return;
    }
    if (headline.length > 80) {
      setMessage({ kind: 'err', text: 'Headline max 80 characters.' });
      return;
    }
    if (description.length > 280) {
      setMessage({ kind: 'err', text: 'Description max 280 characters.' });
      return;
    }

    setBusyKey(`promo-${promoRow.postcode}`);
    try {
      const res = await fetch(adminPostcodePath(promoRow.postcode, 'promotion', 'start'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promotionalMonthlyPriceGbp,
          promotionalSetupFeeGbp,
          durationHours,
          headline,
          description,
        }),
      });
      const j = await parseJson(res);
      if (!res.ok) throw new Error(j.error || 'Start promotion failed');
      setMessage({ kind: 'ok', text: `Promotion started for ${promoRow.postcode}.` });
      setPromoRow(null);
      refresh();
    } catch (err) {
      setMessage({
        kind: 'err',
        text: err instanceof Error ? err.message : 'Start promotion failed.',
      });
    } finally {
      setBusyKey(null);
    }
  };

  const onSaveCopy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!copyRow?.active_promotion_id) return;
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    const headline = String(fd.get('headline') ?? '');
    const description = String(fd.get('description') ?? '');
    setBusyKey(`copy-${copyRow.active_promotion_id}`);
    try {
      const res = await fetch(
        `/api/territory/admin/promotions/${encodeURIComponent(copyRow.active_promotion_id)}/copy`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ headline: headline || null, description: description || null }),
        },
      );
      const j = await parseJson(res);
      if (!res.ok) throw new Error(j.error || 'Copy update failed');
      setMessage({ kind: 'ok', text: 'Promotion copy updated.' });
      setCopyRow(null);
      refresh();
    } catch (err) {
      setMessage({
        kind: 'err',
        text: err instanceof Error ? err.message : 'Copy update failed.',
      });
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-4">
      {message ? (
        <p
          className={
            message.kind === 'ok'
              ? 'text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2'
              : 'text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2'
          }
        >
          {message.text}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-[1280px] w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Postcode</th>
              <th className="px-3 py-2 font-medium">Town / county</th>
              <th className="px-3 py-2 font-medium">Tier</th>
              <th className="px-3 py-2 font-medium">Monthly £</th>
              <th className="px-3 py-2 font-medium">Setup £</th>
              <th className="px-3 py-2 font-medium">Live shown</th>
              <th className="px-3 py-2 font-medium">Active</th>
              <th className="px-3 py-2 font-medium">Promotion</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const busy =
                busyKey === `save-${row.postcode}` ||
                busyKey === `cancel-${row.postcode}` ||
                busyKey === `promo-${row.postcode}`;
              const monthlyStr =
                row.monthly_price_gbp == null ? '' : String(row.monthly_price_gbp);
              const setupStr = row.setup_fee_gbp == null ? '' : String(row.setup_fee_gbp);
              return (
                <tr key={row.id} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-3 font-mono font-semibold text-brand-navy whitespace-nowrap">
                    {row.postcode}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    <div>{row.town_name ?? '—'}</div>
                    <div className="text-xs text-slate-500">{row.county ?? ''}</div>
                  </td>
                  <td className="px-3 py-3" colSpan={7}>
                    <form
                      className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end"
                      onSubmit={(ev) => {
                        ev.preventDefault();
                        void onSaveRow(row, ev.currentTarget);
                      }}
                    >
                      <label className="flex flex-col gap-1 text-xs text-slate-600">
                        Tier
                        <select
                          name="tier"
                          defaultValue={row.tier}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-brand-navy min-w-[8rem]"
                        >
                          <option value="standard">Standard</option>
                          <option value="premium">Premium</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-1 text-xs text-slate-600">
                        Monthly £
                        <input
                          name="monthly"
                          type="number"
                          step="0.01"
                          min="0.01"
                          defaultValue={monthlyStr}
                          className="w-28 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                          required
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs text-slate-600">
                        Setup £
                        <input
                          name="setup"
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={setupStr}
                          placeholder="optional"
                          className="w-28 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                        />
                      </label>
                      <div className="flex flex-col gap-1 text-xs text-slate-600">
                        <span>Live shown</span>
                        <div className="w-32 rounded-md border border-dashed border-slate-200 bg-slate-50 px-2 py-1.5 text-sm min-h-[2.5rem] flex flex-col justify-center leading-tight">
                          {row.has_active_promotion && row.promotion_expires_at ? (
                            <>
                              <span className="font-bold text-brand-gold-accessible">
                                £{row.liveDisplayedMonthlyGbp.toFixed(0)}/mo
                              </span>
                              {row.monthly_price_gbp != null ? (
                                <span className="text-[11px] text-slate-500 line-through">
                                  £{row.monthly_price_gbp.toFixed(0)}/mo
                                </span>
                              ) : null}
                              <span className="text-[11px] text-slate-500 mt-1 tabular-nums">
                                Ends in{' '}
                                <PromotionCountdown
                                  expiresAt={row.promotion_expires_at}
                                  onExpired={refresh}
                                />
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-800">
                              £{row.liveDisplayedMonthlyGbp.toFixed(0)}/mo
                            </span>
                          )}
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-slate-600 lg:pb-2">
                        <input
                          name="is_active"
                          type="checkbox"
                          defaultChecked={row.is_active}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        Active
                      </label>
                      <div className="flex flex-1 flex-col gap-2 lg:min-w-[260px] lg:items-end">
                        <div className="flex w-full flex-col gap-2 lg:items-end">
                          {row.has_active_promotion &&
                          row.promotional_monthly_price_gbp != null &&
                          row.origin_monthly_price_gbp != null ? (
                            <div className="flex w-full flex-col gap-1 lg:items-end">
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                                  Live
                                </span>
                                <span className="text-sm font-semibold text-brand-navy">
                                  £{row.promotional_monthly_price_gbp.toFixed(0)}/mo{' '}
                                  <span className="font-normal text-slate-600">
                                    (was £{row.origin_monthly_price_gbp.toFixed(0)})
                                  </span>
                                </span>
                              </div>
                              {row.promotion_expires_at ? (
                                <p className="text-right text-xs text-slate-500">
                                  Expires in{' '}
                                  <PromotionCountdown
                                    expiresAt={row.promotion_expires_at}
                                    onExpired={refresh}
                                  />
                                </p>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-right text-xs text-slate-500">No promotion</span>
                          )}
                        </div>
                        <div className="flex w-full flex-wrap items-center justify-end gap-2">
                          {row.has_active_promotion ? (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!!busyKey}
                                onClick={() => setCopyRow(row)}
                              >
                                Edit copy
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={busyKey === `cancel-${row.postcode}`}
                                onClick={() => void onCancelPromo(row)}
                              >
                                Cancel promotion
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={!!busyKey}
                              onClick={() => {
                                setPromoHours(24);
                                setPromoRow(row);
                              }}
                            >
                              Start promotion
                            </Button>
                          )}
                          <Button type="submit" variant="brand" size="sm" disabled={busy}>
                            Save row
                          </Button>
                        </div>
                      </div>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {promoRow ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPromoRow(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
            <h3 className="font-headline text-lg text-brand-navy">Start promotion</h3>
            <p className="mt-1 text-sm text-slate-600 font-mono">{promoRow.postcode}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <dt className="text-slate-500">Tier</dt>
              <dd>{promoRow.tier}</dd>
              <dt className="text-slate-500">Base monthly</dt>
              <dd>£{promoRow.monthly_price_gbp ?? '—'}</dd>
              <dt className="text-slate-500">Base setup</dt>
              <dd>{promoRow.setup_fee_gbp != null ? `£${promoRow.setup_fee_gbp}` : '—'}</dd>
            </dl>
            <form className="mt-4 space-y-3" onSubmit={onStartPromo}>
              <label className="block text-sm">
                <span className="text-slate-600">Promotional monthly £ (must be below base)</span>
                <input
                  name="promo_monthly"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Promotional setup £ (optional)</span>
                <input
                  name="promo_setup"
                  type="number"
                  step="0.01"
                  min="0"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Duration (whole hours)</span>
                <input
                  name="duration_hours"
                  type="number"
                  min={1}
                  step={1}
                  value={promoHours}
                  onChange={(ev) =>
                    setPromoHours(Math.max(1, Math.floor(Number(ev.target.value) || 1)))
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                  required
                />
              </label>
              <p className="text-xs text-slate-600">
                Approximate expiry in your local timezone: <ExpiryPreview hours={promoHours} />
              </p>
              <label className="block text-sm">
                <span className="text-slate-600">Headline (max 80)</span>
                <input
                  name="headline"
                  maxLength={80}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Description (max 280)</span>
                <textarea
                  name="description"
                  maxLength={280}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setPromoRow(null)}>
                  Close
                </Button>
                <Button type="submit" variant="brand" disabled={!!busyKey}>
                  Start
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {copyRow?.active_promotion_id ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCopyRow(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
            <h3 className="font-headline text-lg text-brand-navy">Edit promotion copy</h3>
            <p className="mt-1 text-xs font-mono text-slate-500 break-all">
              {copyRow.active_promotion_id}
            </p>
            <form className="mt-4 space-y-3" onSubmit={onSaveCopy}>
              <label className="block text-sm">
                <span className="text-slate-600">Headline (max 80)</span>
                <input
                  name="headline"
                  maxLength={80}
                  defaultValue={copyRow.promotion_headline ?? ''}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Description (max 280)</span>
                <textarea
                  name="description"
                  maxLength={280}
                  rows={4}
                  defaultValue={copyRow.promotion_description ?? ''}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setCopyRow(null)}>
                  Close
                </Button>
                <Button type="submit" variant="brand" disabled={!!busyKey}>
                  Save copy
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
