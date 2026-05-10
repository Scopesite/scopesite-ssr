# Territory Command - Master Build Document

**Product:** Territory Command by ScopeSite
**URL:** https://scopesite.co.uk/territory
**Status:** Phase A (static page + Neon Postgres, no Stripe checkout yet)
**Build Date:** April 2026
**Build Kit Version:** 1.0

---

## Section 1: Product Summary (Single Source of Truth)

**What it is:** Exclusive AI visibility representation. One firm per postcode per sector.

**Pricing (internal, public shows "From £500/month"):**
- Setup fee: £750
- Monthly: £500 for 24 months, rolling monthly thereafter
- Premium (Gold tier) territories: priced higher, exact figure on qualifying call
- Total first 24 months: £12,750

**Deliverables (what the client gets):**
1. Exclusive claim on their postcode for their sector
2. Unlimited PRO V.O.I.C.E. scans on their domain
3. Monthly Sit-Rep (situation report on their AI visibility)
4. Continuous Visibility Engineering (ongoing schema, content, entity work)
5. Outcome Guarantee: V.O.I.C.E. score above 80/100, or next month's free and we engineer back to target

**The funnel:**
Qualify (on page) → Apply (on page) → Sell (on qualifying call)

Education happens upstream in marketing. The page filters, it does not teach.

---

## Section 2: Page Structure

### Above the fold (Qualify)

```
+---------------------------------------------------+
|  NAV (existing ScopeSite nav)                     |
+---------------------------------------------------+
|                                                   |
|  HERO                                             |
|  Headline: One postcode. One sector. One firm.    |
|  Subline: Exclusive AI visibility representation  |
|  in your territory. No competitor can claim what  |
|  you hold.                                        |
|                                                   |
|  [Postcode input]  [Sector dropdown]  [Check]     |
|                                                   |
|  From £500/month. Full pricing on your            |
|  qualifying call.                                 |
|                                                   |
+---------------------------------------------------+
```

**Interactive elements:**
- Postcode input (UK postcode validation, uppercase auto-format)
- Sector selector (3-layer: featured buttons + typeahead + category browse)
- "Check availability" CTA (primary button, ScopeSite gold)

**Sector selector UX (3 layers):**

**Layer 1: Featured buttons (above the dropdown)**
Four large visual buttons for the active sectors:
- Solicitors
- Accountants
- Estate Agents
- Dental Practices

Each shows a live count: "7 territories available" pulled from seats table.

**Layer 2: Typeahead search (default state if none of the above)**
Text input: "Or search for your industry..."
Autocomplete triggers at 2 characters. Draws from the full sectors table.

**Layer 3: Category browse (fallback link)**
Small link below: "Browse all industries"
Opens modal with 6 category columns (Professional Services, Home Services, Hospitality, Retail, Health & Beauty, Trades & Commercial).

### Below the fold (Mechanism + Proof)

```
+---------------------------------------------------+
|  MECHANISM (how it works)                         |
|  Three numbered cards:                            |
|  1. Check your territory                          |
|  2. Apply (we hold it for 48 hours)               |
|  3. Qualifying call, contract, engineering begins |
+---------------------------------------------------+
|                                                   |
|  WHAT YOU GET (deliverables grid)                 |
|  Four cards:                                      |
|  - Exclusive territorial claim                    |
|  - Unlimited PRO V.O.I.C.E. scans                 |
|  - Monthly Sit-Rep                                |
|  - Outcome Guarantee (80/100 or free month)       |
|                                                   |
+---------------------------------------------------+
|                                                   |
|  PROOF                                            |
|  - Google AI Overview screenshot (Somerset)       |
|  - Google AI Overview screenshot (V.O.I.C.E. as   |
|    category term)                                 |
|  - H4TLT case study link                          |
|                                                   |
+---------------------------------------------------+
|                                                   |
|  THE GUARANTEE (single-card emphasis block)       |
|  "Your V.O.I.C.E. score above 80/100 every month,|
|   or next month is free and we engineer it back   |
|   to target at no extra cost."                    |
|                                                   |
+---------------------------------------------------+
|                                                   |
|  FAQ (6-8 questions)                              |
|  - What is a Territory?                           |
|  - What is V.O.I.C.E.?                            |
|  - What is a Sit-Rep?                             |
|  - How does exclusivity work?                     |
|  - What happens if I don't hit the score?         |
|  - Can I change territory later?                  |
|  - What if my industry isn't active yet?          |
|  - Can I cancel the 24 month term?                |
|                                                   |
+---------------------------------------------------+
|                                                   |
|  FINAL CTA                                        |
|  "Check your territory" (scrolls back to hero)    |
|                                                   |
+---------------------------------------------------+
|  FOOTER (existing ScopeSite footer)               |
+---------------------------------------------------+
```

### Result state views (shown below hero after postcode+sector check)

One of five possible states renders, replacing the default below-fold content temporarily with a result card, then continuing to the mechanism/proof/guarantee/FAQ sections.

```
+---------------------------------------------------+
|  RESULT CARD                                      |
|  [State icon] [State label]                       |
|  [State-specific headline]                        |
|  [State-specific body]                            |
|  [State-specific CTA]                             |
|  [Secondary: "Check a different territory"]       |
+---------------------------------------------------+
```

### Application form (separate view, /territory/apply)

Triggered by GREEN or GOLD state CTA. Shows:

```
+---------------------------------------------------+
|  APPLICATION FOR [POSTCODE] [SECTOR]              |
|                                                   |
|  Firm name *                                      |
|  Your name *                                      |
|  Your role * (Director/Partner/MD/Owner/Other)    |
|  Email *                                          |
|  Phone                                            |
|  Website URL *                                    |
|  Firm postcode * (auto-filled)                    |
|                                                   |
|  Current AI visibility approach                   |
|  (None / SEO agency / In-house / Other)           |
|                                                   |
|  What's prompted this application?                |
|  (optional textarea)                              |
|                                                   |
|  [Submit Application]                             |
|                                                   |
|  "By applying you're requesting a qualifying call.|
|  Your territory is held for 48 hours. No payment  |
|  taken at this stage."                            |
+---------------------------------------------------+
```

### Waitlist form (shown on AMBER, RED, or GREY states)

```
+---------------------------------------------------+
|  JOIN THE WAITLIST FOR [POSTCODE] [SECTOR]        |
|                                                   |
|  Firm name *                                      |
|  Your name *                                      |
|  Email *                                          |
|                                                   |
|  [Join Waitlist]                                  |
|                                                   |
|  "We'll email you the moment this territory       |
|  becomes available."                              |
+---------------------------------------------------+
```

---

## Section 3: All Copy

### Hero

**Eyebrow label:** TERRITORY COMMAND

**Headline:** One postcode. One sector. One firm.

**Sub-headline:** Exclusive AI visibility representation in your territory. No competitor can claim what you hold.

**Price strip:** From £500/month. Full pricing discussed on your qualifying call.

**Input placeholders:**
- Postcode field: "e.g. BA11"
- Sector dropdown default: "Select your industry"

**CTA button:** Check availability

---

### Mechanism section

**Section title:** How it works

**Card 1: Check**
**Title:** Check your territory
**Body:** Enter your postcode and your sector. We tell you instantly whether your territory is available, held, or claimed.

**Card 2: Apply**
**Title:** Apply. We hold it 48 hours.
**Body:** If your territory is clear, submit an application. We mark it pending in your name for 48 hours while we arrange a qualifying call.

**Card 3: Command**
**Title:** Contract signed. Engineering begins.
**Body:** After the qualifying call, a 24-month exclusive contract is signed. Your Operation starts. Unlimited scans, monthly Sit-Rep, and the guarantee all activate from day one.

---

### What You Get section

**Section title:** What comes with Territory Command

**Card 1**
**Title:** Exclusive territorial claim
**Body:** One firm per postcode per sector. No competitor in your territory can buy the same representation while you hold it. Claims are contracted for 24 months.

**Card 2**
**Title:** Unlimited PRO V.O.I.C.E. scans
**Body:** Full access to our PRO AI visibility scanner on your domain. Run it as often as you want. Track every change. See what crawlers see.

**Card 3**
**Title:** Monthly Sit-Rep
**Body:** A focused situation report on your AI visibility every month. What's changed, what's ranking, what the scanner caught, what we engineered, and what's next.

**Card 4**
**Title:** Outcome Guarantee
**Body:** Your V.O.I.C.E. score above 80/100 every month. If it drops below 80 in any calendar month, the next month is free AND we engineer it back to target at no extra cost.

---

### Proof section

**Section title:** The methodology, proven

**Card 1 (Google AI Overview, Somerset query)**
**Caption:** Google's AI Overview cites ScopeSite and V.O.I.C.E. methodology by name for Somerset AI SEO queries.
**Image:** google_ai_overview_somerset_voice.png

**Card 2 (Google AI Overview, scanner query)**
**Caption:** Google's AI Overview lists V.O.I.C.E. as the industry term for AI citation analysis.
**Image:** google_ai_overview_voice_category_term.png

**Card 3 (H4TLT case study)**
**Caption:** H4TLT reached top AI citations across ChatGPT, Perplexity, Claude and Gemini for occupational hearing health in under 6 months.
**Link:** Read the case study

---

### Guarantee section

**Section title:** The guarantee, in writing

**Body copy:**
"Your V.O.I.C.E. score above 80/100 every month. If it drops below 80 in any calendar month, the next month is free. And we engineer it back to target at no extra cost. Two ways we take responsibility, because your score is our commitment.

This guarantee is written into every Territory Command contract. It is not a marketing claim. It is a service level."

---

### FAQ section

**Section title:** Questions we get asked

**Q1: What exactly is a Territory?**
A: A Territory is your postcode paired with your sector. For example, BA11 Solicitors is one Territory. BA11 Accountants is a different Territory. One firm holds each Territory exclusively.

**Q2: What is V.O.I.C.E.?**
A: V.O.I.C.E. is our methodology for AI visibility engineering. It stands for Visibility, Optimisation, for Intelligent, Crawler, Engines. The V.O.I.C.E. scanner measures how AI platforms like ChatGPT, Perplexity, Claude and Google AI Overviews see your business. Your score runs from 0 to 100.

**Q3: What is a Sit-Rep?**
A: A monthly situation report on your AI visibility. It covers what changed in your score and why, where your competitors moved, what we engineered that month, what crawlers picked up, and what we are targeting next. It is the record of work delivered against your guarantee.

**Q4: How does exclusivity actually work?**
A: When you sign, your Territory is marked as claimed in our system for 24 months. We do not take on any other client in your postcode and sector during that period. If a competitor applies for the same Territory, they join the waitlist and are notified only if your Territory is released.

**Q5: What happens if my V.O.I.C.E. score drops below 80?**
A: Next month's fee is waived automatically. We then engineer your score back to target at no additional cost. Both responses happen together. Not one or the other.

**Q6: Can I move my Territory later?**
A: Territories are tied to a specific postcode. If your business relocates, we transfer your claim to the new postcode provided it is available. If the new postcode is already claimed by another firm, we offer waitlist priority or an alternative adjacent territory.

**Q7: What if my industry is not active yet?**
A: Register your interest on the waitlist. We launch sectors based on demand signals. When your industry goes live, you are notified in order of waitlist position and given first right of application on your postcode.

**Q8: Can I cancel the 24 month term?**
A: The 24 month term is a commercial commitment from both sides. Early termination terms are covered in your contract. After 24 months it rolls monthly, cancel any time with 30 days notice.

---

### Result state copy

**GREEN (Available)**
**Icon:** Green tick circle
**Label:** Available
**Headline:** [POSTCODE] [SECTOR] is available
**Body:** You are the first firm to check this territory. If you apply in the next 48 hours, we hold it for you while we arrange a qualifying call. Full pricing and terms are discussed on the call.
**Primary CTA:** Apply for this territory
**Secondary CTA:** Check a different territory

**AMBER (Pending)**
**Icon:** Amber clock circle
**Label:** Pending
**Headline:** [POSTCODE] [SECTOR] has a pending application
**Body:** Another firm has applied within the last 48 hours. We are holding this territory for them while we arrange a qualifying call. If they do not convert to a signed contract, the territory returns to available and waitlist members are notified in order.
**Primary CTA:** Join the waitlist
**Secondary CTA:** Check a different territory

**RED (Claimed)**
**Icon:** Red lock circle
**Label:** Claimed
**Headline:** [POSTCODE] [SECTOR] is claimed
**Body:** This territory is under contract with a firm in your sector and postcode. Claims are reviewed on a 24 month cycle. Join the waitlist and we will notify you if this territory is released or if an adjacent territory opens in your sector.
**Primary CTA:** Join the waitlist
**Secondary CTA:** Check a different territory

**GREY (Sector Not Active)**
**Icon:** Grey dot circle
**Label:** Not yet live
**Headline:** [SECTOR] is not currently live
**Body:** We launch sectors based on demand. Register your interest and we will prioritise your industry based on waitlist volume. When your sector goes live, you are notified in order and given first right of application on your postcode.
**Primary CTA:** Register your interest
**Secondary CTA:** Check a different territory

**GOLD (Premium Territory)**
**Icon:** Gold star circle
**Label:** Premium territory
**Headline:** [POSTCODE] [SECTOR] is a premium territory
**Body:** This is a high-density professional services market. Pricing starts above the standard £500 per month based on competitor density and market size. Full pricing is discussed on your qualifying call. The application process is identical to standard territories.
**Primary CTA:** Apply for this territory
**Secondary CTA:** Check a different territory

---

### Application form copy

**Page title:** Application: [POSTCODE] [SECTOR]

**Instruction:** Fill this in. We hold your territory for 48 hours from submission. Dan will email you within 4 working hours to book a 30 minute qualifying call.

**Form field labels:**
- Firm name
- Your name
- Your role (dropdown: Director, Partner, Managing Director, Owner, Other)
- Email address
- Phone number (optional)
- Website URL
- Your firm's postcode (auto-filled from the check)
- Current AI visibility approach (dropdown: None, Existing SEO agency, In-house marketing, Other)
- What's prompted this application? (optional textarea, placeholder: "Context helps us prepare for the call. What's changed recently in your market or your marketing?")

**Submit button:** Submit Application

**Below form disclaimer:**
"No payment is taken at this stage. You are requesting a qualifying call. The territory is held in your name for 48 hours while we arrange it. Pricing, setup fees, contract terms and engineering scope are all discussed on the call. You are free to withdraw at any point before signing."

---

### Application confirmation page copy

**Page title:** Application received

**Headline:** Your territory is held

**Body:**
"[POSTCODE] [SECTOR] is now marked as pending in your name. You have 48 hours to book the qualifying call before the territory returns to available.

Dan will email you within the next 4 working hours to schedule.

Can't wait? Book directly on the calendar link below.

Any questions, reply to the confirmation email or call 01373 311 339."

**Primary CTA:** Book call directly on Dan's calendar (links to Calendly)
**Secondary CTA:** Return to Territory Command

---

### Waitlist confirmation page copy

**Page title:** You are on the waitlist

**Headline:** You are on the waitlist for [POSTCODE] [SECTOR]

**Body:**
"We will email you the moment this territory becomes available. If it is released from contract, waitlist members are notified in the order they joined. First right of application goes to position 1."

**Secondary CTA:** Return to Territory Command

---

### Admin notification email (to Dan)

**Subject:** Territory Command application: [FIRM_NAME] for [POSTCODE] [SECTOR]

**Body:**
New Territory Command application.

Firm: [firm_name]
Contact: [contact_name] ([contact_email])
Role: [contact_role]
Phone: [contact_phone]
Website: [website_url]
Territory: [postcode] [sector]
State after: Pending (held 48 hours)
Current AI approach: [ai_approach]

Context provided:
[additional_context]

Respond within 4 working hours to maintain the 48-hour pending window.

HubSpot deal: [hubspot_deal_link]
Application ID: [application_id]

---

### Waitlist notification email (to prospect, when territory released)

**Subject:** [POSTCODE] [SECTOR] is available

**Body:**
Hi [contact_name],

The Territory Command slot for [postcode] [sector] has become available. You were on the waitlist at position [position].

First right of application goes to the earliest waitlist member. You have 24 hours to submit your application before position 2 is notified.

Apply here: https://scopesite.co.uk/territory?apply=[seat_id]

Cheers,
Dan
ScopeSite Digital Studios

---

## Section 4: Visual Design Notes

### State colour palette (keep consistent with ScopeSite brand)

| State | Primary colour | Hex | Usage |
|---|---|---|---|
| Green (Available) | ScopeSite Gold | #F5B700 | Hero CTAs, active availability |
| Amber (Pending) | Warm amber | #F59E0B | Pending application indicators |
| Red (Claimed) | Navy (muted red alternative) | #B91C1C | Locked territory indicators |
| Grey (Not Active) | Neutral slate | #64748B | Inactive sector indicators |
| Gold (Premium) | Rich gold | #D4A017 | Premium tier badge, small use only |

### Typography

Follow existing ScopeSite site conventions. Headlines in the primary heading font, body copy in system font stack. No new fonts introduced.

### Imagery

**Must include:**
- Google AI Overview screenshot (Somerset V.O.I.C.E. citation). Use today's capture
- Google AI Overview screenshot (V.O.I.C.E. as category term). Use today's capture
- ScopeSite logo in hero (navy/gold combination)

**Avoid:**
- Stock photography of handshakes
- Stock photography of "people looking at laptops"
- Generic globe/network illustrations

---

## Section 5: Schema.org Markup

Place this JSON-LD block in the page head.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://scopesite.co.uk/territory#webpage",
      "url": "https://scopesite.co.uk/territory",
      "name": "Territory Command - Exclusive AI Visibility Representation by Postcode",
      "description": "One firm per postcode per sector. Exclusive AI visibility engineering with an outcome guarantee. Check whether your territory is available.",
      "inLanguage": "en-GB",
      "isPartOf": {"@id": "https://scopesite.co.uk/#website"},
      "about": {"@id": "https://scopesite.co.uk/territory#service"},
      "breadcrumb": {"@id": "https://scopesite.co.uk/territory#breadcrumb"},
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://scopesite.co.uk/images/territory-command-og.png"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://scopesite.co.uk/territory#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://scopesite.co.uk/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Territory Command",
          "item": "https://scopesite.co.uk/territory"
        }
      ]
    },
    {
      "@type": "Service",
      "@id": "https://scopesite.co.uk/territory#service",
      "name": "Territory Command",
      "alternateName": "Exclusive AI Visibility Representation",
      "serviceType": "AI Visibility Engineering",
      "provider": {"@id": "https://scopesite.co.uk/#organization"},
      "description": "Exclusive AI visibility engineering by postcode and sector. One firm holds each territory for 24 months. Includes unlimited PRO V.O.I.C.E. scans, monthly Sit-Rep, continuous visibility engineering, and an outcome guarantee of V.O.I.C.E. score above 80 per 100 or the next month is free.",
      "areaServed": {
        "@type": "Country",
        "name": "United Kingdom"
      },
      "audience": {
        "@type": "BusinessAudience",
        "audienceType": "Professional Services Firms"
      },
      "offers": {"@id": "https://scopesite.co.uk/territory#offer"},
      "termsOfService": "https://scopesite.co.uk/terms",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Territory Command Inclusions",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Exclusive Territorial Claim",
              "description": "One firm per postcode per sector for 24 months"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Unlimited PRO V.O.I.C.E. Scans",
              "description": "Full scanner access on the client domain throughout the engagement"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Monthly Sit-Rep",
              "description": "Situation report on AI visibility delivered every calendar month"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Outcome Guarantee",
              "description": "V.O.I.C.E. score above 80 per 100 monthly, or next month free plus engineering to target"
            }
          }
        ]
      }
    },
    {
      "@type": "Offer",
      "@id": "https://scopesite.co.uk/territory#offer",
      "name": "Territory Command Monthly Representation",
      "price": "500",
      "priceCurrency": "GBP",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "500",
        "priceCurrency": "GBP",
        "referenceQuantity": {
          "@type": "QuantitativeValue",
          "value": "1",
          "unitCode": "MON"
        },
        "priceType": "MinimumPrice"
      },
      "availability": "https://schema.org/LimitedAvailability",
      "eligibleRegion": {
        "@type": "Country",
        "name": "United Kingdom"
      },
      "seller": {"@id": "https://scopesite.co.uk/#organization"}
    },
    {
      "@type": "FAQPage",
      "@id": "https://scopesite.co.uk/territory#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What exactly is a Territory?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A Territory is your postcode paired with your sector. For example, BA11 Solicitors is one Territory. BA11 Accountants is a different Territory. One firm holds each Territory exclusively."
          }
        },
        {
          "@type": "Question",
          "name": "What is V.O.I.C.E.?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "V.O.I.C.E. is the ScopeSite methodology for AI visibility engineering. It stands for Visibility, Optimisation, for Intelligent, Crawler, Engines. The V.O.I.C.E. scanner measures how AI platforms like ChatGPT, Perplexity, Claude and Google AI Overviews see a business. Scores run from 0 to 100."
          }
        },
        {
          "@type": "Question",
          "name": "What is a Sit-Rep?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A monthly situation report on AI visibility. It covers what changed in the score and why, where competitors moved, what was engineered that month, what crawlers picked up, and what is targeted next."
          }
        },
        {
          "@type": "Question",
          "name": "How does exclusivity work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When a client signs, their Territory is marked as claimed in the system for 24 months. No other client is taken on in the same postcode and sector during that period. If a competitor applies, they join the waitlist and are notified only if the Territory is released."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if the V.O.I.C.E. score drops below 80?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Next month's fee is waived automatically. The score is engineered back to target at no additional cost. Both responses happen together, not one or the other."
          }
        },
        {
          "@type": "Question",
          "name": "Can the Territory move to a different postcode?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Territories are tied to a specific postcode. If the business relocates, the claim transfers to the new postcode provided it is available. If the new postcode is already claimed, waitlist priority or an alternative adjacent territory is offered."
          }
        },
        {
          "@type": "Question",
          "name": "What if my industry is not active yet?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Register interest on the waitlist. Sectors launch based on demand signals. When the industry goes live, waitlist members are notified in order and given first right of application on their postcode."
          }
        },
        {
          "@type": "Question",
          "name": "Can the 24 month term be cancelled early?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The 24 month term is a commercial commitment from both sides. Early termination terms are covered in the contract. After 24 months it rolls monthly, cancel any time with 30 days notice."
          }
        }
      ]
    }
  ]
}
```

---

## Section 6: Operation Name Pool (30 colours × 30 nouns = 900 combos)

### Colours (30)
Cobalt, Crimson, Amber, Obsidian, Ivory, Scarlet, Emerald, Sable, Slate, Bronze, Copper, Granite, Ruby, Onyx, Pearl, Silver, Gold, Steel, Indigo, Sapphire, Jet, Ash, Flint, Pewter, Charcoal, Mahogany, Topaz, Garnet, Jasper, Citrine

### Nouns (30)
Falcon, Wolf, Stag, Hawk, Bear, Eagle, Panther, Lion, Tiger, Osprey, Raven, Jaguar, Viper, Cobra, Phoenix, Griffin, Harrier, Kestrel, Shark, Buffalo, Badger, Rhino, Leopard, Lynx, Mantis, Scorpion, Falcon, Hornet, Wolverine, Hammerhead

### Example full names
- Operation Cobalt Falcon
- Operation Crimson Wolf
- Operation Amber Stag
- Operation Obsidian Hawk
- Operation Ivory Bear
- Operation Scarlet Eagle

### Custom option
A client can request a custom name: "Operation [FirmName]" e.g. Operation Hear4TheLongTerm. Handled via admin override in operations table.

### Allocation rule
When a new operation is created, either:
1. Admin selects a custom name
2. System picks an unused combo from operation_name_pool where is_used = false, marks it as used, writes the id into operations.name

---

## Section 7: Admin Journey (post-application)

1. **Application submitted** → `applications` row created with status = received
2. **Admin email fires** → Dan sees the application within 4 hours
3. **Dan emails prospect** → books 30-min qualifying call via Calendly
4. **Application status** → updates to `qualified` once call is booked
5. **Qualifying call held** → Dan decides: convert / decline / needs follow-up
6. **If convert**: 
   - `operations` row created
   - Operation name allocated from pool (or custom if requested)
   - `seats.state` → claimed
   - `seats.claimed_at` → now
   - `seats.current_operation_id` → new operation.id
   - Contract signed via e-sign service (existing ScopeSite flow)
   - First invoice raised (setup + month 1)
7. **If decline**: 
   - `applications.status` → declined
   - `seats.state` → available (returns to pool)
   - `seats.current_application_id` → null
   - Waitlist members for that seat auto-notified
8. **If 48h expires without action**:
   - Same as decline path
   - Automated email to prospect: "Your pending window has expired"

---

## End of Master Build Document
