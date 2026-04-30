import { NextResponse } from 'next/server';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

type IndexNowBody = {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
};

export async function POST(request: Request) {
  const key = process.env.INDEXNOW_KEY?.trim();
  const keyHex = key?.replace(/-/g, '') ?? '';
  if (!key || keyHex.length < 8 || keyHex.length > 128 || !/^[0-9a-f]+$/i.test(keyHex)) {
    return NextResponse.json(
      { error: 'INDEXNOW_KEY is not configured or invalid on this deployment.' },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const urls = (body as { urls?: unknown }).urls;
  if (!Array.isArray(urls) || urls.length === 0 || urls.length > 10_000) {
    return NextResponse.json(
      { error: 'Provide { "urls": string[] } with 1–10000 https URLs.' },
      { status: 400 },
    );
  }

  const host = 'scopesite.co.uk';
  const keyLocation = `https://${host}/${key}.txt`;
  const urlList = urls.filter((u): u is string => typeof u === 'string');

  const invalid = urlList.filter(
    (u) => !u.startsWith(`https://${host}/`) && !u.startsWith(`http://${host}/`),
  );
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: 'All URLs must belong to scopesite.co.uk', invalid },
      { status: 400 },
    );
  }

  const payload: IndexNowBody = {
    host,
    key,
    keyLocation,
    urlList: urlList.map((u) => u.replace(/^http:/, 'https:')),
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: 'IndexNow upstream error', status: res.status, detail: text.slice(0, 500) },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, submitted: payload.urlList.length });
}
