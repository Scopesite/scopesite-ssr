/**
 * Territory Command - UK postcode helpers (client-safe, no DB).
 */

const UK_POSTCODE_REGEX =
  /^(GIR 0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW])\s?[0-9][ABD-HJLNP-UW-Z]{2})$/i;

const UK_POSTCODE_AREA_OR_DISTRICT_REGEX =
  /^[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?))$/i;

/** Uppercase + trim + collapse whitespace. Never throws. */
export function normalisePostcode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, ' ');
}

/** True for a full UK postcode (e.g. "BA11 3AA") OR a postcode district
 *  ("BA11", "SW1A"). We accept districts because the pilot is district-level. */
export function isPlausibleUkPostcode(raw: string): boolean {
  const v = normalisePostcode(raw);
  return UK_POSTCODE_REGEX.test(v) || UK_POSTCODE_AREA_OR_DISTRICT_REGEX.test(v);
}

/** True when the input is a valid postcode DISTRICT only (no inward code).
 *  Map boundary clicks always prefill the checker with a district-only
 *  value like "BS20", so callers can use this to skip the postcodes.io
 *  `/validate` round-trip (which only accepts full postcodes and would
 *  wrongly return false for "BS20"). */
export function isPostcodeDistrictOnly(raw: string): boolean {
  const v = normalisePostcode(raw);
  return UK_POSTCODE_AREA_OR_DISTRICT_REGEX.test(v);
}

/** Strip to postcode district ("BA11 3AA" -> "BA11"). If already a district,
 *  returned as-is (uppercased). */
export function toPostcodeDistrict(raw: string): string {
  const v = normalisePostcode(raw);
  // Full postcode: first token before the space
  if (v.includes(' ')) return v.split(' ')[0];
  // Inward code glued to outward (e.g. "BA113AA"): extract outward portion
  const match = v.match(/^([A-PR-UWYZ][0-9]{1,2}(?:[A-HK-Y])?)/i);
  return match ? match[1].toUpperCase() : v;
}

/** Validate a postcode via Postcodes.io. Free, no auth, no SDK. */
export async function validateUkPostcodeLive(raw: string): Promise<boolean> {
  const v = normalisePostcode(raw);
  if (!v) return false;
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(v)}/validate`,
      { cache: 'no-store' },
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { result?: boolean };
    return data.result === true;
  } catch {
    return false;
  }
}
