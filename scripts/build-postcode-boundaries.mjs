#!/usr/bin/env node
/**
 * Territory Command - build postcode district boundaries.
 *
 * Input:  .postcode-candidates/{BS,BA,TA}.geojson  (raw, WGS84)
 *   fetched from https://github.com/missinglink/uk-postcode-polygons
 *   (c) Wikipedia contributors, CC BY-SA 3.0
 *
 * Pipeline:
 *   1. Load the three source GeoJSON FeatureCollections (all ~80 districts).
 *   2. Simplify the WHOLE set via mapshaper -simplify 15% visvalingam.
 *   3. Project every vertex with the SAME linear equirectangular transform
 *      used by src/lib/territory/pin-coordinates.ts so boundaries align
 *      exactly with pilot pin positions.
 *   4. Emit:
 *        - POSTCODE_BOUNDARIES: path d-string per district (all 80)
 *        - POSTCODE_CENTROIDS:  pilot centroids only (pin repositioning)
 *        - POSTCODE_BBOXES:     bbox per district (all 80)
 *        - PILOT_BOUNDS_UNION:  union bbox of the 10 pilot districts
 *        - ALL_BOUNDS_UNION:    union bbox of every district we render
 *
 * Run: `node scripts/build-postcode-boundaries.mjs`
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const mapshaper = require('mapshaper');

const PILOT = /** @type {const} */ ([
  'BS1','BS8','BS22','BA1','BA2','BA3','BA4','BA11','BA20','TA1',
]);

// Keep in sync with src/lib/territory/pin-coordinates.ts.
const TRANSFORM = {
  xOffset: 557.38,
  xScale: 63.49,
  yOffset: 808.25,
  yAnchorLat: 51.5074,
  yScale: 110.75,
};
const project = (lng, lat) => ({
  x: TRANSFORM.xOffset + lng * TRANSFORM.xScale,
  y: TRANSFORM.yOffset + (TRANSFORM.yAnchorLat - lat) * TRANSFORM.yScale,
});

const ROOT = process.cwd();
const CAND = path.join(ROOT, '.postcode-candidates');
const OUT = path.join(ROOT, 'src/lib/territory/postcode-boundaries.ts');

function extractCode(props) {
  return (
    props.name || props.Name || props.PC_DISTRIC || props.postcode ||
    props.postal_code || props.district || props.POSTCODE || props.code || ''
  ).toString().trim().toUpperCase();
}

function loadAllFeatures() {
  const out = [];
  for (const area of ['BS', 'BA', 'TA']) {
    const file = path.join(CAND, `${area}.geojson`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const feats = data.type === 'FeatureCollection' ? data.features : [data];
    for (const f of feats) {
      const code = extractCode(f.properties || {});
      if (!code) continue;
      out.push({
        type: 'Feature',
        properties: { postcode: code },
        geometry: f.geometry,
      });
    }
  }
  return out;
}

function countVerts(geom) {
  if (!geom) return 0;
  if (Array.isArray(geom) && typeof geom[0] === 'number') return 1;
  if (Array.isArray(geom)) return geom.reduce((a, b) => a + countVerts(b), 0);
  return 0;
}

async function simplifyWithMapshaper(inputPath, outputPath) {
  const cmd = `-i "${inputPath}" -simplify 15% visvalingam keep-shapes -o format=geojson "${outputPath}" force`;
  await mapshaper.runCommands(cmd);
}

function geometryToPath(geom) {
  const ringToPath = (ring) => {
    const pts = ring.map(([lng, lat]) => project(lng, lat));
    let d = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) {
      d += `L${pts[i].x.toFixed(2)},${pts[i].y.toFixed(2)}`;
    }
    d += 'Z';
    return d;
  };
  const polyToPath = (poly) => poly.map(ringToPath).join(' ');
  if (geom.type === 'Polygon') return polyToPath(geom.coordinates);
  if (geom.type === 'MultiPolygon') return geom.coordinates.map(polyToPath).join(' ');
  throw new Error(`Unsupported geometry type: ${geom.type}`);
}

function ringSignedArea(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const { x: x1, y: y1 } = pts[i];
    const { x: x2, y: y2 } = pts[(i + 1) % pts.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

function ringCentroid(pts) {
  const a = ringSignedArea(pts);
  if (Math.abs(a) < 1e-9) {
    const m = pts.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
      { x: 0, y: 0 },
    );
    return { x: m.x / pts.length, y: m.y / pts.length };
  }
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < pts.length; i++) {
    const { x: x1, y: y1 } = pts[i];
    const { x: x2, y: y2 } = pts[(i + 1) % pts.length];
    const f = x1 * y2 - x2 * y1;
    cx += (x1 + x2) * f;
    cy += (y1 + y2) * f;
  }
  const k = 1 / (6 * a);
  return { x: cx * k, y: cy * k };
}

function geometryCentroid(geom) {
  const outers = [];
  if (geom.type === 'Polygon') {
    outers.push(geom.coordinates[0].map(([lng, lat]) => project(lng, lat)));
  } else if (geom.type === 'MultiPolygon') {
    for (const poly of geom.coordinates) {
      outers.push(poly[0].map(([lng, lat]) => project(lng, lat)));
    }
  } else {
    throw new Error(`Unsupported geometry type: ${geom.type}`);
  }
  let totalA = 0;
  let cx = 0;
  let cy = 0;
  for (const ring of outers) {
    const a = Math.abs(ringSignedArea(ring));
    const c = ringCentroid(ring);
    totalA += a;
    cx += c.x * a;
    cy += c.y * a;
  }
  if (totalA === 0) return outers[0] ? ringCentroid(outers[0]) : { x: 0, y: 0 };
  return { x: cx / totalA, y: cy / totalA };
}

function geometryBBox(geom) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const visit = (ring) => {
    for (const [lng, lat] of ring) {
      const p = project(lng, lat);
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
  };
  if (geom.type === 'Polygon') {
    for (const ring of geom.coordinates) visit(ring);
  } else if (geom.type === 'MultiPolygon') {
    for (const poly of geom.coordinates) for (const ring of poly) visit(ring);
  }
  const w = maxX - minX;
  const h = maxY - minY;
  return { x: minX, y: minY, w, h };
}

async function main() {
  const features = loadAllFeatures();
  const allCodes = features.map((f) => f.properties.postcode).sort(codeCompare);
  console.log(`Loaded ${features.length} districts total`);

  const foundCodes = new Set(features.map((f) => f.properties.postcode));
  const missing = PILOT.filter((p) => !foundCodes.has(p));
  if (missing.length) {
    throw new Error(`Missing pilot districts: ${missing.join(', ')}`);
  }

  const rawVerts = features.reduce(
    (a, f) => a + countVerts(f.geometry.coordinates), 0,
  );

  const tmpIn = path.join(CAND, 'pilot-raw.geojson');
  const tmpOut = path.join(CAND, 'pilot-simplified.geojson');
  fs.writeFileSync(tmpIn, JSON.stringify({ type: 'FeatureCollection', features }));

  await simplifyWithMapshaper(tmpIn, tmpOut);

  const simplified = JSON.parse(fs.readFileSync(tmpOut, 'utf8'));
  const byCode = new Map();
  for (const f of simplified.features) {
    byCode.set(extractCode(f.properties || {}), f.geometry);
  }

  let simpVerts = 0;
  const paths = {};
  const centroids = {};
  const districtBBoxes = {};

  let pilotMinX = Infinity, pilotMinY = Infinity;
  let pilotMaxX = -Infinity, pilotMaxY = -Infinity;
  let allMinX = Infinity, allMinY = Infinity;
  let allMaxX = -Infinity, allMaxY = -Infinity;

  for (const code of allCodes) {
    const geom = byCode.get(code);
    if (!geom) throw new Error(`Simplification lost district: ${code}`);

    paths[code] = geometryToPath(geom);
    const b = geometryBBox(geom);
    districtBBoxes[code] = {
      x: +b.x.toFixed(2),
      y: +b.y.toFixed(2),
      w: +b.w.toFixed(2),
      h: +b.h.toFixed(2),
    };

    if (b.x < allMinX) allMinX = b.x;
    if (b.y < allMinY) allMinY = b.y;
    if (b.x + b.w > allMaxX) allMaxX = b.x + b.w;
    if (b.y + b.h > allMaxY) allMaxY = b.y + b.h;

    if (PILOT.includes(code)) {
      const c = geometryCentroid(geom);
      centroids[code] = { x: +c.x.toFixed(2), y: +c.y.toFixed(2) };
      if (b.x < pilotMinX) pilotMinX = b.x;
      if (b.y < pilotMinY) pilotMinY = b.y;
      if (b.x + b.w > pilotMaxX) pilotMaxX = b.x + b.w;
      if (b.y + b.h > pilotMaxY) pilotMaxY = b.y + b.h;
    }

    simpVerts += countVerts(geom.coordinates);
  }

  const pilotUnion = {
    x: +pilotMinX.toFixed(2),
    y: +pilotMinY.toFixed(2),
    w: +(pilotMaxX - pilotMinX).toFixed(2),
    h: +(pilotMaxY - pilotMinY).toFixed(2),
  };
  const allUnion = {
    x: +allMinX.toFixed(2),
    y: +allMinY.toFixed(2),
    w: +(allMaxX - allMinX).toFixed(2),
    h: +(allMaxY - allMinY).toFixed(2),
  };

  const header = `/**
 * Territory Command - simplified postcode district boundaries.
 *
 * GENERATED FILE. Do not hand-edit. Regenerate via:
 *   node scripts/build-postcode-boundaries.mjs
 *
 * Source: https://github.com/missinglink/uk-postcode-polygons
 *   (c) Wikipedia contributors, released under CC BY-SA 3.0
 *   https://creativecommons.org/licenses/by-sa/3.0/
 *
 * Pipeline: mapshaper -simplify 15% visvalingam keep-shapes, then projected
 * through the same linear equirectangular transform used by pin-coordinates.
 * Districts: ${allCodes.length} total (${PILOT.length} pilot, ${allCodes.length - PILOT.length} non-pilot).
 * Raw vertex count: ${rawVerts}. Simplified vertex count: ${simpVerts}.
 */

export type PilotPostcode =
  | 'BS1' | 'BS8' | 'BS22'
  | 'BA1' | 'BA2' | 'BA3' | 'BA4' | 'BA11' | 'BA20'
  | 'TA1';

export const PILOT_POSTCODES: readonly PilotPostcode[] = [
  'BS1', 'BS8', 'BS22',
  'BA1', 'BA2', 'BA3', 'BA4', 'BA11', 'BA20',
  'TA1',
];

export interface BoundaryBBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Centroid {
  x: number;
  y: number;
}

export const POSTCODE_BOUNDARIES: Record<string, string> = {
`;

  const body = allCodes
    .map((code) => `  ${JSON.stringify(code)}: ${JSON.stringify(paths[code])},`)
    .join('\n');

  const centroidsBlock =
    '\n};\n\nexport const POSTCODE_CENTROIDS: Record<PilotPostcode, Centroid> = {\n' +
    PILOT.map(
      (code) =>
        `  ${code}: { x: ${centroids[code].x}, y: ${centroids[code].y} },`,
    ).join('\n') +
    '\n};\n';

  const bboxesBlock =
    '\nexport const POSTCODE_BBOXES: Record<string, BoundaryBBox> = {\n' +
    allCodes
      .map(
        (code) =>
          `  ${JSON.stringify(code)}: { x: ${districtBBoxes[code].x}, y: ${districtBBoxes[code].y}, w: ${districtBBoxes[code].w}, h: ${districtBBoxes[code].h} },`,
      )
      .join('\n') +
    '\n};\n';

  const unionBlock =
    `\nexport const PILOT_BOUNDS_UNION: BoundaryBBox = { x: ${pilotUnion.x}, y: ${pilotUnion.y}, w: ${pilotUnion.w}, h: ${pilotUnion.h} };\n\nexport const ALL_BOUNDS_UNION: BoundaryBBox = { x: ${allUnion.x}, y: ${allUnion.y}, w: ${allUnion.w}, h: ${allUnion.h} };\n`;

  fs.writeFileSync(OUT, header + body + centroidsBlock + bboxesBlock + unionBlock, 'utf8');

  console.log(`\nWrote ${OUT}`);
  console.log(`  districts: ${allCodes.length} (${PILOT.length} pilot, ${allCodes.length - PILOT.length} non-pilot)`);
  console.log(`  raw vertices: ${rawVerts}`);
  console.log(`  simplified vertices: ${simpVerts}`);
  console.log(`  pilot union: ${JSON.stringify(pilotUnion)}`);
  console.log(`  all union:   ${JSON.stringify(allUnion)}`);
}

/**
 * Natural sort for postcode district codes so BS10 comes after BS9, not after
 * BS1. Splits into (letters, number) parts.
 */
function codeCompare(a, b) {
  const pa = a.match(/^([A-Z]+)(\d+)$/);
  const pb = b.match(/^([A-Z]+)(\d+)$/);
  if (pa && pb) {
    if (pa[1] !== pb[1]) return pa[1].localeCompare(pb[1]);
    return Number(pa[2]) - Number(pb[2]);
  }
  return a.localeCompare(b);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
