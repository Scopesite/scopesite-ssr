/**
 * Territory Command - district-level postcode classifications from the
 * original South West launch. Retained for code that still differentiates
 * hero-checker postcode submissions (TerritoryChecker) between the three
 * sets. The /territory map no longer uses these - it renders every UK
 * postcode area uniformly.
 *
 * LEGACY: pilot terminology retained in code (ACTIVE_PILOT_POSTCODES,
 * RESERVE_PILOT_POSTCODES, isActivePilotPostcode, isReservePilotPostcode).
 * Not user-facing.
 */

export const ACTIVE_PILOT_POSTCODES = [
  'BS1',
  'BS8',
  'BS22',
  'BA1',
  'BA11',
  'BA20',
  'TA1',
] as const;

export type ActivePilotPostcode = (typeof ACTIVE_PILOT_POSTCODES)[number];

const ACTIVE_PILOT_SET: ReadonlySet<string> = new Set(ACTIVE_PILOT_POSTCODES);

export const RESERVE_PILOT_POSTCODES = ['BA2', 'BA3', 'BA4'] as const;

export type ReservePilotPostcode = (typeof RESERVE_PILOT_POSTCODES)[number];

const RESERVE_PILOT_SET: ReadonlySet<string> = new Set(RESERVE_PILOT_POSTCODES);

function normalise(p: string): string {
  return p.trim().toUpperCase().replace(/\s+/g, ' ');
}

/**
 * Returns the postcode district portion (e.g. "BS1" from "BS1 5TR").
 * Used so the pilot lookup works for both district-only inputs (map clicks)
 * and full postcodes (typed by users).
 */
function districtOf(p: string): string {
  const v = normalise(p);
  // Pilot codes are all area+district format (letters + digits, no inward
  // unit). Strip anything after the first space.
  const space = v.indexOf(' ');
  return space === -1 ? v : v.substring(0, space);
}

export function isActivePilotPostcode(p: string): boolean {
  return ACTIVE_PILOT_SET.has(districtOf(p));
}

export function isReservePilotPostcode(p: string): boolean {
  return RESERVE_PILOT_SET.has(districtOf(p));
}
