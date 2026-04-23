#!/usr/bin/env node
/**
 * Territory Command - build postcode AREA boundaries and UK REGION outlines
 * from a single consistent source grid.
 *
 * Inputs:
 *   - .postcode-candidates/<AREA>.geojson (raw, WGS84)
 *       Fetched from https://github.com/missinglink/uk-postcode-polygons
 *       master/geojson/<AREA>.geojson (one file per area, containing all its
 *       districts as a FeatureCollection).
 *       (c) Wikipedia contributors, CC BY-SA 3.0
 *       https://creativecommons.org/licenses/by-sa/3.0/
 *   - .postcode-candidates/NI_lgd.topojson
 *       Fetched from https://github.com/martinjc/UK-GeoJSON
 *       master/json/administrative/ni/topo_lgd.json
 *       NI local government district boundaries; dissolved into one shape
 *       as the BT postcode area. OGL (Open Government Licence).
 *
 * Pipeline:
 *   1. Download every missing upstream file.
 *   2. Tag each district feature with its area code.
 *   3. Dissolve the NI LGDs into a single BT feature and merge it in.
 *   4. Apply a Shetland (ZE) inset: shift every ZE vertex by
 *      (+2.3 lng, -2.5 lat) so Shetland projects into the top-right
 *      corner of the SVG viewBox instead of sitting ~280 units above it.
 *   5. Tag every feature with its region key from AREA_TO_REGION.
 *   6. Two mapshaper dissolves from the SAME source file:
 *        - dissolve2 area   -> 121 postcode-area polygons
 *        - dissolve2 region -> 12 UK region polygons
 *      Both at `-simplify 6% visvalingam keep-shapes` so areas and
 *      regions share the exact same topology (region outline = union of
 *      its areas, zero gaps / overlap).
 *   7. Project every vertex through the same linear equirectangular
 *      transform used by pin-coordinates.ts.
 *
 * Outputs:
 *   - src/lib/territory/area-boundaries.ts
 *       AREA_BOUNDARIES          Record<area, string>       (SVG path d)
 *       AREA_BOUNDARY_CENTROIDS  Record<area, Centroid>
 *       AREA_BOUNDARY_BBOXES     Record<area, BoundaryBBox>
 *   - src/lib/territory/region-paths.ts
 *       REGION_PATHS             Record<RegionKey, string>
 *       REGION_VIEWBOX           { width, height }
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

// Shetland inset - applied at lat/lng level BEFORE any dissolve so both
// the ZE area polygon AND the scotland region polygon (which contains
// ZE as one of its MultiPolygon rings) reflect the shift automatically.
// Values chosen so the projected ZE bbox lands at roughly x:605..655,
// y:30..150 - top-right corner, fully inside the 690x982 viewBox.
const ZE_LNG_OFFSET = 2.3;
const ZE_LAT_OFFSET = -2.5;

// Fallback viewBox used only if dynamic computation fails. Actual viewBox is
// computed from the union bbox of the dissolved regions and written to the
// generated file with `x`, `y`, `width`, `height`.
const REGION_VIEWBOX_FALLBACK = { x: 0, y: 0, width: 690, height: 982 };
const REGION_VIEWBOX_PAD = 10;

const ROOT = process.cwd();
const CAND = path.join(ROOT, '.postcode-candidates');
const OUT_AREAS = path.join(ROOT, 'src/lib/territory/area-boundaries.ts');
const OUT_REGIONS = path.join(ROOT, 'src/lib/territory/region-paths.ts');

const UPSTREAM = (area) =>
  `https://raw.githubusercontent.com/missinglink/uk-postcode-polygons/master/geojson/${area}.geojson`;
const NI_UPSTREAM =
  'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/ni/topo_lgd.json';

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

async function ensureNiFile() {
  const raw = path.join(CAND, 'NI_lgd.topojson');
  const dissolved = path.join(CAND, 'BT.geojson');
  if (!fs.existsSync(raw) || fs.statSync(raw).size < 1000) {
    console.log(`Fetching NI LGDs from martinjc/UK-GeoJSON...`);
    await download(NI_UPSTREAM, raw);
  }
  if (!fs.existsSync(dissolved) || fs.statSync(dissolved).size < 200) {
    console.log(`Dissolving NI LGDs into a single BT polygon...`);
    await mapshaperRun(
      `-i "${raw}" -dissolve2 -o format=geojson "${dissolved}" force`,
    );
  }
  return { raw, dissolved };
}

function loadAreaFeatures(file, area) {
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

function loadBtFeature(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  // mapshaper -dissolve2 on NI LGDs outputs a GeometryCollection; handle
  // FeatureCollection, GeometryCollection and bare polygon inputs.
  const candidates = [];
  if (data.type === 'FeatureCollection') {
    for (const f of data.features) if (f && f.geometry) candidates.push(f.geometry);
  } else if (data.type === 'GeometryCollection') {
    for (const g of data.geometries) if (g) candidates.push(g);
  } else if (data.type === 'Feature' && data.geometry) {
    candidates.push(data.geometry);
  } else if (data.type === 'Polygon' || data.type === 'MultiPolygon') {
    candidates.push(data);
  }
  for (const g of candidates) {
    if (g.type !== 'Polygon' && g.type !== 'MultiPolygon') continue;
    return {
      type: 'Feature',
      properties: { area: 'BT', district: 'BT' },
      geometry: g,
    };
  }
  return null;
}

function transformCoords(geom, fn) {
  if (!geom) return;
  if (geom.type === 'Polygon') {
    geom.coordinates = geom.coordinates.map((ring) => ring.map(fn));
  } else if (geom.type === 'MultiPolygon') {
    geom.coordinates = geom.coordinates.map((poly) =>
      poly.map((ring) => ring.map(fn)),
    );
  } else if (geom.type === 'GeometryCollection' && Array.isArray(geom.geometries)) {
    for (const g of geom.geometries) transformCoords(g, fn);
  }
}

/** Collapse a GeometryCollection of Polygon/MultiPolygon into a single
 *  MultiPolygon so downstream mapshaper + projection treat it uniformly. */
function flattenToMultiPolygon(geom) {
  if (!geom) return geom;
  if (geom.type === 'Polygon') {
    return { type: 'MultiPolygon', coordinates: [geom.coordinates] };
  }
  if (geom.type === 'MultiPolygon') return geom;
  if (geom.type === 'GeometryCollection' && Array.isArray(geom.geometries)) {
    const polys = [];
    for (const g of geom.geometries) {
      if (!g) continue;
      if (g.type === 'Polygon') polys.push(g.coordinates);
      else if (g.type === 'MultiPolygon') for (const p of g.coordinates) polys.push(p);
      else if (g.type === 'GeometryCollection') {
        const inner = flattenToMultiPolygon(g);
        if (inner && inner.type === 'MultiPolygon') {
          for (const p of inner.coordinates) polys.push(p);
        }
      }
    }
    return { type: 'MultiPolygon', coordinates: polys };
  }
  return geom;
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

  // ---------------------------------------------------------------------
  // Stage 1: fetch GB area files + NI LGD bundle.
  // ---------------------------------------------------------------------
  console.log(`Fetching ${ALL_AREA_CODES.length} GB area source files (cached if present)...`);
  const fetchReport = [];
  const missingAreas = [];
  for (const area of ALL_AREA_CODES) {
    if (area === 'BT') continue; // BT comes from NI_lgd below, not missinglink.
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

  // BT (Northern Ireland) comes from a separate OGL source.
  await ensureNiFile();

  // ---------------------------------------------------------------------
  // Stage 2: load + tag every feature.
  // ---------------------------------------------------------------------
  const allFeatures = [];
  let rawVerts = 0;
  const presentAreas = new Set();

  for (const area of ALL_AREA_CODES) {
    if (area === 'BT') continue;
    if (missingAreas.includes(area)) continue;
    const feats = loadAreaFeatures(path.join(CAND, `${area}.geojson`), area);
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

  const btFeat = loadBtFeature(path.join(CAND, 'BT.geojson'));
  if (!btFeat) {
    throw new Error('BT feature missing after NI dissolve');
  }
  rawVerts += countVerts(btFeat.geometry.coordinates);
  allFeatures.push(btFeat);
  presentAreas.add('BT');

  console.log(`Loaded ${allFeatures.length} district/area features across ${presentAreas.size} areas`);
  console.log(`Raw vertices: ${rawVerts}`);

  // ---------------------------------------------------------------------
  // Stage 3: flatten GeometryCollections (some missinglink features use
  // them), apply the Shetland (ZE) lat/lng inset, then tag with region.
  // ---------------------------------------------------------------------
  for (const f of allFeatures) {
    f.geometry = flattenToMultiPolygon(f.geometry);
  }
  let zeVertices = 0;
  for (const f of allFeatures) {
    if (f.properties.area === 'ZE') {
      transformCoords(f.geometry, ([lng, lat]) => {
        zeVertices++;
        return [lng + ZE_LNG_OFFSET, lat + ZE_LAT_OFFSET];
      });
    }
    f.properties.region = AREA_TO_REGION[f.properties.area] || null;
  }
  console.log(`Applied Shetland inset to ${zeVertices} ZE vertices (lng+${ZE_LNG_OFFSET}, lat${ZE_LAT_OFFSET}).`);

  const tmpIn = path.join(CAND, 'uk-raw.geojson');
  const tmpAreas = path.join(CAND, 'areas-simplified.geojson');
  const tmpRegions = path.join(CAND, 'regions-simplified.geojson');

  fs.writeFileSync(
    tmpIn,
    JSON.stringify({ type: 'FeatureCollection', features: allFeatures }),
  );

  // ---------------------------------------------------------------------
  // Stage 4: two dissolves from the same source - one per grain.
  // Same simplify rate so areas and regions stay topologically consistent.
  // ---------------------------------------------------------------------
  console.log('Dissolving + simplifying by AREA...');
  await mapshaperRun(
    `-i "${tmpIn}" -dissolve2 area copy-fields=area,region -simplify 6% visvalingam keep-shapes -o format=geojson "${tmpAreas}" force`,
  );

  console.log('Dissolving + simplifying by REGION...');
  await mapshaperRun(
    `-i "${tmpIn}" -dissolve2 region copy-fields=region -simplify 6% visvalingam keep-shapes -o format=geojson "${tmpRegions}" force`,
  );

  // ---------------------------------------------------------------------
  // Stage 5: project areas, emit area-boundaries.ts.
  // ---------------------------------------------------------------------
  const simplifiedAreas = JSON.parse(fs.readFileSync(tmpAreas, 'utf8'));
  const byArea = new Map();
  for (const f of simplifiedAreas.features) {
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

  const areaHeader = `/**
 * Territory Command - simplified postcode AREA boundaries (dissolved).
 *
 * GENERATED FILE. Do not hand-edit. Regenerate via:
 *   node scripts/build-area-boundaries.mjs
 *
 * Sources:
 *   - https://github.com/missinglink/uk-postcode-polygons (CC BY-SA 3.0)
 *     (c) Wikipedia contributors. Covers GB postcode districts.
 *   - https://github.com/martinjc/UK-GeoJSON (OGL) for BT / Northern Ireland.
 *     Contains OS/OSNI open data under the Open Government Licence.
 *
 * Pipeline: per-area district FeatureCollections + NI LGD dissolve
 * -> tag with area + region -> ZE lat/lng inset (+${ZE_LNG_OFFSET} lng, ${ZE_LAT_OFFSET} lat)
 * -> mapshaper -dissolve2 area + -simplify 6% visvalingam keep-shapes
 * -> projected through the same linear equirectangular transform used by
 * pin-coordinates.ts.
 * Areas: ${emittedAreas.length} of ${ALL_AREA_CODES.length} requested.
 * Raw input vertices: ${rawVerts}. Simplified area vertices: ${simpVerts}.${
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
    OUT_AREAS,
    areaHeader + pathsBody + centroidsBlock + bboxesBlock + missingBlock,
    'utf8',
  );

  console.log(`\nWrote ${OUT_AREAS}`);
  console.log(`  areas emitted:   ${emittedAreas.length}`);
  console.log(`  raw verts:       ${rawVerts}`);
  console.log(`  simplified verts:${simpVerts}`);
  console.log(`  output size:     ${fs.statSync(OUT_AREAS).size} bytes`);
  if (missingAreas.length) {
    console.warn(`  missing areas:   ${missingAreas.join(', ')}`);
  }

  const regionCounts = Object.entries(byRegion)
    .map(([r, as]) => `${r}=${as.length}`)
    .sort()
    .join(', ');
  console.log(`  by region:       ${regionCounts}`);

  // ---------------------------------------------------------------------
  // Stage 6: project regions, emit region-paths.ts.
  // ---------------------------------------------------------------------
  const simplifiedRegions = JSON.parse(fs.readFileSync(tmpRegions, 'utf8'));
  const byRegionGeom = new Map();
  for (const f of simplifiedRegions.features) {
    const region = f.properties && f.properties.region;
    if (!region) continue;
    byRegionGeom.set(region, f.geometry);
  }

  const REGION_KEYS_ORDER = [
    'scotland',
    'northern_ireland',
    'north_east',
    'north_west',
    'yorkshire_humber',
    'east_midlands',
    'west_midlands',
    'east_of_england',
    'wales',
    'london',
    'south_east',
    'south_west',
  ];

  const regionPaths = {};
  let regionSimpVerts = 0;
  let regionMinX = Infinity;
  let regionMinY = Infinity;
  let regionMaxX = -Infinity;
  let regionMaxY = -Infinity;
  for (const key of REGION_KEYS_ORDER) {
    const geom = byRegionGeom.get(key);
    if (!geom) {
      console.warn(`  dissolve lost region: ${key}`);
      continue;
    }
    regionPaths[key] = geometryToPath(geom);
    regionSimpVerts += countVerts(geom.coordinates);
    const b = geometryBBox(geom);
    if (b.x < regionMinX) regionMinX = b.x;
    if (b.y < regionMinY) regionMinY = b.y;
    if (b.x + b.w > regionMaxX) regionMaxX = b.x + b.w;
    if (b.y + b.h > regionMaxY) regionMaxY = b.y + b.h;
  }

  // Derive the viewBox dynamically from the actual region-union extent
  // with a small uniform pad, rounded to integers. Falls back to the
  // historical 690x982 range if the dissolve produced no regions.
  let vbX = Math.floor(regionMinX) - REGION_VIEWBOX_PAD;
  let vbY = Math.floor(regionMinY) - REGION_VIEWBOX_PAD;
  let vbW = Math.ceil(regionMaxX - regionMinX) + REGION_VIEWBOX_PAD * 2;
  let vbH = Math.ceil(regionMaxY - regionMinY) + REGION_VIEWBOX_PAD * 2;
  if (!Number.isFinite(vbX) || !Number.isFinite(vbY) || vbW <= 0 || vbH <= 0) {
    vbX = REGION_VIEWBOX_FALLBACK.x;
    vbY = REGION_VIEWBOX_FALLBACK.y;
    vbW = REGION_VIEWBOX_FALLBACK.width;
    vbH = REGION_VIEWBOX_FALLBACK.height;
  }

  const regionHeader = `/**
 * Territory Command - UK region outlines.
 *
 * GENERATED FILE. Do not hand-edit. Regenerate via:
 *   node scripts/build-area-boundaries.mjs
 *
 * Each region outline is the union (mapshaper -dissolve2 region) of its
 * constituent postcode-area polygons from area-boundaries.ts. The two
 * files share the exact same source grid and simplification level, so the
 * region outline is always the exact topological union of its areas -
 * zero gaps, zero overlap, zero misalignment.
 *
 * Sources:
 *   - https://github.com/missinglink/uk-postcode-polygons (CC BY-SA 3.0)
 *   - https://github.com/martinjc/UK-GeoJSON (OGL) for Northern Ireland.
 * Simplify: 6% visvalingam keep-shapes.
 * Shetland (ZE) shifted (+${ZE_LNG_OFFSET} lng, ${ZE_LAT_OFFSET} lat) to inset into top-right of viewBox.
 * Regions: ${Object.keys(regionPaths).length}. Simplified region vertices: ${regionSimpVerts}.
 * Union bbox: x=${regionMinX.toFixed(2)}..${regionMaxX.toFixed(2)}, y=${regionMinY.toFixed(2)}..${regionMaxY.toFixed(2)}.
 */

import type { RegionKey } from './map-regions';

export const REGION_PATHS: Record<RegionKey, string> = {
${REGION_KEYS_ORDER
  .filter((k) => regionPaths[k])
  .map((k) => `  ${k}: ${JSON.stringify(regionPaths[k])},`)
  .join('\n')}
};

export const REGION_VIEWBOX = { x: ${vbX}, y: ${vbY}, width: ${vbW}, height: ${vbH} } as const;
`;

  fs.writeFileSync(OUT_REGIONS, regionHeader, 'utf8');

  console.log(`\nWrote ${OUT_REGIONS}`);
  console.log(`  regions emitted: ${Object.keys(regionPaths).length}`);
  console.log(`  simplified verts:${regionSimpVerts}`);
  console.log(`  output size:     ${fs.statSync(OUT_REGIONS).size} bytes`);
  console.log(
    `  union bbox:      x=${regionMinX.toFixed(2)}..${regionMaxX.toFixed(2)}, y=${regionMinY.toFixed(2)}..${regionMaxY.toFixed(2)}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
