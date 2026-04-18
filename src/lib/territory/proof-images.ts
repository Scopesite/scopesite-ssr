import 'server-only';
import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Resolve a ProofSection card image by slug.
 *
 * Preference order:
 *   1. /public/territory/proof/{slug}.webp
 *   2. /public/territory/proof/{slug}.png
 *   3. null -> caller falls back to an SVG mockup component
 *
 * Evaluated at build / server-render time. Next.js static-renders
 * /territory, so the resolved paths are baked into the HTML payload.
 * Drop a new file into public/territory/proof/, trigger a revalidation
 * (next build, or wait for ISR's 60-second window) and the card switches
 * from mockup to real image with no code change.
 */
const PROOF_DIR = path.join(process.cwd(), 'public', 'territory', 'proof');

export function resolveProofImage(slug: string): string | null {
  const webpAbs = path.join(PROOF_DIR, `${slug}.webp`);
  if (existsSync(webpAbs)) return `/territory/proof/${slug}.webp`;

  const pngAbs = path.join(PROOF_DIR, `${slug}.png`);
  if (existsSync(pngAbs)) return `/territory/proof/${slug}.png`;

  return null;
}
