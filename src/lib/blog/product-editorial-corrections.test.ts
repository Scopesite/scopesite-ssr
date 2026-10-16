import { describe, expect, it } from 'vitest';
import { applyProductEditorialCorrection } from './product-editorial-corrections';
import type { GhostPost } from '../ghost';
import { resolveBlogSeoFields } from './pitch-cluster-seo';

function legacy(slug: string): GhostPost {
  return { id: 'retained-id', uuid: 'retained-uuid', slug, title: 'Old price', html: '<p>£29, cheapest</p>', meta_title: 'Old price', meta_description: 'Old offer', og_title: 'Old offer', twitter_description: 'Old offer', feature_image: 'https://example.com/old-price.png', featured: false, published_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z', reading_time: 4 };
}

describe('dated product editorial correction', () => {
  it.each(['ai-visibility-scan-cost', 'cheapest-ai-visibility-checker', 'free-ai-visibility-tools'])('keeps identity while replacing every public claim surface for %s', (slug) => {
    const source = legacy(slug);
    const post = applyProductEditorialCorrection(source);
    expect(post.id).toBe(source.id);
    expect(post.slug).toBe(source.slug);
    expect(post.published_at).toBe(source.published_at);
    expect(post.html).toContain('CAFMO is live');
    expect(post.html).toContain('https://canaifindme.online/pricing');
    expect(post.html).toContain('https://voice.scopesite.co.uk/pricing');
    expect(post.html).not.toContain('£29');
    expect(post.feature_image).toBeUndefined();
    expect(post.meta_title).toBe(post.title);
    expect(post.og_title).toBe(post.title);
    expect(post.twitter_description).toBe(post.meta_description);
    expect(resolveBlogSeoFields(slug, post).description).toBe(post.meta_description);
    expect(source.html).toBe('<p>£29, cheapest</p>');
  });
  it('leaves other posts and later CMS revisions alone', () => {
    const other = legacy('another-post');
    expect(applyProductEditorialCorrection(other)).toBe(other);
    const later = { ...legacy('free-ai-visibility-tools'), updated_at: '2026-10-17T00:00:00Z' };
    expect(applyProductEditorialCorrection(later)).toBe(later);
  });
});
