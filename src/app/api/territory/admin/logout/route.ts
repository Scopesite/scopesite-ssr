import { NextResponse } from 'next/server';
import { buildSessionCookieClear } from '@/lib/territory/admin-session';

export const runtime = 'nodejs';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(buildSessionCookieClear());
  return res;
}
