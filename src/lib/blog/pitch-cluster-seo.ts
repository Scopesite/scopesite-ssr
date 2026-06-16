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
  'free-ai-visibility-tools': {
    metaTitle: 'Free AI Visibility Tools (2026) | Check If ChatGPT and Google AI Can Find You',
    metaDescription:
      'A practical run-through of free tools for checking whether AI search can see your business, read your schema, and recommend you. What each one tells you, and what it misses.',
    itemList: {
      name: 'Best free AI visibility tools in 2026',
      items: [
        { name: 'V.O.I.C.E™', description: 'Most thorough free AI visibility audit' },
        { name: 'HubSpot AEO Grader', description: 'Free report with share-of-voice metrics' },
        {
          name: 'SUSO Digital AI Search Visibility Checker',
          description: 'One-time scan across 100+ AI visibility signals',
        },
        { name: 'Profound', description: 'Free tier covering nine AI platforms' },
        { name: 'Otterly AI', description: '14-day trial with automated AI search monitoring' },
      ],
    },
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
