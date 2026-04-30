import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

/**
 * IndexNow host verification: https://scopesite.co.uk/<INDEXNOW_KEY>.txt
 * KEY is read from env at request time — never committed.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;

  if (!filename.endsWith('.txt')) {
    notFound();
  }

  const envKey = process.env.INDEXNOW_KEY?.trim();
  if (!envKey) {
    notFound();
  }

  if (filename !== `${envKey}.txt`) {
    notFound();
  }

  return new NextResponse(envKey, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
