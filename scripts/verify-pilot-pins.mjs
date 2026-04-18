/**
 * One-shot verification: for each pilot postcode district, confirm the
 * aggregate state reported by territory.v_seats_full and the pin colour
 * that TerritoryMap.tsx would render for it.
 *
 * Reads DATABASE_URL_UNPOOLED from .env.local.
 */
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const env = readFileSync('.env.local', 'utf8');
const m = env.match(/DATABASE_URL_UNPOOLED="([^"]+)"/);
if (!m) {
  console.error('DATABASE_URL_UNPOOLED not found in .env.local');
  process.exit(1);
}
const sql = neon(m[1]);

const PILOT = [
  { postcode: 'BS1',  tier: 'premium',  isReserve: false, isHome: false },
  { postcode: 'BA1',  tier: 'premium',  isReserve: false, isHome: false },
  { postcode: 'BS8',  tier: 'premium',  isReserve: false, isHome: false },
  { postcode: 'TA1',  tier: 'standard', isReserve: false, isHome: false },
  { postcode: 'BA20', tier: 'standard', isReserve: false, isHome: false },
  { postcode: 'BS22', tier: 'standard', isReserve: false, isHome: false },
  { postcode: 'BA11', tier: 'standard', isReserve: false, isHome: true  },
  { postcode: 'BA2',  tier: 'standard', isReserve: true,  isHome: false },
  { postcode: 'BA3',  tier: 'standard', isReserve: true,  isHome: false },
  { postcode: 'BA4',  tier: 'standard', isReserve: true,  isHome: false },
];

const COLOUR = {
  available: '#22C55E',
  pending:   '#3B82F6',
  claimed:   '#B91C1C',
  inactive:  '#64748B',
  premium:   '#A855F7',
};

function pinColour(p) {
  if (p.isReserve) return { colour: COLOUR.inactive, name: 'inactive (reserve)' };
  switch (p.aggregateState) {
    case 'claimed':   return { colour: COLOUR.claimed,  name: 'claimed' };
    case 'pending':   return { colour: COLOUR.pending,  name: 'pending' };
    case 'available': return p.tier === 'premium'
      ? { colour: COLOUR.premium,   name: 'premium (available)' }
      : { colour: COLOUR.available, name: 'available' };
    default: return { colour: COLOUR.inactive, name: `FALLBACK (${p.aggregateState})` };
  }
}

const rows = await sql`
  SELECT
    postcode_district,
    COUNT(*) FILTER (WHERE state = 'available') AS available,
    COUNT(*) FILTER (WHERE state = 'pending')   AS pending,
    COUNT(*) FILTER (WHERE state = 'claimed')   AS claimed,
    COUNT(*) FILTER (WHERE state = 'not_active') AS not_active,
    COUNT(*) AS total
  FROM territory.v_seats_full
  WHERE postcode_district = ANY(${PILOT.map((p) => p.postcode)})
  GROUP BY postcode_district
`;

const byDistrict = new Map(rows.map((r) => [r.postcode_district, r]));

console.log(
  'postcode | tier     | reserve | home | avail | pend | claim | aggregateState | pin colour',
);
console.log(
  '---------|----------|---------|------|-------|------|-------|----------------|-----------',
);
for (const p of PILOT) {
  const row = byDistrict.get(p.postcode) ?? {
    available: 0, pending: 0, claimed: 0, not_active: 0, total: 0,
  };
  let aggregateState;
  if (p.isReserve) aggregateState = 'reserve';
  else if (Number(row.claimed) >= Number(row.total) && Number(row.total) > 0) aggregateState = 'claimed';
  else if (Number(row.pending) > 0) aggregateState = 'pending';
  else if (Number(row.available) > 0) aggregateState = 'available';
  else aggregateState = 'reserve';

  const { colour, name } = pinColour({ ...p, aggregateState });
  console.log(
    `${p.postcode.padEnd(8)} | ${p.tier.padEnd(8)} | ${String(p.isReserve).padEnd(7)} | ${String(p.isHome).padEnd(4)} | ${String(row.available).padStart(5)} | ${String(row.pending).padStart(4)} | ${String(row.claimed).padStart(5)} | ${aggregateState.padEnd(14)} | ${colour} ${name}`,
  );
}
