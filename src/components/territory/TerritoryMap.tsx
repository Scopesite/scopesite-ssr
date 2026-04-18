'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MAP_REGIONS, type RegionKey } from '@/lib/territory/map-regions';
import { REGION_PATHS, REGION_VIEWBOX } from '@/lib/territory/region-paths';
import type { MapDataPoint } from '@/lib/territory/types';
import { emitOpenAreaWaitlist, emitOpenPilotChecker } from '@/lib/territory/events';
import {
  getRegionZoomBounds,
  aspectCorrect,
  postcodeToRegion,
  type BBox,
} from '@/lib/territory/pin-layout';
import {
  POSTCODE_BOUNDARIES,
  POSTCODE_CENTROIDS,
  ALL_BOUNDS_UNION,
  PILOT_POSTCODES,
  type PilotPostcode,
} from '@/lib/territory/postcode-boundaries';
import { isActivePilotPostcode } from '@/lib/territory/pilot-postcodes';

// Stable set lookup - avoid Array.includes inside render loops over ~80 paths.
const PILOT_POSTCODE_SET: ReadonlySet<string> = new Set(PILOT_POSTCODES);

interface Props {
  /** Server-rendered pin data. Pre-fetched by /territory/page.tsx. */
  points: MapDataPoint[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const FULL_VIEWBOX: BBox = {
  x: 0,
  y: 0,
  w: REGION_VIEWBOX.width,
  h: REGION_VIEWBOX.height,
  cx: REGION_VIEWBOX.width / 2,
  cy: REGION_VIEWBOX.height / 2,
};

const FULL_ASPECT = REGION_VIEWBOX.width / REGION_VIEWBOX.height;

// Active-region label at UK view (gold, centred inside outline).
const ACTIVE_LABEL_COORDS: Partial<Record<RegionKey, { x: number; y: number }>> = {
  south_west: { x: 300, y: 880 },
};

// State colour palette - traffic-light + purple, plus gold home accent.
const COLOUR = {
  available: '#22C55E',
  pending:   '#3B82F6',
  claimed:   '#B91C1C',
  inactive:  '#64748B',
  premium:   '#A855F7',
  home:      '#F5B700',
} as const;

// Pin visual dimensions (screen px at natural 1.0 size).
const PIN_W_SCREEN = 16;
const PIN_H_SCREEN = 22;

// Pin visual dimensions when zoomed (natural * 1.4 emphasis multiplier).
const PIN_W_ZOOMED_SCREEN = PIN_W_SCREEN * 1.4;
const PIN_H_ZOOMED_SCREEN = PIN_H_SCREEN * 1.4;

// Pan clamp buffer - keep at least this fraction of the region bbox visible.
const PAN_BUFFER = 0.1;
// Arrow-button pan nudge as a fraction of the current animated viewBox size.
const PAN_ARROW_STEP = 0.15;
const PAN_ARROW_DURATION_MS = 200;

// Zoom-factor bounds applied on top of region-level zoom.
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 1.2;

// Label anchor (screen px) when zoomed. Labels sit 12px from the pin tip,
// vertically centred on the tip. Default is to the right; edge pins can
// flip to the left to avoid viewBox clipping.
const LABEL_GAP_PX = 12;

const LABEL_POSITION_OVERRIDES: Record<string, 'left' | 'right'> = {
  BS1: 'left',
};

// ---------------------------------------------------------------------------
// Pan maths - pure, module-level so it's accessible from effects and handlers
// without closing over component state.
// ---------------------------------------------------------------------------

// Returns a pan offset (dx, dy) clamped so the shown viewBox
// (targetX + dx, targetY + dy, targetW, targetH) keeps at least PAN_BUFFER
// worth of the region bbox visible on each side.
function clampPanPure(
  region: BBox,
  targetX: number,
  targetY: number,
  targetW: number,
  targetH: number,
  requestedDx: number,
  requestedDy: number,
): { dx: number; dy: number } {
  const minLeft = region.x - region.w * PAN_BUFFER;
  const maxRight = region.x + region.w * (1 + PAN_BUFFER);
  const minTop = region.y - region.h * PAN_BUFFER;
  const maxBottom = region.y + region.h * (1 + PAN_BUFFER);

  const minDx = minLeft - targetX;
  const maxDx = maxRight - (targetX + targetW);
  const minDy = minTop - targetY;
  const maxDy = maxBottom - (targetY + targetH);

  const clampedDx =
    minDx <= maxDx ? Math.max(minDx, Math.min(maxDx, requestedDx)) : 0;
  const clampedDy =
    minDy <= maxDy ? Math.max(minDy, Math.min(maxDy, requestedDy)) : 0;
  return { dx: clampedDx, dy: clampedDy };
}

// ---------------------------------------------------------------------------
// Zoom bounds helpers
// ---------------------------------------------------------------------------
function southWestZoomBounds(targetAspect: number): BBox {
  // Frame the UNION bbox of every rendered postcode district (pilot AND
  // non-pilot). This gives users a full south-west view on first zoom: pilot
  // districts in prominent styling plus every neighbouring BS/BA/TA district
  // they can click to join a waitlist. Pad 10% per axis, aspect-correct to
  // match the container.
  const { x, y, w, h } = ALL_BOUNDS_UNION;
  const padX = w * 0.1;
  const padY = h * 0.1;
  const raw: BBox = {
    x: x - padX,
    y: y - padY,
    w: w + padX * 2,
    h: h + padY * 2,
    cx: x + w / 2,
    cy: y + h / 2,
  };
  return aspectCorrect(raw, targetAspect);
}

// ---------------------------------------------------------------------------
// Bounding-box maths for region paths
// ---------------------------------------------------------------------------
function computeRegionBBox(d: string): BBox {
  const matches = d.match(/-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?/g) ?? [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const m of matches) {
    const [xStr, yStr] = m.split(',');
    const x = parseFloat(xStr);
    const y = parseFloat(yStr);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  const rawW = maxX - minX;
  const rawH = maxY - minY;
  const padX = rawW * 0.05;
  const padY = rawH * 0.05;
  const x = minX - padX;
  const y = minY - padY;
  const w = rawW + padX * 2;
  const h = rawH + padY * 2;
  return { x, y, w, h, cx: minX + rawW / 2, cy: minY + rawH / 2 };
}

// ---------------------------------------------------------------------------
// ViewBox animation hook
// ---------------------------------------------------------------------------
interface ViewBoxState {
  x: number;
  y: number;
  w: number;
  h: number;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function useAnimatedViewBox(
  targetX: number,
  targetY: number,
  targetW: number,
  targetH: number,
): ViewBoxState {
  const [current, setCurrent] = useState<ViewBoxState>({
    x: targetX,
    y: targetY,
    w: targetW,
    h: targetH,
  });
  const rafRef = useRef<number | null>(null);
  const currentRef = useRef<ViewBoxState>(current);

  useEffect(() => {
    currentRef.current = current;
  });

  useEffect(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const start = { ...currentRef.current };
    const end = { x: targetX, y: targetY, w: targetW, h: targetH };
    const DURATION = 400;
    const t0 = performance.now();

    const step = (now: number) => {
      const elapsed = now - t0;
      const progress = Math.min(1, elapsed / DURATION);
      const eased = easeOutCubic(progress);
      setCurrent({
        x: start.x + (end.x - start.x) * eased,
        y: start.y + (end.y - start.y) * eased,
        w: start.w + (end.w - start.w) * eased,
        h: start.h + (end.h - start.h) * eased,
      });
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [targetX, targetY, targetW, targetH]);

  return current;
}

// ---------------------------------------------------------------------------
// Pin helpers
// ---------------------------------------------------------------------------
function pinColour(p: MapDataPoint): string {
  if (p.isReserve) return COLOUR.inactive;
  switch (p.aggregateState) {
    case 'claimed':   return COLOUR.claimed;
    case 'pending':   return COLOUR.pending;
    case 'available': return p.tier === 'premium' ? COLOUR.premium : COLOUR.available;
    case 'reserve':   return COLOUR.inactive;
    default: {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[TerritoryMap] unresolved pin state', p);
      }
      return COLOUR.inactive;
    }
  }
}

/**
 * Teardrop path for a map pin. Tip is at (0,0). Head is centred at
 * (0, -height). The sharp bottom point sits exactly at the translated
 * coordinate.
 */
function pinPath(isReserve: boolean): string {
  if (isReserve) return 'M0,0 L-6,-16 A6,6 0 1,1 6,-16 Z';
  return 'M0,0 L-8,-22 A8,8 0 1,1 8,-22 Z';
}

function sectorSummary(p: MapDataPoint): string {
  if (p.isReserve) return 'Reserve territory, not yet live';
  return `${p.availableSectorCount} of ${p.totalSectorCount} sectors available`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
// Pan UX: arrow buttons + keyboard arrow keys only. Drag-to-pan
// was removed because discriminating click-vs-drag on SVG child
// elements with pointer capture fought with native click dispatch
// in ways that burned a full build session. Arrow buttons are
// simpler, more accessible, and work on touch devices without
// competing with browser scroll gestures.
export function TerritoryMap({ points }: Props) {
  const [hoverRegion, setHoverRegion] = useState<RegionKey | null>(null);
  const [hoverPin, setHoverPin] = useState<string | null>(null);
  const [hoverBoundary, setHoverBoundary] = useState<string | null>(null);
  const [zoomedRegion, setZoomedRegion] = useState<RegionKey | null>(null);

  // Extra zoom factor applied on top of region-level zoom (+/- buttons).
  const [zoomFactor, setZoomFactor] = useState(1);

  // Pan state - offset applied ON TOP of the animated zoom viewBox.
  const [pan, setPan] = useState({ dx: 0, dy: 0 });
  /** Pan clamp limits for the current zoom state only — recomputed only when region or targetBBox changes. */
  const panLimitsRef = useRef<{
    region: BBox;
    baseVB: { x: number; y: number; w: number; h: number };
    limits: { minDx: number; maxDx: number; minDy: number; maxDy: number };
  } | null>(null);
  const panAnimRafRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (panAnimRafRef.current != null) cancelAnimationFrame(panAnimRafRef.current);
    },
    [],
  );

  // Pre-compute every region's bounding box + centroid once per mount.
  const bboxes = useMemo(() => {
    const out: Record<RegionKey, BBox> = {} as Record<RegionKey, BBox>;
    (Object.keys(REGION_PATHS) as RegionKey[]).forEach((key) => {
      out[key] = computeRegionBBox(REGION_PATHS[key]);
    });
    return out;
  }, []);

  const targetBBox = useMemo<BBox>(() => {
    if (!zoomedRegion) return FULL_VIEWBOX;
    let base: BBox;
    if (zoomedRegion === 'south_west') {
      // South West pilot: frame the UNION of the 10 pilot boundary bboxes.
      // Regions SVG is hidden at this zoom, so boundaries and centroid-
      // positioned pins are the only things visible. The same projected
      // coordinate system backs both, so framing is trivially correct.
      base = southWestZoomBounds(FULL_ASPECT);
    } else {
      // Non-pilot regions: frame the calibrated pin cluster or region bbox.
      const pinsInRegion = points.filter(
        (p) => postcodeToRegion(p.postcode) === zoomedRegion,
      );
      base = getRegionZoomBounds(
        zoomedRegion,
        pinsInRegion,
        bboxes[zoomedRegion],
        FULL_ASPECT,
      );
    }
    if (zoomFactor <= 1.0001) return base;
    // Shrink around the base bbox centre. Pan is PRESERVED across zoom
    // changes, so the user's current view centre (= base.cx + pan.dx, which
    // stays constant as vb.w shrinks) becomes the zoom focal point. Any
    // stale pan that no longer fits the shrunk/grown viewBox is clamped by
    // the reclampPanOnTargetChange effect below.
    const w = base.w / zoomFactor;
    const h = base.h / zoomFactor;
    return {
      x: base.cx - w / 2,
      y: base.cy - h / 2,
      w,
      h,
      cx: base.cx,
      cy: base.cy,
    };
  }, [zoomedRegion, zoomFactor, points, bboxes]);

  const vb = useAnimatedViewBox(targetBBox.x, targetBBox.y, targetBBox.w, targetBBox.h);

  // Freeze pan clamp inputs to one snapshot per zoom-state change (region
  // switch or +/- zoom). Handlers read panLimitsRef — never recompute these
  // limits during an active pan gesture.
  const panLimitsForZoom = useMemo(() => {
    if (!zoomedRegion) return null;
    const region = bboxes[zoomedRegion];
    const t = targetBBox;
    const minLeft = region.x - region.w * PAN_BUFFER;
    const maxRight = region.x + region.w * (1 + PAN_BUFFER);
    const minTop = region.y - region.h * PAN_BUFFER;
    const maxBottom = region.y + region.h * (1 + PAN_BUFFER);
    return {
      region,
      baseVB: { x: t.x, y: t.y, w: t.w, h: t.h },
      limits: {
        minDx: minLeft - t.x,
        maxDx: maxRight - (t.x + t.w),
        minDy: minTop - t.y,
        maxDy: maxBottom - (t.y + t.h),
      },
    };
  }, [zoomedRegion, targetBBox, bboxes]);
  panLimitsRef.current = panLimitsForZoom;

  const panArrowsAtLimit = useMemo(() => {
    if (!zoomedRegion || !panLimitsForZoom) {
      return { up: true, down: true, left: true, right: true };
    }
    const { minDx, maxDx, minDy, maxDy } = panLimitsForZoom.limits;
    const eps = 1e-3;
    return {
      left: pan.dx <= minDx + eps,
      right: pan.dx >= maxDx - eps,
      up: pan.dy <= minDy + eps,
      down: pan.dy >= maxDy - eps,
    };
  }, [zoomedRegion, pan.dx, pan.dy, panLimitsForZoom]);

  // `zoomScale` tracks the animated viewBox in real time so CSS transforms
  // that should stay pixel-constant can be counter-scaled.
  const zoomScale = FULL_VIEWBOX.w / vb.w;

  const runPanArrow = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right') => {
      if (!zoomedRegion) return;
      const pl = panLimitsRef.current;
      if (!pl) return;
      if (panAnimRafRef.current != null) {
        cancelAnimationFrame(panAnimRafRef.current);
        panAnimRafRef.current = null;
      }
      const stepW = vb.w * PAN_ARROW_STEP;
      const stepH = vb.h * PAN_ARROW_STEP;
      let deltaDx = 0;
      let deltaDy = 0;
      if (dir === 'left') deltaDx = -stepW;
      else if (dir === 'right') deltaDx = stepW;
      else if (dir === 'up') deltaDy = -stepH;
      else deltaDy = stepH;

      const startDx = pan.dx;
      const startDy = pan.dy;
      const endClamped = clampPanPure(
        pl.region,
        pl.baseVB.x,
        pl.baseVB.y,
        pl.baseVB.w,
        pl.baseVB.h,
        startDx + deltaDx,
        startDy + deltaDy,
      );
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / PAN_ARROW_DURATION_MS);
        const eased = easeOutCubic(t);
        setPan({
          dx: startDx + (endClamped.dx - startDx) * eased,
          dy: startDy + (endClamped.dy - startDy) * eased,
        });
        if (t < 1) {
          panAnimRafRef.current = requestAnimationFrame(tick);
        } else {
          panAnimRafRef.current = null;
          setPan(endClamped);
        }
      };
      panAnimRafRef.current = requestAnimationFrame(tick);
    },
    [zoomedRegion, vb.w, vb.h, pan.dx, pan.dy],
  );

  // Escape key resets zoom + pan + zoomFactor.
  useEffect(() => {
    if (!zoomedRegion) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomedRegion(null);
        setPan({ dx: 0, dy: 0 });
        setZoomFactor(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomedRegion]);

  // Reclamp pan whenever targetBBox changes.
  //
  // Zooming IN shrinks the viewBox, which INCREASES pan range - any existing
  // pan is still valid. Zooming OUT grows the viewBox, which shrinks the pan
  // range, so an existing pan may exceed the new limits. Rather than resetting
  // pan to (0, 0) on every zoom change (which would snap the focus back to
  // the base centre), we preserve pan and only correct it when the new
  // target actually puts it out of range.
  useEffect(() => {
    if (!zoomedRegion) return;
    const region = bboxes[zoomedRegion];
    const clamped = clampPanPure(
      region,
      targetBBox.x,
      targetBBox.y,
      targetBBox.w,
      targetBBox.h,
      pan.dx,
      pan.dy,
    );
    if (clamped.dx !== pan.dx || clamped.dy !== pan.dy) {
      setPan(clamped);
    }
    // Intentionally omit `pan` from deps: we only want to run this effect
    // when the target viewBox changes (zoom in/out or region switch), not
    // while the user is actively panning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetBBox.x, targetBBox.y, targetBBox.w, targetBBox.h, zoomedRegion, bboxes]);

  const resetToUK = () => {
    setZoomedRegion(null);
    setPan({ dx: 0, dy: 0 });
    setZoomFactor(1);
  };

  const onRegionClick = (key: RegionKey) => {
    setZoomedRegion(key);
    setPan({ dx: 0, dy: 0 });
    setZoomFactor(1);
    if (!MAP_REGIONS[key].active) {
      emitOpenAreaWaitlist({
        entrySource: 'region_click',
        regionKey: key,
        regionLabel: MAP_REGIONS[key].label,
      });
    }
  };

  // Unified click rule (applies to BOTH pin and boundary clicks):
  //
  //   - ACTIVE PILOT (BS1, BS8, BS22, BA1, BA11, BA20, TA1):
  //       open the PilotCheckerModal qualification gate. User confirms
  //       the postcode and picks an industry; modal then navigates to
  //       /territory/apply?postcode=X&sector=Y.
  //
  //   - EVERYTHING ELSE:
  //       open the AreaWaitlistForm directly with the postcode prefilled
  //       and entry_source='postcode_not_in_pilot'. This covers reserve
  //       pilot districts (BA2, BA3, BA4) as well as any non-pilot
  //       district inside the SW (TA7, BS40, BA16, ...) and beyond.
  //       The form differentiates copy between "reserve" and "not in
  //       pilot zone yet" but both feed the same waitlist queue.
  const routeDistrictClick = (postcode: string) => {
    const activePilot = isActivePilotPostcode(postcode);
    console.log('[TerritoryMap] routeDistrictClick', { postcode, activePilot });
    if (activePilot) {
      const pinMeta = points.find((p) => p.postcode === postcode);
      emitOpenPilotChecker({ postcode, town: pinMeta?.town });
      return;
    }
    emitOpenAreaWaitlist({
      entrySource: 'postcode_not_in_pilot',
      postcode,
    });
  };

  const onPinClick = (p: MapDataPoint) => {
    routeDistrictClick(p.postcode);
  };

  const onBoundaryClick = (code: string) => {
    routeDistrictClick(code);
  };

  const onZoomIn = () => {
    if (!zoomedRegion) return;
    // DO NOT reset pan. Preserving (dx, dy) means the current view centre
    // (= base.cx + pan.dx, base.cy + pan.dy) stays fixed as vb.w shrinks,
    // which is the behaviour users expect: "zoom in on what I'm looking at,
    // not back to the base centre".
    setZoomFactor((z) => Math.min(ZOOM_MAX, z * ZOOM_STEP));
  };

  const onZoomOut = () => {
    if (!zoomedRegion) return;
    // Same behaviour as zoom-in: preserve pan so the user keeps their
    // focal point. If the shrunk viewBox no longer lets that pan stay
    // within the outer region bounds, reclampPanOnTargetChange snaps it
    // back to the nearest legal offset.
    setZoomFactor((z) => Math.max(ZOOM_MIN, z / ZOOM_STEP));
  };

  const onWrapperKeyDown = (e: React.KeyboardEvent) => {
    if (!zoomedRegion) return;
    if (e.key === '+' || e.key === '=') {
      onZoomIn();
      e.preventDefault();
    } else if (e.key === '-' || e.key === '_') {
      onZoomOut();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (!panArrowsAtLimit.up) runPanArrow('up');
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (!panArrowsAtLimit.down) runPanArrow('down');
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      if (!panArrowsAtLimit.left) runPanArrow('left');
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      if (!panArrowsAtLimit.right) runPanArrow('right');
      e.preventDefault();
    }
  };

  const showPinLabels = zoomedRegion !== null && MAP_REGIONS[zoomedRegion].active;

  // Resolve each pin's rendered position.
  //
  //   - At UK-wide view or zoomed into a non-pilot region we use the
  //     hand-calibrated (svgX, svgY) from pin-coordinates.ts.
  //   - At zoom === 'south_west' we switch to the postcode polygon centroid
  //     so pins sit inside their matching district automatically. Boundaries
  //     and pins then share a single source of truth.
  //
  // `source` is kept on each row for the debug instrumentation below.
  const renderedPins = useMemo(() => {
    const useCentroids = zoomedRegion === 'south_west';
    return points.map((p) => {
      if (useCentroids) {
        const c = POSTCODE_CENTROIDS[p.postcode as PilotPostcode];
        if (c) {
          return {
            p,
            renderedX: c.x,
            renderedY: c.y,
            source: 'centroid' as const,
          };
        }
      }
      return {
        p,
        renderedX: p.svgX,
        renderedY: p.svgY,
        source: 'calibrated' as const,
      };
    });
  }, [points, zoomedRegion]);

  // Effective viewBox: zoom target plus pan offset.
  const viewBoxStr = `${vb.x + pan.dx} ${vb.y + pan.dy} ${vb.w} ${vb.h}`;

  // Debug instrumentation. Logs the full pin set for BOTH states:
  //   - zoomedRegion === null       -> source = 'calibrated' (svgX/svgY)
  //   - zoomedRegion === 'south_west' -> source = 'centroid' (postcode polygon)
  //
  // Runs once per zoom-state change so console noise stays minimal.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rows = renderedPins.map(({ p, renderedX, renderedY, source }) => {
      const heightPx = 20;
      const { offsetX, offsetY } = labelOffsetPx(heightPx);
      const labelX = renderedX + offsetX / zoomScale;
      const labelY = renderedY + offsetY / zoomScale;
      const insideViewBox =
        renderedX >= vb.x + pan.dx &&
        renderedX <= vb.x + pan.dx + vb.w &&
        renderedY >= vb.y + pan.dy &&
        renderedY <= vb.y + pan.dy + vb.h;
      return {
        postcode: p.postcode,
        source,
        renderedX: +renderedX.toFixed(2),
        renderedY: +renderedY.toFixed(2),
        labelX: +labelX.toFixed(2),
        labelY: +labelY.toFixed(2),
        insideViewBox,
      };
    });
    console.log(
      '[TerritoryMap] zoomedRegion =',
      zoomedRegion,
      'viewBox=',
      {
        x: +(vb.x + pan.dx).toFixed(2),
        y: +(vb.y + pan.dy).toFixed(2),
        w: +vb.w.toFixed(2),
        h: +vb.h.toFixed(2),
      },
      'zoomScale=',
      +zoomScale.toFixed(3),
    );
    console.table(rows);
    // Intentionally depend only on zoomedRegion + renderedPins identity so
    // we don't spam logs during the viewBox animation frames.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomedRegion, renderedPins]);

  // Cursor class for the wrapper. Arrow buttons are the sole pan UI
  // so the wrapper no longer flips to grab/grabbing.
  const wrapperCursor = zoomedRegion ? 'cursor-default' : '';

  // Labels always sit LABEL_GAP_PX right of the pin tip, vertically centred
  // on the tip. Screen-px values - the consumer counter-scales via
  // `1 / zoomScale` when placing the group inside the SVG.
  const labelOffsetPx = (heightPx: number) => ({
    offsetX: PIN_W_ZOOMED_SCREEN / 2 + LABEL_GAP_PX,
    offsetY: -heightPx / 2,
  });

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-headline text-3xl sm:text-4xl text-brand-navy">
            Where Territory Command is live
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            The South West pilot launches first. Other UK regions are coming.
            Click a region to zoom in, or click a pin to check availability for
            that postcode.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-8 items-start">
          <div
            className={`relative rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4 focus:outline-none ${wrapperCursor}`}
            tabIndex={0}
            onKeyDown={onWrapperKeyDown}
          >
            {/* Back-to-UK button (shown only when zoomed) */}
            {zoomedRegion ? (
              <button
                type="button"
                onClick={resetToUK}
                className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-lg bg-brand-gold px-3 py-2 text-sm font-semibold text-brand-navy shadow-md hover:bg-brand-gold/90 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-2 motion-safe:duration-200"
                aria-label="Back to full UK view"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to UK
              </button>
            ) : null}

            {/* Zoomed-region header chip */}
            {zoomedRegion ? (
              <div
                className="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-navy shadow-md ring-1 ring-slate-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-200"
                role="status"
                aria-live="polite"
              >
                {MAP_REGIONS[zoomedRegion].label}
                {MAP_REGIONS[zoomedRegion].active ? (
                  <span className="ml-2 rounded-full bg-brand-gold/20 px-2 py-0.5 text-xs text-brand-gold-accessible">
                    Pilot live
                  </span>
                ) : (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    Coming soon
                  </span>
                )}
              </div>
            ) : null}

            {/* Zoom in/out controls (zoomed views only). */}
            {zoomedRegion ? (
              <div
                className="absolute right-5 top-5 z-10 flex flex-col gap-1 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
              >
                <button
                  type="button"
                  aria-label="Zoom in"
                  disabled={zoomFactor >= ZOOM_MAX - 0.0001}
                  onClick={onZoomIn}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-gold text-xl font-bold leading-none text-brand-navy shadow-md hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  +
                </button>
                <button
                  type="button"
                  aria-label="Zoom out"
                  disabled={zoomFactor <= ZOOM_MIN + 0.0001}
                  onClick={onZoomOut}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-gold text-xl font-bold leading-none text-brand-navy shadow-md hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  &minus;
                </button>
              </div>
            ) : null}

            {zoomedRegion ? (
              <nav
                aria-label="Map pan controls"
                className="absolute bottom-5 right-5 z-10 grid grid-cols-3 grid-rows-3 gap-1 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
              >
                <button
                  type="button"
                  aria-label="Pan map up"
                  disabled={panArrowsAtLimit.up}
                  onClick={() => runPanArrow('up')}
                  className="col-start-2 row-start-1 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-gold text-brand-navy shadow-md hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 14 12 8 18 14" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Pan map left"
                  disabled={panArrowsAtLimit.left}
                  onClick={() => runPanArrow('left')}
                  className="col-start-1 row-start-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-gold text-brand-navy shadow-md hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="14 6 8 12 14 18" />
                  </svg>
                </button>
                <div
                  className="col-start-2 row-start-2 h-10 w-10"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  aria-label="Pan map right"
                  disabled={panArrowsAtLimit.right}
                  onClick={() => runPanArrow('right')}
                  className="col-start-3 row-start-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-gold text-brand-navy shadow-md hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="10 6 16 12 10 18" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Pan map down"
                  disabled={panArrowsAtLimit.down}
                  onClick={() => runPanArrow('down')}
                  className="col-start-2 row-start-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-gold text-brand-navy shadow-md hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 10 12 16 18 10" />
                  </svg>
                </button>
              </nav>
            ) : null}

            <svg
              viewBox={viewBoxStr}
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Map of the United Kingdom regions showing the South West Territory Command pilot area"
              preserveAspectRatio="xMidYMid meet"
              className="territory-map-root w-full h-auto max-h-[70vh] mx-auto block"
            >
              <defs>
                <filter id="active-region-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="0" dy="2" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.35" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="pin-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="hover-pill-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                  <feOffset dx="0" dy="1" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.25" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="label-shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                  <feOffset dx="0" dy="2" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.2" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* UK regions. Hidden while zoomed into the South West pilot
                  so postcode boundaries become the only map surface (they
                  share a coordinate system with centroid-positioned pins,
                  which avoids any projection mismatch between the regions
                  SVG and the postcode-district GeoJSON). Wrapped in a
                  single <g> with display toggle so the DOM is stable and
                  zoom-in/zoom-out transitions don't rebuild the paths. */}
              <g
                id="uk-regions"
                style={{ display: zoomedRegion === 'south_west' ? 'none' : undefined }}
              >
                {(Object.keys(MAP_REGIONS) as RegionKey[]).map((key) => {
                  const isActive = MAP_REGIONS[key].active;
                  const isHover = hoverRegion === key;
                  const fill = isActive ? '#0A1B36' : '#64748B';
                  const opacity = isActive ? 1 : isHover ? 0.45 : 0.25;
                  return (
                    <path
                      key={key}
                      data-region-key={key}
                      d={REGION_PATHS[key]}
                      fill={fill}
                      stroke={isActive ? '#ECB615' : '#94A3B8'}
                      strokeWidth={isActive ? 1.5 : 0.5}
                      vectorEffect="non-scaling-stroke"
                      opacity={opacity}
                      filter={isActive ? 'url(#active-region-shadow)' : undefined}
                      style={{
                        cursor: 'pointer',
                        transition: 'opacity 150ms ease, fill 150ms ease',
                      }}
                      onMouseEnter={() => !isActive && setHoverRegion(key)}
                      onMouseLeave={() => !isActive && setHoverRegion(null)}
                      onClick={() => onRegionClick(key)}
                    >
                      <title>
                        {isActive
                          ? `${MAP_REGIONS[key].label}: pilot live, click to zoom in`
                          : `${MAP_REGIONS[key].label}: coming soon, click to register interest`}
                      </title>
                    </path>
                  );
                })}
              </g>

              {/* Active-region label (UK view only; header chip takes over when
                  zoomed). */}
              {!zoomedRegion
                ? (Object.keys(ACTIVE_LABEL_COORDS) as RegionKey[]).map((key) => {
                    const coord = ACTIVE_LABEL_COORDS[key];
                    if (!coord) return null;
                    return (
                      <text
                        key={`label-${key}`}
                        x={coord.x}
                        y={coord.y}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="700"
                        fill={COLOUR.home}
                        style={{ pointerEvents: 'none', fontFamily: 'system-ui, sans-serif' }}
                      >
                        {MAP_REGIONS[key].label}
                      </text>
                    );
                  })
                : null}

              {/* Hover pill for inactive regions at UK view. */}
              {!zoomedRegion && hoverRegion && !MAP_REGIONS[hoverRegion].active ? (
                (() => {
                  const label = MAP_REGIONS[hoverRegion].label;
                  const bb = bboxes[hoverRegion];
                  const charW = 7;
                  const pillW = Math.max(80, label.length * charW + 16);
                  const pillH = 22;
                  const px = bb.cx - pillW / 2;
                  const py = bb.cy - pillH / 2;
                  return (
                    <g style={{ pointerEvents: 'none' }} filter="url(#hover-pill-shadow)">
                      <rect
                        x={px}
                        y={py}
                        width={pillW}
                        height={pillH}
                        rx={4}
                        fill="#FFFFFF"
                      />
                      <text
                        x={bb.cx}
                        y={bb.cy + 4}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="600"
                        fill="#0A1B36"
                        style={{ fontFamily: 'system-ui, sans-serif' }}
                      >
                        {label}
                      </text>
                    </g>
                  );
                })()
              ) : null}

              {/* Postcode district boundaries - visible only when zoomed into
                  the South West. Every BS/BA/TA district we have data for is
                  rendered so prospects in non-pilot areas can still click to
                  prefill the checker and join the waitlist (first-come-
                  first-served). Pilot districts get prominent gold+navy
                  styling; non-pilot get a subtle slate outline so the pilot
                  coverage reads clearly but every district is clickable.
                  Rendered AFTER regions and BEFORE pins so pins stay on top. */}
              {zoomedRegion === 'south_west' ? (
                <g id="postcode-boundaries" aria-label="Postcode district boundaries">
                  {Object.keys(POSTCODE_BOUNDARIES).map((code) => {
                    const d = POSTCODE_BOUNDARIES[code];
                    const isPilot = PILOT_POSTCODE_SET.has(code);
                    const isHover = hoverBoundary === code;
                    const fill = isPilot ? '#0A1B36' : '#64748B';
                    const fillOpacity = isPilot
                      ? isHover ? 0.6 : 0.4
                      : isHover ? 0.25 : 0.1;
                    const stroke = isPilot ? '#F5B700' : '#94A3B8';
                    const strokeOpacity = isPilot
                      ? isHover ? 0.8 : 0.4
                      : isHover ? 0.7 : 0.35;
                    const strokeWidth = isPilot ? 0.8 : 0.4;
                    const title = isPilot
                      ? `${code} - pilot live, click to check sector availability`
                      : `${code} - coming soon, click to join the waitlist`;
                    return (
                      <path
                        key={`boundary-${code}`}
                        d={d}
                        data-postcode={code}
                        data-district-postcode={code}
                        data-pilot={isPilot ? 'true' : 'false'}
                        fill={fill}
                        fillOpacity={fillOpacity}
                        stroke={stroke}
                        strokeOpacity={strokeOpacity}
                        strokeWidth={strokeWidth}
                        vectorEffect="non-scaling-stroke"
                        style={{
                          cursor: 'pointer',
                          transition:
                            'fill-opacity 150ms ease-out, stroke-opacity 150ms ease-out',
                        }}
                        onMouseEnter={() => setHoverBoundary(code)}
                        onMouseLeave={() => setHoverBoundary(null)}
                        onClick={() => onBoundaryClick(code)}
                      >
                        <title>{title}</title>
                      </path>
                    );
                  })}
                </g>
              ) : null}

              {/* Pins.
                  Rendering contract (so labels + pins stay in lockstep with
                  the polygon centroids):
                    - OUTER group: translate to (renderedX, renderedY). This
                      point is the pin TIP.
                    - INNER group: SVG-attribute scale(...) only. Because SVG
                      attribute transforms pivot around the parent origin,
                      the scale pivots at the pin tip by definition - no
                      fill-box / transform-origin games, no drift between
                      pin geometry and renderedX/Y.
                  The previous implementation used CSS `transform: scale(...)`
                  with `transformBox: 'fill-box'` + `transformOrigin: '0 0'`,
                  which pivots at the top-left of the pin's fill bounding box.
                  That shifts the visible tip by (~-7, ~-19) SVG units per
                  scale pass and was the root cause of pins floating away
                  from the polygon centroids at zoom. */}
              {renderedPins.map(({ p, renderedX, renderedY }) => {
                const colour = pinColour(p);
                const isHover = hoverPin === p.postcode;
                const clickable = !p.isReserve;
                const baseScale = zoomedRegion ? 1.4 / zoomScale : 1;
                const hoverMul = isHover ? 1.15 : 1;
                const pinScale = baseScale * hoverMul;
                return (
                  <g
                    key={`pin-${p.postcode}`}
                    data-pin-postcode={p.postcode}
                    transform={`translate(${renderedX} ${renderedY})`}
                    style={{ cursor: clickable ? 'pointer' : 'default' }}
                    onMouseEnter={() => setHoverPin(p.postcode)}
                    onMouseLeave={() => setHoverPin(null)}
                    onClick={() => onPinClick(p)}
                  >
                    {/* Invisible hit area: ~44px iOS HIG minimum. Kept OUT of
                        the pin-scale group so hit area stays constant at the
                        same screen px regardless of zoom or hover. */}
                    <rect
                      x={-22 / zoomScale}
                      y={-48 / zoomScale}
                      width={44 / zoomScale}
                      height={52 / zoomScale}
                      fill="transparent"
                      style={{ pointerEvents: 'all' }}
                    />
                    <g
                      transform={`scale(${pinScale})`}
                      filter={isHover ? 'url(#pin-glow)' : undefined}
                    >
                      {p.isHome ? (
                        <circle
                          cx={0}
                          cy={-22}
                          r={12}
                          fill="none"
                          stroke={COLOUR.home}
                          strokeWidth={2}
                          vectorEffect="non-scaling-stroke"
                          opacity={0.95}
                        />
                      ) : null}
                      <path
                        d={pinPath(p.isReserve)}
                        fill={colour}
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                        vectorEffect="non-scaling-stroke"
                      >
                        <title>{`${p.postcode} ${p.town} - ${sectorSummary(p)}`}</title>
                      </path>
                    </g>
                  </g>
                );
              })}

              {/* Static postcode + town labels (zoomed active regions only).
                  Anchored 12px right of the pin tip, vertically centred.
                  Counter-scaled so each chip stays at constant screen px. */}
              {showPinLabels
                ? renderedPins.map(({ p, renderedX, renderedY }) => {
                    const text = `${p.postcode} ${p.town}`;
                    const widthPx = text.length * 6.6 + 16;
                    const heightPx = 20;
                    const side = LABEL_POSITION_OVERRIDES[p.postcode] ?? 'right';
                    const pinHalfGap = PIN_W_ZOOMED_SCREEN / 2 + LABEL_GAP_PX;
                    const offsetX =
                      side === 'right' ? pinHalfGap : -(widthPx + pinHalfGap);
                    const offsetY = -heightPx / 2;
                    return (
                      <g
                        key={`label-${p.postcode}`}
                        transform={`translate(${renderedX} ${renderedY}) scale(${1 / zoomScale})`}
                        style={{ pointerEvents: 'none' }}
                      >
                        <g
                          transform={`translate(${offsetX} ${offsetY})`}
                          filter="url(#label-shadow)"
                        >
                          <rect
                            x={0}
                            y={0}
                            width={widthPx}
                            height={heightPx}
                            rx={4}
                            fill="#FFFFFF"
                          />
                          <text
                            x={8}
                            y={heightPx / 2 + 4}
                            fontSize={11}
                            fontWeight={600}
                            fill="#0A1B36"
                            style={{ fontFamily: 'system-ui, sans-serif' }}
                          >
                            {text}
                          </text>
                        </g>
                      </g>
                    );
                  })
                : null}

              {/* Hover tooltip. */}
              {hoverPin
                ? (() => {
                    const found = renderedPins.find((r) => r.p.postcode === hoverPin);
                    if (!found) return null;
                    const { p, renderedX, renderedY } = found;
                    const text = `${p.postcode} ${p.town} - ${sectorSummary(p)}`;
                    const widthPx = text.length * 6.4 + 20;
                    const heightPx = 24;
                    return (
                      <g
                        transform={`translate(${renderedX} ${renderedY}) scale(${1 / zoomScale})`}
                        style={{ pointerEvents: 'none' }}
                      >
                        <g transform={`translate(${-widthPx / 2} ${-PIN_H_ZOOMED_SCREEN - heightPx - 6})`}>
                          <rect
                            width={widthPx}
                            height={heightPx}
                            rx={4}
                            fill="#0A1B36"
                            opacity={0.96}
                          />
                          <text
                            x={widthPx / 2}
                            y={heightPx / 2 + 4}
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize={11}
                            fontWeight={600}
                            style={{ fontFamily: 'system-ui, sans-serif' }}
                          >
                            {text}
                          </text>
                        </g>
                      </g>
                    );
                  })()
                : null}
            </svg>
          </div>

          <aside className="space-y-4">
            <h3 className="font-headline text-lg text-brand-navy">Legend</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-territory-available" aria-hidden="true" />
                Available (standard tier)
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-territory-premium" aria-hidden="true" />
                Available (premium tier)
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-territory-pending" aria-hidden="true" />
                Pending application
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-territory-claimed" aria-hidden="true" />
                All sectors claimed
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-territory-inactive" aria-hidden="true" />
                Reserve / not yet live
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full border-2 border-territory-home" aria-hidden="true" />
                ScopeSite home postcode
              </li>
            </ul>
            <p className="text-xs text-slate-500 leading-relaxed">
              Live state refreshes every 60 seconds from the territory
              database. Click a region to zoom in, use the arrow buttons to
              pan, press Escape or the Back to UK button to reset.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Postcode boundaries &copy; Wikipedia contributors,{' '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-2 hover:text-slate-600"
              >
                CC BY-SA 3.0
              </a>
              .
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default TerritoryMap;
