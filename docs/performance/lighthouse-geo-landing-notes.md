# Lighthouse geo landing notes (`/web-design-bristol`)

Derived from Apr 30 2026 Lighthouse 13 report context and repository analysis (not a live DevTools capture).

## LCP element (capture-lcp-element)

**Expected LCP candidate:** text inside the hero **`<h1>`** in [`LandingHero`](../../src/components/landing/LandingHero.tsx)—either the gold `headlineHighlight` span or the following headline line—not a bitmap/video.

**Reasoning:**

- Geo landing pages render [`LandingHero`](../../src/components/landing/LandingHero.tsx) without an above-the-fold hero image; the hero is typography-led.
- `/web-design-bristol` uses static headline copy (`useTypewriter` defaults false); no progressive typing delaying paint for LCP text.
- On **mobile**, the badge renders above the `h1`; the largest paint in the first view is still typically the **headline block** (multi-line, largest font size via `font-headline` / responsive text classes).

**Validate in lab:** In Lighthouse or Performance → **LCP node** / **LCP breakdown**, confirm the DOM node is an `h1` or inner text node (not `img` or background).

---

## Forced reflow — likely sources (map-forced-reflow)

Lighthouse attributed ~44 ms forced layout to a hashed main chunk (`0_6x97f80800_.js` in the cited run). That bundle aggregates **React hydration**, **Next client runtime**, **layout island code**, and **route-specific clients**.

| Area | Role | Files / notes |
|------|------|----------------|
| **Motion** | `useInView` uses IntersectionObserver; animating `opacity`/`transform` is compositor-friendly but hook setup runs during hydration of client trees. | [`FadeInOnScroll.tsx`](../../src/components/animations/FadeInOnScroll.tsx), other `motion/react` usage |
| **Marketing** | [`BrevoTracker`](../../src/components/BrevoTracker.tsx) runs two `beforeInteractive` scripts in `<head>`; competes with early layout/paint. | Root [`layout.tsx`](../../src/app/layout.tsx) |
| **Hydration** | React commit phase measuring DOM after paint can trigger layout when combined with style reads in dependencies. | Framework + shared layout clients |

**Next step in Chrome:** Record a **Performance** trace on production (source maps on), filter **Layout / Recalculate style**, map stack frames to source (motion vs `BrevoTracker` vs React).

---

## Bundle analysis (bundle-analyze-followup)

Run locally:

```bash
npm run analyze
```

Inspect the generated client report for:

1. The **polyfill / legacy baseline** slice (Lighthouse: `0kalpynn_yyw2.js`-style chunk names change each build).
2. The **largest route + shared** chunk corresponding to unused-JS diagnostics (`0_6x97f80800_.js`-style).

Notes from automated CI-mode builds are appended below when generated.

---

## Automated bundle-analyze output

**When:** local run after `next build` with **webpack** (required for `@next/bundle-analyzer` on Next 16; default `next build` uses **Turbopack** and does **not** emit the report — see `npm run analyze` in [package.json](../../package.json), which passes `--webpack`).

**HTML reports (open in browser):**

- `.next/analyze/client.html` — client bundle treemap
- `.next/analyze/nodejs.html` — may show “No bundles were parsed” (known analyzer quirk for some server graphs)
- `.next/analyze/edge.html` — edge bundle

**Polyfill / “legacy JS” chunk (hashes change per build):**

From `.next/build-manifest.json` field `polyfillFiles` after a webpack production build:

- **`polyfills-42372ed130431b0a.js`** — Next-emitted **Baseline polyfills** bundle (maps conceptually to Lighthouse `0kalpynn_yyw2.js`-style fingerprint on Vercel; hashed names differ per deployment).

**Main client bootstrap (`rootMainFiles` in same manifest):**

- `webpack-76476516f4a5add4.js`
- `4bd1b696-df4c0fb946159b6a.js`
- `3794-2978b2c1d998a425.js`
- `main-app-dda2701a97e4f176.js`

Together these correspond to the large **shared + runtime** slice Lighthouse labels under hashed names like `0_6x97f80800_.js` in production.

**Turbopack alternative:** `next experimental-analyze` (see Next.js bundling guide) for webpack-free workflows.

---

## Homepage mobile lab checklist (`/`)

After deploying viewport-aware analytics ([`DeferredViewportAnalytics.tsx`](../../src/components/DeferredViewportAnalytics.tsx)), **`(&lt;768px)`**:

- Ahrefs: **`lazyOnload`** (desktop: **`afterInteractive`** via `useLayoutEffect`).
- Vercel Speed Insights: mount after **`requestIdleCallback`** (fallback `setTimeout` ~200 ms), desktop mounts before paint as before.

**Validation protocol:** Moto G Power (or equivalent), Slow 4G, single navigation, **median of 3–5 runs** on production `/`. Record **Performance score**, **TBT**, **long tasks**, and **FCP/LCP** — not only the headline number.

**Brevo** ([`BrevoTracker.tsx`](../../src/components/BrevoTracker.tsx)): `beforeInteractive` email bootstrap + init unchanged; **SDK loader** uses `lazyOnload` on mobile, `afterInteractive` on desktop. Re-test Brevo email-link flows if attribution looks off.

### Font fallbacks

Root layout enables **`adjustFontFallback: true`** for **Paytone One** and **Inter** (`next/font/google`) to reduce layout shift and LCP text render delay from font swap.

