# SCOPESITE DIGITAL STUDIOS - PROJECT BRIEF

## Complete Technical & Brand Documentation
**Version:** 2.0 | **Last Updated:** January 2026

---

## 📋 EXECUTIVE SUMMARY

**ScopeSite Digital Studios** is a veteran-owned, AI-first web design agency based in Somerset, UK. This is their primary marketing website, built to practice what they preach: a fully server-side rendered (SSR) Next.js application optimized for both traditional search engines AND AI assistants like ChatGPT, Claude, and Perplexity.

| Attribute | Value |
|-----------|-------|
| **Live URL** | https://scopesite.co.uk |
| **Framework** | Next.js 16.1.1 (App Router) |
| **Hosting** | Vercel |
| **Repository** | Private GitHub |
| **Owner** | Dan Cartwright (Founder) |
| **Target Market** | UK SMEs, service businesses |

---

## 🎯 BUSINESS CONTEXT

### What ScopeSite Does

ScopeSite specializes in making UK businesses visible to AI platforms through:

1. **Web Design** - Server-side rendered websites built on Next.js for maximum AI crawler visibility
2. **V.O.I.C.E™ Optimization** - Proprietary methodology for AI platform visibility (ChatGPT, Claude, Perplexity, Google AI)
3. **Custom Web Apps** - Bespoke business applications, quote calculators, client portals

### The V.O.I.C.E™ Methodology

ScopeSite's unique selling proposition - a proprietary framework for AI visibility:

- **V**isibility: Making your business findable by AI assistants like ChatGPT, Siri, Alexa and Claude
- **O**ptimisation: Technical improvements to structured data, schema markup and site architecture
- **I**ntelligent: AI-focused strategy that goes beyond traditional SEO
- **C**onversational: Voice search ready - optimised for how people actually talk to AI
- **E**ngines: Built for ChatGPT, Siri, Alexa, Claude, Perplexity and whatever comes next

### Brand Personality

- **Veteran-owned** - Military precision, discipline, no-nonsense approach
- **"No bullshit"** - Direct, honest communication (this phrase is part of the brand)
- **Somerset-based** - Local roots with UK-wide service
- **AI-first** - Practicing what they preach with SSR and AI optimization

---

## 🎨 BRAND SYSTEM

### Primary Colour Palette

```
┌─────────────────────────────────────────────────────────────────┐
│  BRAND GOLD         │  #ECB615  │  Primary accent, CTAs, links  │
│  BRAND NAVY         │  #0A1B36  │  Primary backgrounds          │
│  BRAND WHITE        │  #FFFFFF  │  Text on dark, clean sections │
│  BRAND ORANGE       │  #F68B1E  │  Secondary accent (hover)     │
│  BRAND GRAPHITE     │  #1E2D50  │  Borders, subtle elements     │
└─────────────────────────────────────────────────────────────────┘
```

### Accessible Colour Variants (WCAG AA Compliant)

```
┌────────────────────────────────────────────────────────────────────────┐
│  GOLD ACCESSIBLE    │  #996D00  │  Use on white backgrounds (4.5:1+)  │
│  ORANGE ACCESSIBLE  │  #B35E00  │  Use on white for hover states      │
└────────────────────────────────────────────────────────────────────────┘
```

**Important:** Never use `#ECB615` (brand gold) directly on white backgrounds - it fails WCAG contrast. Use `#996D00` instead.

### Colour Usage Ratio

```
60% Navy  │  30% White  │  10% Gold
```

### Typography

| Element | Font | Weight | Case | Size |
|---------|------|--------|------|------|
| H1, H2 | Paytone One | 400 | UPPERCASE | 3rem / 2.25rem |
| H3, H4 | Inter | 900 (Black) | Sentence case | 1.75rem / 1.25rem |
| Body | Inter | 400 | Sentence case | 1rem (16px) |
| Body Large | Inter | 400 | Sentence case | 1.5625rem (25px) |
| Caption | Inter | 400 | Sentence case | 0.75rem (12px) |

**Font Loading:** Both fonts loaded via `next/font/google` with `display: 'swap'` for optimal performance.

```tsx
// Font configuration in layout.tsx
const paytoneOne = Paytone_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-paytone',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
```

### Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `xxs` | 0.25rem (4px) | Micro spacing |
| `xs` | 0.5rem (8px) | Tight spacing |
| `s` | 1rem (16px) | Standard spacing |
| `m` | 1.5rem (24px) | Medium spacing |
| `l` | 2rem (32px) | Large spacing |
| `xl` | 3rem (48px) | Extra large |
| `xxl` | 4rem (64px) | Section gaps |
| `section` | 5rem (80px) | Section padding (desktop) |
| `section-mobile` | 2.5rem (40px) | Section padding (mobile) |

**Base unit:** 8px

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `DEFAULT` | 1rem (16px) | Buttons, cards |
| `sm` | 8px | Inputs, small elements |
| `xl` | 1.5rem (24px) | Large cards |
| `pill` | 999px | Badge, tags |

### Shadows

```css
/* Card shadow */
shadow-card: 0 2px 8px rgba(10, 27, 54, 0.1);
shadow-card-hover: 0 6px 16px rgba(10, 27, 54, 0.15);

/* Button shadow (gold glow) */
shadow-button: 0 4px 12px rgba(236, 182, 21, 0.3);
shadow-button-hover: 0 6px 16px rgba(236, 182, 21, 0.4);
```

---

## 🧩 COMPONENT PATTERNS

### Buttons

**Primary Button (Gold)**
```tsx
<Link href="/pricing" className="btn-primary">
  Get Instant Quote
</Link>
```
- Background: Gold `#ECB615`
- Text: Navy `#0A1B36`
- Hover: Navy background, white text
- Shadow: Gold glow

**Secondary Button (Outline)**
```tsx
<Link href="/book" className="btn-secondary">
  Book Strategy Call
</Link>
```
- Background: Transparent
- Border: 2px solid Gold
- Text: Gold (on navy) or Navy (on white)
- Hover: Gold fill, navy text

**Secondary Light (For navy backgrounds)**
```tsx
<Link href="/voice" className="btn-secondary-light">
  Learn About V.O.I.C.E™
</Link>
```

### Cards

```tsx
// White card with hover lift
<div className="card-brand">
  Content here
</div>

// Navy card
<div className="card-navy">
  Content here
</div>
```

### Sections

```tsx
// Navy section
<section className="section-navy">
  <div className="container-content">
    Content here
  </div>
</section>

// White section
<section className="section-white">
  <div className="container-content">
    Content here
  </div>
</section>
```

### Badges

```tsx
// Gold badge (large)
<div className="badge-gold-lg">Veteran Owned & Operated</div>

// Gold badge (small)
<span className="badge-gold">NEW</span>
```

---

## 🏗️ TECHNICAL ARCHITECTURE

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 16.1.1 (App Router) | SSR, routing, API routes |
| **Runtime** | React 19.2.3 | UI components |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS |
| **Components** | shadcn/ui + Radix | Accessible UI primitives |
| **Animations** | Motion (Framer Motion 12) | Scroll animations |
| **State** | Zustand 5 | Global state management |
| **Forms** | React Hook Form + Zod | Form validation |
| **Database** | Neon (Serverless PostgreSQL) | Quote storage |
| **Email** | Brevo (Sendinblue) | Transactional emails |
| **CMS** | Ghost (Headless) | Blog content |
| **Hosting** | Vercel | Edge deployment |
| **Analytics** | Vercel Analytics + GA4 | Traffic analysis |

### Project Structure

```
scopesite-ssr/
├── ops/                        # Project documentation
│   ├── CURSOR_BRIEFING.md      # AI assistant briefing
│   ├── DECISIONS.md            # Locked architecture decisions
│   ├── SESSION_LOG.md          # Development session history
│   └── BACKLOG.md              # Future tasks
│
├── public/
│   ├── images/                 # Static images (WebP preferred)
│   ├── robots.txt              # AI crawler directives
│   ├── llms.txt                # AI/LLM information file
│   ├── llms-full.txt           # Extended AI information
│   ├── site.webmanifest        # PWA manifest
│   └── google*.html            # Search console verification
│
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Global styles + Tailwind
│   │   ├── about/
│   │   ├── web-design/
│   │   ├── voice/              # V.O.I.C.E™ service page
│   │   ├── web-apps/
│   │   ├── pricing/            # Quote calculator
│   │   ├── blog/
│   │   │   └── [slug]/         # Dynamic blog posts
│   │   ├── book/               # Booking page (Fillout embed)
│   │   ├── brief/              # Project brief form
│   │   ├── privacy-policy/
│   │   ├── terms-and-conditions/
│   │   ├── accessibility-statement/
│   │   ├── sitemap.ts          # Dynamic sitemap
│   │   └── api/                # API routes
│   │       ├── blog/           # Ghost CMS proxy
│   │       ├── briefs/         # Brief submission
│   │       ├── quote/          # Quote calculator API
│   │       └── health/         # Health check
│   │
│   ├── components/
│   │   ├── a11y/               # Accessibility components
│   │   │   ├── SkipLink.tsx    # Skip to main content
│   │   │   ├── RouteAnnouncer.tsx
│   │   │   ├── FormField.tsx   # Accessible form fields
│   │   │   └── LiveRegion.tsx  # ARIA live regions
│   │   ├── animations/         # Motion components
│   │   │   ├── FadeInOnScroll.tsx
│   │   │   ├── AnimatedCounter.tsx
│   │   │   ├── TypeWriter.tsx
│   │   │   └── LighthouseGauge.tsx
│   │   ├── blog/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── pricing/
│   │   │   └── QuoteCalculator.tsx
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── JsonLd.tsx          # Schema markup component
│   │   └── BriefForm.tsx
│   │
│   ├── hooks/
│   │   ├── useReducedMotion.ts # Respects prefers-reduced-motion
│   │   └── useMediaQuery.ts    # Responsive hooks
│   │
│   ├── lib/
│   │   ├── schema.ts           # JSON-LD schema generators
│   │   ├── ghost.ts            # Ghost CMS client
│   │   ├── brevo.ts            # Email sending
│   │   ├── pricing-config.ts   # Quote calculator config
│   │   ├── calculate-quote.ts  # Price calculation logic
│   │   └── utils.ts            # Utility functions (cn)
│   │
│   └── types/
│       └── pricing.ts          # TypeScript types
│
├── tailwind.config.ts          # Brand system config
├── next.config.ts              # Next.js config + redirects
└── package.json
```

### Key Configuration Files

**next.config.ts**
- `trailingSlash: false` - Consistent URL handling
- `output: 'standalone'` - Optimized production builds
- `experimental.optimizeCss: true` - Critical CSS inlining
- Custom headers for AI crawler optimization
- 301 redirects from legacy Wix URLs

**tailwind.config.ts**
- Complete brand colour system
- Custom font families (Paytone One, Inter)
- Custom spacing scale (8px base unit)
- Custom shadows and animations
- Typography and animation plugins

---

## 🌐 PAGE STRUCTURE & SEO

### All Pages

| Route | Title | Purpose |
|-------|-------|---------|
| `/` | Website Designer Somerset \| AI Visibility Experts | Homepage |
| `/about` | About Us \| Veteran-Owned Website Designers | About Dan & company |
| `/web-design` | Web Design Somerset \| AI-Optimised SSR Websites | SSR web design service |
| `/voice` | AI Visibility Optimisation \| V.O.I.C.E™ Methodology | V.O.I.C.E™ service |
| `/web-apps` | Custom Web Apps UK \| Bespoke Business Applications | Web applications |
| `/pricing` | Web Design Pricing UK \| Transparent Costs | Interactive quote calculator |
| `/blog` | AI Visibility & Web Design Blog \| Expert Insights | Blog index |
| `/blog/[slug]` | [Dynamic] | Individual blog posts |
| `/book` | Book a Free Strategy Call \| Web Design Consultation | Fillout booking embed |
| `/brief` | Send Us Your Project Brief | Project submission form |
| `/privacy-policy` | Privacy Policy | Legal |
| `/terms-and-conditions` | Terms & Conditions | Legal |
| `/accessibility-statement` | Accessibility Statement | WCAG compliance |

### Title Template

All page titles use the template `%s | ScopeSite Digital Studios` defined in `layout.tsx`.

### Metadata Structure

Each page exports metadata following this pattern:

```tsx
export const metadata: Metadata = {
  title: 'Page Title Here',  // Template adds brand suffix
  description: 'Description between 150-160 characters for optimal SEO.',
  openGraph: {
    title: 'Full Title | ScopeSite Digital Studios',
    description: '...',
    url: PAGE_URL,
    images: [...],
  },
  twitter: {
    card: 'summary_large_image',
    title: '...',
    description: '...',
  },
  alternates: {
    canonical: PAGE_URL,
  },
};
```

---

## 🔍 SEO & AI VISIBILITY

### Structured Data (JSON-LD)

Every page includes comprehensive schema markup via the `<JsonLd>` component:

**Site-wide schemas (in layout.tsx):**
- `Organization` with `LocalBusiness` and `ProfessionalService` types
- `WebSite` with search action

**Page-specific schemas:**
- `BreadcrumbList` - Every page
- `FAQPage` - Service pages with FAQ sections
- `Service` - Service detail pages
- `Review` - Homepage testimonials
- `Article` / `BlogPosting` - Blog posts
- `HowTo` - Process explanations
- `Offer` - Pricing page

### AI Crawler Optimization

**robots.txt explicitly welcomes:**
- GPTBot (OpenAI)
- ChatGPT-User
- Claude-Web / ClaudeBot (Anthropic)
- PerplexityBot
- Google-Extended
- Applebot-Extended
- Bingbot
- Cohere-ai
- Meta-ExternalAgent

**LLM Information Files:**
- `/llms.txt` - Summary for AI assistants
- `/llms-full.txt` - Detailed company/service information

**HTTP Headers:**
```
X-Robots-Tag: index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1
```

### 301 Redirects (Legacy Wix URLs)

| Old URL | New URL |
|---------|---------|
| `/affordable-web-design-uk` | `/web-design` |
| `/faq` | `/` |
| `/strategy-meeting-uk-web-design` | `/book` |
| `/cookie-policy` | `/privacy-policy#8-cookies-and-tracking` |
| `/how-to-get-listed-brave-search` | `/` |
| `/reviews` | `/about` |

---

## ♿ ACCESSIBILITY (WCAG 2.1 AA)

### Implemented Features

1. **Skip Link** - "Skip to main content" as first focusable element
2. **Route Announcer** - Announces page changes to screen readers
3. **Focus Management** - Visible focus rings, logical tab order
4. **Semantic HTML** - Proper heading hierarchy, landmarks
5. **ARIA Labels** - All interactive elements have accessible names
6. **Color Contrast** - All text meets WCAG AA (4.5:1 normal, 3:1 large)
7. **Reduced Motion** - Respects `prefers-reduced-motion`
8. **Form Accessibility** - Labels, error messages, required indicators

### Accessibility Components (`src/components/a11y/`)

```tsx
import { SkipLink, RouteAnnouncer, FormField, LiveRegion } from '@/components/a11y';
```

### Focus States

```css
*:focus-visible {
  outline: none;
  ring: 2px solid #ECB615;
  ring-offset: 2px;
}

/* Dark background variant */
.bg-brand-navy *:focus-visible {
  ring-offset-color: #0A1B36;
}
```

### Motion Preferences

```tsx
// Hook for reduced motion
import { useReducedMotion } from '@/hooks';

function Component() {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <StaticVersion />;
  }
  return <AnimatedVersion />;
}
```

---

## 🎬 ANIMATIONS

### Animation Philosophy

- **GPU-accelerated only** - `transform` and `opacity` only
- **Subtle and fast** - 0.3-0.6s duration max
- **Once per visit** - Scroll animations use `once: true`
- **No delay on content** - Content visible immediately
- **Respects user preferences** - Disabled for `prefers-reduced-motion`

### Animation Components

```tsx
import { 
  FadeInOnScroll, 
  StaggerContainer, 
  StaggerItem,
  AnimatedCounter,
  TypeWriter,
  LighthouseGauge 
} from '@/components/animations';
```

### Mobile Optimization

Animations are **disabled on mobile** (< 1024px viewport) to improve performance. The site uses conditional rendering:

```tsx
// HomeBelowFoldWrapper.tsx
const isMobile = useIsMobile();

if (isMobile) {
  return <HomeBelowFoldStatic reviews={reviews} />;
}
return <HomeBelowFoldAnimated reviews={reviews} />;
```

---

## 💰 PRICING CALCULATOR

### Flow

```
Step 1: Project Type → Step 2: Scope → Step 3: Add-ons → Step 4: Payment → Summary
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/quote/start` | POST | Initialize quote session |
| `/api/quote` | POST | Submit final quote |
| `/api/quote/[id]` | GET | Retrieve saved quote |

### Quote Storage

Quotes are stored in Neon PostgreSQL via the Supabase client pattern.

---

## 📝 CONTENT MANAGEMENT

### Blog (Ghost CMS)

The blog is powered by Ghost CMS in headless mode:

```tsx
// src/lib/ghost.ts
import GhostContentAPI from '@tryghost/content-api';

const api = new GhostContentAPI({
  url: process.env.GHOST_URL!,
  key: process.env.GHOST_CONTENT_API_KEY!,
  version: 'v5.0',
});
```

Blog posts are fetched server-side and rendered with proper schema markup.

---

## 📊 ANALYTICS & TRACKING

### Installed

1. **Vercel Analytics** - Core web vitals, page views
2. **Google Analytics 4** - `G-DGMRS1RD05`
3. **Google Search Console** - Verified via HTML file

```tsx
// In layout.tsx
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';

// In return
<Analytics />
<GoogleAnalytics gaId="G-DGMRS1RD05" />
```

---

## 🔐 ENVIRONMENT VARIABLES

```env
# Required for production
GHOST_URL=                    # Ghost CMS URL
GHOST_CONTENT_API_KEY=        # Ghost API key

# Database (Neon)
DATABASE_URL=                 # Neon connection string

# Email (Brevo)
BREVO_API_KEY=

# Blob Storage (Vercel)
BLOB_READ_WRITE_TOKEN=

# Google Sheets (Brief submissions)
GOOGLE_SHEETS_*=
```

---

## 🚀 DEPLOYMENT

### Vercel Configuration

- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Node Version:** 20.x
- **Framework Preset:** Next.js

### Build Output

```bash
npm run build
```

Produces standalone output in `.next/standalone/` for optimized deployment.

---

## 📞 CONTACT INFORMATION

| Channel | Value |
|---------|-------|
| **Phone** | 01373 311339 |
| **Email** | support@scopesite.co.uk |
| **Website** | https://scopesite.co.uk |
| **Address** | 4 Horse Close, Frome, Somerset, BA11, UK |
| **Founder** | Dan Cartwright |

### Social Links

- LinkedIn: https://www.linkedin.com/in/scopesite/
- Facebook: https://www.facebook.com/scopesite
- Instagram: https://www.instagram.com/follow_scopesite_graphics/
- Google Business: https://g.page/r/CRrwXXb-9sE3EAE

---

## 🛠️ DEVELOPMENT COMMANDS

```bash
# Development server
npm run dev          # Starts at http://localhost:3000

# Production build
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # ESLint check

# Database
npm run db:init      # Initialize database
npm run db:check     # Check database connection
```

---

## 📚 KEY FILES TO READ FIRST

For a new developer joining the project:

1. `ops/CURSOR_BRIEFING.md` - Full project context
2. `ops/DECISIONS.md` - Locked architecture decisions
3. `tailwind.config.ts` - Brand system implementation
4. `src/app/globals.css` - Component styles and utilities
5. `src/lib/schema.ts` - SEO schema generators
6. `src/app/layout.tsx` - Root layout structure

---

## ✅ QUALITY STANDARDS

### Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |
| LCP | < 2.5s |
| CLS | 0 |

### Code Standards

- TypeScript strict mode
- ESLint with Next.js config
- Semantic HTML
- WCAG 2.1 AA compliance
- Mobile-first responsive design
- SSR-first (client components only when necessary)

---

*"While other agencies are still trying to figure out what questions to ask, we've already got all the answers. Time to show them what proper planning looks like, mate."*

**Document Version:** 2.0  
**Created:** January 2026  
**Maintained by:** ScopeSite Digital Studios


