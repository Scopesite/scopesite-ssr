# AGENTS.md

## Cursor Cloud specific instructions

ScopeSite SSR is a Next.js 16 (App Router, Turbopack) marketing website for ScopeSite
Digital Studios. React 19, Tailwind CSS, TypeScript (strict). It is a single app, not a
monorepo.

### Commands (see `package.json` scripts)

- Dev server: `npm run dev` (serves on `http://localhost:3000`)
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Tests: `npm test` (Vitest, files under `src/**/*.test.ts(x)`)
- Production build: `npm run build`

The update script already runs `npm install`, so dependencies are in place at session start.

### What runs without secrets vs what needs them

The **public marketing site runs fully with no environment variables**: home, service/location
pages, blog, glossary, and the client-side site search (Fuse.js, fed by `/api/search-glossary`
which reads MDX from disk). Use site search as a quick smoke test of a working action.

`ClerkProvider` only wraps `/portal/*`, and `middleware.ts` only matches `/portal`,
`/api/portal`, and `/api/webhooks`. So **Clerk keys are NOT required to run or browse the
marketing site** — they are only needed to exercise the portal/auth flows.

**Integration features are secret-gated** and will fail without keys in `.env.local`:

- Quote, brief, portal, and glossary persistence call a **Neon Postgres** database via
  `@neondatabase/serverless`. `src/lib/db.ts` reads `POSTGRES_URL` or `DATABASE_URL`. Missing
  it makes those API routes return HTTP 500 (e.g. `POST /api/quote/start`). The quote
  calculator UI works through its steps, but the email-capture step fails without the DB.
- The DB driver uses Neon's **HTTP `neon()` function**, so it needs a real Neon endpoint. A
  plain local Postgres will not work without a Neon HTTP proxy.
- Other integrations needing keys: Clerk (`CLERK_SECRET_KEY`,
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`), Stripe, Brevo (`BREVO_API_KEY`), and the homepage
  speed-test tool (`GOOGLE_PAGESPEED_API_KEY`).

Note: `.env.example` is incomplete (only Brevo + analytics keys). Add `DATABASE_URL` (and any
other integration keys) to `.env.local` to test DB-backed flows. DB helper scripts
(`npm run db:init`, `npm run db:check`) load `.env.local` and create/inspect tables.

### Lint status

`npm run lint` currently reports pre-existing errors (mostly React 19 compiler purity rules,
e.g. `Date.now`/impure calls during render) plus warnings. These exist in the committed
codebase and are not caused by environment setup.
