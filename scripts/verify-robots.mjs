/**
 * Smoke-check robots.txt (run after deploy).
 * Usage: node scripts/verify-robots.mjs
 */
const APEX = 'https://scopesite.co.uk/robots.txt';
const WWW = 'https://www.scopesite.co.uk/robots.txt';

async function check(url, label) {
  const res = await fetch(url, { redirect: 'manual' });
  console.log(label, res.status, res.headers.get('content-type')?.split(';')[0]);
  if (res.status === 301 || res.status === 308) {
    const loc = res.headers.get('location');
    console.log('  → redirect to', loc);
    if (loc) {
      const follow = await fetch(loc);
      console.log('  apex follow', follow.status, follow.headers.get('content-type')?.split(';')[0]);
    }
  }
}

await check(APEX, 'apex');
await check(WWW, 'www');
