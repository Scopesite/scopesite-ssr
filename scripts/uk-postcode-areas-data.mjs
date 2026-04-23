/**
 * UK geographic postcode area codes (124) — GB+NI, excludes GY, JE, IM
 * (Crown Dependencies) / not in the 12 UK regions SVG.
 *
 * `region` = key matching src/lib/territory/map-regions.ts
 * `sample` = valid full postcode for Postcodes.io
 */

export const SECTOR_SLUGS = [
  'accountants',
  'solicitors',
  'estate-agents',
  'dental-practices',
];

/** @type {ReadonlySet<string>} */
export const PREMIUM_LONDON = new Set(['EC', 'WC', 'W', 'SW', 'SE', 'E', 'N', 'NW']);

/** @type {ReadonlySet<string>} */
export const PREMIUM_CITY = new Set([
  'M', 'B', 'LS', 'S', 'L', 'BS', 'EH', 'G', 'CF', 'NE', 'NG', 'LE', 'CB', 'OX',
  'RG', 'GU', 'BN', 'BT',
]);

/**
 * NUTS-1 / SVG map assignment (ambiguous outcodes: majority geography).
 */
export const AREA_TO_REGION = {
  AB: 'scotland',
  AL: 'east_of_england',
  B: 'west_midlands',
  BA: 'south_west',
  BB: 'north_west',
  BD: 'yorkshire_humber',
  BH: 'south_west',
  BL: 'north_west',
  BN: 'south_east',
  BR: 'london',
  BS: 'south_west',
  BT: 'northern_ireland',
  CA: 'north_west',
  CB: 'east_of_england',
  CF: 'wales',
  CH: 'north_west',
  CM: 'east_of_england',
  CO: 'east_of_england',
  CR: 'london',
  CT: 'south_east',
  CV: 'west_midlands',
  CW: 'north_west',
  DA: 'south_east',
  DD: 'scotland',
  DE: 'east_midlands',
  DG: 'scotland',
  DH: 'north_east',
  DL: 'north_east',
  DN: 'yorkshire_humber',
  DT: 'south_west',
  DY: 'west_midlands',
  E: 'london',
  EC: 'london',
  EH: 'scotland',
  EN: 'east_of_england',
  EX: 'south_west',
  FK: 'scotland',
  FY: 'north_west',
  G: 'scotland',
  GL: 'south_west',
  GU: 'south_east',
  HA: 'london',
  HD: 'yorkshire_humber',
  HG: 'yorkshire_humber',
  HP: 'south_east',
  HR: 'west_midlands',
  HS: 'scotland',
  HU: 'yorkshire_humber',
  HX: 'yorkshire_humber',
  IG: 'london',
  IP: 'east_of_england',
  IV: 'scotland',
  KA: 'scotland',
  KT: 'london',
  KW: 'scotland',
  KY: 'scotland',
  L: 'north_west',
  LA: 'north_west',
  LD: 'wales',
  LE: 'east_midlands',
  LL: 'wales',
  LN: 'east_midlands',
  LS: 'yorkshire_humber',
  LU: 'east_of_england',
  M: 'north_west',
  ME: 'south_east',
  MK: 'south_east',
  ML: 'scotland',
  N: 'london',
  NE: 'north_east',
  NG: 'east_midlands',
  NN: 'east_midlands',
  NP: 'wales',
  NR: 'east_of_england',
  NW: 'london',
  OL: 'north_west',
  OX: 'south_east',
  PA: 'scotland',
  PE: 'east_of_england',
  PH: 'scotland',
  PL: 'south_west',
  PO: 'south_east',
  PR: 'north_west',
  RG: 'south_east',
  RH: 'south_east',
  RM: 'london',
  S: 'yorkshire_humber',
  SA: 'wales',
  SE: 'london',
  SG: 'east_of_england',
  SK: 'north_west',
  SL: 'south_east',
  SM: 'london',
  SN: 'south_west',
  SO: 'south_west',
  SP: 'south_west',
  SR: 'north_east',
  SS: 'east_of_england',
  ST: 'west_midlands',
  SW: 'london',
  SY: 'west_midlands',
  TA: 'south_west',
  TD: 'scotland',
  TF: 'west_midlands',
  TN: 'south_east',
  TQ: 'south_west',
  TR: 'south_west',
  TS: 'north_east',
  TW: 'london',
  UB: 'london',
  W: 'london',
  WA: 'north_west',
  WC: 'london',
  WD: 'east_of_england',
  WF: 'yorkshire_humber',
  WN: 'north_west',
  WR: 'west_midlands',
  WS: 'west_midlands',
  WV: 'west_midlands',
  YO: 'yorkshire_humber',
  ZE: 'scotland',
};

/** Outward-code geocoding uses Postcodes.io `/outcodes/{outcode}`; see outcodeCandidates() in scripts/territory-expand-uk.mjs. */

// London teardrop fan-out (svg units) — from plan
export const LONDON_FANOUT = {
  EC: [6, 0], WC: [0, 0], W: [-8, 0], SW: [-4, 8], SE: [6, 6], E: [10, 2], N: [0, -8], NW: [-6, -6],
};

const ALL = Object.keys(AREA_TO_REGION).sort();

/**
 * @param {string} code
 * @returns {'standard' | 'premium'}
 */
export function tierForArea(code) {
  if (PREMIUM_LONDON.has(code) || PREMIUM_CITY.has(code)) return 'premium';
  return 'standard';
}

export const ALL_AREA_CODES = ALL;
