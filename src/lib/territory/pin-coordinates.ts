/**
 * Territory Command - Pilot pin coordinates.
 *
 * svgX / svgY are calibrated against the Public-Domain UK regions SVG
 * (see src/lib/territory/region-paths.ts). Each coordinate is the TIP
 * location of the teardrop pin - the pin is translated such that its
 * sharp bottom point sits exactly on the town centre.
 *
 * Calibration method: linear equirectangular transform anchored on
 * London's geographic centroid inside its region path.
 *   svgX = 557.38 + lng * 63.49
 *   svgY = 808.25 + (51.5074 - lat) * 110.75
 * (N/S stretch factor 1.742x matches the source SVG's 170% convention.)
 *
 * Phase C rollout: add new pins here, flip region to active in map-regions.ts.
 */

import type { Tier } from './types';

export interface PilotPin {
  postcode: string;
  svgX: number;
  svgY: number;
  town: string;
  tier: Tier;
  isReserve: boolean;
  isHome?: boolean;
}

export const PILOT_PINS: PilotPin[] = [
  { postcode: 'BS1',  svgX: 393.1, svgY: 814.1, town: 'Bristol',            tier: 'premium',  isReserve: false },
  { postcode: 'BA1',  svgX: 407.6, svgY: 821.9, town: 'Bath',               tier: 'premium',  isReserve: false },
  { postcode: 'BS8',  svgX: 391.3, svgY: 813.7, town: 'Clifton',            tier: 'premium',  isReserve: false },
  { postcode: 'TA1',  svgX: 360.2, svgY: 862.8, town: 'Taunton',            tier: 'standard', isReserve: false },
  { postcode: 'BA20', svgX: 389.9, svgY: 871.0, town: 'Yeovil',             tier: 'standard', isReserve: false },
  { postcode: 'BS22', svgX: 370.3, svgY: 824.4, town: 'Weston-super-Mare',  tier: 'standard', isReserve: false },
  { postcode: 'BA11', svgX: 410.0, svgY: 839.0, town: 'Frome',              tier: 'standard', isReserve: false, isHome: true },
  { postcode: 'BA2',  svgX: 407.0, svgY: 824.2, town: 'Bath South',         tier: 'standard', isReserve: true  },
  { postcode: 'BA3',  svgX: 401.9, svgY: 832.4, town: 'Radstock',           tier: 'standard', isReserve: true  },
  { postcode: 'BA4',  svgX: 395.7, svgY: 843.2, town: 'Shepton Mallet',     tier: 'standard', isReserve: true  },
];
