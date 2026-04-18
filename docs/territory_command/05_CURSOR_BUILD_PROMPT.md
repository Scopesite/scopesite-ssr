# Cursor Build Prompt - Territory Command Phase A (Neon Postgres)

**This is the CORRECTED version. scopesite.co.uk uses Neon Postgres, not Supabase. The earlier version of this document wrongly assumed Supabase - ignore any references to Supabase in older drafts.**

Copy everything between the triple-backtick blocks below and paste into Cursor Composer in your scopesite.co.uk repo.

---

## THE PROMPT

```
BUILD: Territory Command landing page and product infrastructure.

CONTEXT:
This is a new product for ScopeSite Digital Studios. We are building Phase A:
a public landing page at /territory with a postcode-and-sector availability
check, application form, waitlist form, and server-side state management via
Neon Postgres. NO Stripe checkout in Phase A (manual seat management).

DATABASE: Neon Postgres, same database scopesite.co.uk already uses via the
DATABASE_URL env var. Do NOT use Supabase. Do NOT create a new database.
Territory Command lives inside a new `territory` schema within the existing
Neon database.

Product reference: /territory is the URL. Product name is "Territory Command".
Pricing shown publicly: "From £500/month". Internal pricing: £750 setup + £500/mo
over 24 months, rolling thereafter. Premium (Gold tier) territories priced higher,
exact figure on qualifying call.

The complete spec lives in these five files in the repo at /docs/territory_command/
(note the underscore, not hyphen):

- 01_MASTER_BUILD_DOCUMENT.md (page structure, all copy, schema.org markup)
- 02_INDUSTRY_TAXONOMY.csv (62 industries, SIC codes, categories)
- 03_NEON_SCHEMA.sql (9 tables in new `territory` schema, Neon-compatible)
- 04_SEED_DATA.sql (10 territories, 62 sectors, 434 seats, 900 ops names)
- 05_CURSOR_BUILD_PROMPT.md (this file, for reference)

READ ALL FIVE BEFORE WRITING ANY CODE. The copy in the master document is the
source of truth for all page text. Do not generate new copy. Use the exact
wording provided.

STACK (existing):
- Next.js App Router
- TypeScript
- Tailwind CSS
- Neon Postgres (database, connection via DATABASE_URL)
- Vercel deployment
- HubSpot integration (check current wiring)
- Email sending (use whatever is already wired up in the repo, likely Resend
  or Brevo - check package.json and existing usage before installing anything)

BEFORE PHASE 1: CONFIRM THE STACK
---------------------------------
Do NOT install any new packages before answering these questions and showing
me the answers:

1. What Postgres driver does the repo already use? Check package.json for:
   - @neondatabase/serverless (Neon's edge-compatible driver)
   - @vercel/postgres (Vercel's wrapper, uses Neon under the hood)
   - pg or postgres.js (standard Node Postgres clients)
   - drizzle-orm or prisma (ORM layers)
   Whichever is already installed, reuse its connection pattern. Do not
   introduce a new client unless nothing is there.

2. What email library is already installed? Check package.json for resend,
   nodemailer, @sendgrid/mail, brevo, or any other email SDK. Reuse it.

3. Is there an existing lib/db.ts, lib/database.ts, src/lib/db.ts or similar?
   If yes, use that pattern for the Territory Command DB access.

4. Report back what you found before proceeding to Phase 1.

PHASE 1: DATABASE SETUP
-----------------------
1. Run /docs/territory_command/03_NEON_SCHEMA.sql against the Neon database.
   Use the Neon SQL Editor in the Neon dashboard, or:
   `psql $DATABASE_URL -f docs/territory_command/03_NEON_SCHEMA.sql`
2. Run /docs/territory_command/04_SEED_DATA.sql to populate initial data.
3. Verify row counts via the verification queries at the bottom of the seed
   file:
   - 10 territories
   - 62 sectors
   - 434 seats (28 available, 406 not_active)
   - 900 operation_name_pool rows
   - 28 area_intelligence rows
4. Report back with the verified row counts before proceeding.

PHASE 2: SHARED TYPES AND DATABASE CLIENT
------------------------------------------
Create /src/lib/territory/types.ts with TypeScript types matching the schema:
- Territory, Sector, Seat, SeatState ('available'|'pending'|'claimed'|'not_active'),
  Tier ('standard'|'premium'), Application, WaitlistEntry, AreaIntelligence.

Create /src/lib/territory/db.ts that exports a database client using the
repo's existing Postgres driver pattern (identified in the pre-Phase 1 check).
All connections use the server-side DATABASE_URL env var. NEVER expose this
to the client.

Create /src/lib/territory/queries.ts with these functions:
- checkAvailability(postcode: string, sectorSlug: string)
  Returns: { seat, territory, sector, areaIntelligence, state, tier }
  Logic: normalise postcode (uppercase, trim). Look up territory by postcode
  (case-insensitive). Look up sector by slug. Find matching seat. Return the
  state. If no territory match, return { state: 'territory_not_found' }.

- getFeaturedSectors()
  Returns: active + featured sectors for the Layer 1 hero buttons.

- getAllSectorsForBrowse()
  Returns: all sectors grouped by category for the browse modal.

- getSectorsByTypeahead(query: string)
  Returns: sectors where label ILIKE %query% (minimum 2 chars, max 10 results).

- createApplication(payload) and createWaitlistEntry(payload)
  Writes to applications or waitlist tables. Updates seat state to 'pending'
  with pending_until = NOW() + 48 hours for applications.

PHASE 3: API ROUTES
-------------------
Create these route handlers under /src/app/api/territory/:

1. /src/app/api/territory/check/route.ts (POST)
   Request: { postcode: string, sectorSlug: string }
   Response: { state, tier, seatId, territoryLabel, sectorLabel, areaIntelligence }
   Handles all 5 state outcomes plus 'territory_not_found' for invalid postcodes.
   Validate inputs with Zod. Rate limit on IP.

2. /src/app/api/territory/featured-sectors/route.ts (GET)
   Response: Array of featured sectors with live available-count per sector.
   Cached at the edge for 60 seconds.

3. /src/app/api/territory/browse-sectors/route.ts (GET)
   Response: All sectors grouped by category. Use for browse modal.
   Cached at the edge for 60 seconds.

4. /src/app/api/territory/typeahead/route.ts (GET, query param: q)
   Response: Array of matching sectors. Case-insensitive, label ILIKE.
   Sanitise query parameter. Rate limit on IP.

5. /src/app/api/territory/apply/route.ts (POST)
   Request: Full application form payload.
   Response: { applicationId, pendingUntil, confirmationEmailSent }
   Side effects:
   a) Zod-validate all inputs. Reject if invalid.
   b) Insert applications row (status='received')
   c) Update seat: state='pending', pending_until=NOW()+48h,
      current_application_id=new app id
   d) Send admin email to dan@scopesite.co.uk (see master doc section 3
      "Admin notification email")
   e) Send confirmation email to applicant (adapt from master doc
      "Application confirmation page copy")
   f) Create HubSpot contact and deal (pipeline: "Territory Command",
      stage: "Application Received")
   g) Return applicationId so frontend can navigate to /territory/confirmed
   Rate limit hard on IP and email. One application per email per 24 hours.

6. /src/app/api/territory/waitlist/route.ts (POST)
   Request: { seatId, contactName, contactEmail, firmName }
   Response: { waitlistId, position }
   Side effects:
   a) Zod-validate inputs
   b) Insert waitlist row
   c) Calculate position (next unoccupied integer for this seat)
   d) Send confirmation email to joiner

PHASE 4: PAGE COMPONENTS
------------------------
Create /src/app/territory/page.tsx as the main landing page. Follow the page
structure in the master document section 2. Components to create under
/src/components/territory/:

1. TerritoryHero.tsx
   - Eyebrow, headline, sub-headline, price strip
   - Embeds the TerritoryChecker component
   - Copy: master doc section 3 "Hero"

2. TerritoryChecker.tsx (the hero interactive)
   - Postcode input (uppercase auto-format, UK postcode regex validation)
   - Sector selector with 3 layers:
     Layer 1: Featured buttons (4 buttons for active sectors)
     Layer 2: Typeahead search input with autocomplete dropdown
     Layer 3: "Browse all industries" link opens modal
   - "Check availability" CTA
   - On submit, POSTs to /api/territory/check and renders the ResultCard below
   - State: postcode, selectedSector, isLoading, result

3. ResultCard.tsx
   - Renders one of 5 states based on check response
   - Uses state-specific copy from master doc section 3 "Result state copy"
   - Green/Gold states: CTA "Apply for this territory" links to
     /territory/apply?seat=[seatId]
   - Amber/Red/Grey states: CTA "Join the waitlist" opens WaitlistForm modal
   - Secondary CTA "Check a different territory" resets TerritoryChecker

4. SectorBrowseModal.tsx
   - Modal with 6 category columns
   - Each column lists sectors in that category
   - Click a sector = selects it and closes modal

5. MechanismSection.tsx (3 numbered cards)
6. WhatYouGetSection.tsx (4 deliverable cards)
7. ProofSection.tsx (3 cards with Google AI Overview images + H4TLT link)
8. GuaranteeSection.tsx (single emphasis block)
9. FAQSection.tsx (8 questions with accordion pattern)
10. FinalCTA.tsx (scrolls back to hero)
11. SchemaOrgMarkup.tsx (injects the JSON-LD from master doc section 5)

Create /src/app/territory/apply/page.tsx for the application form:
- Reads ?seat=[seatId] from URL params
- Fetches seat details to display "Application for [POSTCODE] [SECTOR]"
- Form fields per master doc section 3 "Application form copy"
- Submit button posts to /api/territory/apply
- On success, router.push to /territory/confirmed?applicationId=...

Create /src/app/territory/confirmed/page.tsx:
- Reads ?applicationId from URL params
- Fetches application details server-side
- Shows copy from master doc section 3 "Application confirmation page copy"
- Calendly link as primary CTA

Create /src/app/territory/waitlist-confirmed/page.tsx:
- Similar to confirmed page but for waitlist joiners
- Shows position in queue

PHASE 5: SCHEMA.ORG MARKUP
--------------------------
Inject the JSON-LD from master doc section 5 into /src/app/territory/page.tsx
via a Script component with type="application/ld+json". Use Next.js `<Script>`
with `strategy="afterInteractive"` or inline in a `<script>` tag in the head
via the metadata export (whichever pattern the existing site uses).

No changes to sameAs array needed. Do NOT add Wikidata references (the entity
Q138866631 was deleted 6 April 2026, separate Cursor task handles its removal).

PHASE 6: STYLING
----------------
Use existing Tailwind classes and the ScopeSite design tokens already in the
project. New state colour variables needed (add to tailwind.config.ts if not
already present):

- territory-available: #F5B700 (ScopeSite Gold, likely already present)
- territory-pending: #F59E0B
- territory-claimed: #B91C1C
- territory-inactive: #64748B
- territory-premium: #D4A017

Follow existing ScopeSite patterns for spacing, typography, card design,
button styles. No new design system. This should feel native to the existing
scopesite.co.uk site.

PHASE 7: INTEGRATIONS
---------------------
HubSpot:
- Create a new pipeline in HubSpot called "Territory Command" if it does not
  already exist. Check via HubSpot MCP tool if connected.
- Pipeline stages: "Application Received" -> "Qualifying Call Booked" ->
  "Qualifying Call Held" -> "Contract Sent" -> "Signed" -> (Closed Won) /
  "Declined" / "No Response" (Closed Lost).
- When a new application is submitted, create a contact (upsert by email)
  and a deal in the "Application Received" stage.
- Store the hubspot_contact_id and hubspot_deal_id on the applications row.

Email:
- Use the existing email service in the project (identified in pre-Phase 1
  check). Do NOT install a new email library.
- Admin email goes to dan@scopesite.co.uk
- Confirmation emails to the applicant's submitted email
- Use the exact copy from master doc section 3.

PHASE 8: CRON JOB FOR PENDING EXPIRY
-------------------------------------
Create /src/app/api/cron/territory/expire-pending/route.ts:
- Validates CRON_SECRET header before doing anything. Reject 401 if missing
  or wrong.
- Calls territory.expire_pending_seats() function on Neon
- Returns count of expired applications as JSON
- Add to vercel.json as a scheduled cron: every 15 minutes
- Add CRON_SECRET env var (generate a 32-character random string)

PHASE 9: TESTING CHECKLIST
--------------------------
Before declaring done, manually verify each of these flows in dev:

1. Hit /territory, verify page loads with all 8 sections visible.
2. Select "Solicitors" featured button, enter "BA11", click "Check availability".
   Expect GREEN state with copy "BA11 Solicitors is available."
3. Click "Apply for this territory", verify /territory/apply loads with the
   correct seat preloaded.
4. Fill out application form, submit. Verify:
   - /territory/confirmed page loads
   - Admin email received at dan@scopesite.co.uk
   - Confirmation email received at applicant email
   - HubSpot contact and deal created
   - Seat state in Neon updated to 'pending' (check via Neon dashboard)
   - pending_until timestamp is roughly 48h from now
5. Hit /territory again, check BA11 Solicitors. Expect AMBER state with copy
   "BA11 Solicitors has a pending application."
6. Click "Join the waitlist", submit waitlist form. Verify:
   - Waitlist row created with position 1
   - Confirmation email received
7. Check a premium territory (BS1 Solicitors). Expect GOLD state.
8. Check an inactive sector (enter BA11 + "Plumbers" via typeahead).
   Expect GREY state.
9. Check an invalid postcode (e.g. "XX99"). Expect "Territory not found"
   graceful error.
10. Run cron endpoint manually with CRON_SECRET header. Verify any pending
    applications with pending_until in the past are expired back to 'available'.

PHASE 10: DEPLOY
----------------
1. Commit all changes with message:
   "feat(territory): Phase A build - landing page, application flow, Neon schema"
2. Push to main.
3. Monitor Vercel deploy logs for errors.
4. Verify scopesite.co.uk/territory renders correctly in production.
5. Run the 10-step testing checklist in production.

WHAT NOT TO DO
--------------
- Do NOT use Supabase. Use Neon Postgres, same DATABASE_URL the rest of the
  site uses.
- Do NOT install @supabase/supabase-js. Use the Postgres driver already in
  the repo.
- Do NOT create a new database. Add a `territory` schema to the existing one.
- Do NOT invent copy. Use the exact copy from master doc section 3.
- Do NOT add Stripe checkout. Phase A is manual seat management only.
- Do NOT add em dashes anywhere in copy. ScopeSite brand rule.
- Do NOT use banned marketing words: revolutionary, seamless, cutting-edge,
  game-changing, transformative, unlock, empower, leverage, robust, scalable,
  innovative, disruptive.
- Do NOT add Wikidata references to sameAs. Entity was deleted 6 April 2026.
- Do NOT add new npm packages unless strictly necessary and explicitly justified.
- Do NOT change the existing V.O.I.C.E. scanner tables or API routes (they
  live on a completely separate Supabase database on Railway, not in this
  codebase).

SURGICAL EDIT DISCIPLINE
------------------------
All new code goes under /src/app/territory/*, /src/lib/territory/*, and
/src/components/territory/*. The only existing files you should touch are:
- tailwind.config.ts (add territory state colours, if not present)
- vercel.json (add cron schedule)
- possibly the nav component (add "Territory" menu link, show me first)

If you find yourself modifying anything else, STOP and tell me. That is a
scope creep signal.

ACCEPTANCE CRITERIA
-------------------
Cursor, before declaring the task complete, confirm:
- [ ] Postgres driver, email library, and existing DB pattern all identified
      BEFORE Phase 1 started
- [ ] Schema and seed SQL executed successfully on Neon with verified row counts
- [ ] All 11 components created
- [ ] All 6 API routes created with Zod validation and rate limiting
- [ ] 10-step testing checklist passed
- [ ] Production deploy verified
- [ ] No scope creep into unrelated code
- [ ] No new npm packages installed beyond what was justified and approved
- [ ] HubSpot pipeline "Territory Command" exists with contact and deal flow
- [ ] Admin email, applicant confirmation email, and waitlist email all tested
- [ ] Cron job registered in vercel.json with CRON_SECRET validation
- [ ] Schema.org markup validates via validator.schema.org

Show me the plan BEFORE writing any code. Show me the commit diff BEFORE
pushing. Wait for my explicit confirmation at each gate.
```

---

## How to use this prompt

### Step 1: Confirm the spec files are in the right place

The spec files need to be at `/docs/territory_command/` (with underscore, not
hyphen) in the repo. Check with:

```bash
ls -la docs/territory_command/
```

You should see the 5 files. If they are in the wrong spot or missing:

```bash
cd /path/to/scopesite.co.uk
mkdir -p docs/territory_command
cp ~/Downloads/territory_command/*.md docs/territory_command/
cp ~/Downloads/territory_command/*.csv docs/territory_command/
cp ~/Downloads/territory_command/*.sql docs/territory_command/
git add docs/territory_command/
git commit -m "docs(territory): Add Phase A Neon-ready build spec documents"
git push
```

### Step 2: Open Cursor Composer

Press Cmd+I (Mac) or Ctrl+I (Windows/Linux) in Cursor. Opens the Composer
panel.

### Step 3: Paste the prompt

Paste everything between the triple-backtick blocks above into the Composer
input. The prompt is self-contained.

### Step 4: Watch Cursor work

Cursor will:
1. Confirm the stack first (Postgres driver, email library, existing DB
   patterns)
2. Read the five spec documents
3. Produce a plan BEFORE writing code
4. Ask any clarifying questions
5. Create files in the correct locations with your approval at each phase

### Step 5: Review each phase before approval

Do NOT approve everything blindly. Review:
- Copy matches the master document exactly
- No em dashes
- No banned words
- Schema.org JSON-LD validates
- API routes handle error cases and have rate limiting
- HubSpot integration is correctly configured
- No Supabase references anywhere

### Step 6: Run the testing checklist

Phase 9 has a 10-step testing checklist. Run every step before merging to
production. If any step fails, fix it before moving on.

### Step 7: Deploy

Once all tests pass and the commit diff is clean, push to main. Vercel
auto-deploys. Monitor logs. Verify production rendering.

---

## If Cursor goes off-script

**Cursor tries to install @supabase/supabase-js or mentions Supabase.**
Stop it. This repo is on Neon. Point it at the Postgres driver already in
package.json.

**Cursor invents new copy.**
Stop it. All copy is in the master document. Refer it back to section 3.

**Cursor modifies files outside the territory directories.**
Stop it unless it is tailwind.config.ts, vercel.json, or the nav component.
Any other file is scope creep.

**Cursor wants to deploy without testing.**
Hold it. Run the 10-step testing checklist first. No exceptions.

---

## After Phase A ships

Phase B will add:
- Stripe checkout for self-serve signup on available seats
- Automated contract generation and e-signature
- First-invoice raising automation
- Client portal shell at /portal (fetches V.O.I.C.E. scores via HTTP API to
  voice.scopesite.co.uk, NOT via cross-database query)
- Real-time seat availability via Neon's replication slot or polling

Phase C longer term:
- Multi-region territory expansion (Scotland, Wales, Northern Ireland)
- API for agency partners to check territory availability
- Revenue reporting dashboard
- Sector graduation logic (auto-promote sectors from waitlist-heavy to active)

Keep the spec documents in /docs/territory_command/ as the canonical reference
for future phases.
