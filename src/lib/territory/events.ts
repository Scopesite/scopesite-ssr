/**
 * Territory Command - lightweight client-side event bus.
 *
 * Used to cross-link the TerritoryMap and TerritoryChecker into the single
 * shared AreaWaitlistForm modal without prop drilling through the page tree.
 * Runs only in the browser.
 *
 * LEGACY: OPEN_PILOT_CHECKER_EVENT / OpenPilotCheckerDetail /
 * emitOpenPilotChecker / entrySource='postcode_not_in_pilot' retain
 * pilot terminology in code. Not user-facing.
 */

export interface OpenAreaWaitlistDetail {
  entrySource: 'region_click' | 'postcode_not_in_pilot';
  regionKey?: string;
  regionLabel?: string;
  postcode?: string;
  sectorSlug?: string;
}

export interface PrefillCheckerDetail {
  postcode: string;
  autoSubmit?: boolean;
}

/** Map click — opens industry picker; includes optional live promotion snapshot. */
export interface OpenPilotCheckerDetail {
  postcode: string;
  town?: string;
  promotion?: {
    headline: string | null;
    description: string | null;
    promotionalMonthlyPriceGbp: number;
    originMonthlyPriceGbp: number;
    expiresAt: string;
    originTier: 'standard' | 'premium';
  };
}

export const AREA_WAITLIST_EVENT = 'territory:openAreaWaitlist';
export const PREFILL_CHECKER_EVENT = 'territory:prefillChecker';
export const OPEN_PILOT_CHECKER_EVENT = 'territory:openPilotChecker';

export function emitOpenAreaWaitlist(detail: OpenAreaWaitlistDetail): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AREA_WAITLIST_EVENT, { detail }));
}

export function emitPrefillChecker(detail: PrefillCheckerDetail): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(PREFILL_CHECKER_EVENT, { detail }));
}

export function emitOpenPilotChecker(detail: OpenPilotCheckerDetail): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_PILOT_CHECKER_EVENT, { detail }));
}
