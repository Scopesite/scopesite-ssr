import { Metadata } from 'next';
import { getPosts } from '@/lib/ghost';
import { BlogCard } from '@/components/blog';
import { BlogLoadMore } from './BlogLoadMore';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateBlogSchema,
  generateCollectionPageSchema,
  generateItemListSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/blog`;

export const metadata: Metadata = {
  title: 'AI Visibility & Web Design Blog',
  description:
    "AI visibility strategies, GEO optimisation tips & web design insights for UK businesses. No-bullshit advice from Somerset's AI-first web design experts.",
  openGraph: {
    title: 'AI Visibility & Web Design Blog | Expert Insights | ScopeSite Digital Studios',
    description:
      "AI visibility strategies, GEO optimisation tips & web design insights for UK businesses. No-bullshit advice from Somerset's AI-first web design experts.",
    url: PAGE_URL,
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite Blog - AI Visibility & Web Design Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Visibility & Web Design Blog | ScopeSite',
    description: "AI visibility strategies, GEO optimisation tips & web design insights for UK businesses. No-bullshit advice.",
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default async function BlogPage() {
  const [{ posts: featuredPosts }, { posts: allPosts, meta }] = await Promise.all([
    getPosts({ filter: 'featured:true', limit: 6 }),
    getPosts({ page: 1, limit: 12 }),
  ]);

  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Blog', url: PAGE_URL },
  ]);

  const blogSchema = generateBlogSchema(PAGE_URL);

  const collectionPageSchema = generateCollectionPageSchema(
    PAGE_URL,
    'ScopeSite Blog - AI Visibility & Web Design Insights'
  );

  const blogPostListSchema = generateItemListSchema(
    `${PAGE_URL}/#post-list`,
    'ScopeSite Blog Posts',
    allPosts.map((post) => ({
      '@type': 'BlogPosting' as const,
      '@id': `${BASE_URL}/blog/${post.slug}/#article`,
      headline: post.title,
      url: `${BASE_URL}/blog/${post.slug}`,
    }))
  );

  return (
    <>
      {/* Page-specific structured data */}
      <JsonLd schema={[breadcrumbSchema, blogSchema, collectionPageSchema, blogPostListSchema]} />

      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section">
        <div className="container-content text-center">
          <span className="badge-gold-lg mb-6 inline-flex items-center justify-center">
            Insights & Resources
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-headline text-white mb-4">
            THE <span className="text-brand-gold">BLOG</span>
          </h1>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto mb-8">
            AI visibility insights, web design tips, and zero bullshit advice.
          </p>
          <div className="max-w-3xl mx-auto text-left bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white/80 mb-4">
              <strong className="text-brand-gold">What you&apos;ll find here:</strong> Practical advice on making your business 
              visible to AI assistants like ChatGPT and Claude. Technical breakdowns of what actually works 
              (and what doesn&apos;t). No fluff, no filler content, no SEO-bait articles written by people who&apos;ve 
              never built a website.
            </p>
            <p className="text-white/60 text-sm">
              Everything&apos;s written by Dan Cartwright, founder of ScopeSite. If something&apos;s on this blog, 
              it&apos;s because it&apos;s genuinely useful - not because we needed to hit a content quota.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="section-white border-b border-brand-navy/10">
          <div className="container-content">
            <div className="mb-8">
              <BlogCard
                slug={featuredPosts[0].slug}
                title={featuredPosts[0].title}
                excerpt={featuredPosts[0].excerpt || featuredPosts[0].custom_excerpt}
                featureImage={featuredPosts[0].feature_image}
                featureImageAlt={featuredPosts[0].feature_image_alt}
                publishedAt={featuredPosts[0].published_at}
                readingTime={featuredPosts[0].reading_time}
                tag={featuredPosts[0].primary_tag}
                featured={true}
              />
            </div>

            {featuredPosts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.slice(1).map((post) => (
                  <BlogCard
                    key={post.id}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt || post.custom_excerpt}
                    featureImage={post.feature_image}
                    featureImageAlt={post.feature_image_alt}
                    publishedAt={post.published_at}
                    readingTime={post.reading_time}
                    tag={post.primary_tag}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* All Articles Section */}
      <section className="section-white">
        <div className="container-content">
          <h2 className="text-brand-navy text-center mb-10 text-xl sm:text-2xl md:text-h2">
            All Articles
          </h2>

          {allPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.custom_excerpt || post.excerpt}
                    featureImage={post.feature_image}
                    featureImageAlt={post.feature_image_alt}
                    publishedAt={post.published_at}
                    readingTime={post.reading_time}
                    tag={post.primary_tag}
                    tags={post.tags}
                  />
                ))}
              </div>

              {meta.pagination.pages > 1 && (
                <BlogLoadMore
                  initialPage={1}
                  totalPages={meta.pagination.pages}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-brand-navy/60 text-lg">
                No posts yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
