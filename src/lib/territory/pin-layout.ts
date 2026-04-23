/**
 * Territory Command - pure-function layout helpers for TerritoryMap.
 *
 *   - `getRegionZoomBounds`   - picks a viewBox that frames the pin cluster
 *   - `aspectCorrect`         - widens the narrower axis to match container
 *   - `PIN_VISUAL_OFFSET_PX`  - fixed directional offsets for pairs that
 *                               sit geographically on top of each other
 *   - `PIN_LABEL_SIDE`        - hardcoded preferred label side per pilot pin
 *   - `postcodeToRegion`      - maps a postcode back to a NUTS 1 region
 */

import type { MapDataPoint } from './types';
import type { RegionKey } from './map-regions';

// ---------------------------------------------------------------------------
// BBox
// ---------------------------------------------------------------------------
export interface BBox {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

function bbox(minX: number, minY: number, maxX: number, maxY: number): BBox {
  const w = Math.max(0, maxX - minX);
  const h = Math.max(0, maxY - minY);
  return { x: minX, y: minY, w, h, cx: minX + w / 2, cy: minY + h / 2 };
}

// ---------------------------------------------------------------------------
// Region zoom bounds
// ---------------------------------------------------------------------------
/**
 * Decide the viewBox the SVG should animate to when zoomedRegion is set.
 *
 * If the region has any pilot pins we frame the PIN CLUSTER (not the region
 * outline), padded 15% per axis. If there are no pins we fall back to the
 * region's path bbox. Either way the result is aspect-corrected against
 * `targetAspect` so the narrower axis widens.
 */
export function getRegionZoomBounds(
  _regionKey: RegionKey,
  pinsInRegion: readonly MapDataPoint[],
  regionBBox: BBox,
  targetAspect: number,
): BBox {
  let base: BBox;

  if (pinsInRegion.length > 0) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of pinsInRegion) {
      if (p.svgX < minX) minX = p.svgX;
      if (p.svgY < minY) minY = p.svgY;
      if (p.svgX > maxX) maxX = p.svgX;
      if (p.svgY > maxY) maxY = p.svgY;
    }
    const rawW = Math.max(1, maxX - minX);
    const rawH = Math.max(1, maxY - minY);
    const padX = rawW * 0.15;
    const padY = rawH * 0.15;
    base = bbox(minX - padX, minY - padY, maxX + padX, maxY + padY);
  } else {
    base = regionBBox;
  }

  return aspectCorrect(base, targetAspect);
}

/**
 * Expand the narrower axis of `b` so its `w/h` ratio equals `targetAspect`.
 * Keeps the existing centroid fixed.
 */
export function aspectCorrect(b: BBox, targetAspect: number): BBox {
  if (b.w <= 0 || b.h <= 0) return b;
  const currentAspect = b.w / b.h;
  if (currentAspect < targetAspect) {
    const newW = b.h * targetAspect;
    const extra = (newW - b.w) / 2;
    return bbox(b.x - extra, b.y, b.x + b.w + extra, b.y + b.h);
  }
  if (currentAspect > targetAspect) {
    const newH = b.w / targetAspect;
    const extra = (newH - b.h) / 2;
    return bbox(b.x, b.y - extra, b.x + b.w, b.y + b.h + extra);
  }
  return b;
}

// ---------------------------------------------------------------------------
// Fixed visual offsets for geographically-clustered pins
// ---------------------------------------------------------------------------
/**
 * Screen-px offsets applied to specific pins so pair-overlapping tips become
 * distinguishable without moving the pin far from its true coordinate.
 * Applied only at render time, not to the calibrated data.
 *
 *   BS8: Clifton sits southwest of central Bristol (BS1).
 *   BA2: Bath South sits directly south of Bath centre (BA1).
 */
export const PIN_VISUAL_OFFSET_PX: Record<string, { dx: number; dy: number }> = {
  BS8: { dx: -10, dy: 10 },
  BA2: { dx: 0, dy: 8 },
};

// ---------------------------------------------------------------------------
// Hardcoded label side per pilot pin
// ---------------------------------------------------------------------------
export type LabelSide = 'right' | 'left' | 'below-right';

export const PIN_LABEL_SIDE: Record<string, LabelSide> = {
  BA11: 'right',
  BS1: 'right',
  BS8: 'left',
  BA1: 'right',
  BA2: 'below-right',
  BA3: 'right',
  BA4: 'right',
  TA1: 'right',
  BA20: 'right',
  BS22: 'right',
};

// ---------------------------------------------------------------------------
// Postcode -> region mapping
// ---------------------------------------------------------------------------
import { UK_POSTCODE_AREA_TO_REGION } from './uk-postcode-area-regions';

/**
 * Map a postcode (or postcode district) to its NUTS 1 region
 * (first letters of the outward code = geographic postcode area).
 */
export function postcodeToRegion(postcode: string): RegionKey | null {
  const area = postcode.replace(/\d.*$/, '').toUpperCase();
  return UK_POSTCODE_AREA_TO_REGION[area] ?? null;
}
