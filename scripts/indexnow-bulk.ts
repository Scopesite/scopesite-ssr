/**
 * One-off or cron: submit sitemap URLs to IndexNow (Bing/Yandex/Naver).
 * Requires INDEXNOW_KEY in env and matching https://scopesite.co.uk/<KEY>.txt on the host.
 *
 * Usage: INDEXNOW_KEY=yourhexkey npx tsx scripts/indexnow-bulk.ts
 */

const SITEMAP = 'https://scopesite.co.uk/sitemap.xml';
const INDEXNOW = 'https://api.indexnow.org/indexnow';
const HOST = 'scopesite.co.uk';

async function main() {
  const key = process.env.INDEXNOW_KEY?.trim();
  const keyHex = key?.replace(/-/g, '') ?? '';
  if (!key || keyHex.length < 8 || !/^[0-9a-f]+$/i.test(keyHex)) {
    console.error('Set INDEXNOW_KEY (8+ hex chars, optional dashes).');
    process.exit(1);
  }

  const res = await fetch(SITEMAP);
  if (!res.ok) {
    console.error('Failed to fetch sitemap', res.status);
    process.exit(1);
  }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const urls = locs.filter((u) => u.includes(HOST));

  const keyLocation = `https://${HOST}/${key}.txt`;
  const chunkSize = 10000;

  for (let i = 0; i < urls.length; i += chunkSize) {
    const urlList = urls.slice(i, i + chunkSize);
    const body = JSON.stringify({ host: HOST, key, keyLocation, urlList });
    const post = await fetch(INDEXNOW, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
    });
    if (!post.ok) {
      console.error('IndexNow error', post.status, await post.text());
      process.exit(1);
    }
    console.log('Submitted', urlList.length, 'URLs (batch', i / chunkSize + 1, ')');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
