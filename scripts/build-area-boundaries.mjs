#!/usr/bin/env node
/**
 * Territory Command - build postcode AREA boundaries for all 121 UK areas.
 *
 * Mirrors scripts/build-postcode-boundaries.mjs (SW pilot districts) but
 * operates at area level: every district inside an area is dissolved into
 * a single area polygon, then simplified and projected through the same
 * linear equirectangular transform used by pin-coordinates.ts.
 *
 * Input:  .postcode-candidates/<AREA>.geojson (raw, WGS84)
 *   Fetched from https://github.com/missinglink/uk-postcode-polygons
 *   master/geojson/<AREA>.geojson (one file per area, containing all its
 *   districts as a FeatureCollection).
 *   (c) Wikipedia contributors, CC BY-SA 3.0
 *   https://creativecommons.org/licenses/by-sa/3.0/
 *
 * Pipeline per area:
 *   1. Download <AREA>.geojson if not already cached locally.
 *   2. Tag every district feature with its area code (letters only).
 *   3. Merge all features from all areas into one FeatureCollection.
 *   4. Dissolve by area code so each area becomes one (multi)polygon.
 *   5. Simplify the whole set via mapshaper -simplify 6% visvalingam
 *      keep-shapes (area level polygons are larger than district level
 *      and sit at a lower zoom, so a harder simplification is fine and
 *      keeps the bundle down).
 *   6. Project every vertex with the SAME transform used everywhere else.
 *
 * Output: src/lib/territory/area-boundaries.ts with:
 *   AREA_BOUNDARIES         Record<area, string>         (SVG path d-strings)
 *   AREA_BOUNDARY_CENTROIDS Record<area, Centroid>       (for label placement)
 *   AREA_BOUNDARY_BBOXES    Record<area, BoundaryBBox>   (for region framing)
 *
 * Run: `node scripts/build-area-boundaries.mjs`
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { createRequire } from 'node:module';

import { ALL_AREA_CODES, AREA_TO_REGION } from './uk-postcode-areas-data.mjs';

const require = createRequire(import.meta.url);
const mapshaper = require('mapshaper');

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
const OUT = path.join(ROOT, 'src/lib/territory/area-boundaries.ts');
const UPSTREAM = (area) =>
  `https://raw.githubusercontent.com/missinglink/uk-postcode-polygons/master/geojson/${area}.geojson`;

function areaFromDistrict(code) {
  return String(code).toUpperCase().replace(/[0-9].*$/, '');
}

function extractCode(props) {
  const raw = (
    props.name ||
    props.Name ||
    props.PC_DISTRIC ||
    props.postcode ||
    props.postal_code ||
    props.district ||
    props.POSTCODE ||
    props.code ||
    ''
  )
    .toString()
    .trim()
    .toUpperCase();
  return raw;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'scopesite-ssr build' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} ${url}`));
        res.resume();
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(dest, buf);
        resolve(buf.length);
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error(`timeout ${url}`));
    });
  });
}

async function ensureAreaFile(area) {
  const file = path.join(CAND, `${area}.geojson`);
  if (fs.existsSync(file) && fs.statSync(file).size > 200) return { area, file, fetched: false };
  try {
    const bytes = await download(UPSTREAM(area), file);
    return { area, file, fetched: true, bytes };
  } catch (err) {
    return { area, file, fetched: false, error: String(err && err.message ? err.message : err) };
  }
}

function loadFeatures(file, area) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const feats = data.type === 'FeatureCollection' ? data.features : [data];
  const out = [];
  for (const f of feats) {
    const code = extractCode(f.properties || {});
    if (!code) continue;
    const a = areaFromDistrict(code);
    if (a !== area) continue;
    out.push({
      type: 'Feature',
      properties: { area, district: code },
      geometry: f.geometry,
    });
  }
  return out;
}

async function mapshaperRun(args) {
  await mapshaper.runCommands(args);
}

function geometryToPath(geom) {
  const ringToPath = (ring) => {
    const pts = ring.map(([lng, lat]) => project(lng, lat));
    if (!pts.length) return '';
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
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function countVerts(geom) {
  if (!geom) return 0;
  if (Array.isArray(geom) && typeof geom[0] === 'number') return 1;
  if (Array.isArray(geom)) return geom.reduce((a, b) => a + countVerts(b), 0);
  return 0;
}

function codeCompare(a, b) {
  if (a.length !== b.length) return a.length - b.length;
  return a.localeCompare(b);
}

async function main() {
  if (!fs.existsSync(CAND)) fs.mkdirSync(CAND, { recursive: true });

  console.log(`Fetching ${ALL_AREA_CODES.length} area source files (cached if present)...`);
  const fetchReport = [];
  const missingAreas = [];
  for (const area of ALL_AREA_CODES) {
    const r = await ensureAreaFile(area);
    fetchReport.push(r);
    if (r.error || !fs.existsSync(r.file) || fs.statSync(r.file).size < 200) {
      missingAreas.push(area);
    }
  }
  const fetched = fetchReport.filter((r) => r.fetched).length;
  console.log(`  cached: ${fetchReport.length - fetched - missingAreas.length}`);
  console.log(`  fetched: ${fetched}`);
  if (missingAreas.length) {
    console.warn(`  missing upstream data for: ${missingAreas.join(', ')}`);
  }

  const allFeatures = [];
  let rawVerts = 0;
  const presentAreas = new Set();
  for (const area of ALL_AREA_CODES) {
    if (missingAreas.includes(area)) continue;
    const feats = loadFeatures(path.join(CAND, `${area}.geojson`), area);
    if (!feats.length) {
      missingAreas.push(area);
      continue;
    }
    presentAreas.add(area);
    for (const f of feats) {
      rawVerts += countVerts(f.geometry.coordinates);
      allFeatures.push(f);
    }
  }
  console.log(`Loaded ${allFeatures.length} district features across ${presentAreas.size} areas`);
  console.log(`Raw vertices: ${rawVerts}`);

  const tmpIn = path.join(CAND, 'areas-raw.geojson');
  const tmpDissolved = path.join(CAND, 'areas-dissolved.geojson');
  const tmpSimplified = path.join(CAND, 'areas-simplified.geojson');

  fs.writeFileSync(
    tmpIn,
    JSON.stringify({ type: 'FeatureCollection', features: allFeatures }),
  );

  console.log('Dissolving districts into areas...');
  await mapshaperRun(
    `-i "${tmpIn}" -dissolve2 area copy-fields=area -o format=geojson "${tmpDissolved}" force`,
  );

  console.log('Simplifying...');
  await mapshaperRun(
    `-i "${tmpDissolved}" -simplify 6% visvalingam keep-shapes -o format=geojson "${tmpSimplified}" force`,
  );

  const simplified = JSON.parse(fs.readFileSync(tmpSimplified, 'utf8'));
  const byArea = new Map();
  for (const f of simplified.features) {
    const area = (f.properties && (f.properties.area || extractCode(f.properties))) || '';
    if (!area) continue;
    byArea.set(area, f.geometry);
  }

  const paths = {};
  const centroids = {};
  const bboxes = {};
  let simpVerts = 0;
  const sortedAreas = Array.from(presentAreas).sort(codeCompare);
  const emittedAreas = [];

  for (const area of sortedAreas) {
    const geom = byArea.get(area);
    if (!geom) {
      console.warn(`  dissolve lost area: ${area}`);
      continue;
    }
    paths[area] = geometryToPath(geom);
    const b = geometryBBox(geom);
    bboxes[area] = {
      x: +b.x.toFixed(2),
      y: +b.y.toFixed(2),
      w: +b.w.toFixed(2),
      h: +b.h.toFixed(2),
    };
    const c = geometryCentroid(geom);
    centroids[area] = { x: +c.x.toFixed(2), y: +c.y.toFixed(2) };
    simpVerts += countVerts(geom.coordinates);
    emittedAreas.push(area);
  }

  const byRegion = {};
  for (const area of emittedAreas) {
    const region = AREA_TO_REGION[area];
    (byRegion[region] ||= []).push(area);
  }

  const header = `/**
 * Territory Command - simplified postcode AREA boundaries (dissolved).
 *
 * GENERATED FILE. Do not hand-edit. Regenerate via:
 *   node scripts/build-area-boundaries.mjs
 *
 * Source: https://github.com/missinglink/uk-postcode-polygons
 *   (c) Wikipedia contributors, released under CC BY-SA 3.0
 *   https://creativecommons.org/licenses/by-sa/3.0/
 *
 * Pipeline: per-area district FeatureCollections -> dissolve by area code
 * -> mapshaper -simplify 6% visvalingam keep-shapes -> projected through
 * the same linear equirectangular transform used by pin-coordinates.ts.
 * Areas: ${emittedAreas.length} of ${ALL_AREA_CODES.length} requested.
 * Raw district vertices: ${rawVerts}. Simplified area vertices: ${simpVerts}.${
    missingAreas.length ? `\n * Missing upstream data: ${missingAreas.join(', ')}.` : ''
  }
 */

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

export const AREA_BOUNDARIES: Record<string, string> = {
`;

  const pathsBody = emittedAreas
    .map((a) => `  ${JSON.stringify(a)}: ${JSON.stringify(paths[a])},`)
    .join('\n');

  const centroidsBlock =
    '\n};\n\nexport const AREA_BOUNDARY_CENTROIDS: Record<string, Centroid> = {\n' +
    emittedAreas
      .map((a) => `  ${JSON.stringify(a)}: { x: ${centroids[a].x}, y: ${centroids[a].y} },`)
      .join('\n') +
    '\n};\n';

  const bboxesBlock =
    '\nexport const AREA_BOUNDARY_BBOXES: Record<string, BoundaryBBox> = {\n' +
    emittedAreas
      .map(
        (a) =>
          `  ${JSON.stringify(a)}: { x: ${bboxes[a].x}, y: ${bboxes[a].y}, w: ${bboxes[a].w}, h: ${bboxes[a].h} },`,
      )
      .join('\n') +
    '\n};\n';

  const missingBlock = missingAreas.length
    ? '\nexport const AREA_BOUNDARY_MISSING: readonly string[] = ' +
      JSON.stringify(missingAreas) +
      ';\n'
    : '\nexport const AREA_BOUNDARY_MISSING: readonly string[] = [];\n';

  fs.writeFileSync(
    OUT,
    header + pathsBody + centroidsBlock + bboxesBlock + missingBlock,
    'utf8',
  );

  console.log(`\nWrote ${OUT}`);
  console.log(`  areas emitted:   ${emittedAreas.length}`);
  console.log(`  raw verts:       ${rawVerts}`);
  console.log(`  simplified verts:${simpVerts}`);
  console.log(`  output size:     ${fs.statSync(OUT).size} bytes`);
  if (missingAreas.length) {
    console.warn(`  missing areas:   ${missingAreas.join(', ')}`);
  }

  const regionCounts = Object.entries(byRegion)
    .map(([r, as]) => `${r}=${as.length}`)
    .sort()
    .join(', ');
  console.log(`  by region:       ${regionCounts}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
