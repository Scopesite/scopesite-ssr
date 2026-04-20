/**
 * Territory Command - Single source of truth for all page copy.
 *
 * Do NOT edit copy here without updating docs/territory_command/
 * 01_MASTER_BUILD_DOCUMENT.md first. The master document is the spec;
 * this file is the implementation of that spec in TypeScript form.
 */

import type { SeatState, Tier } from './types';

export const HERO = {
  eyebrow: 'TERRITORY COMMAND',
  headline: 'One postcode. One sector. Your firm.',
  subHeadline:
    'Exclusive AI visibility representation in your territory. No competitor can claim what you hold.',
  priceStrip: 'From £500/month. Full pricing discussed on your qualifying call.',
  postcodePlaceholder: 'e.g. BA11',
  sectorPlaceholder: 'Select your industry',
  cta: 'Check availability',
  invalidPostcode:
    'That does not look like a valid UK postcode. Check and try again.',
} as const;

export const MECHANISM = {
  sectionTitle: 'How it works',
  cards: [
    {
      number: 1,
      title: 'Check your territory',
      body: 'Enter your postcode and your sector. We tell you instantly whether your territory is available, held, or claimed.',
    },
    {
      number: 2,
      title: 'Apply. We hold it 48 hours.',
      body: 'If your territory is clear, submit an application. We mark it pending in your name for 48 hours while we arrange a qualifying call.',
    },
    {
      number: 3,
      title: 'Contract signed. Engineering begins.',
      body: 'After the qualifying call, a 24-month exclusive contract is signed. Your Operation starts. Unlimited scans, monthly Sit-Rep, and the guarantee all activate from day one.',
    },
  ],
} as const;

export const WHAT_YOU_GET = {
  sectionTitle: 'What comes with Territory Command',
  cards: [
    {
      title: 'Exclusive territorial claim',
      body: 'One firm per postcode per sector. No competitor in your territory can buy the same representation while you hold it. Claims are contracted for 24 months.',
    },
    {
      title: 'Unlimited PRO V.O.I.C.E. scans',
      body: 'Full access to our PRO AI visibility scanner on your domain. Run it as often as you want. Track every change. See what crawlers see.',
    },
    {
      title: 'Monthly Sit-Rep',
      body: "A focused situation report on your AI visibility every month. What's changed, what's ranking, what the scanner caught, what we engineered, and what's next.",
    },
    {
      title: 'Outcome Guarantee',
      body: 'Your V.O.I.C.E. score above 80/100 every month. If it drops below 80 in any calendar month, the next month is free AND we engineer it back to target at no extra cost.',
    },
  ],
} as const;

/**
 * ProofSection card data.
 *
 * Every card declares an `imageSlug`; ProofSection resolves it to
 * /territory/proof/{slug}.webp -> .png -> SVG mockup at render time.
 * The `mockup` field decides which fallback component to render if the
 * file isn't on disk yet.
 */
export const PROOF = {
  sectionTitle: 'The methodology, proven',
  cards: [
    {
      imageSlug: 'ai-overview-somerset-seo',
      imageAlt: 'Google AI Overview naming ScopeSite and V.O.I.C.E. for Somerset AI SEO queries',
      mockup: { kind: 'ai-overview', variant: 'somerset-seo' },
      caption:
        "Google's AI Overview cites ScopeSite and V.O.I.C.E. methodology by name for Somerset AI SEO queries.",
    },
    {
      imageSlug: 'ai-overview-voice-category',
      imageAlt: 'Google AI Overview listing V.O.I.C.E. as the category term for AI citation analysis',
      mockup: { kind: 'ai-overview', variant: 'voice-category' },
      caption:
        "Google's AI Overview lists V.O.I.C.E. as the industry term for AI citation analysis.",
    },
    {
      imageSlug: 'h4tlt-case-study',
      imageAlt: 'H4TLT achieved top AI citations across ChatGPT, Perplexity, Claude and Gemini in under six months',
      mockup: { kind: 'h4tlt' },
      caption:
        'H4TLT reached top AI citations across ChatGPT, Perplexity, Claude and Gemini for occupational hearing health in under 6 months.',
      link: { href: '/case-studies/h4tlt', label: 'Read the case study' },
    },
  ],
} as const;

export const GUARANTEE = {
  sectionTitle: 'The guarantee, in writing',
  body: 'Your V.O.I.C.E. score above 80/100 every month. If it drops below 80 in any calendar month, the next month is free. And we engineer it back to target at no extra cost. Two ways we take responsibility, because your score is our commitment.',
  secondaryBody:
    'This guarantee is written into every Territory Command contract. It is not a marketing claim. It is a service level.',
} as const;

export const FAQ = {
  sectionTitle: 'Questions we get asked',
  items: [
    {
      q: 'What exactly is a Territory?',
      a: 'A Territory is your postcode paired with your sector. For example, BA11 Solicitors is one Territory. BA11 Accountants is a different Territory. One firm holds each Territory exclusively.',
    },
    {
      q: 'What is V.O.I.C.E.?',
      a: 'V.O.I.C.E. is our methodology for AI visibility engineering. It stands for Visibility, Optimisation, for Intelligent, Crawler, Engines. The V.O.I.C.E. scanner measures how AI platforms like ChatGPT, Perplexity, Claude and Google AI Overviews see your business. Your score runs from 0 to 100.',
    },
    {
      q: 'What is a Sit-Rep?',
      a: 'A monthly situation report on your AI visibility. It covers what changed in your score and why, where your competitors moved, what we engineered that month, what crawlers picked up, and what we are targeting next. It is the record of work delivered against your guarantee.',
    },
    {
      q: 'How does exclusivity actually work?',
      a: 'When you sign, your Territory is marked as claimed in our system for 24 months. We do not take on any other client in your postcode and sector during that period. If a competitor applies for the same Territory, they join the waitlist and are notified only if your Territory is released.',
    },
    {
      q: 'What happens if my V.O.I.C.E. score drops below 80?',
      a: "Next month's fee is waived automatically. We then engineer your score back to target at no additional cost. Both responses happen together. Not one or the other.",
    },
    {
      q: 'Can I move my Territory later?',
      a: 'Territories are tied to a specific postcode. If your business relocates, we transfer your claim to the new postcode provided it is available. If the new postcode is already claimed by another firm, we offer waitlist priority or an alternative adjacent territory.',
    },
    {
      q: 'What if my industry is not active yet?',
      a: 'Register your interest on the waitlist. We launch sectors based on demand signals. When your industry goes live, you are notified in order of waitlist position and given first right of application on your postcode.',
    },
    {
      q: 'Can I cancel the 24 month term?',
      a: 'The 24 month term is a commercial commitment from both sides. Early termination terms are covered in your contract. After 24 months it rolls monthly, cancel any time with 30 days notice.',
    },
  ],
} as const;

export const FINAL_CTA = {
  headline: 'Check your territory',
  body: 'One postcode. One sector. Your firm.',
  buttonLabel: 'Check availability',
} as const;

export const APPLICATION = {
  pageTitlePrefix: 'Application:',
  instruction:
    'Fill this in. We hold your territory for 48 hours from submission. Dan will email you within 4 working hours to book a 30 minute qualifying call.',
  labels: {
    firmName: 'Firm name',
    contactName: 'Your name',
    contactRole: 'Your role',
    contactEmail: 'Email address',
    contactPhone: 'Phone number (optional)',
    websiteUrl: 'Website URL',
    firmPostcode: "Your firm's postcode",
    aiVisibilityApproach: 'Current AI visibility approach',
    additionalContext: "What's prompted this application?",
  },
  rolesOptions: ['Director', 'Partner', 'Managing Director', 'Owner', 'Other'] as const,
  aiApproachOptions: [
    'None',
    'Existing SEO agency',
    'In-house marketing',
    'Other',
  ] as const,
  additionalContextPlaceholder:
    "Context helps us prepare for the call. What's changed recently in your market or your marketing?",
  submit: 'Submit Application',
  disclaimer:
    'No payment is taken at this stage. You are requesting a qualifying call. The territory is held in your name for 48 hours while we arrange it. Pricing, setup fees, contract terms and engineering scope are all discussed on the call. You are free to withdraw at any point before signing.',
} as const;

export const APPLICATION_CONFIRMED = {
  pageTitle: 'Application received',
  headlineSeat: 'Your territory is held',
  headlineFreeform: 'Your application is received',
  /** Body copy for seat-bound applications (48h hold applies). */
  bodyLinesSeat: [
    '[POSTCODE] [SECTOR] is now marked as pending in your name. You have 48 hours for Dan to reach out and arrange your qualifying call before the territory returns to available.',
    'Dan will email you within the next 4 working hours to schedule.',
    'Any questions, reply to the confirmation email or call 01373 311 339.',
  ],
  /** Body copy for freeform applications (no seat to hold). */
  bodyLinesFreeform: [
    'Thanks - your application for [POSTCODE] [SECTOR] is in.',
    'Dan will email you within the next 4 working hours to discuss next steps for your sector and territory.',
    'Any questions, reply to the confirmation email or call 01373 311 339.',
  ],
  /** Single CTA back to the map - no external booking links. */
  cta: { label: 'Return to Territory Command', href: '/territory' },
} as const;

export const WAITLIST = {
  formHeading: 'Join the waitlist for [POSTCODE] [SECTOR]',
  labels: {
    firmName: 'Firm name',
    contactName: 'Your name',
    contactEmail: 'Email',
  },
  submit: 'Join Waitlist',
  disclaimer: "We'll email you the moment this territory becomes available.",
} as const;

export const WAITLIST_CONFIRMED = {
  pageTitle: 'You are on the waitlist',
  headlinePrefix: 'You are on the waitlist for ',
  body: 'We will email you the moment this territory becomes available. If it is released from contract, waitlist members are notified in the order they joined. First right of application goes to position 1.',
  secondaryCta: { label: 'Return to Territory Command', href: '/territory' },
} as const;

export const AREA_WAITLIST = {
  regionHeadlinePrefix: 'Register interest in ',
  postcodeHeadlinePrefix: 'is a valid UK postcode but not in our pilot zone yet',
  regionSubHeadline:
    'This region is coming soon. Register and we will notify you the moment your area goes live.',
  postcodeSubHeadline:
    'Register your interest and we will notify you when your area goes live. First-come, first-served queue.',
  reserveHeadlineSuffix: 'is a reserve territory',
  reserveSubHeadline: (postcode: string) =>
    `Register your interest and we will notify you when ${postcode} opens for applications. First-come, first-served queue.`,
  nonPilotHeadlineSuffix: 'is valid. Not in the pilot zone yet.',
  nonPilotSubHeadline:
    'Register your interest and we will notify you when your area goes live. First-come, first-served queue.',
  queue: {
    loading: 'Checking queue position...',
    first: (postcode: string) =>
      `You will be first in the queue for ${postcode}.`,
    upcoming: (position: number, postcode: string) =>
      `You will be position #${position} in the queue for ${postcode}.`,
    assignedFirst: (postcode: string) =>
      `You are first in the queue for ${postcode}. We will email you with updates as your position changes.`,
    assigned: (position: number, postcode: string) =>
      `You are position #${position} in the queue for ${postcode}. We will email you with updates as your position changes.`,
  },
  labels: {
    firmName: 'Firm name',
    contactName: 'Your name',
    contactEmail: 'Email',
    postcode: 'Postcode (optional)',
    postcodeHelp: 'If you want us to prioritise your exact area.',
    sector: 'Sector',
    sectorPlaceholder: 'Select your industry',
  },
  submit: 'Register interest',
  success:
    'Registered. We will email you the moment your area goes live, and sooner if you are in one of the earlier rollout areas.',
  close: 'Close',
} as const;

// ---------------------------------------------------------------------------
// RESULT STATE COPY
// ---------------------------------------------------------------------------

export interface ResultStateCopy {
  label: string;
  headline: (postcode: string, sector: string) => string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
}

export const RESULT_STATES: Record<
  'available' | 'pending' | 'claimed' | 'not_active' | 'premium',
  ResultStateCopy
> = {
  available: {
    label: 'Available',
    headline: (p, s) => `${p} ${s} is available`,
    body: 'You are the first firm to check this territory. If you apply in the next 48 hours, we hold it for you while we arrange a qualifying call. Full pricing and terms are discussed on the call.',
    primaryCta: 'Apply for this territory',
    secondaryCta: 'Check a different territory',
  },
  pending: {
    label: 'Pending',
    headline: (p, s) => `${p} ${s} has a pending application`,
    body: 'Another firm has applied within the last 48 hours. We are holding this territory for them while we arrange a qualifying call. If they do not convert to a signed contract, the territory returns to available and waitlist members are notified in order.',
    primaryCta: 'Join the waitlist',
    secondaryCta: 'Check a different territory',
  },
  claimed: {
    label: 'Claimed',
    headline: (p, s) => `${p} ${s} is claimed`,
    body: 'This territory is under contract with a firm in your sector and postcode. Claims are reviewed on a 24 month cycle. Join the waitlist and we will notify you if this territory is released or if an adjacent territory opens in your sector.',
    primaryCta: 'Join the waitlist',
    secondaryCta: 'Check a different territory',
  },
  not_active: {
    label: 'Not yet live',
    headline: (_p, s) => `${s} is not currently live`,
    body: 'We launch sectors based on demand. Register your interest and we will prioritise your industry based on waitlist volume. When your sector goes live, you are notified in order and given first right of application on your postcode.',
    primaryCta: 'Register your interest',
    secondaryCta: 'Check a different territory',
  },
  premium: {
    label: 'Premium territory',
    headline: (p, s) => `${p} ${s} is a premium territory`,
    body: 'This is a high-density professional services market. Pricing starts above the standard £500 per month based on competitor density and market size. Full pricing is discussed on your qualifying call. The application process is identical to standard territories.',
    primaryCta: 'Apply for this territory',
    secondaryCta: 'Check a different territory',
  },
};

/** Map a seat state + tier to its display key ('premium' if available + premium tier). */
export function resolveResultKey(
  state: SeatState,
  tier: Tier,
): keyof typeof RESULT_STATES {
  if (state === 'available' && tier === 'premium') return 'premium';
  return state;
}

// ---------------------------------------------------------------------------
// PAGE METADATA
// ---------------------------------------------------------------------------

export const PAGE_META = {
  title: 'Territory Command: AI Visibility by Postcode',
  description:
    'One firm per postcode per sector. Exclusive AI visibility engineering with an outcome guarantee. Check whether your territory is available.',
  ogImage: '/images/territory/territory-command-og.png',
  canonicalPath: '/territory',
} as const;
