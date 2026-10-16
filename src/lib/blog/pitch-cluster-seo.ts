/**
 * Pitch-cluster SEO overrides for high-impression blog posts (SCO-6).
 * Code overrides take precedence over Ghost meta_title / meta_description so
 * metadata and JSON-LD stay in sync in the same deploy.
 */

export interface BlogSeoOverride {
  metaTitle: string;
  metaDescription: string;
  /** Optional ItemList entries when the post contains a visible ranked list. */
  itemList?: {
    name: string;
    items: Array<{ name: string; description?: string }>;
  };
}

const BLOG_SEO_OVERRIDES: Record<string, BlogSeoOverride> = {
  '2026-uk-ai-visibility-index': {
    metaTitle: '2026 UK AI Visibility Index | Which Businesses AI Search Actually Recommends',
    // Softened vs original brief: page ranks agencies from a 50+ review; no average score dataset.
    metaDescription:
      'We analysed 50+ UK web agencies for AI search visibility. The 2026 index ranks the top 10 and shows what separates businesses that get cited by ChatGPT and Perplexity from the ones that do not.',
  },
};

export function getBlogSeoOverride(slug: string): BlogSeoOverride | undefined {
  return BLOG_SEO_OVERRIDES[slug];
}

export function resolveBlogSeoFields(
  slug: string,
  post: {
    title: string;
    meta_title?: string;
    meta_description?: string;
    excerpt?: string;
    custom_excerpt?: string;
  }
): { seoTitle: string; description: string } {
  const override = getBlogSeoOverride(slug);
  const ghostMetaTitle = post.meta_title?.trim();
  const fallbackDescription =
    post.meta_description || post.excerpt || post.custom_excerpt || `Read ${post.title} on the ScopeSite blog.`;

  return {
    seoTitle: override?.metaTitle ?? ghostMetaTitle ?? post.title,
    description: override?.metaDescription ?? fallbackDescription,
  };
}
