import { createHash } from 'node:crypto';
import type { GhostPost } from '@/lib/ghost';
import corrections from './evidence-editorial-corrections.data.json';

/** Read-only Ghost corrections reviewed against the snapshots in ./fixtures/editorial-2026-10-16. */
export const EVIDENCE_REVIEW_DATE = '2026-10-16T19:50:00.000Z';

// Include every replaced claim surface so a metadata-only edit cannot be lost.
const fingerprintFields = [
  'id', 'uuid', 'slug', 'updated_at', 'title', 'html', 'excerpt', 'custom_excerpt',
  'meta_title', 'meta_description', 'og_title', 'og_description', 'twitter_title',
  'twitter_description', 'feature_image', 'feature_image_alt', 'og_image', 'twitter_image',
] as const;

export function editorialSourceFingerprint(post: GhostPost): string {
  return createHash('sha256')
    .update(JSON.stringify(fingerprintFields.map((field) => post[field] ?? '')))
    .digest('hex');
}

type Block = { id: string; before: string; after: string };
type BlockResult = { ok: true; html: string } | { ok: false; blockId: string; matches: number };

/** Validate the entire patch before changing anything; no normalisation or fuzzy replacement. */
export function replaceExactEditorialBlocks(html: string, blocks: readonly Block[]): BlockResult {
  for (const block of blocks) {
    const matches = block.before ? html.split(block.before).length - 1 : 0;
    if (matches !== 1) return { ok: false, blockId: block.id, matches };
  }
  let corrected = html;
  for (const block of blocks) corrected = corrected.replace(block.before, () => block.after);
  return { ok: true, html: corrected };
}

type Result =
  | { status: 'applied' | 'unaffected' | 'later-cms-revision'; post: GhostPost }
  | { status: 'unapplied'; post: GhostPost; reason: 'invalid-updated-at' | 'source-drift' | 'block-drift'; blockId?: string };

export function evaluateEvidenceEditorialCorrection(post: GhostPost): Result {
  const correction = corrections.find((candidate) => candidate.slug === post.slug);
  if (!correction) return { status: 'unaffected', post };
  const updatedAt = Date.parse(post.updated_at);
  if (!Number.isFinite(updatedAt)) return { status: 'unapplied', reason: 'invalid-updated-at', post };
  // A real subsequent Ghost publication takes authority over this dated repository repair.
  if (updatedAt > Date.parse(EVIDENCE_REVIEW_DATE)) return { status: 'later-cms-revision', post };
  if (editorialSourceFingerprint(post) !== correction.sourceFingerprint) {
    return { status: 'unapplied', reason: 'source-drift', post };
  }
  const replacement = replaceExactEditorialBlocks(post.html || '', correction.blocks);
  if (!replacement.ok) return { status: 'unapplied', reason: 'block-drift', blockId: replacement.blockId, post };
  const html = correction.kind === 'replace_article'
    ? correction.html!
    : `${correction.notice}${replacement.html}${correction.appendix}`;
  const { title, description } = correction;
  return {
    status: 'applied',
    post: {
      ...post,
      title,
      html,
      excerpt: description,
      custom_excerpt: description,
      meta_title: title,
      meta_description: description,
      og_title: title,
      og_description: description,
      twitter_title: title,
      twitter_description: description,
      ...(correction.removeImages ? {
        feature_image: undefined, feature_image_alt: undefined, og_image: undefined, twitter_image: undefined,
      } : {}),
      updated_at: EVIDENCE_REVIEW_DATE,
      reading_time: Math.max(1, Math.ceil(html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length / 200)),
    },
  };
}

export function applyEvidenceEditorialCorrection(post: GhostPost): GhostPost {
  const result = evaluateEvidenceEditorialCorrection(post);
  if (result.status === 'unapplied') {
    // Keep the whole source post, avoiding partial rewrites and article outages.
    // This is an actionable failure: recapture/review the CMS source before updating the patch.
    console.error('[EditorialCorrection] Unapplied correction requires review', {
      slug: post.slug, reason: result.reason, blockId: result.blockId,
      sourceUpdatedAt: post.updated_at, reviewDate: EVIDENCE_REVIEW_DATE,
    });
  }
  return result.post;
}
