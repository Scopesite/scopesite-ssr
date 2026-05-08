'use client';

import { useCallback, useState } from 'react';
import type { SiteBannerRow } from '@/lib/territory/siteConfig';
import { Button } from '@/components/ui/button';

type BannerJson = {
  bannerEnabled: boolean;
  bannerHeadline: string | null;
  bannerDescription: string | null;
  bannerCtaLabel: string | null;
  bannerCtaUrl: string | null;
};

interface Props {
  initial: SiteBannerRow;
}

export function BannerAdminForm({ initial }: Props) {
  const [enabled, setEnabled] = useState(initial.bannerEnabled);
  const [headline, setHeadline] = useState(initial.bannerHeadline ?? '');
  const [description, setDescription] = useState(initial.bannerDescription ?? '');
  const [ctaLabel, setCtaLabel] = useState(initial.bannerCtaLabel ?? '');
  const [ctaUrl, setCtaUrl] = useState(initial.bannerCtaUrl ?? '');
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const preview: BannerJson = {
    bannerEnabled: enabled,
    bannerHeadline: headline.trim() || null,
    bannerDescription: description.trim() || null,
    bannerCtaLabel: ctaLabel.trim() || null,
    bannerCtaUrl: ctaUrl.trim() || null,
  };

  const onSave = useCallback(async () => {
    setMessage(null);
    setBusy(true);
    try {
      const res = await fetch('/api/territory/admin/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bannerEnabled: enabled,
          bannerHeadline: headline.trim() || null,
          bannerDescription: description.trim() || null,
          bannerCtaLabel: ctaLabel.trim() || null,
          bannerCtaUrl: ctaUrl.trim() || null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Save failed');
      }
      setMessage({ kind: 'ok', text: 'Banner saved. Public site updates within about a minute.' });
    } catch (e) {
      setMessage({
        kind: 'err',
        text: e instanceof Error ? e.message : 'Save failed.',
      });
    } finally {
      setBusy(false);
    }
  }, [enabled, headline, description, ctaLabel, ctaUrl]);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-headline text-lg text-brand-navy">Editor</h2>
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

        <label className="flex items-center gap-3 text-sm text-brand-navy">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Banner visible on public /territory
        </label>

        <div>
          <label className="block text-sm font-medium text-slate-700">Headline (max 100)</label>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value.slice(0, 100))}
            maxLength={100}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Description (max 280)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 280))}
            maxLength={280}
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">CTA label (max 30)</label>
          <input
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value.slice(0, 30))}
            maxLength={30}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">CTA URL</label>
          <input
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            type="url"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="https://…"
          />
          <p className="mt-1 text-xs text-slate-500">Leave blank with no CTA button. Must be http(s).</p>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="brand" onClick={() => void onSave()} disabled={busy}>
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-headline text-lg text-brand-navy">Live preview</h2>
        <p className="text-sm text-slate-600">
          Matches the public banner when enabled. Timer and dismiss controls are not shown on the
          live site.
        </p>
        <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
          <TerritorySiteBannerPreview banner={preview} />
        </div>
      </div>
    </div>
  );
}

function TerritorySiteBannerPreview({ banner }: { banner: BannerJson }) {
  if (!banner.bannerEnabled) {
    return (
      <p className="text-sm text-slate-500 italic py-4 text-center">Banner hidden (toggle on to preview)</p>
    );
  }
  const hasCta = Boolean(banner.bannerCtaLabel?.trim() && banner.bannerCtaUrl?.trim());
  return (
    <div className="rounded-xl bg-brand-gold px-5 py-5 text-brand-navy shadow-inner">
      {banner.bannerHeadline ? (
        <p className="font-headline text-xl sm:text-2xl leading-snug">{banner.bannerHeadline}</p>
      ) : (
        <p className="font-headline text-xl text-brand-navy/60">Headline</p>
      )}
      {banner.bannerDescription ? (
        <p className="mt-2 text-sm sm:text-base text-brand-navy/90 leading-relaxed">
          {banner.bannerDescription}
        </p>
      ) : (
        <p className="mt-2 text-sm text-brand-navy/50 italic">Description (optional)</p>
      )}
      {hasCta ? (
        <div className="mt-4">
          <span className="inline-flex rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white">
            {banner.bannerCtaLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
