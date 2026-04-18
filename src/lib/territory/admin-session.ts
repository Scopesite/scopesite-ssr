/**
 * Territory Command admin session helper.
 *
 * Tiny HMAC-signed cookie. No database sessions table - Phase A scope
 * is a single-operator admin (Dan), not multi-user.
 *
 * Cookie format: `<base64url(payload)>.<base64url(hmac)>`
 *   payload = { v: 1, exp: <unix seconds> }
 *   hmac    = HMAC-SHA256(payload, TERRITORY_ADMIN_SESSION_SECRET)
 *
 * Password comparison is done with node:crypto.timingSafeEqual on the
 * UTF-8 bytes of the submitted + configured password (padded to equal
 * length to avoid a length-based side channel).
 *
 * Required env vars:
 *   TERRITORY_ADMIN_PASSWORD         - plaintext passphrase
 *   TERRITORY_ADMIN_SESSION_SECRET   - base64-encoded 32-byte key
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'territory_admin_session';
const COOKIE_TTL_SECONDS = 7 * 24 * 60 * 60;

function getSecret(): Buffer {
  const raw = process.env.TERRITORY_ADMIN_SESSION_SECRET || '';
  if (!raw) {
    throw new Error(
      'TERRITORY_ADMIN_SESSION_SECRET is not configured. Admin routes will 500.',
    );
  }
  return Buffer.from(raw, 'base64');
}

function b64urlEncode(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function b64urlDecode(input: string): Buffer {
  const pad = 4 - (input.length % 4 || 4);
  const padded = input + '='.repeat(pad === 4 ? 0 : pad);
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function sign(payload: string): string {
  return b64urlEncode(
    createHmac('sha256', getSecret()).update(payload).digest(),
  );
}

/**
 * Timing-safe password compare. Pads both to the max length so
 * submission of a short password does not leak length information.
 */
export function verifyAdminPassword(submitted: string): boolean {
  const configured = process.env.TERRITORY_ADMIN_PASSWORD || '';
  if (!configured) return false;
  const a = Buffer.from(submitted, 'utf8');
  const b = Buffer.from(configured, 'utf8');
  const len = Math.max(a.length, b.length, 1);
  const ap = Buffer.alloc(len);
  const bp = Buffer.alloc(len);
  a.copy(ap);
  b.copy(bp);
  const ok = timingSafeEqual(ap, bp) && a.length === b.length;
  return ok;
}

/** Encode a signed session token (cookie value). */
export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + COOKIE_TTL_SECONDS;
  const payloadJson = JSON.stringify({ v: 1, exp });
  const payloadB64 = b64urlEncode(payloadJson);
  const sig = sign(payloadB64);
  return `${payloadB64}.${sig}`;
}

export interface AdminSessionPayload {
  v: number;
  exp: number;
}

/** Verify a signed session token. Returns payload if valid + unexpired. */
export function verifySessionToken(token: string | undefined | null): AdminSessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  const expectedSig = sign(payloadB64);
  if (sig.length !== expectedSig.length) return null;
  const sigBuf = Buffer.from(sig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null;
  let payload: AdminSessionPayload;
  try {
    payload = JSON.parse(b64urlDecode(payloadB64).toString('utf8'));
  } catch {
    return null;
  }
  if (!payload || typeof payload.exp !== 'number') return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

/** Read + verify the current request's cookie. Returns payload or null. */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const store = await cookies();
  const c = store.get(ADMIN_COOKIE_NAME);
  return verifySessionToken(c?.value);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getAdminSession()) !== null;
}

/** For use in Route Handlers: sets the signed cookie on the response. */
export function buildSessionCookieOptions() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_TTL_SECONDS,
  };
}

export function buildSessionCookieClear() {
  return {
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  };
}
