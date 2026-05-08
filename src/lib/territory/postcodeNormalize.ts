/**
 * Territory Command — canonical UK postcode area resolution for search,
 * promotions, and queue display. Client-safe (no DB).
 */

import {
  normalisePostcode,
  isPlausibleUkPostcode,
  isPostcodeDistrictOnly,
  toPostcodeDistrict,
} from './postcode';

/** Letters-only outward fragment (e.g. `WV`, `B`, `SW`). Second letter may be
 *  `V` (e.g. WV) which is excluded from the single-class `[A-PR-UWYZ]` matcher
 *  used elsewhere in this codebase. */
const BARE_AREA = /^[A-PR-UWYZ][A-Z]?$/i;

export function isBareUkPostcodeArea(normalised: string): boolean {
  const s = normalised.trim();
  return BARE_AREA.test(s) && !/\d/.test(s);
}

/**
 * Accepts a full UK postcode, an outward/district fragment, or bare area
 * letters (e.g. `WV`, `B`, `EC`).
 */
export function isValidUkPostcodeInput(raw: string): boolean {
  const v = normalisePostcode(raw);
  if (!v) return false;
  if (isPlausibleUkPostcode(v)) return true;
  return isBareUkPostcodeArea(v);
}

/**
 * Postcodes.io `/validate` only accepts full postcodes. Skip the round-trip
 * for district-only and bare-area inputs that we already accept locally.
 */
export function shouldSkipPostcodesIoLiveValidation(normalised: string): boolean {
  return isPostcodeDistrictOnly(normalised) || isBareUkPostcodeArea(normalised);
}

/**
 * Canonical 1–2 letter UK postcode area (e.g. `WV`, `B`, `SW`, `EC`).
 * Returns null when the input is not a valid UK postcode fragment.
 */
export function extractPostcodeArea(raw: string): string | null {
  const v = normalisePostcode(raw);
  if (!v || !isValidUkPostcodeInput(v)) return null;

  if (isBareUkPostcodeArea(v)) {
    return v.trim().toUpperCase();
  }

  const outward = toPostcodeDistrict(v);
  if (/^GIR/i.test(outward)) return 'GIR';

  const letterPrefix = outward.match(/^([A-Za-z]+)/)?.[1];
  if (!letterPrefix) return null;
  if (!/^[A-PR-UWYZ]/i.test(letterPrefix)) return null;

  const area =
    letterPrefix.length >= 2
      ? letterPrefix.slice(0, 2).toUpperCase()
      : letterPrefix.toUpperCase();
  return area;
}
