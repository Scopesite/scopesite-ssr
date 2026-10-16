// @vitest-environment jsdom
import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { GhostPost } from '@/lib/ghost';
import { getFeaturedPosts, getPostBySlug, getPosts } from '@/lib/ghost';
import { generateBlogFAQSchema, generateBlogPostingSchema } from '@/lib/schema';
import { resolveBlogSeoFields } from './pitch-cluster-seo';
import { injectHeadingIds } from './inject-heading-ids';
import corrections from './evidence-editorial-corrections.data.json';
import {
  applyEvidenceEditorialCorrection, editorialSourceFingerprint,
  EVIDENCE_REVIEW_DATE, evaluateEvidenceEditorialCorrection, replaceExactEditorialBlocks,
} from './evidence-editorial-corrections';

function source(slug: string): GhostPost {
  return JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures/editorial-2026-10-16', `${slug}.json`), 'utf8'));
}

const parse = (html: string) => new DOMParser().parseFromString(html, 'text/html');

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('captured Ghost editorial corrections', () => {
  it.each(corrections)('applies the reviewed atomic repair and claim surfaces for $slug', (correction) => {
    const original = source(correction.slug);
    const untouched = structuredClone(original);
    expect(editorialSourceFingerprint(original)).toBe(correction.sourceFingerprint);
    const result = evaluateEvidenceEditorialCorrection(original);
    expect(result.status).toBe('applied');
    const post = result.post;
    expect(original).toEqual(untouched);
    for (const field of ['id', 'uuid', 'slug', 'published_at'] as const) expect(post[field]).toBe(original[field]);
    expect(post.updated_at).toBe(EVIDENCE_REVIEW_DATE);
    for (const field of ['title', 'meta_title', 'og_title', 'twitter_title'] as const) expect(post[field]).toBe(correction.title);
    for (const field of ['excerpt', 'custom_excerpt', 'meta_description', 'og_description', 'twitter_description'] as const) expect(post[field]).toBe(correction.description);
    expect(post.html).toContain('16 October 2026');
    for (const block of correction.blocks) {
      expect(post.html).not.toContain(block.before);
      if (block.after) expect(post.html).toContain(block.after);
    }
    expect(resolveBlogSeoFields(post.slug, post)).toEqual({ seoTitle: correction.title, description: correction.description });
    const article = generateBlogPostingSchema(post, `https://scopesite.co.uk/blog/${post.slug}`);
    expect(article.headline).toBe(correction.title);
    expect(article.description).toBe(correction.description);
    expect(article.datePublished).toBe(original.published_at);
    expect(article.dateModified).toBe(EVIDENCE_REVIEW_DATE);
    // FAQ output must be derived from the repaired source, without removed paragraphs.
    const faq = JSON.stringify(generateBlogFAQSchema(post));
    for (const block of correction.blocks) {
      const oldText = parse(block.before).body.textContent;
      if (oldText) expect(faq).not.toContain(oldText);
    }
    if (correction.removeImages) {
      expect(post.feature_image).toBeUndefined();
      expect(post.og_image).toBeUndefined();
      expect(post.twitter_image).toBeUndefined();
    } else expect(post.feature_image).toBe(original.feature_image);
  });

  it.each(corrections.filter((c) => c.kind === 'replace_article'))('replaces the unsafe case story completely for $slug', ({ slug }) => {
    const post = applyEvidenceEditorialCorrection(source(slug));
    const document = parse(post.html || '');
    const text = document.body.textContent || '';
    expect(text.trim().split(/\s+/).length).toBeGreaterThanOrEqual(700);
    expect(text.trim().split(/\s+/).length).toBeLessThanOrEqual(1050);
    expect(text).toContain('private development preview');
    expect(document.querySelector('a[href="https://scopesite.co.uk/case-studies/h4tlt"]')).not.toBeNull();
    expect(text).not.toMatch(/97%|37 of 38|£15,000|£8,000|#1 across|fraudulent/);
    expect(document.querySelector('h1, script, img')).toBeNull();
  });

  it.each(corrections.filter((c) => c.kind === 'replace_blocks'))('preserves existing heading and fragment targets for $slug', ({ slug }) => {
    const original = source(slug);
    const before = parse(injectHeadingIds(original.html || ''));
    const after = parse(injectHeadingIds(applyEvidenceEditorialCorrection(original).html || ''));
    for (const element of before.querySelectorAll('[id]')) {
      expect(after.getElementById(element.id), `Retained anchor ${element.id}`).not.toBeNull();
    }
    for (const anchor of after.querySelectorAll('a[href^="#"]')) {
      const id = decodeURIComponent(anchor.getAttribute('href')!.slice(1));
      if (before.getElementById(id)) expect(after.getElementById(id)).not.toBeNull();
    }
  });

  it('keeps a later CMS edit, including its metadata, unchanged', () => {
    const post = { ...source(corrections[0].slug), updated_at: '2026-10-17T10:00:00Z', title: 'New CMS revision', html: '<p>Newly reviewed source</p>' };
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(evaluateEvidenceEditorialCorrection(post)).toEqual({ status: 'later-cms-revision', post });
    expect(applyEvidenceEditorialCorrection(post)).toBe(post);
    expect(error).not.toHaveBeenCalled();
  });

  it.each(['html', 'meta_description', 'feature_image'] as const)('leaves the whole source unchanged and reports unexpected %s drift', (field) => {
    const post = { ...source(corrections[2].slug), [field]: 'Changed since snapshot' };
    const original = structuredClone(post);
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(applyEvidenceEditorialCorrection(post)).toBe(post);
    expect(post).toEqual(original);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('Unapplied correction requires review'), expect.objectContaining({ slug: post.slug, reason: 'source-drift' }));
  });

  it('does not repair an invalid or missing revision date', () => {
    const post = { ...source(corrections[0].slug), updated_at: 'unknown' };
    expect(evaluateEvidenceEditorialCorrection(post)).toEqual({ status: 'unapplied', reason: 'invalid-updated-at', post });
  });

  it('does not partially replace missing or repeated exact blocks', () => {
    const first = corrections[2].blocks[0];
    const second = corrections[2].blocks[1];
    expect(replaceExactEditorialBlocks(first.before, [first, second])).toEqual({ ok: false, blockId: second.id, matches: 0 });
    expect(replaceExactEditorialBlocks(first.before + first.before, [first])).toEqual({ ok: false, blockId: first.id, matches: 2 });
  });

  it('leaves unrelated posts unchanged', () => {
    const post = { ...source(corrections[0].slug), slug: 'unrelated-post' };
    expect(applyEvidenceEditorialCorrection(post)).toBe(post);
  });

  it('uses the same corrected source for detail, listing and featured consumers', async () => {
    vi.stubEnv('GHOST_URL', 'https://fixture.invalid');
    vi.stubEnv('GHOST_CONTENT_API_KEY', 'fixture-only');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
      posts: corrections.map((c) => source(c.slug)),
      meta: { pagination: { page: 1, limit: 12, pages: 1, total: 8, next: null, prev: null } },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })));
    const listing = await getPosts({ limit: 12 });
    const featured = await getFeaturedPosts(12);
    expect(listing.posts).toHaveLength(8);
    expect(featured).toHaveLength(8);
    for (const correction of corrections) {
      const detail = await getPostBySlug(correction.slug);
      expect(detail?.title).toBe(correction.title);
      expect(detail?.meta_description).toBe(correction.description);
      expect(listing.posts.find((p) => p.slug === correction.slug)?.html).toBe(detail?.html);
      expect(featured.find((p) => p.slug === correction.slug)?.html).toBe(detail?.html);
    }
  });
});
