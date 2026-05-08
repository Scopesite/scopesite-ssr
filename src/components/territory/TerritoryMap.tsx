'use client';

/**
 * Territory Command - interactive UK map.
 *
 * Two-level interaction:
 *   1. UK view: 12 regions, hoverable + clickable. No pins, no areas.
 *   2. Region zoom: the clicked region fills the viewport, adjacent regions
 *      hidden. Postcode-area polygons render inside with fill colour driven
 *      by aggregated seat availability. Click an area -> existing industry
 *      picker modal.
 *
 * LEGACY: pilot terminology retained in code (emitOpenPilotChecker,
 * OPEN_PILOT_CHECKER_EVENT), not user-facing.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MAP_REGIONS, type RegionKey } from '@/lib/territory/map-regions';
import { REGION_PATHS, REGION_VIEWBOX } from '@/lib/territory/region-paths';
import type { AreaStatus } from '@/lib/territory/types';
import { emitOpenPilotChecker } from '@/lib/territory/events';
import { PromotionCountdown } from '@/components/territory/PromotionCountdown';
import { aspectCorrect, type BBox } from '@/lib/territory/pin-layout';
import {
  AREA_BOUNDARIES,
  AREA_BOUNDARY_CENTROIDS,
} from '@/lib/territory/area-boundaries';
import { UK_POSTCODE_AREA_TO_REGION } from '@/lib/territory/uk-postcode-area-regions';

interface Props {
  /** Server-rendered area-availability map keyed by postcode area. */
  areas: Record<string, AreaStatus>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const FULL_VIEWBOX: BBox = {
  x: REGION_VIEWBOX.x,
  y: REGION_VIEWBOX.y,
  w: REGION_VIEWBOX.width,
  h: REGION_VIEWBOX.height,
  cx: REGION_VIEWBOX.x + REGION_VIEWBOX.width / 2,
  cy: REGION_VIEWBOX.y + REGION_VIEWBOX.height / 2,
};

const FULL_ASPECT = REGION_VIEWBOX.width / REGION_VIEWBOX.height;

// Status palette - traffic-light + purple for premium.
const STATUS_FILL: Record<AreaStatus['status'], string> = {
  available: '#22C55E',
  premium: '#A855F7',
  pending: '#3B82F6',
  claimed: '#B91C1C',
  none: '#64748B',
  promotional: '#D4AF37',
};

const STATUS_LABEL: Record<AreaStatus['status'], string> = {
  available: 'Seats available',
  premium: 'Premium tier, seats available',
  pending: 'Application pending',
  claimed: 'All sectors claimed',
  none: 'Register interest',
  promotional: 'Limited offer',
};

// Pan clamp buffer - keep at least this fraction of the region bbox visible.
const PAN_BUFFER = 0.1;
const PAN_ARROW_STEP = 0.15;
const PAN_ARROW_DURATION_MS = 200;

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 1.2;

// London area labels pack into a small slice of the SVG when zoomed into
// London. Nudge each label off its centroid so they don't stack on top of
// each other. Values are SVG units; applied ONLY to labels, never to the
// polygon d-string (polygons keep their true geography).
const LONDON_LABEL_FANOUT: Record<string, [number, number]> = {
  EC: [ 4,  0],
  WC: [ 0,  0],
  W:  [-6,  0],
  SW: [-3,  6],
  SE: [ 4,  5],
  E:  [ 7,  1],
  N:  [ 0, -6],
  NW: [-4, -4],
};

// ---------------------------------------------------------------------------
// Pan maths
// ---------------------------------------------------------------------------
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
// ViewBox animation
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
// Component
// ---------------------------------------------------------------------------
export function TerritoryMap({ areas }: Props) {
  const router = useRouter();
  const [hoverRegion, setHoverRegion] = useState<RegionKey | null>(null);
  const [hoverArea, setHoverArea] = useState<string | null>(null);
  const [zoomedRegion, setZoomedRegion] = useState<RegionKey | null>(null);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [pan, setPan] = useState({ dx: 0, dy: 0 });

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
    const base = aspectCorrect(bboxes[zoomedRegion], FULL_ASPECT);
    if (zoomFactor <= 1.0001) return base;
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
  }, [zoomedRegion, zoomFactor, bboxes]);

  const vb = useAnimatedViewBox(targetBBox.x, targetBBox.y, targetBBox.w, targetBBox.h);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetBBox.x, targetBBox.y, targetBBox.w, targetBBox.h, zoomedRegion, bboxes]);

  const resetToUK = () => {
    setZoomedRegion(null);
    setPan({ dx: 0, dy: 0 });
    setZoomFactor(1);
    setHoverArea(null);
  };

  const onRegionClick = (key: RegionKey) => {
    setZoomedRegion(key);
    setPan({ dx: 0, dy: 0 });
    setZoomFactor(1);
    setHoverRegion(null);
  };

  const onAreaClick = (area: string) => {
    const status = areas[area];
    const promotion =
      status?.status === 'promotional' &&
      status.promotionExpiresAt &&
      status.promotionMonthlyPriceGbp != null &&
      status.promotionOriginMonthlyPriceGbp != null
        ? {
            headline: status.promotionHeadline ?? null,
            description: status.promotionDescription ?? null,
            promotionalMonthlyPriceGbp: status.promotionMonthlyPriceGbp,
            originMonthlyPriceGbp: status.promotionOriginMonthlyPriceGbp,
            expiresAt: status.promotionExpiresAt,
            originTier: (status.promotionOriginTier ?? 'standard') as
              | 'standard'
              | 'premium',
          }
        : undefined;
    emitOpenPilotChecker({
      postcode: area,
      town: status?.townName ?? undefined,
      promotion,
    });
  };

  const onZoomIn = () => {
    if (!zoomedRegion) return;
    setZoomFactor((z) => Math.min(ZOOM_MAX, z * ZOOM_STEP));
  };

  const onZoomOut = () => {
    if (!zoomedRegion) return;
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

  // Areas to render at current zoom. UK view renders none; region zoom
  // renders just the areas belonging to the zoomed region.
  const visibleAreas = useMemo(() => {
    if (!zoomedRegion) return [] as string[];
    const out: string[] = [];
    for (const area of Object.keys(AREA_BOUNDARIES)) {
      if (UK_POSTCODE_AREA_TO_REGION[area] === zoomedRegion) out.push(area);
    }
    return out.sort();
  }, [zoomedRegion]);

  const viewBoxStr = `${vb.x + pan.dx} ${vb.y + pan.dy} ${vb.w} ${vb.h}`;
  const wrapperCursor = zoomedRegion ? 'cursor-default' : '';

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-headline text-3xl sm:text-4xl text-brand-navy">
            Where Territory Command is live
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Territory Command is live across the UK. Click your region to zoom
            in, then click a postcode area to check what&rsquo;s available.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-8 items-start">
          <div
            className={`relative rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4 focus:outline-none ${wrapperCursor}`}
            tabIndex={0}
            onKeyDown={onWrapperKeyDown}
          >
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

            {zoomedRegion ? (
              <div
                className="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-navy shadow-md ring-1 ring-slate-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-200"
                role="status"
                aria-live="polite"
              >
                {MAP_REGIONS[zoomedRegion].label}
              </div>
            ) : null}

            {zoomedRegion ? (
              <div className="absolute right-5 top-5 z-10 flex flex-col gap-1 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
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
                <div className="col-start-2 row-start-2 h-10 w-10" aria-hidden="true" />
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
              aria-label="Map of the United Kingdom with Territory Command postcode areas by region"
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

              {/* UK regions. Adjacent regions hidden when zoomed so no map
                  geography outside the selected region bleeds into the view.
                  Selected region stays visible as the backdrop under the
                  area polygons so its outline silhouettes through the gaps
                  between polygon groups (Shetland, offshore islands etc). */}
              <g id="uk-regions">
                {(Object.keys(MAP_REGIONS) as RegionKey[]).map((key) => {
                  const isHover = hoverRegion === key && !zoomedRegion;
                  const isSelected = zoomedRegion === key;
                  const hidden = zoomedRegion !== null && !isSelected;
                  const fill = isSelected ? '#0A1B36' : '#0A1B36';
                  const opacity = isSelected ? 0.35 : isHover ? 0.9 : 0.75;
                  return (
                    <path
                      key={key}
                      data-region-key={key}
                      d={REGION_PATHS[key]}
                      fill={fill}
                      stroke="#ECB615"
                      strokeWidth={1.5}
                      vectorEffect="non-scaling-stroke"
                      opacity={opacity}
                      filter={!zoomedRegion ? 'url(#active-region-shadow)' : undefined}
                      style={{
                        cursor: zoomedRegion ? 'default' : 'pointer',
                        display: hidden ? 'none' : undefined,
                        pointerEvents: zoomedRegion ? 'none' : 'auto',
                        transition: 'opacity 150ms ease, fill 150ms ease',
                      }}
                      onMouseEnter={() => {
                        if (!zoomedRegion) setHoverRegion(key);
                      }}
                      onMouseLeave={() => {
                        if (!zoomedRegion) setHoverRegion(null);
                      }}
                      onClick={() => !zoomedRegion && onRegionClick(key)}
                    >
                      <title>
                        {`${MAP_REGIONS[key].label} \u2014 click to zoom in`}
                      </title>
                    </path>
                  );
                })}
              </g>

              {/* Hover pill for regions at UK view. Shows the region label
                  at its centroid so users confirm what they are about to
                  click. */}
              {!zoomedRegion && hoverRegion ? (
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
                      <rect x={px} y={py} width={pillW} height={pillH} rx={4} fill="#FFFFFF" />
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

              {/* Postcode-area polygons. Rendered only at region zoom,
                  filtered to areas that belong to the zoomed region.
                  Fill colour driven by per-area seat availability. */}
              {zoomedRegion ? (
                <g id="postcode-areas" aria-label="Postcode areas">
                  {visibleAreas.map((area) => {
                    const d = AREA_BOUNDARIES[area];
                    if (!d) return null;
                    const status = areas[area];
                    const key = status?.status ?? 'none';
                    const fill = STATUS_FILL[key];
                    const isHover = hoverArea === area;
                    const fillOpacity = isHover ? 0.85 : 0.65;
                    const title = status
                      ? `${area}${status.townName ? ' \u2014 ' + status.townName : ''}: ${STATUS_LABEL[key]}`
                      : `${area}: ${STATUS_LABEL.none}`;
                    const premiumStripe =
                      key === 'promotional' && status?.promotionOriginTier === 'premium';
                    return (
                      <g key={`area-${area}`}>
                        <path
                          d={d}
                          data-postcode-area={area}
                          fill={fill}
                          fillOpacity={fillOpacity}
                          stroke="#0A1B36"
                          strokeOpacity={isHover ? 0.9 : 0.7}
                          strokeWidth={0.7}
                          vectorEffect="non-scaling-stroke"
                          style={{
                            cursor: 'pointer',
                            transition:
                              'fill-opacity 150ms ease-out, stroke-opacity 150ms ease-out',
                          }}
                          onMouseEnter={() => setHoverArea(area)}
                          onMouseLeave={() => setHoverArea(null)}
                          onClick={() => onAreaClick(area)}
                        >
                          <title>{title}</title>
                        </path>
                        {premiumStripe ? (
                          <path
                            d={d}
                            fill="#6D28D9"
                            fillOpacity={isHover ? 0.35 : 0.28}
                            stroke="none"
                            style={{ pointerEvents: 'none' }}
                          />
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              ) : null}

              {/* Area labels. Anchored at each area's boundary centroid.
                  Font size counter-scaled so labels stay pixel-constant
                  regardless of zoomFactor. London areas get a small nudge
                  off their centroid so labels don't stack. */}
              {zoomedRegion ? (
                <g id="area-labels" style={{ pointerEvents: 'none' }}>
                  {visibleAreas.map((area) => {
                    const c = AREA_BOUNDARY_CENTROIDS[area];
                    if (!c) return null;
                    const nudge = LONDON_LABEL_FANOUT[area] ?? [0, 0];
                    const status = areas[area];
                    const town = status?.townName ?? '';
                    const text = town ? `${area} \u2014 ${town}` : area;
                    const widthPx = text.length * 6.4 + 14;
                    const heightPx = 18;
                    return (
                      <g
                        key={`label-${area}`}
                        transform={`translate(${c.x + nudge[0]} ${c.y + nudge[1]}) scale(${1 / zoomScale})`}
                      >
                        <g
                          transform={`translate(${-widthPx / 2} ${-heightPx / 2})`}
                          filter="url(#label-shadow)"
                        >
                          <rect
                            width={widthPx}
                            height={heightPx}
                            rx={4}
                            fill="#FFFFFF"
                            opacity={0.95}
                          />
                          <text
                            x={widthPx / 2}
                            y={heightPx / 2 + 4}
                            textAnchor="middle"
                            fontSize={11}
                            fontWeight={600}
                            fill="#0A1B36"
                            style={{ fontFamily: 'system-ui, sans-serif' }}
                          >
                            {text}
                          </text>
                        </g>
                        {status?.status === 'promotional' && status.promotionExpiresAt ? (
                          <foreignObject
                            x={-56}
                            y={heightPx / 2 + 4}
                            width={112}
                            height={40}
                          >
                            <div className="flex justify-center text-[10px] leading-tight text-brand-navy">
                              <div className="rounded border border-brand-gold/40 bg-white/95 px-1.5 py-0.5 shadow-sm">
                                <PromotionCountdown
                                  expiresAt={status.promotionExpiresAt}
                                  onExpired={() => router.refresh()}
                                />
                              </div>
                            </div>
                          </foreignObject>
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              ) : null}
            </svg>
          </div>

          <aside className="space-y-4">
            <h3 className="font-headline text-lg text-brand-navy">Legend</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: STATUS_FILL.available }}
                  aria-hidden="true"
                />
                Seats available (standard)
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: STATUS_FILL.premium }}
                  aria-hidden="true"
                />
                Seats available (premium)
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: STATUS_FILL.promotional }}
                  aria-hidden="true"
                />
                Limited-time offer (gold)
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: STATUS_FILL.pending }}
                  aria-hidden="true"
                />
                Application pending
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: STATUS_FILL.claimed }}
                  aria-hidden="true"
                />
                All sectors claimed
              </li>
            </ul>
            <p className="text-xs text-slate-500 leading-relaxed">
              Live state refreshes every 60 seconds from the territory
              database. Click a region to zoom in, then click a postcode
              area to check sector availability. Use the arrow buttons to
              pan, press Escape or Back to UK to reset.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Postcode areas &copy; Wikipedia contributors,{' '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-2 hover:text-slate-600"
              >
                CC BY-SA 3.0
              </a>
              . Northern Ireland outline &copy; OSNI / martinjc
              UK-GeoJSON under the{' '}
              <a
                href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-2 hover:text-slate-600"
              >
                Open Government Licence
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
