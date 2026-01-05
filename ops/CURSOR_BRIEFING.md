# SCOPESITE SSR REBUILD - CURSOR OPERATING BRIEFING
## Version 1.0 | January 2026

---

## 🚨 READ THIS FIRST - EVERY SESSION

Before writing ANY code:
1. Read `/ops/DECISIONS.md` for locked decisions
2. Read `/ops/SESSION_LOG.md` for current state
3. Confirm your task aligns with the MVP scope
4. Make MINIMAL changes per session
5. Update SESSION_LOG.md before ending

**ONE WRITER RULE:** Only one agent (human or AI) writes to any file at a time. Commits include session log entry. No exceptions.

---

## 🎯 PROJECT OVERVIEW

**Client:** ScopeSite Digital Studios
**Project:** SSR Website Rebuild with Interactive Pricing Tool
**Tech Stack:** Next.js 14 (App Router) + Vercel + Tailwind + shadcn/ui + Supabase
**Timeline:** MVP in 2-3 weeks
**Owner:** Dan (Founder)

### What We're Building

A Server-Side Rendered website for a UK web design agency specializing in AI visibility (AEO/GEO). The site must:

1. **Practice what we preach** - Full SSR for AI crawler visibility
2. **Convert visitors** - Interactive pricing tool as primary lead capture
3. **Look premium** - Military precision, no corporate bollocks
4. **Integrate with existing stack** - OnPageCRM, Zapier/N8N, email

### Why SSR Matters

Current site is Wix (client-side rendered). AI crawlers (GPTBot, ClaudeBot, PerplexityBot) can't execute JavaScript properly. SSR ensures:
- Full content visible to AI crawlers
- Proper schema markup rendered server-side
- Fast TTFB for crawler efficiency
- We can actually deliver what we sell to clients

---

## 🏗️ TECH STACK (LOCKED)

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | Next.js 14 (App Router) | Best SSR support, AI crawler friendly |
| **Hosting** | Vercel | Native Next.js, edge functions, simple |
| **Styling** | Tailwind CSS | Utility-first, matches brand system |
| **Components** | shadcn/ui | Accessible, customizable, not a dependency |
| **Database** | Supabase (PostgreSQL) | Generous free tier, real-time, auth ready |
| **Email** | Resend | Developer-friendly, good deliverability |
| **CRM** | OnPageCRM | Existing stack - webhook integration |
| **Automation** | Zapier → N8N (migration planned) | Existing stack |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **State** | Zustand | Simple, no boilerplate |

---

## 🎨 BRAND SYSTEM (LOCKED)

### Colours

```javascript
// tailwind.config.js colors
colors: {
  brand: {
    gold: '#ECB615',      // Primary accent, CTAs
    navy: '#0A1B36',      // Primary background
    white: '#FFFFFF',     // Text on dark, clean sections
    orange: '#F68B1E',    // Secondary accent (sparingly)
    graphite: '#1E2D50',  // Borders, subtle elements
  }
}
```

### Typography

```javascript
// Font imports needed
// Headlines: Paytone One (Google Fonts)
// Body: Inter (Google Fonts)

fontFamily: {
  headline: ['Paytone One', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
}

// Usage:
// H1, H2: Paytone One, UPPERCASE, gold or white
// H3, H4: Inter Black (900), sentence case
// Body: Inter Regular (400), 16-18px
```

### Spacing & Layout

```javascript
// Base unit: 8px
// Border radius: 16px (buttons, cards), 8px (inputs)
// Grid: 12 columns, 24px gutters
// Max content width: 1200px
// Section padding: 80px vertical (desktop), 40px (mobile)

borderRadius: {
  DEFAULT: '16px',
  sm: '8px',
  pill: '999px',
}
```

### Component Patterns

**Primary Button:**
- Background: Gold (#ECB615)
- Text: Navy (#0A1B36)
- Font: Inter Black, 16px
- Padding: 16px 32px
- Hover: Navy background, White text
- Shadow: `0 4px 12px rgba(236, 182, 21, 0.3)`

**Secondary Button:**
- Background: Transparent
- Border: 2px solid Gold
- Text: Gold (on navy) or Navy (on white)
- Hover: Gold background, Navy text

**Cards:**
- Background: White or Navy
- Border radius: 16px
- Padding: 32px
- Shadow: `0 2px 8px rgba(10, 27, 54, 0.1)`
- Hover: Lift 4px with increased shadow

---

## 📁 PROJECT STRUCTURE

```
scopesite-ssr/
├── /ops/                           # Command centre (this folder)
│   ├── CURSOR_BRIEFING.md          # This file
│   ├── DECISIONS.md                # Locked decisions
│   ├── SESSION_LOG.md              # Session history
│   └── BACKLOG.md                  # Future tasks
│
├── /src/
│   ├── /app/                       # Next.js App Router
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── page.tsx                # Homepage
│   │   ├── /voice/
│   │   │   └── page.tsx            # V.O.I.C.E™ page
│   │   ├── /pricing/
│   │   │   └── page.tsx            # Pricing tool page
│   │   ├── /web-design/
│   │   │   └── page.tsx            # Web design services
│   │   ├── /book/
│   │   │   └── page.tsx            # Strategy meeting booking
│   │   ├── /blog/
│   │   │   ├── page.tsx            # Blog index
│   │   │   └── /[slug]/
│   │   │       └── page.tsx        # Individual posts
│   │   └── /api/
│   │       ├── /quote/
│   │       │   └── route.ts        # Quote submission endpoint
│   │       ├── /webhook/
│   │       │   └── route.ts        # Incoming webhooks
│   │       └── /health/
│   │           └── route.ts        # Health check
│   │
│   ├── /components/
│   │   ├── /ui/                    # shadcn/ui components
│   │   ├── /layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── /pricing/
│   │   │   ├── PricingCalculator.tsx    # Main calculator
│   │   │   ├── ProjectTypeStep.tsx      # Step 1
│   │   │   ├── ScopeStep.tsx            # Step 2
│   │   │   ├── AddOnsStep.tsx           # Step 3
│   │   │   ├── PaymentStep.tsx          # Step 4
│   │   │   ├── QuoteSummary.tsx         # Final summary
│   │   │   └── QuoteBreakdown.tsx       # Line item display
│   │   ├── /sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── CTA.tsx
│   │   └── /shared/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   │
│   ├── /lib/
│   │   ├── supabase.ts             # Supabase client
│   │   ├── pricing.ts              # Pricing calculation logic
│   │   ├── email.ts                # Email sending (Resend)
│   │   ├── crm.ts                  # OnPageCRM integration
│   │   └── utils.ts                # Utility functions
│   │
│   ├── /hooks/
│   │   ├── usePricingCalculator.ts # Calculator state management
│   │   └── useQuoteSubmission.ts   # Form submission logic
│   │
│   ├── /types/
│   │   ├── pricing.ts              # Pricing types
│   │   └── quote.ts                # Quote types
│   │
│   ├── /content/
│   │   └── /blog/                  # MDX blog posts
│   │
│   └── /styles/
│       └── globals.css             # Global styles + Tailwind
│
├── /public/
│   ├── /images/
│   │   ├── logo.svg
│   │   ├── logo-icon.svg
│   │   ├── no-bull-insignia.svg
│   │   └── voice-mark.svg
│   └── /fonts/                     # Self-hosted fonts if needed
│
├── tailwind.config.ts
├── next.config.js
├── package.json
└── .env.local                      # Environment variables (NOT committed)
```

---

## 💰 PRICING TOOL ARCHITECTURE

### User Flow

```
Landing → "Get Instant Quote" CTA
              ↓
┌─────────────────────────────────────┐
│  STEP 1: PROJECT TYPE               │
│  ○ New Website                      │
│  ○ Website Upgrade                  │
│  ○ AI Visibility Only (V.O.I.C.E™) │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  STEP 2: SCOPE                      │
│  Pages: [slider 5-50+]              │
│  ☐ E-commerce (products dropdown)   │
│  ☐ Blog/CMS                         │
│  ☐ Complex Forms                    │
│  ☐ Automation (outreach, cart)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  STEP 3: ADD-ONS                    │
│  ☐ V.O.I.C.E™ AI Visibility        │
│  ☐ Full Branding Package            │
│  ☐ Market Research + Persona        │
│  ☐ Video Production                 │
│  ☐ Custom Image Library             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  STEP 4: PAYMENT PREFERENCE         │
│  ○ One-Off Payment                  │
│  ○ 12-Month Contract                │
│  ○ 24-Month Contract                │
│                                     │
│  [Live price updates as user moves] │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  QUOTE SUMMARY                      │
│  Project Value: £X,XXX              │
│  Monthly (if applicable): £XXX/mo   │
│                                     │
│  [Book Strategy Call]               │
│  [Download Quote PDF]               │
│  [Email Me This Quote]              │
└─────────────────────────────────────┘
              ↓
         SUBMISSION
              ↓
    ┌─────────────────┐
    │ Supabase DB     │ ← Store quote + lead
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐    ┌──────────────┐
│ Resend  │    │ Zapier/N8N   │
│ (Email) │    │ Webhook      │
└─────────┘    └──────┬───────┘
                      │
                      ▼
               ┌──────────────┐
               │ OnPageCRM    │
               │ (New Lead)   │
               └──────────────┘
```

### Pricing Data Structure

```typescript
// /src/types/pricing.ts

interface PricingConfig {
  baseWebsite: {
    starter: number;      // 5 pages
    professional: number; // 10 pages
    enterprise: number;   // Unlimited
  };
  perPageRate: number;    // Additional pages
  ecommerce: {
    small: number;        // Up to 50 products
    medium: number;       // 51-200 products
    large: number;        // 200+ products
  };
  addOns: {
    voice: number;        // V.O.I.C.E™ monthly
    branding: number;     // One-off
    research: number;     // One-off
    videoLong: number;    // Per video
    videoBundle: number;  // Monthly short-form
    imageLibrary: number; // One-off
    complexForms: number; // One-off
    automation: number;   // Setup + monthly
  };
  contracts: {
    oneOff: {
      discount: number;   // e.g., 0.95 for 5% discount
    };
    twelve: {
      markup: number;     // e.g., 1.05 for 5% markup
      ongoingMonthly: number; // Post-contract maintenance
    };
    twentyFour: {
      markup: number;     // e.g., 1.10 for 10% markup
      ongoingMonthly: number;
    };
  };
}

interface QuoteRequest {
  // Step 1
  projectType: 'new' | 'upgrade' | 'visibility';
  
  // Step 2
  pageCount: number;
  hasEcommerce: boolean;
  productCount?: number;
  hasBlog: boolean;
  hasComplexForms: boolean;
  hasAutomation: boolean;
  
  // Step 3
  addOns: {
    voice: boolean;
    branding: boolean;
    research: boolean;
    videoLong: number;      // Quantity
    videoBundle: boolean;
    imageLibrary: boolean;
  };
  
  // Step 4
  paymentPreference: 'oneOff' | 'twelve' | 'twentyFour';
  
  // Contact (captured at submission)
  contact: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message?: string;
  };
}

interface QuoteResult {
  id: string;
  createdAt: Date;
  
  // Breakdown
  basePrice: number;
  ecommercePrice: number;
  addOnsTotal: number;
  
  // Totals
  projectValue: number;
  discountApplied: number;
  finalOneOff: number;
  
  // Monthly options
  twelveMonthly: number;
  twelveTotal: number;
  twelveOngoing: number;
  
  twentyFourMonthly: number;
  twentyFourTotal: number;
  twentyFourOngoing: number;
  
  // Selected
  selectedPayment: 'oneOff' | 'twelve' | 'twentyFour';
  selectedTotal: number;
  selectedMonthly?: number;
}
```

### Database Schema (Supabase)

```sql
-- Quotes table
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contact info
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_company TEXT,
  contact_message TEXT,
  
  -- Quote details (stored as JSONB for flexibility)
  quote_request JSONB NOT NULL,
  quote_result JSONB NOT NULL,
  
  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'meeting_booked', 'proposal_sent', 'won', 'lost')),
  
  -- CRM sync
  crm_synced BOOLEAN DEFAULT FALSE,
  crm_id TEXT,
  
  -- Analytics
  source TEXT,
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT
);

-- Index for common queries
CREATE INDEX idx_quotes_email ON quotes(contact_email);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created ON quotes(created_at DESC);
```

---

## 🔌 INTEGRATIONS

### Email (Resend)

```typescript
// /src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendQuoteConfirmation(quote: QuoteResult, contact: Contact) {
  // To client
  await resend.emails.send({
    from: 'ScopeSite <quotes@scopesite.co.uk>',
    to: contact.email,
    subject: `Your ScopeSite Quote - £${quote.selectedTotal.toLocaleString()}`,
    // React email template
  });
  
  // To Dan
  await resend.emails.send({
    from: 'ScopeSite <quotes@scopesite.co.uk>',
    to: 'dan@scopesite.co.uk',
    subject: `New Quote: ${contact.company || contact.name} - £${quote.selectedTotal.toLocaleString()}`,
    // React email template with full details
  });
}
```

### CRM (OnPageCRM via Zapier/N8N)

```typescript
// /src/lib/crm.ts
export async function pushToCRM(quote: QuoteResult, contact: Contact) {
  // Webhook to Zapier/N8N
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // OnPageCRM fields
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      
      // Custom fields
      quote_value: quote.selectedTotal,
      payment_type: quote.selectedPayment,
      quote_id: quote.id,
      
      // Tags
      tags: ['website-quote', quote.selectedPayment],
      
      // Notes
      note: `Quote generated via website calculator.\n\nProject Value: £${quote.projectValue}\nPayment: ${quote.selectedPayment}\n\nDetails: ${JSON.stringify(quote, null, 2)}`,
    }),
  });
}
```

### Quote API Endpoint

```typescript
// /src/app/api/quote/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { sendQuoteConfirmation } from '@/lib/email';
import { pushToCRM } from '@/lib/crm';
import { calculateQuote } from '@/lib/pricing';
import { quoteRequestSchema } from '@/types/quote';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const parsed = quoteRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    const quoteRequest = parsed.data;
    
    // Calculate quote
    const quoteResult = calculateQuote(quoteRequest);
    
    // Store in database
    const supabase = createClient();
    const { data: quote, error } = await supabase
      .from('quotes')
      .insert({
        contact_name: quoteRequest.contact.name,
        contact_email: quoteRequest.contact.email,
        contact_phone: quoteRequest.contact.phone,
        contact_company: quoteRequest.contact.company,
        contact_message: quoteRequest.contact.message,
        quote_request: quoteRequest,
        quote_result: quoteResult,
        source: request.headers.get('referer'),
        // UTM params from query string
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Send emails (async, don't block response)
    sendQuoteConfirmation(quoteResult, quoteRequest.contact).catch(console.error);
    
    // Push to CRM (async)
    pushToCRM(quoteResult, quoteRequest.contact).catch(console.error);
    
    return NextResponse.json({ 
      success: true, 
      quote: quoteResult,
      quoteId: quote.id 
    });
    
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

---

## 📄 MVP PAGES

### Priority Order

| Page | Route | Priority | Status |
|------|-------|----------|--------|
| Homepage | `/` | 🔴 Critical | Not started |
| Pricing Tool | `/pricing` | 🔴 Critical | Not started |
| V.O.I.C.E™ | `/voice` | 🔴 Critical | Not started |
| Book Meeting | `/book` | 🔴 Critical | Not started |
| Web Design Services | `/web-design` | 🟡 High | Not started |
| Blog Index | `/blog` | 🟡 High | Not started |
| Blog Post [slug] | `/blog/[slug]` | 🟡 High | Not started |
| FAQ | `/faq` | 🟢 Medium | Not started |
| Reviews | `/reviews` | 🟢 Medium | Not started |

### Explicitly OUT of MVP Scope

- User accounts / dashboard
- Client portal
- Payment processing (Stripe etc.)
- Full blog migration (3-5 posts only for MVP)
- Interactive AI visibility checker (keep on subdomain)
- Case studies page (move to Phase 2)

---

## 🔍 SEO & AI VISIBILITY

### Schema Markup (Required on Every Page)

```typescript
// Base schemas for all pages
const baseSchemas = {
  organization: {
    "@type": "Organization",
    "@id": "https://scopesite.co.uk/#organization",
    "name": "ScopeSite Digital Studios",
    "url": "https://scopesite.co.uk",
    "logo": "https://scopesite.co.uk/images/logo.svg",
    "description": "Veteran-owned UK web design agency specializing in AI visibility and GEO optimization",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Frome",
      "addressRegion": "Somerset",
      "addressCountry": "GB"
    },
    "founder": {
      "@type": "Person",
      "name": "Dan Cartwright"
    },
    "sameAs": [
      "https://www.linkedin.com/in/scopesite/",
      "https://www.facebook.com/scopesite",
      "https://www.instagram.com/follow_scopesite_graphics/"
    ]
  },
  
  localBusiness: {
    "@type": "LocalBusiness",
    "@id": "https://scopesite.co.uk/#localbusiness",
    "name": "ScopeSite Digital Studios",
    "image": "https://scopesite.co.uk/images/logo.svg",
    "telephone": "+441373311339",
    "email": "help@scopesite.co.uk",
    "priceRange": "££",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Frome",
      "addressRegion": "Somerset",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.2279,
      "longitude": -2.3215
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    }
  }
};

// Page-specific schemas
// - WebPage on every page
// - FAQPage on FAQ sections
// - Service on service pages
// - Article on blog posts
// - BreadcrumbList on all pages
```

### AI Crawler Optimizations

```typescript
// next.config.js
module.exports = {
  // Enable static generation where possible
  output: 'hybrid',
  
  // Headers for AI crawlers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
    ];
  },
};
```

```txt
# robots.txt
User-agent: *
Allow: /

# AI Crawlers - explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot
Allow: /

Sitemap: https://scopesite.co.uk/sitemap.xml
```

---

## ⚠️ ENVIRONMENT VARIABLES

```env
# .env.local (NEVER COMMIT)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email (Resend)
RESEND_API_KEY=

# CRM Webhook
CRM_WEBHOOK_URL=

# Analytics (optional)
NEXT_PUBLIC_GA_ID=

# Feature flags
NEXT_PUBLIC_ENABLE_PRICING_TOOL=true
```

---

## 📝 SESSION LOG TEMPLATE

When ending a session, update `/ops/SESSION_LOG.md`:

```markdown
## [DATE] | Agent: [Cursor/Claude/Human] | Duration: [X hours]

### 🎯 Goal
[What we set out to do]

### ✅ Completed
- [Specific files created/modified]
- [Features implemented]
- [Bugs fixed]

### 📌 Decisions Made
- [Any new decisions - also add to DECISIONS.md]

### ⚠️ Issues/Blockers
- [Problems encountered]
- [Things that need clarification]

### ➡️ Next Step
[Single clear action for next session]

### 🔗 References
- Commit: [hash]
- PR: [link if applicable]
```

---

## ✅ READY TO BUILD

This briefing contains everything needed to start development. 

**Cursor's first task:** Set up the project scaffold
1. Initialize Next.js 14 with App Router
2. Configure Tailwind with brand system
3. Install and configure shadcn/ui
4. Create folder structure
5. Set up Supabase client
6. Create base layout with Header/Footer

**Do not proceed to features until scaffold is complete and tested.**

---

*"While other agencies are still trying to figure out what questions to ask, we've already got all the answers. Time to show them what proper planning looks like, mate."*

**Document Version:** 1.0
**Created:** January 2026
**Last Updated:** January 2026
