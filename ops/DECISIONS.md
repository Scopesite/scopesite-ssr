# SCOPESITE SSR - DECISIONS LOG
## Authoritative Record of All Locked Decisions

---

## 🚨 RULES

1. Once recorded here, a decision is **LOCKED**
2. To change a decision, create a NEW entry explaining the override
3. All agents MUST check here before proposing alternatives
4. Decisions are numbered sequentially (D001, D002, etc.)

---

## D001 - Framework Choice

**Date:** 2026-01-03
**Decision:** Next.js 14 with App Router
**Decided By:** Dan + Claude

**Rationale:**
- Best SSR support for AI crawler visibility
- App Router is the future of Next.js
- Largest ecosystem for support/plugins
- Most LLMs are trained on Next.js code
- Native Vercel integration

**Trade-offs:**
- Learning curve for App Router patterns
- Some RSC complexity
- Slightly more opinionated than alternatives

**Revisit When:** Major framework shift in industry or critical limitation discovered

---

## D002 - Hosting Platform

**Date:** 2026-01-03
**Decision:** Vercel
**Decided By:** Dan + Claude

**Rationale:**
- Native Next.js support (same company)
- Zero-config deployment
- Edge functions for API routes
- Excellent DX and preview deployments
- Good enough free tier for MVP

**Trade-offs:**
- Vendor lock-in to some degree
- Costs scale with traffic
- Some features only on Pro tier

**Revisit When:** Costs exceed £100/month or specific feature needed elsewhere

---

## D003 - Component Library

**Date:** 2026-01-03
**Decision:** shadcn/ui + Tailwind CSS
**Decided By:** Dan + Claude

**Rationale:**
- Not a dependency (copy-paste components)
- Fully customizable to brand system
- Accessible by default
- Tailwind matches 8px grid system in brand guidelines
- Active development and community

**Trade-offs:**
- More initial setup than pre-built libraries
- Need to maintain own component variations

**Revisit When:** Never - this approach allows full control

---

## D004 - Database

**Date:** 2026-01-03
**Decision:** Supabase (PostgreSQL)
**Decided By:** Dan + Claude

**Rationale:**
- Generous free tier (500MB, 2 projects)
- PostgreSQL = battle-tested
- Real-time subscriptions if needed later
- Auth ready for future features
- Good TypeScript support
- Self-hostable if needed

**Trade-offs:**
- Another service to manage
- Learning curve for Supabase-specific features

**Revisit When:** Exceeds free tier significantly or need different database type

---

## D005 - Email Service

**Date:** 2026-01-03
**Decision:** Resend
**Decided By:** Dan + Claude

**Rationale:**
- Developer-friendly API
- React Email for templates
- Good deliverability
- Simple pricing
- Modern alternative to SendGrid/Mailgun

**Trade-offs:**
- Newer service (less battle-tested)
- Limited templates compared to dedicated email platforms

**Revisit When:** Deliverability issues or need complex email automation

---

## D006 - CRM Integration Method

**Date:** 2026-01-03
**Decision:** Webhook to Zapier/N8N → OnPageCRM
**Decided By:** Dan + Claude

**Rationale:**
- OnPageCRM is existing stack
- Zapier already in use (migration to N8N planned)
- Webhook approach is flexible
- Can add multiple destinations without code changes

**Trade-offs:**
- Extra hop through automation layer
- Dependent on external service uptime

**Revisit When:** Direct OnPageCRM API becomes preferable or Zapier costs too high

---

## D007 - Pricing Tool as Primary Lead Capture

**Date:** 2026-01-03
**Decision:** Interactive pricing calculator is the main conversion mechanism
**Decided By:** Dan + Claude

**Rationale:**
- Transparent pricing is brand differentiator
- Self-qualifying leads (they see price before talking)
- Interactive = engaging
- Captures detailed project requirements
- Reduces tire-kicker calls

**Trade-offs:**
- Complex to build correctly
- Need accurate pricing data
- Must maintain as services change

**Revisit When:** Conversion data suggests different approach works better

---

## D008 - Payment Options Structure

**Date:** 2026-01-03
**Decision:** Three options: One-off, 12-month, 24-month contracts
**Decided By:** Dan

**Rationale:**
- One-off for cash-ready clients
- Monthly spreads cost for smaller businesses
- 24-month offers lower monthly for longer commitment
- All options visible for transparency

**Trade-offs:**
- More complex calculation logic
- Contract management overhead

**Revisit When:** Market feedback suggests different structure preferred

---

## D009 - Quote Submission Flow

**Date:** 2026-01-03
**Decision:** Full-stack integration: DB + Email (to client + Dan) + CRM webhook
**Decided By:** Dan

**Rationale:**
- Database stores everything for analysis/follow-up
- Email confirms to client immediately
- Dan gets notified instantly
- CRM has lead ready for pipeline management
- All async for fast user experience

**Trade-offs:**
- Multiple points of failure
- Need monitoring for each integration

**Revisit When:** Integration reliability issues or simpler flow needed

---

## D010 - Brand Implementation

**Date:** 2026-01-03
**Decision:** Follow November 2025 Brand Guidelines v2.0 exactly
**Decided By:** Dan

**Rationale:**
- Comprehensive guidelines exist
- Colours, typography, spacing all defined
- Consistency with existing materials
- Professional appearance

**Trade-offs:**
- None - guidelines are comprehensive

**Revisit When:** Brand refresh or guidelines updated

---

## D011 - MVP Scope

**Date:** 2026-01-03
**Decision:** Homepage, Pricing Tool, V.O.I.C.E™, Book Meeting, Web Design, Blog (3-5 posts)
**Decided By:** Dan + Claude

**Rationale:**
- Minimum needed to capture leads
- Core services represented
- Blog establishes authority
- Booking enables conversion

**Explicitly Excluded from MVP:**
- User accounts / dashboard
- Client portal
- Payment processing
- Full blog migration (30 posts)
- AI visibility checker tool
- Case studies page

**Revisit When:** MVP launch complete and next phase starts

---

## D012 - Voice.scopesite.co.uk Subdomain

**Date:** 2026-01-03
**Decision:** Keep AI visibility checker on subdomain for MVP, integrate later
**Decided By:** Dan + Claude

**Rationale:**
- Already working
- Separate concerns for MVP
- Can integrate in Phase 2

**Trade-offs:**
- Separate analytics/tracking
- User journey has external hop

**Revisit When:** Post-MVP integration phase

---

## D013 - V.O.I.C.E. Acronym: Conversational (not Crawler)

**Date:** 2026-06-16
**Decision:** The "C" in V.O.I.C.E.™ stands for **Conversational**, not Crawler
**Decided By:** Dan

**Canonical expansion:**
Visibility, Optimisation, for Intelligent, Conversational, Engines

**Rationale:**
- Aligns with PROJECT_BRIEF.md and the live blog post `/blog/2026-uk-ai-visibility-index`
- "Conversational" covers voice search, chat-based AI discovery, and how people actually query assistants
- "Crawler" duplicated technical SEO language already covered by Visibility and Optimisation

**Applies to:**
- All site copy, schema `DefinedTermSet` (`#voice-methodology`), FAQ answers, case studies, and downstream surfaces (CAFMO, Brain entries, glossary)

**Overrides:** Any prior Brain entries or code using "Crawler" in the acronym context

**Revisit When:** Never without a formal brand decision

---

*Last Updated: 2026-06-16*
