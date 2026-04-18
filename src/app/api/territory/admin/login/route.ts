import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  buildSessionCookieOptions,
  verifyAdminPassword,
} from '@/lib/territory/admin-session';

export const runtime = 'nodejs';

const Body = z.object({ password: z.string().min(1).max(300) });

// Throttle failed attempts per process (enough for a single-operator
// admin; survives normal traffic, resets on cold start which is fine).
const attempts = new Map<string, { count: number; firstAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function clientKey(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for') || '';
  const ip = xff.split(',')[0]?.trim() || 'unknown';
  return ip;
}

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  if (!rateLimit(key)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(buildSessionCookieOptions());
  return res;
}
