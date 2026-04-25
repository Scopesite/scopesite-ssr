# ScopeSite Pricing Audit

Generated: 2026-04-23
Source: Read-only scan of `scopesite-ssr` codebase (no files modified).
Scope: Every hardcoded GBP/USD price, every multiplier/markup, every
discount rule, every promo code and every price string in schema/metadata.

All line numbers are 1-based. Where the same number appears in several
places the primary source-of-truth file is cited first.

---

## 1. Website Builds

### 1a. Client-Managed Website (Wix Studio) — GBP

- **Source of truth:** `src/lib/pricing-config.ts:77-81`
- **Tiered, not single base price:**
  - `starter` (up to 5 pages): **£1,875** (`src/lib/pricing-config.ts:78`)
  - `professional` (up to 10 pages): **£4,125** (`src/lib/pricing-config.ts:79`)
  - `enterprise` (unlimited): **£7,500** (`src/lib/pricing-config.ts:80`)
- Per-additional-page rate beyond the tier: **£150** (`src/lib/pricing-config.ts:104`)
- Tier selection from page count: `getPackageForPageCount()` in `src/lib/pricing-config.ts:541-545`.
- Additional-page calculation: `getAdditionalPages()` in `src/lib/pricing-config.ts:550-554`.
- **What's included** (all three tiers): `src/lib/pricing-config.ts:399-432`.
  - Starter: 5 pages, mobile responsive, contact form, basic SEO,
    GA4, social, Wix CMS access, 1 month free support.
  - Professional: Everything in Starter + animations, blog/CMS,
    e-commerce up to 50 products, advanced SEO, up to 3 integrations,
    CMS training, 3 months free support.
  - Enterprise: Everything in Professional + unlimited pages, unlimited
    integrations, e-commerce up to 700 products, AI chatbot, 4x SEO
    blog posts/month, custom graphics, priority support, 6 months
    free support.

### 1b. SSR AI-First Website (Next.js) — GBP

- **Source of truth:** `src/lib/pricing-config.ts:92-97`
- **Not tiered — base + per-page:**
  - `base` (up to 5 pages): **£8,000** (`src/lib/pricing-config.ts:93`)
  - Pages 6-10: **+£500** each (`src/lib/pricing-config.ts:94`)
  - Pages 11-20: **+£400** each (`src/lib/pricing-config.ts:95`)
  - Pages 21+: **+£350** each (`src/lib/pricing-config.ts:96`)
- Calculation function: `calculateSSRPrice()` in `src/lib/pricing-config.ts:510-536`.
- **What's included** (SSR base): `src/lib/pricing-config.ts:383-394`.
  - V.O.I.C.E. AI Visibility (described as "worth £562/mo"), SSR on
    Next.js 16, Ghost CMS, auto-generated JSON-LD, Vercel Edge,
    100/100 Lighthouse, mobile-first, basic SEO, SSL, 30 days
    post-launch support.

### 1c. Website Upgrade — GBP

- **Code path branches on project type in the quote calculator:** `src/lib/calculate-quote.ts:214-233`
- **Discount multiplier:** `0.6` (i.e. **40% off**) applied via:

  ```ts
  const upgradeMultiplier = request.projectType === 'upgrade' ? 0.6 : 1;
  // src/lib/calculate-quote.ts:222
  ```
- **What the 40% applies to:** ONLY the **Client-Managed (Wix) base
  package + additional-pages line**. Applied in `src/lib/calculate-quote.ts:229`
  (base: `Math.round(basePrice * upgradeMultiplier)`) and
  `src/lib/calculate-quote.ts:242` (additional pages:
  `Math.round(additionalPagesPrice * upgradeMultiplier)`).
- **NOT applied to:** e-commerce, web-app, complex-forms, automation,
  add-ons (V.O.I.C.E, branding, research, video, image library), or
  any SSR upgrade path.
- Upgrade target type selector: `upgradeTargetType: 'clientManaged' | 'ssr'`
  (`src/types/pricing.ts:144`), with user-facing copy "The 40% discount
  applies to your chosen type." (`src/components/pricing/QuoteCalculator.tsx:1078`).
  **See Section 9 discrepancy #1 — the SSR upgrade branch does NOT
  apply the 40% discount in code.**
- Upgrade UI description: "Modernize your existing site with new
  features and design (40% discount)" (`src/components/pricing/QuoteCalculator.tsx:964`
  and `src/lib/pricing-config.ts:301`).

### 1d. Custom Web App — GBP

- **Pricing model:** tiered, not hourly. Two parallel tables depending on whether it's built on Wix or SSR.
- **Client-Managed (Wix) web apps** (`src/lib/pricing-config.ts:134-138`):
  - `simple` (calculator, booking widget, qualifier): **£2,625**
  - `standard` (client portal, dashboard, tracker): **£5,625**
  - `complex` (multi-user, API, custom workflows): **£9,375**
- **SSR web apps** (`src/lib/pricing-config.ts:143-146`):
  - `simple` (dashboard, forms): **£5,000**
  - `complex` (portal, integrations): **£12,000**
- Standalone "webapp" project type is routed through `simple`/`standard`/`complex` of the Wix table (`src/lib/calculate-quote.ts:313-326`).
- **What's included:** `src/lib/pricing-config.ts:451-483` (bullet lists per tier).

### 1e. Headless E-commerce (SSR only) — GBP

- `src/lib/pricing-config.ts:122-126`
- `shopify`: **£7,500** (description note: "Excludes Shopify subscription fees" — `src/lib/calculate-quote.ts:77`)
- `snipcart`: **£5,500**
- `custom`: **£12,000**

### 1f. E-commerce (Wix Client-Managed) — GBP

- `src/lib/pricing-config.ts:112-116`
- `small` (up to 50 products): **£6,375**
- `medium` (51-200): **£9,000**
- `large` (200+): **£13,500**

---

## 2. V.O.I.C.E. AI Visibility

- **Monthly rate:** **£562/mo**
  - Primary source of truth: `src/lib/pricing-config.ts:158` (`voice: 562`)
  - Displayed in UI: `src/components/pricing/QuoteCalculator.tsx:1798` via `PRICING_CONFIG.addOns.voice`.
  - Referenced in SSR "included" bullet: `src/lib/pricing-config.ts:384` ("worth £562/mo").
  - Referenced in calculate-quote "Included with SSR (worth £562/mo)": `src/lib/calculate-quote.ts:341`.
  - Referenced in recommended-badge UI: `src/components/pricing/QuoteCalculator.tsx:954` ("Includes V.O.I.C.E™ AI Visibility (worth £562/mo)").

- **UK average comparison figure:** **£750/mo** (HARDCODED, not calculated).
  - `src/lib/pricing-config.ts:37` (`aeoGeoMonthly: 750` in `UK_MARKET_AVERAGES`).
  - Rendered as a struck-through line in the quote calculator: `src/components/pricing/QuoteCalculator.tsx:1801` (`UK avg: {formatCurrency(750)}/mo`).
  - Savings line: "Save {formatCurrency(750 - PRICING_CONFIG.addOns.voice)}/mo" — `src/components/pricing/QuoteCalculator.tsx:1804`. Evaluates to £188/mo saved.
  - Also referenced via the `getMarketAverage` mapping (`src/lib/calculate-quote.ts:586`, mapping `voice` → `aeoGeoMonthly` → 750).
  - Hardcoded NUMBER 750 also appears standalone at `src/components/pricing/QuoteCalculator.tsx:1801` and 1804 — this is a second, redundant hardcoded 750 that is NOT read from `UK_MARKET_AVERAGES`.

- **Commitment length options:** **NOT FOUND IN CODEBASE.**
  - The quote wizard exposes V.O.I.C.E only as a monthly `isMonthly: true` line item (`src/lib/calculate-quote.ts:357`). It flows through the generic contract payment plans (6/12/24/36 months) as part of `monthlySubtotal`, which is added on top of the build monthly and kept in the "ongoing after" line (`src/lib/calculate-quote.ts:438-453`).
  - There is no V.O.I.C.E-specific contract length or lock-in defined anywhere in UK pricing code.

- **Setup fee:** **NOT FOUND IN CODEBASE.**
- **Minimum commitment length:** **NOT FOUND IN CODEBASE.**
- **Notice period:** **NOT FOUND IN CODEBASE.** (The US variant says "3-month minimum, then 30 days written notice" at `src/app/us/pricing/page.tsx:24` and `src/app/us/pricing/layout.tsx:24` — but this is US-only copy, not the UK product.)

- **Included in retainer** (display only, from `VOICE_FEATURES`): `src/lib/pricing-config.ts:437-446`.
  - AEO, GEO, traditional SEO foundations, schema markup, ChatGPT/Claude visibility, voice search, monthly AI visibility reporting, competitor AI monitoring.

- **V.O.I.C.E. page public copy** (FAQ) refers to a **£495** "full implementation package":
  - `src/app/voice/page.tsx:154`: *"Full implementation packages start from £495. Monthly ongoing optimisation is available from £562/month."*
  - `src/app/voice/layout.tsx:97`: same string.
  - **£495 is NOT defined anywhere else in the codebase** — see Section 9 discrepancy #3.

- **Free V.O.I.C.E. scan** (JSON-LD):
  - `src/lib/schema.ts:499-503`: `price: '0', priceCurrency: 'GBP', name: 'Free AI Visibility Scan'`.
  - Organisation OfferCatalog (`src/lib/schema.ts:242`): `price: '0.58'` per scan — described as "AI visibility scan from £0.58 per scan. No subscription. Credits never expire." (`src/lib/schema.ts:246`). **Two conflicting V.O.I.C.E scan prices in JSON-LD: £0 and £0.58.**

---

## 3. Payment Plans

### 3a. Pay in Full (one-off)

- Discount multiplier: `0.95` (i.e. **5% off**). `src/lib/pricing-config.ts:254`.
- Applied to: `oneOffSubtotal` ONLY, i.e. every one-off line item combined (build + all add-ons that are not monthly). Monthly services (V.O.I.C.E, automation-monthly, short-form video) are NOT discounted — they just carry on at their monthly rate. See `src/lib/calculate-quote.ts:432-433`:

  ```ts
  const oneOffDiscount = oneOffSubtotal * (1 - PRICING_CONFIG.contracts.oneOff.discount);
  const oneOffFinal = oneOffSubtotal * PRICING_CONFIG.contracts.oneOff.discount;
  ```
- UI label: "Pay in Full (5% OFF):" (`src/components/pricing/QuoteCalculator.tsx:717, 1925`).
- Human-readable description label: `'Pay in Full (5% discount)'` — `src/lib/pricing-config.ts:371`.

### 3b. 6-Month Contract

- Markup: `1.03` (**3% markup** on the build). `src/lib/pricing-config.ts:257`.
- Ongoing after: **£125/mo**. `src/lib/pricing-config.ts:258`.
- Monthly math (during contract): `src/lib/calculate-quote.ts:436-438`:

  ```ts
  const sixTotal = oneOffSubtotal * 1.03;
  const sixMonthly = Math.round((sixTotal / 6) + monthlySubtotal);
  const sixOngoing = 125 + monthlySubtotal;
  ```
- Build portion displayed: `buildMonthly = planData.monthly - breakdown.monthlySubtotal` and `buildTotal = buildMonthly * months` (`src/components/pricing/QuoteCalculator.tsx:744-746`).
- SSR minimum monthly: **£1,200/mo** (`src/lib/pricing-config.ts:279`, enforced at `src/lib/calculate-quote.ts:472`).
- No payment-plan badge on this option in the UI (`src/components/pricing/QuoteCalculator.tsx:1926`).

### 3c. 12-Month Contract

- Markup: `1.06` (**6% markup**). `src/lib/pricing-config.ts:261`.
- Ongoing after: **£95/mo**. `src/lib/pricing-config.ts:262`.
- Monthly math: `src/lib/calculate-quote.ts:441-443`.
- SSR minimum monthly: **£750/mo** (`src/lib/pricing-config.ts:280`, enforced at `src/lib/calculate-quote.ts:477`).
- UI badge: **"MOST POPULAR"** (`src/components/pricing/QuoteCalculator.tsx:1927`, styled gold-on-navy at `src/components/pricing/QuoteCalculator.tsx:1980-1982`).

### 3d. 24-Month Contract

- Markup: `1.12` (**12% markup**). `src/lib/pricing-config.ts:265`.
- Ongoing after: **£75/mo**. `src/lib/pricing-config.ts:266`.
- Monthly math: `src/lib/calculate-quote.ts:446-448`.
- SSR minimum monthly: **£400/mo** (`src/lib/pricing-config.ts:281`, enforced at `src/lib/calculate-quote.ts:482`).
- UI badge: **"Best Value"** + reassurance line "Lock in today's prices — no increases during your term" (`src/components/pricing/QuoteCalculator.tsx:1928`).

### 3e. 36-Month Contract (in code, not in UI)

- Markup: `1.18` (**18% markup**). `src/lib/pricing-config.ts:269`.
- Ongoing after: **£65/mo**. `src/lib/pricing-config.ts:270`.
- Monthly math: `src/lib/calculate-quote.ts:451-453`.
- SSR minimum monthly: **£300/mo** (`src/lib/pricing-config.ts:282`).
- **This option is implemented end-to-end in the pricing engine but is NOT offered in the UI** (`src/components/pricing/QuoteCalculator.tsx:1924-1929` options array stops at `twentyFour`). See Section 9 discrepancy #7.

### 3f. Badge assignment rules

- Defined by the `options` array at `src/components/pricing/QuoteCalculator.tsx:1924-1929`:
  - `oneOff` → `'5% OFF'`
  - `six` → no badge
  - `twelve` → `'MOST POPULAR'`
  - `twentyFour` → `'Best Value'`
- Style rule: `option.badge === 'MOST POPULAR' ? "bg-brand-gold text-brand-navy" : "bg-brand-navy text-white"` (`src/components/pricing/QuoteCalculator.tsx:1980-1982`). Every other badge uses the navy style.

---

## 4. Bundle Logic (V.O.I.C.E + Website build)

- **V.O.I.C.E is INCLUDED FREE with SSR:** `src/lib/calculate-quote.ts:333-348`.
  - `isSSRProject = projectType === 'ssr' || (projectType === 'upgrade' && upgradeTargetType === 'ssr')`.
  - When `isSSRProject` is true, V.O.I.C.E is pushed to `includedItems` with `unitPrice: 0, total: 0, isIncluded: true`. It is NOT added to `monthlyItems`, so it does not inflate `monthlySubtotal`.
- **V.O.I.C.E is a paid £562/mo ADD-ON for:**
  - Client-Managed (Wix) projects (`request.addOns.voice === true`),
  - Upgrade-to-Wix (`upgradeTargetType === 'clientManaged'` with `addOns.voice`),
  - Standalone AI Visibility projects (`projectType === 'visibility'`, forced `isRequired: true`),
  - Standalone web-app projects with V.O.I.C.E opted in.
  - Code path: `src/lib/calculate-quote.ts:349-360`.

- **Bundle inside the contract period (non-SSR):** V.O.I.C.E is added into `monthlySubtotal` (`src/lib/calculate-quote.ts:428-429`). That `monthlySubtotal` is added on top of the build monthly during the contract (`src/lib/calculate-quote.ts:437, 442, 447, 452`) AND added on top of the post-contract `ongoingMonthly` (`src/lib/calculate-quote.ts:438, 443, 448, 453`). So V.O.I.C.E is NOT bundled into the contract build cost — it rides alongside at its full £562/mo rate every month, during AND after.

- **Bundle inside the contract period (SSR):** V.O.I.C.E is NOT in `monthlySubtotal` at all — it's a £0 included line. The entire value of V.O.I.C.E is effectively subsidised by the SSR base price (£8,000). Post-contract, `ongoingAfter` is `contracts.X.ongoingMonthly + 0 = ongoingMonthly` only (e.g. £75/mo after a 24-month SSR contract). The code does NOT re-add V.O.I.C.E after an SSR contract expires.

- **UK avg calculation for V.O.I.C.E comparison:**
  - Hardcoded `£750/mo` (`UK_MARKET_AVERAGES.aeoGeoMonthly` in `src/lib/pricing-config.ts:37`, re-hardcoded in `src/components/pricing/QuoteCalculator.tsx:1801, 1804`).
  - Source attribution: *"Based on research from 348 UK agencies and industry reports"* — `src/lib/pricing-config.ts:492`.
  - Savings math: `750 - PRICING_CONFIG.addOns.voice` → £188/mo (`src/components/pricing/QuoteCalculator.tsx:1804`).

- **No bundle discount is applied** beyond the free-with-SSR inclusion. There is no code path that reduces V.O.I.C.E for being bought alongside a Wix build.

---

## 5. Discounts and Modifiers

### 5a. Pay-in-full discount

- 5% off `oneOffSubtotal`. See Section 3a. `src/lib/pricing-config.ts:254`, applied at `src/lib/calculate-quote.ts:432-433`.

### 5b. Website Upgrade 40% discount

- 0.6 multiplier on Wix base + additional-pages lines ONLY. See Section 1c. `src/lib/calculate-quote.ts:222, 229, 242`.

### 5c. "25% below UK market average" positioning

- Not a calculated discount — it's a marketing positioning constant.
- `src/lib/pricing-config.ts:488-493`:

  ```ts
  export const MARKET_COMPARISON = {
    discount: 25,
    message: "25% below UK market average",
    tagline: "Premium quality, fair pricing",
    sources: "Based on research from 348 UK agencies and industry reports",
  };
  ```
- The quote calculator shows "UK avg: {formatCurrency(...)}" struck-through alongside ScopeSite prices for each line item, using `getMarketAverage()` → `UK_MARKET_AVERAGES` (`src/lib/calculate-quote.ts:575-607`).

### 5d. SSR minimum monthly enforcement

- If the build-derived monthly falls below the SSR minimum, the minimum is used:
  - `src/lib/calculate-quote.ts:472, 477, 482, 487` — uses `Math.max(<calc>, PRICING_CONFIG.ssrMinimums.<term>)`.
- Minimums: £1,200 (6mo), £750 (12mo), £400 (24mo), £300 (36mo). `src/lib/pricing-config.ts:278-283`.
- Displayed in the UI on the payment step: `src/components/pricing/QuoteCalculator.tsx:1956`.

### 5e. No sector, volume, or promo-code discounts in the quote wizard

- No `promo`, `coupon`, `voucher`, `code` or `discount_code` fields exist in `src/lib/pricing-config.ts`, `src/lib/calculate-quote.ts` or `src/types/pricing.ts`.
- The one place promo codes are enabled is the LLM Brain Stripe Checkout (see 5f).

### 5f. Stripe promo codes (LLM Brain)

- `src/app/api/llm-brain/checkout/route.ts:34`:

  ```ts
  ...(plan === 'setup' && { allow_promotion_codes: true }),
  ```
- Only enabled for the **`setup`** plan (price ID `price_1TIZxqC2FmRRiMA09JPCnes5`, £250 one-off). **Not** enabled for the `managed` subscription plan.
- **BRAINLAUNCH26 promo code is NOT defined in the codebase.** The actual coupon/promotion code (mentioned in the audit brief) would live in the Stripe Dashboard; the code only opts the checkout into accepting promotion codes. Marked as known unknown in Section 11.
- Supporting UI copy: "You pay through Stripe, promo codes accepted at checkout." (`src/app/llm-brain/page.tsx:319`) and "Follow us on LinkedIn for exclusive launch pricing." (`src/app/llm-brain/page.tsx:194-205`).

### 5g. US version — same 5% off, same 3/6/12/18% markups, different £/$ values

- `src/lib/us-pricing-config.ts:147-166` mirrors UK contract structure:
  - `oneOff.discount: 0.95` (5%)
  - `six.markup: 1.03`, `ongoingMonthly: 175` USD
  - `twelve.markup: 1.06`, `ongoingMonthly: 125` USD
  - `twentyFour.markup: 1.12`, `ongoingMonthly: 100` USD
  - `thirtySix.markup: 1.18`, `ongoingMonthly: 85` USD
- US SSR minimums (USD): `six 1600`, `twelve 1000`, `twentyFour 550`, `thirtySix 400` (`src/lib/us-pricing-config.ts:171-176`).

---

## 6. Service Pricing Elsewhere

### 6a. LLM Brain

- **Done-for-you setup**: **£250** one-time.
  - Stripe price ID: `price_1TIZxqC2FmRRiMA09JPCnes5` (`src/app/api/llm-brain/checkout/route.ts:8`).
  - Mode: `payment` (`src/app/api/llm-brain/checkout/route.ts:9`).
  - Page copy: `src/app/llm-brain/page.tsx:144, 162, 235, 513, 563`.
  - Layout metadata/description: `src/app/llm-brain/layout.tsx:18, 22`.
  - JSON-LD offer: `src/app/llm-brain/layout.tsx:56` (price `'250'`, currency `GBP`).
- **Managed service**: **£85/mo**.
  - Stripe price ID: `price_1TIZxwC2FmRRiMA0gMsa75Eo` (`src/app/api/llm-brain/checkout/route.ts:12`).
  - Mode: `subscription` (`src/app/api/llm-brain/checkout/route.ts:13`).
  - Page copy: `src/app/llm-brain/page.tsx:169, 186, 252, 541`.
  - JSON-LD offer: `src/app/llm-brain/layout.tsx:63` (price `'85'`, currency `GBP`).
- **Promo code restrictions:** `allow_promotion_codes: true` for `setup` only (`src/app/api/llm-brain/checkout/route.ts:34`). Managed subscription does NOT accept promo codes at checkout.
- **"Exclusive launch pricing" via LinkedIn:** announced as marketing copy at `src/app/llm-brain/page.tsx:194-205`, not implemented as a code path.

### 6b. Portal hourly rates (change-request pricing)

- Defined in `src/types/portal.ts:179-195`:
  - `emergency`: **£120/hr**
  - `out_of_hours`: **£200/hr**
  - `24_hours`: **£90/hr**
  - `48_hours`: **£60/hr**
  - `3_5_days`: **£45/hr**
- Displayed labels: `src/types/portal.ts:200-206`.
- Same five-band rate dropdown on the admin new-client form: `src/app/portal/admin/clients/new/page.tsx:148-152`.
- Hourly quote display string: `` `${hours} hours × £${rate}/hr = £${total.toLocaleString()}` `` — `src/types/portal.ts:468`.
- Trello-webhook field parsers also accept `£`-prefixed rate values from Trello dropdowns: `src/app/api/webhooks/trello/route.ts:214-217`.

### 6c. Territory Command (commercial map product)

- `src/lib/territory/copy.ts:16`: `"From £500/month. Full pricing discussed on your qualifying call."`
- `src/lib/territory/copy.ts:311` (premium result state body): `"Pricing starts above the standard £500 per month..."`
- Seeded seat prices in the database (not code-rendered price labels) — default seat pricing in `scripts/territory-expand-uk.mjs`:
  - Standard tier: **£500/mo, £750 setup, 24 months** contract.
  - Premium tier: **£750/mo, £1,250 setup, 24 months** contract.

### 6d. Brief form budget ranges (lead capture, not pricing)

- `src/components/BriefForm.tsx:39-43`:
  - Under £1k / £1k-£3k / £3k-£5k / £5k-£10k / £10k+
- Submitted to `src/app/api/briefs/submit/route.ts:19` (same five values).

### 6e. Plain-copy pricing on city landing pages

- **From £2,625** appears on every city landing page as the Wix-equivalent "packages start from" figure, even though the actual Wix starter is £1,875. Pages:
  - `src/app/page.tsx:120` (home)
  - `src/app/ai-website-design/page.tsx:44` and `layout.tsx:67`
  - `src/app/ai-seo-agency/page.tsx:38` and `layout.tsx:61`
  - `src/app/answer-engine-optimisation/page.tsx:46` and `layout.tsx:69`
  - `src/app/generative-engine-optimisation/page.tsx:46` and `layout.tsx:73`
  - `src/app/web-design-bath/page.tsx:20, 42` and `layout.tsx:50`
  - `src/app/web-design-bristol/page.tsx:20, 42, 144, 194` and `layout.tsx:51`
  - `src/app/web-design-somerset/page.tsx:20, 46` and `layout.tsx:51`
  - `src/app/web-design-frome/page.tsx:19, 49`
  - `src/app/web-design-burnham-on-sea/page.tsx:19, 49` and `layout.tsx:49`
  - `src/app/web-design-glastonbury/page.tsx:19, 49` and `layout.tsx:49`
  - `src/app/web-design-shepton-mallet/page.tsx:19, 49` and `layout.tsx:49`
  - `src/app/web-design-trowbridge/page.tsx:18, 19, 49` and `layout.tsx:48, 49`
  - `src/app/web-design-warminster/page.tsx:18, 19, 49` and `layout.tsx:48, 49`
  - `src/app/web-design-westbury/page.tsx:19, 49` and `layout.tsx:49`
- **£5,000-£9,000 "most businesses invest"** — same pages as above. This range lies between Wix `professional` (£4,125) and `enterprise` (£7,500) but does not match either.
- **£150/month monthly maintenance** claim — `src/app/web-design-bath/layout.tsx:56`, `src/app/web-design-bristol/layout.tsx:57`, `src/app/web-design-burnham-on-sea/page.tsx:25` and `layout.tsx:55`, `src/app/web-design-somerset/page.tsx:27` and `layout.tsx:58`. This value is NOT defined in `pricing-config.ts` — closest equivalent is `automationMonthly: 185` or `contracts.twelve.ongoingMonthly: 95`.
- **£60/hour revisions** — `src/app/web-design-bath/layout.tsx:62` and `page.tsx:32`, `src/app/web-design-bristol/layout.tsx:64` and `page.tsx:33`, `src/app/web-design-somerset/page.tsx:31` and `layout.tsx:62`. Hardcoded into FAQ answers only; matches the `48_hours` portal urgency band (`£60/hr`) but the copy doesn't cite that.
- **Schema markup £750-£2,000** — `src/app/schema-markup/layout.tsx:99`.
- **SEO retainers from £750/month** — `src/app/ai-seo-agency/layout.tsx:61` and `page.tsx:38`, `src/app/answer-engine-optimisation/layout.tsx:69` and `page.tsx:46`, `src/app/generative-engine-optimisation/layout.tsx:73` and `page.tsx:46`.
- **SEO audits £500, retainer £300/mo** — `src/app/seo-bristol/page.tsx:19` and `layout.tsx:49`, `src/app/seo-frome/page.tsx:18` and `layout.tsx:49`, `src/app/seo-somerset/page.tsx:18` and `layout.tsx:49`.
- **Web apps £1,500-3,000 / £5,000-15,000+** — `src/app/web-apps/page.tsx:193`. (The real quote-calculator tiers are £2,625 / £5,625 / £9,375 for Wix and £5,000 / £12,000 for SSR — neither of those exact ranges.)
- **H4TLT case study** — "£10/test vs industry average £40-70" and "delivered for under £5,000" (`src/app/case-studies/h4tlt/page.tsx:63, 170, 187, 833`). Client-pricing testimony, not ScopeSite pricing.
- **"from £8,000 for established businesses"** — `src/app/web-design/layout.tsx:67` and `page.tsx:228` (matches SSR base).
- **"£8-15K"** — `src/app/web-design/page.tsx:383`.
- **"SSR sites range from £2,625-£15,000+"** — `src/app/web-design/layout.tsx:107`.
- **"Template sites cost £500-£2,000. Custom WordPress £3,000-£10,000"** — competitor framing, `src/app/web-design/layout.tsx:107`.

### 6f. US pricing (separate USD configuration)

- **Source of truth:** `src/lib/us-pricing-config.ts:37-177`.
- Website builds:
  - `ssrBrochure`: base $10,000 (min $8,000, max $12,000). Per page above 10: $600. `src/lib/us-pricing-config.ts:39-44`.
  - `ssrExtended`: base $15,000 (min $12,000, max $18,000). Per page above 20: $500. `src/lib/us-pricing-config.ts:45-50`.
  - `ssrEcommerce`: base $20,000 (min $15,000, max $25,000). `src/lib/us-pricing-config.ts:51-55`.
  - `wixStandard`: base $4,000 (min $3,000, max $5,000). Per page above 10: $200. `src/lib/us-pricing-config.ts:56-61`.
  - `wixExtended`: base $6,500 (min $5,000, max $8,000). Per page above 15: $175. `src/lib/us-pricing-config.ts:62-67`.
- AI visibility:
  - `aiAudit`: $2,500 (`src/lib/us-pricing-config.ts:71-73`).
  - `aiRetainer`: $2,000/mo (`src/lib/us-pricing-config.ts:74-76`).
  - `localSeo`: base $2,000 (min $1,500, max $3,000).
  - `schemaMarkup`: base $1,500 (min $1,000, max $2,500).
  - `contentStrategy`: base $3,000 (min $2,000, max $4,000).
- Custom dev:
  - `customApp`: `startingFrom: 15000`, `isEnquiryBased: true` (`src/lib/us-pricing-config.ts:95-98`).
  - `apiIntegration`: base $5,000 (min $3,000, max $10,000).
  - `websiteMigration`: base $7,500 (min $5,000, max $12,000).
- SSR add-ons (USD): animations $3,000, customerPortal $7,500, database $5,000, authentication $4,000, apiIntegration $2,500, multilanguage $4,500, realtime $6,000, analytics $3,000, scalability $4,000 (`src/lib/us-pricing-config.ts:115-125`).
- General add-ons (USD): branding $6,500, research $4,500, videoLong $3,500, videoShortBundle $500, imageLibrary $1,000, complexForms $3,500, automationSetup $2,500, automationMonthly $250 (`src/lib/us-pricing-config.ts:131-140`).
- Contracts: 0.95 / 1.03+$175 / 1.06+$125 / 1.12+$100 / 1.18+$85 (`src/lib/us-pricing-config.ts:147-166`).
- SSR minimums: $1,600 / $1,000 / $550 / $400 (`src/lib/us-pricing-config.ts:171-176`).

### 6g. US public pricing page tier copy

- `src/app/us/pricing/page.tsx:32, 49, 66`:
  - Tier 1 AI Visibility Audit: `'$2,500'` (one-time). Tier 1 fee credited if upgrading within 60 days (`:14, :152`).
  - Tier 2 AI-Ready Website: `'$8,000 – $15,000'` (project).
  - Tier 3 AI Visibility Retainer: `'$2,000'` (/month), 3-month minimum (`:24, :68`).
- US pricing metadata: `src/app/us/pricing/layout.tsx:42, 54, 72, 80` (repeats the $2,500/$8,000/$2,000 triangle).

---

## 7. Pricing in Schema / Metadata

### 7a. Organization JSON-LD OfferCatalog — `src/lib/schema.ts:211-292`

- AI-First Web Design: `minPrice: '2625', maxPrice: '9375'` (`src/lib/schema.ts:220-221`) — this range matches **Custom Web App (Wix)** tiers, not the website-build tiers.
- V.O.I.C.E. service: `price: '0.58'` per scan (`src/lib/schema.ts:242`). Description: *"AI visibility scan from £0.58 per scan. No subscription. Credits never expire."* (`src/lib/schema.ts:246`).
- Custom Web Apps service: `minPrice: '5000'` (`src/lib/schema.ts:272`).

### 7b. V.O.I.C.E. Scanner SoftwareApplication — `src/lib/schema.ts:485-515`

- Offer: `price: '0'`, `priceCurrency: 'GBP'`, `name: 'Free AI Visibility Scan'` (`src/lib/schema.ts:498-502`).

### 7c. Pricing page offers (JSON-LD)

- `src/app/pricing/page.tsx:104-120`:
  - `starterOffer`: price range `'1500-3000'` (does NOT match `baseWebsite.starter: 1875`).
  - `professionalOffer`: price range `'3000-8000'` (does NOT match `baseWebsite.professional: 4125`).
  - `enterpriseOffer`: price range `'8000+'` (does NOT match `baseWebsite.enterprise: 7500`).
- Offers emitted via `generateOfferSchema()` from `src/lib/schema.ts:1603-1622`, which wraps the price string as a `PriceSpecification`.

### 7d. LLM Brain JSON-LD — `src/app/llm-brain/layout.tsx:53-72`

- Setup offer: `'250'` GBP (one-time).
- Managed offer: `'85'` GBP (per month, though the offer schema doesn't encode the "per month" part — just price).

### 7e. Open Graph / Twitter metadata pricing strings

- `src/app/pricing/page.tsx:48, 52, 69, 131`: `"Honest web design pricing from £1,875."`
- `src/app/llm-brain/layout.tsx:18, 22, 40`: `"£250 one-time setup"`.
- `src/app/us/pricing/layout.tsx:42, 54, 72, 80`: `"Three tiers: Audit ($2,500), AI-Ready Website (from $8,000), Retainer ($2,000/month)."`
- `src/app/web-design/layout.tsx:67` + `page.tsx:228`: `"Our websites start from £8,000"`.

---

## 8. Pricing in Email Templates

- **`src/lib/email.ts` contains NO hardcoded £/$ prices**. Grep for `£[0-9]|\$[0-9]` returned zero matches.
- The area-waitlist confirmation email (`src/lib/email.ts:1175-...`) does NOT include any pricing lines.
- `src/app/api/quote/[id]/route.ts:160, 180` passes `pricing?.monthlyPayment` through to downstream CRM syncs, but does not render prices in email body strings.

---

## 9. Discrepancies and Inconsistencies Found

1. **Pricing page JSON-LD offers disagree with the quote engine.**
   - `src/app/pricing/page.tsx:107, 113, 119` publishes `1500-3000` / `3000-8000` / `8000+`, but `src/lib/pricing-config.ts:78-80` actually prices starter/professional/enterprise at **£1,875 / £4,125 / £7,500**.
2. **Pricing page FAQ says "from £1,500" — everywhere else says "from £1,875" — actual is £1,875.**
   - `src/app/pricing/page.tsx:21`: "Our websites start from £1,500 for a professional 1-5 page site."
   - `src/app/pricing/page.tsx:48, 52, 69, 131`: metadata says "from £1,875."
3. **V.O.I.C.E page promises a £495 "full implementation" that is not priced anywhere in code.**
   - `src/app/voice/page.tsx:154` and `src/app/voice/layout.tsx:97`: "Full implementation packages start from £495."
   - Nothing named £495 or a 495-priced item exists in `pricing-config.ts`, `calculate-quote.ts`, `schema.ts`, `us-pricing-config.ts`, or the Stripe price IDs.
4. **£2,625 "packages start from" copy on 14 city/landing pages describes the Wix starter — but the Wix starter is actually £1,875.**
   - £2,625 is the `webApps.simple` price (`src/lib/pricing-config.ts:135`) and also the `addOns.complexForms` and `addOns.videoLong` (`:179, :200`). Using it as a website "starting price" in landing-page FAQ copy is inconsistent with the calculator's actual starter price.
5. **Home-page price trio `£2,625 / £5,625 / £9,375`** (`src/app/page.tsx:120`) matches the **Wix web-app tiers** (`simple/standard/complex` at `src/lib/pricing-config.ts:135-137`), not the **website-build tiers** (`starter/professional/enterprise` at `:78-80`). Mis-labelled as "simple build / business site / heavier projects".
6. **PricingConfig type is out of sync with the actual config.**
   - `src/types/pricing.ts:52-64` defines `contracts` with only `oneOff`, `twelve`, `twentyFour`.
   - `src/lib/pricing-config.ts:252-272` actually defines `oneOff`, `six`, `twelve`, `twentyFour`, `thirtySix`.
   - `src/lib/calculate-quote.ts:436-453, 471-489` reads all five.
   - Type coverage is incomplete — TypeScript will not catch a removed `six` or `thirtySix` entry.
7. **36-month contract is implemented but not shown in the UI.**
   - Pricing engine: `src/lib/pricing-config.ts:268-270`, `src/lib/calculate-quote.ts:451-453, 486-490`.
   - UI options array: `src/components/pricing/QuoteCalculator.tsx:1924-1929` stops at `twentyFour`. The label still exists in `src/lib/pricing-config.ts:375` (`thirtySix: '36-Month Contract'`), and the live-price strip (`:709`) handles a `thirtySix` plan key, but nothing lets the user select it.
8. **Upgrade "40% discount applies to your chosen type" copy is false for SSR upgrades.**
   - Copy: `src/components/pricing/QuoteCalculator.tsx:1078` — "The 40% discount applies to your chosen type."
   - Code: the `upgradeMultiplier = 0.6` only fires in the clientManaged branch at `src/lib/calculate-quote.ts:222`. The SSR branch (`:48-211`) never reads `upgrade` and never applies a multiplier. So choosing "Website Upgrade" + "upgrading to SSR" displays the same price as a full new SSR build.
9. **Two conflicting V.O.I.C.E scan prices in JSON-LD.**
   - `src/lib/schema.ts:499`: `price: '0'` (free scan).
   - `src/lib/schema.ts:242`: `price: '0.58'` per scan.
10. **US GEO FAQ retainer price disagrees with the US pricing config.**
    - `src/app/us/generative-engine-optimization/layout.tsx:91` and `page.tsx:89`: "Our GEO retainers start at **$1,000 per month**."
    - `src/lib/us-pricing-config.ts:75`: `aiRetainer.monthlyPrice: 2000`.
    - `src/app/us/pricing/page.tsx:66`: tier copy says `$2,000/month`.
    - The `$1,000` figure matches the **US SSR minimum monthly at 12 months** (`src/lib/us-pricing-config.ts:173: twelve: 1000`), not a retainer price.
11. **V.O.I.C.E UK avg `750` is hardcoded twice.**
    - Once via `UK_MARKET_AVERAGES.aeoGeoMonthly = 750` (`src/lib/pricing-config.ts:37`).
    - Again inline at `src/components/pricing/QuoteCalculator.tsx:1801` and `:1804` (`formatCurrency(750)`, `750 - PRICING_CONFIG.addOns.voice`). If UK_MARKET_AVERAGES is ever updated, these two inline literals will drift.
12. **Monthly maintenance "from £150/month" on city pages has no source in `pricing-config.ts`.**
    - Cited on 4+ city pages (see Section 6e).
    - Config values closest to £150: `contracts.six.ongoingMonthly = 125`, `automationMonthly = 185`, or the old US twelve ongoing $125 — none are £150.
13. **Short-form Video Bundle UK avg is inconsistent.**
    - `src/lib/pricing-config.ts:42`: `videoShortBundle: 1500` (market average).
    - `src/components/pricing/QuoteCalculator.tsx:1749`: `marketAverage={1500}` (inline literal, consistent).
    - `src/lib/calculate-quote.ts:590`: maps `video-short` → `videoShortBundle` → 1500 (consistent).
    - This one is consistent internally but the UK_MARKET_AVERAGES comment labels it as "one-off bundle" while the ScopeSite price `395` is monthly (`src/lib/pricing-config.ts:186`). Users see £1,500 "UK avg" on a £395/mo line. Arguably a copy issue, not a pricing bug.
14. **`contracts.six` is not exposed in the public `PricingConfig` type but IS used**. Same class as discrepancy #6 but worth calling out separately — the UI StepPayment does not offer `six` either, so `six` prices are computed in the engine and displayed only when a non-UI caller sets `paymentPreference: 'six'` (e.g. the `/api/quote/[id]` route fetching a previously stored quote).

---

## 10. Summary Table

| Service | Price | Billing | File Reference |
|---|---|---|---|
| Client-Managed (Wix) Starter (5 pages) | £1,875 | one-off | `src/lib/pricing-config.ts:78` |
| Client-Managed (Wix) Professional (10 pages) | £4,125 | one-off | `src/lib/pricing-config.ts:79` |
| Client-Managed (Wix) Enterprise (unlimited) | £7,500 | one-off | `src/lib/pricing-config.ts:80` |
| Additional page (Wix, beyond tier) | £150 each | one-off | `src/lib/pricing-config.ts:104` |
| SSR AI-First Website (base, up to 5 pages) | £8,000 | one-off | `src/lib/pricing-config.ts:93` |
| SSR Page 6-10 | +£500/page | one-off | `src/lib/pricing-config.ts:94` |
| SSR Page 11-20 | +£400/page | one-off | `src/lib/pricing-config.ts:95` |
| SSR Page 21+ | +£350/page | one-off | `src/lib/pricing-config.ts:96` |
| Website Upgrade multiplier (Wix path only) | 0.6 (40% off) | — | `src/lib/calculate-quote.ts:222` |
| E-commerce Small (Wix, up to 50) | £6,375 | one-off | `src/lib/pricing-config.ts:113` |
| E-commerce Medium (Wix, 51-200) | £9,000 | one-off | `src/lib/pricing-config.ts:114` |
| E-commerce Large (Wix, 200+) | £13,500 | one-off | `src/lib/pricing-config.ts:115` |
| Headless E-commerce Shopify (SSR) | £7,500 | one-off | `src/lib/pricing-config.ts:123` |
| Headless E-commerce Snipcart (SSR) | £5,500 | one-off | `src/lib/pricing-config.ts:124` |
| Headless E-commerce Custom (SSR) | £12,000 | one-off | `src/lib/pricing-config.ts:125` |
| Web App Simple (Wix) | £2,625 | one-off | `src/lib/pricing-config.ts:135` |
| Web App Standard (Wix) | £5,625 | one-off | `src/lib/pricing-config.ts:136` |
| Web App Complex (Wix) | £9,375 | one-off | `src/lib/pricing-config.ts:137` |
| SSR Web App Simple | £5,000 | one-off | `src/lib/pricing-config.ts:144` |
| SSR Web App Complex | £12,000 | one-off | `src/lib/pricing-config.ts:145` |
| V.O.I.C.E.™ AI Visibility | £562/mo | monthly | `src/lib/pricing-config.ts:158` |
| V.O.I.C.E.™ UK-avg comparison | £750/mo | (display) | `src/lib/pricing-config.ts:37`, `src/components/pricing/QuoteCalculator.tsx:1801` |
| V.O.I.C.E.™ bundled with SSR | £0 (included, "worth £562/mo") | monthly | `src/lib/calculate-quote.ts:336-348` |
| Full Branding Package | £4,875 | one-off | `src/lib/pricing-config.ts:165` |
| Market Research + Persona | £3,375 | one-off | `src/lib/pricing-config.ts:172` |
| Long-form Video (per video) | £2,625 | one-off | `src/lib/pricing-config.ts:179` |
| Short-form Video Bundle | £395/mo | monthly | `src/lib/pricing-config.ts:186` |
| Custom Image Library | £800 | one-off | `src/lib/pricing-config.ts:193` |
| Complex Logic Forms | £2,625 | one-off | `src/lib/pricing-config.ts:200` |
| Automation Setup | £1,875 | one-off | `src/lib/pricing-config.ts:207` |
| Automation Maintenance | £185/mo | monthly | `src/lib/pricing-config.ts:214` |
| SSR Add-on Premium Animations | £2,250 | one-off | `src/lib/pricing-config.ts:222` |
| SSR Add-on Customer Portal | £5,500 | one-off | `src/lib/pricing-config.ts:223` |
| SSR Add-on PostgreSQL Database | £3,500 | one-off | `src/lib/pricing-config.ts:224` |
| SSR Add-on User Authentication | £2,750 | one-off | `src/lib/pricing-config.ts:225` |
| SSR Add-on API Integration (per integration) | £1,875 | one-off | `src/lib/pricing-config.ts:226` |
| SSR Add-on Multi-language | £3,375 | one-off | `src/lib/pricing-config.ts:227` |
| SSR Add-on Real-time Features | £4,500 | one-off | `src/lib/pricing-config.ts:228` |
| SSR Add-on Custom Analytics | £2,250 | one-off | `src/lib/pricing-config.ts:229` |
| SSR Add-on Enterprise Scalability | £3,000 | one-off | `src/lib/pricing-config.ts:230` |
| Pay in Full discount | 5% off one-off subtotal | — | `src/lib/pricing-config.ts:254` |
| 6-Month Contract markup | +3% on build, £125/mo after | contract | `src/lib/pricing-config.ts:256-258` |
| 12-Month Contract markup | +6% on build, £95/mo after | contract | `src/lib/pricing-config.ts:260-262` |
| 24-Month Contract markup | +12% on build, £75/mo after | contract | `src/lib/pricing-config.ts:264-266` |
| 36-Month Contract markup (UI-hidden) | +18% on build, £65/mo after | contract | `src/lib/pricing-config.ts:268-270` |
| SSR min monthly 6mo | £1,200/mo | contract floor | `src/lib/pricing-config.ts:279` |
| SSR min monthly 12mo | £750/mo | contract floor | `src/lib/pricing-config.ts:280` |
| SSR min monthly 24mo | £400/mo | contract floor | `src/lib/pricing-config.ts:281` |
| SSR min monthly 36mo | £300/mo | contract floor | `src/lib/pricing-config.ts:282` |
| LLM Brain setup | £250 one-time | Stripe `price_1TIZxqC2FmRRiMA09JPCnes5` | `src/app/api/llm-brain/checkout/route.ts:8, 13`, `src/app/llm-brain/layout.tsx:56` |
| LLM Brain managed | £85/mo | Stripe `price_1TIZxwC2FmRRiMA0gMsa75Eo` | `src/app/api/llm-brain/checkout/route.ts:12, 13`, `src/app/llm-brain/layout.tsx:63` |
| Portal rate — 3-5 days urgency | £45/hr | hourly | `src/types/portal.ts:194` |
| Portal rate — 48 hours urgency | £60/hr | hourly | `src/types/portal.ts:193` |
| Portal rate — 24 hours urgency | £90/hr | hourly | `src/types/portal.ts:192` |
| Portal rate — Emergency | £120/hr | hourly | `src/types/portal.ts:190` |
| Portal rate — Out of hours | £200/hr | hourly | `src/types/portal.ts:191` |
| Territory Command (standard seat) | £500/mo, £750 setup, 24mo | monthly + setup | `src/lib/territory/copy.ts:16, 311`, `scripts/territory-expand-uk.mjs` (seed) |
| Territory Command (premium seat) | £750/mo, £1,250 setup, 24mo | monthly + setup | `scripts/territory-expand-uk.mjs` (seed) |
| V.O.I.C.E. scan price (JSON-LD, org OfferCatalog) | £0.58 per scan | per-scan | `src/lib/schema.ts:242` |
| V.O.I.C.E. scan price (JSON-LD, SoftwareApplication) | £0 | per-scan | `src/lib/schema.ts:499` |
| US Tier 1 AI Visibility Audit | $2,500 | one-off | `src/lib/us-pricing-config.ts:72`, `src/app/us/pricing/page.tsx:32` |
| US Tier 2 AI-Ready Website | $8,000 - $15,000 | project | `src/app/us/pricing/page.tsx:49` |
| US Tier 3 AI Visibility Retainer | $2,000/mo (3-mo min) | monthly | `src/lib/us-pricing-config.ts:75`, `src/app/us/pricing/page.tsx:66` |
| US 6mo / 12mo / 24mo / 36mo ongoingMonthly | $175 / $125 / $100 / $85 | contract | `src/lib/us-pricing-config.ts:152, 156, 160, 164` |

---

## 11. Known Unknowns

1. **V.O.I.C.E. setup fee** — NOT FOUND IN CODEBASE. No `voice.setup` or similar key in `pricing-config.ts`, `calculate-quote.ts`, or `QuoteCalculator.tsx`. UK V.O.I.C.E is modelled as monthly-only in code.
2. **V.O.I.C.E. minimum commitment length (UK)** — NOT FOUND IN CODEBASE. US variant has a 3-month minimum (`src/app/us/pricing/page.tsx:24`) but that string is US-only.
3. **V.O.I.C.E. notice period (UK)** — NOT FOUND IN CODEBASE. US copy mentions "30 days written notice to cancel" (`src/app/us/pricing/layout.tsx:24`), not applied to UK.
4. **£495 "Full implementation package" for V.O.I.C.E** — referenced in `src/app/voice/page.tsx:154` and `src/app/voice/layout.tsx:97` but there is no £495 SKU anywhere in `pricing-config.ts`, `calculate-quote.ts`, Stripe price IDs, or `schema.ts`. Either obsolete copy or an unshipped product.
5. **Stripe `BRAINLAUNCH26` coupon code** — NOT FOUND IN CODEBASE. `src/app/api/llm-brain/checkout/route.ts:34` sets `allow_promotion_codes: true` for the setup plan but the actual promotion codes live in the Stripe Dashboard, not in code.
6. **Custom Web App (UK) quoted rate for "enquiry-based" path** — UK has three concrete tiers in `pricing-config.ts:134-138` that the quote wizard uses. There is no "contact for quote" branch for UK custom apps. (The US side explicitly flags `customApp.isEnquiryBased: true` and `startingFrom: 15000` at `src/lib/us-pricing-config.ts:95-98`.)
7. **"From £150/month" monthly maintenance** copy on 4+ city pages — no matching value in `pricing-config.ts`. Source NOT FOUND.
8. **Short-form Video Bundle UK market average meaning** — `UK_MARKET_AVERAGES.videoShortBundle = 1500` (`src/lib/pricing-config.ts:42`) is commented as a "one-off bundle" but our own `addOns.videoShortBundle = 395` is monthly. Base-of-comparison is mismatched; whether the £1,500 UK avg is meant to be monthly or one-off NOT FOUND.
9. **Pricing page `starter` offer range £1,500-£3,000** — no rule in code that justifies the `£1,500` lower bound. Actual Wix starter is £1,875 (`src/lib/pricing-config.ts:78`).
10. **Territory Command seat pricing labels in the code** — the `£500/mo` strings in `src/lib/territory/copy.ts:16, 311` are not wired to `scripts/territory-expand-uk.mjs` seed values; they're independent copy constants. Single source of truth NOT FOUND.

---

## End of audit.

Read-only scan. No files were modified. Deliverable path:
`c:\Users\Dam\scopesite-ssr\PRICING-AUDIT.md`
