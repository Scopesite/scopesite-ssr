# ScopeSite Instant Quote System - Full Logic & Pathway

## Overview

The quote calculator is a 6-step wizard that generates instant pricing based on user selections. It supports two main website tiers (Client-Managed and SSR AI-First) plus additional services.

---

## User Journey Flow

```
Step 1: Email Entry
    ↓
Step 2: Project Type Selection
    ↓
Step 3: Scope Configuration
    ↓
Step 4: Add-Ons Selection
    ↓
Step 5: Payment Plan Choice
    ↓
Step 6: Contact Details & Submit
```

---

## Step-by-Step Breakdown

### Step 1: Get Started (Email)

**Purpose:** Capture email to enable quote saving/resuming

**Validation:**
- Email must be valid format
- Normalised to lowercase

**Limit Check:**
- Maximum 2 submitted quotes per email
- If limit reached → Show "Book a Call" screen instead

**On Success:**
- Creates quote record in storage
- Adds contact to Brevo "Quote Started" list
- Creates row in Google Sheet
- Returns quote token (used in URL `?q=TOKEN`)

---

### Step 2: Project Type Selection

**Options:**

| Type | Internal Code | Description |
|------|---------------|-------------|
| Client-Managed Website | `clientManaged` | Wix Studio, 60+ Lighthouse |
| SSR AI-First Website | `ssr` | Next.js, 99+ Lighthouse, **RECOMMENDED** |
| Website Upgrade | `upgrade` | 40% discount on new site price |
| AI Visibility Only | `visibility` | V.O.I.C.E™ service only |
| Custom Web App | `webapp` | Standalone app without website |

**Conditional Logic:**
- If `ssr` selected → Blog auto-included, minimum 5 pages enforced
- If `upgrade` selected → 40% discount multiplier applied to base price

---

### Step 3: Scope Configuration

**Fields shown vary by project type:**

| Field | Shown For | Options/Range |
|-------|-----------|---------------|
| Page Count | `clientManaged`, `ssr`, `upgrade` | 1-50 (SSR min: 5) |
| E-commerce (Wix) | `clientManaged`, `upgrade` | none/small/medium/large |
| Headless E-commerce | `ssr` | none/shopify/snipcart/custom |
| Web App (Wix) | `clientManaged`, `upgrade`, `webapp` | none/simple/standard/complex |
| SSR Web App | `ssr` | none/simple/complex |
| Blog/CMS | All | Auto-included for SSR |
| Complex Forms | `clientManaged` | Checkbox (+£2,625) |
| Automation | `clientManaged` | Checkbox (+£1,875 + £185/mo) |

---

### Step 4: Add-Ons Selection

**SSR-Specific Add-Ons (only shown for `ssr`):**

| Add-On | Our Price | UK Market | Savings |
|--------|-----------|-----------|---------|
| Premium Animations | £2,250 | £3,500 | £1,250 |
| Customer Portal | £5,500 | £8,000 | £2,500 |
| PostgreSQL Database | £3,500 | £5,500 | £2,000 |
| User Authentication | £2,750 | £4,000 | £1,250 |
| API Integration (each) | £1,875 | £3,000 | £1,125 |
| Multi-language/i18n | £3,375 | £4,500 | £1,125 |
| Real-time Features | £4,500 | £6,500 | £2,000 |
| Custom Analytics | £2,250 | £3,500 | £1,250 |
| Enterprise Scalability | £3,000 | £5,000 | £2,000 |

**Common Add-Ons (all project types):**

| Add-On | Our Price | UK Market | Type |
|--------|-----------|-----------|------|
| V.O.I.C.E™ AI Visibility | £562/mo | £750/mo | Monthly |
| Full Branding Package | £4,875 | £6,500 | One-off |
| Market Research + Persona | £3,375 | £4,500 | One-off |
| Long-form Video (each) | £2,625 | £3,500 | One-off |
| Short-form Video Bundle | £395/mo | £1,500 | Monthly |
| Custom Image Library | £800 | £1,200 | One-off |

---

### Step 5: Payment Plan Selection

**Three Options:**

| Plan | Modifier | Post-Contract |
|------|----------|---------------|
| One-Off | 5% discount (×0.95) | Monthly services only |
| 12-Month | 6% markup (×1.06) | £95/mo + monthly services |
| 24-Month | 12% markup (×1.12) | £75/mo + monthly services |

**SSR Minimum Payments:**
- 12-month: Minimum £750/mo
- 24-month: Minimum £400/mo

---

### Step 6: Summary & Submit

**Displays:**
- Full breakdown of one-off costs
- Monthly service costs
- UK market comparison savings
- Selected payment plan total

**On Submit:**
1. Updates quote status to `submitted`
2. Updates Brevo contact attributes
3. Moves contact from "Quote Started" to "Quote Completed" list
4. Updates Google Sheet row with full details
5. Sends admin notification email
6. Sends client confirmation email

---

## Pricing Configuration

### Base Website Pricing

**Client-Managed (Wix Studio) - 25% below UK market:**

| Package | Pages | Our Price | UK Market |
|---------|-------|-----------|-----------|
| Starter | 1-5 | £1,875 | £2,500 |
| Professional | 6-10 | £4,125 | £5,500 |
| Enterprise | 11+ | £7,500 | £10,000 |

Additional pages beyond package: **£150/page**

**SSR AI-First (Next.js):**

| Pages | Price |
|-------|-------|
| Base (up to 5) | £8,000 |
| Pages 6-10 | +£500/page |
| Pages 11-20 | +£400/page |
| Pages 21+ | +£350/page |

**Example SSR Calculations:**
- 5 pages = £8,000
- 10 pages = £8,000 + (5 × £500) = £10,500
- 15 pages = £10,500 + (5 × £400) = £12,500
- 25 pages = £12,500 + (5 × £350) = £14,250

### E-commerce Pricing

**Client-Managed (Wix):**

| Size | Products | Our Price | UK Market |
|------|----------|-----------|-----------|
| Small | Up to 50 | £6,375 | £8,500 |
| Medium | 51-200 | £9,000 | £12,000 |
| Large | 200+ | £13,500 | £18,000 |

**SSR Headless:**

| Type | Our Price |
|------|-----------|
| Shopify Integration | £7,500 |
| Snipcart | £5,500 |
| Custom Solution | £12,000 |

### Web App Pricing

**Client-Managed:**

| Tier | Our Price | UK Market |
|------|-----------|-----------|
| Simple | £2,625 | £3,500 |
| Standard | £5,625 | £7,500 |
| Complex | £9,375 | £12,500 |

**SSR:**

| Tier | Our Price |
|------|-----------|
| Simple | £5,000 |
| Complex | £12,000 |

---

## Calculation Formula

```javascript
// 1. Calculate one-off subtotal
oneOffSubtotal = basePrice + additionalPages + ecommerce + webApp + addOns

// 2. Calculate monthly subtotal
monthlySubtotal = voice + videoBundle + automationMonthly

// 3. Apply payment plan

// One-Off:
final = oneOffSubtotal × 0.95

// 12-Month:
monthly = (oneOffSubtotal × 1.06 / 12) + monthlySubtotal
totalOverTerm = (oneOffSubtotal × 1.06) + (monthlySubtotal × 12)
ongoingAfter = £95 + monthlySubtotal

// 24-Month:
monthly = (oneOffSubtotal × 1.12 / 24) + monthlySubtotal
totalOverTerm = (oneOffSubtotal × 1.12) + (monthlySubtotal × 24)
ongoingAfter = £75 + monthlySubtotal

// SSR minimums applied after calculation
if (isSSR) {
  twelveMonthly = max(calculatedMonthly, £750)
  twentyFourMonthly = max(calculatedMonthly, £400)
}
```

---

## Data Storage

### Quote Record Schema

```typescript
interface StoredQuote {
  id: string;              // 8-char alphanumeric token
  email: string;
  status: 'started' | 'in_progress' | 'submitted' | 'abandoned';
  currentStep: number;     // 1-6
  selections: {
    projectType: 'clientManaged' | 'ssr' | 'upgrade' | 'visibility' | 'webapp';
    scope: {
      pageCount: number;
      ecommerce: 'none' | 'small' | 'medium' | 'large';
      headlessEcommerce: 'none' | 'shopify' | 'snipcart' | 'custom';
      webApp: 'none' | 'simple' | 'standard' | 'complex';
      ssrWebApp: 'none' | 'simple' | 'complex';
      hasBlog: boolean;
      hasComplexForms: boolean;
      hasAutomation: boolean;
    };
    addOns: {
      // Common
      voice: boolean;
      branding: boolean;
      research: boolean;
      videoLong: number;
      videoShortBundle: boolean;
      imageLibrary: boolean;
      // SSR-specific
      ssrAnimations: boolean;
      ssrCustomerPortal: boolean;
      ssrDatabase: boolean;
      ssrAuthentication: boolean;
      ssrApiIntegrations: number;
      ssrMultilanguage: boolean;
      ssrRealtime: boolean;
      ssrAnalytics: boolean;
      ssrScalability: boolean;
    };
    paymentPreference: 'oneOff' | 'twelve' | 'twentyFour';
  };
  contact: {
    name: string;
    phone: string;
    company: string;
    message: string;
  };
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/quote/start` | POST | Create new quote (email submission) |
| `/api/quote/[id]` | GET | Retrieve quote by token |
| `/api/quote/[id]` | PATCH | Update quote progress |
| `/api/quote` | POST | Legacy submit endpoint |

---

## Integrations

### Brevo (Email Marketing)

**Lists:**
- `QUOTE_STARTED` - Added when email submitted
- `QUOTE_COMPLETED` - Moved to when submitted

**Contact Attributes Updated:**
- FULL_NAME, PHONE, COMPANY_NAME
- QUOTE_ID, QUOTE_URL
- QUOTE_TOTAL, QUOTE_MONTHLY
- QUOTE_PACKAGE, QUOTE_PROJECT_TYPE
- QUOTE_PAYMENT_TYPE, QUOTE_DATE
- QUOTE_NOTES

### Google Sheets

Rows created/updated with full quote details for CRM tracking.

### Email Notifications

**On Submit:**
1. Admin notification with full quote breakdown
2. Client confirmation with summary and next steps

---

## Business Rules Summary

1. **Quote Limit:** Max 2 submitted quotes per email
2. **SSR Minimum Pages:** 5 pages minimum for SSR projects
3. **SSR Minimum Monthly:** £750 (12mo) / £400 (24mo)
4. **Upgrade Discount:** 40% off base website price
5. **One-Off Discount:** 5% off total
6. **Contract Markup:** 6% (12mo) / 12% (24mo)
7. **Blog:** Auto-included with SSR, optional for Client-Managed
8. **Quote Resumption:** Can resume from URL token anytime (until submitted)

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/lib/pricing-config.ts` | All pricing values |
| `src/lib/calculate-quote.ts` | Calculation engine |
| `src/types/pricing.ts` | Type definitions |
| `src/lib/quote-storage.ts` | Database operations |
| `src/components/pricing/QuoteCalculator.tsx` | UI component |
| `src/app/api/quote/start/route.ts` | Start quote API |
| `src/app/api/quote/[id]/route.ts` | Update/get quote API |
| `src/lib/email.ts` | Email notifications |
