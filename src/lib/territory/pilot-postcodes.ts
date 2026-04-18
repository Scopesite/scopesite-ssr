/**
 * Territory Command - canonical pilot postcode classifications.
 *
 * Two distinct sets share the same "pilot" umbrella but route to different
 * UX flows on the public landing page:
 *
 *   - ACTIVE_PILOT  - a postcode in the live pilot whose seats are
 *                      bookable today. Map clicks route into the
 *                      TerritoryChecker -> sector -> apply / book flow.
 *
 *   - RESERVE_PILOT - a postcode in the pilot data set but with
 *                      `is_active = false` in the database. Not yet
 *                      bookable. Map clicks route into the
 *                      AreaWaitlistForm so prospects can register
 *                      first-come-first-served interest.
 *
 * Any postcode (district or full) NOT in either set is treated as
 * non-pilot and also routes through AreaWaitlistForm with the same
 * entry_source, but with different copy ("not in pilot zone yet" vs
 * "reserve territory").
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
