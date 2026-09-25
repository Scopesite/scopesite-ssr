/**
 * Allowlisted outbound clicks to the Recruitment Web Design specialist site.
 * Event properties are categories only. Never a full URL, query string, free text, or PII.
 * Tracking is fire-and-forget and must never block navigation.
 */

export const RWD_OUTBOUND_EVENT = 'rwd_outbound';

export const RWD_ORIGIN = 'https://recruitmentwebdesign.com';

export const RWD_DESTINATIONS = {
  home: `${RWD_ORIGIN}/`,
  website_design: `${RWD_ORIGIN}/recruitment-website-design`,
  ats: `${RWD_ORIGIN}/ats-integrations`,
  jobs_board: `${RWD_ORIGIN}/live-jobs-board`,
  ai_visibility: `${RWD_ORIGIN}/ai-search-visibility`,
  software: `${RWD_ORIGIN}/recruitment-software`,
  demos: `${RWD_ORIGIN}/demos`,
} as const;

export const RWD_PAGES = [
  'home',
  'recruitment_intro',
  'web_design',
  'web_apps',
  'ai_visibility',
  'nav',
  'footer',
] as const;

export const RWD_PLACEMENTS = ['card', 'nav', 'footer', 'body', 'demo', 'hero'] as const;

export type RwdDestinationCategory = keyof typeof RWD_DESTINATIONS;
export type RwdPageCategory = (typeof RWD_PAGES)[number];
export type RwdPlacementCategory = (typeof RWD_PLACEMENTS)[number];

export interface RwdOutboundEvent {
  page: RwdPageCategory;
  placement: RwdPlacementCategory;
  destination: RwdDestinationCategory;
}

const PAGE_SET = new Set<string>(RWD_PAGES);
const PLACEMENT_SET = new Set<string>(RWD_PLACEMENTS);
const DESTINATION_SET = new Set<string>(Object.keys(RWD_DESTINATIONS));

export function sanitizeRwdOutboundEvent(input: unknown): RwdOutboundEvent | null {
  if (!input || typeof input !== 'object') return null;
  const record = input as Record<string, unknown>;
  const page = record.page;
  const placement = record.placement;
  const destination = record.destination;
  if (typeof page !== 'string' || !PAGE_SET.has(page)) return null;
  if (typeof placement !== 'string' || !PLACEMENT_SET.has(placement)) return null;
  if (typeof destination !== 'string' || !DESTINATION_SET.has(destination)) return null;
  return {
    page: page as RwdPageCategory,
    placement: placement as RwdPlacementCategory,
    destination: destination as RwdDestinationCategory,
  };
}

export function isAnalyticsOptedOut(): boolean {
  if (typeof navigator === 'undefined') return true;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; doNotTrack?: string | null };
  const legacyDnt =
    typeof window !== 'undefined'
      ? (window as Window & { doNotTrack?: string | null }).doNotTrack
      : null;
  const dnt = ('doNotTrack' in nav ? nav.doNotTrack : null) || legacyDnt;
  if (dnt === '1' || dnt === 'yes') return true;
  if (nav.globalPrivacyControl === true) return true;
  try {
    if (window.localStorage.getItem('va-disable')) return true;
  } catch {
    return true;
  }
  return false;
}

type Gtag = (command: string, action: string, params?: Record<string, unknown>) => void;

function readGtag(): Gtag | null {
  if (typeof window === 'undefined') return null;
  const gtag = (window as Window & { gtag?: Gtag }).gtag;
  return typeof gtag === 'function' ? gtag : null;
}

function readVercelVa(): ((...args: unknown[]) => void) | null {
  if (typeof window === 'undefined') return null;
  const va = (window as Window & { va?: (...args: unknown[]) => void }).va;
  return typeof va === 'function' ? va : null;
}

/** Sends the allowlisted event only when existing analytics is already active. */
export function trackRwdOutbound(input: unknown): void {
  const event = sanitizeRwdOutboundEvent(input);
  if (!event) return;
  if (isAnalyticsOptedOut()) return;

  const gtag = readGtag();
  if (gtag) {
    gtag('event', RWD_OUTBOUND_EVENT, {
      page: event.page,
      placement: event.placement,
      destination: event.destination,
    });
  }

  const va = readVercelVa();
  if (va) {
    va('event', {
      name: RWD_OUTBOUND_EVENT,
      data: {
        page: event.page,
        placement: event.placement,
        destination: event.destination,
      },
    });
  }
}
