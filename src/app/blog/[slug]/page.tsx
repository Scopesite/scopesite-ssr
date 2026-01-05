import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import {
  getPostBySlug,
  getAllPostSlugs,
  formatPostDate,
  getPosts,
} from '@/lib/ghost';
import { BlogCard } from '@/components/blog';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateBlogPostingSchema,
  generateBlogFAQSchema,
  generateBlogHowToSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const pageUrl = `${BASE_URL}/blog/${slug}`;

  return {
    title: post.title,
    description:
      post.excerpt || post.custom_excerpt || `Read ${post.title} on the ScopeSite blog.`,
    openGraph: {
      title: `${post.title} | ScopeSite Blog`,
      description: post.excerpt || post.custom_excerpt,
      type: 'article',
      url: pageUrl,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: post.primary_author?.name ? [post.primary_author.name] : undefined,
      images: post.feature_image
        ? [
            {
              url: post.feature_image,
              alt: post.feature_image_alt || post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.custom_excerpt,
      images: post.feature_image ? [post.feature_image] : undefined,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const pageUrl = `${BASE_URL}/blog/${slug}`;

  // Get related posts (same tag, excluding current post)
  const { posts: allPosts } = await getPosts({ limit: 4 });
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Blog', url: `${BASE_URL}/blog` },
    { name: post.title, url: pageUrl },
  ]);

  const blogPostingSchema = generateBlogPostingSchema(post, pageUrl);

  // Conditionally generate FAQ schema if post has FAQ content/tag
  const faqSchema = generateBlogFAQSchema(post);

  // Conditionally generate HowTo schema if post is a tutorial
  const howToSchema = generateBlogHowToSchema(post, pageUrl);

  // Build schema array - only include non-null schemas
  const schemas: Record<string, unknown>[] = [breadcrumbSchema, blogPostingSchema];
  if (faqSchema) schemas.push(faqSchema);
  if (howToSchema) schemas.push(howToSchema);

  return (
    <>
      {/* Page-specific structured data - NO Organization/WebSite (already in layout.tsx) */}
      <JsonLd schema={schemas} />

      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <div className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/60 hover:text-brand-gold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>

            {/* Category Tag */}
            {post.primary_tag && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-brand-gold text-brand-navy mb-6">
                {post.primary_tag.name}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-white/60">
              {post.primary_author && (
                <div className="flex items-center gap-2">
                  {post.primary_author.profile_image && (
                    <Image
                      src={post.primary_author.profile_image}
                      alt={post.primary_author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span>{post.primary_author.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.published_at}>
                  {formatPostDate(post.published_at)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.reading_time} min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Image */}
      {post.feature_image && (
        <section className="bg-brand-navy pb-8">
          <div className="container-content">
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <Image
                  src={post.feature_image}
                  alt={post.feature_image_alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Post Content */}
      <section className="section-white">
        <div className="container-content">
          <article className="max-w-3xl mx-auto">
            {post.html ? (
              <div
                className="prose-scopesite"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
            ) : (
              <p className="text-brand-navy/70">
                {post.excerpt || 'Content coming soon...'}
              </p>
            )}
          </article>
        </div>
      </section>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <section className="py-8 bg-brand-navy/5">
          <div className="container-content">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap gap-2">
                <span className="text-brand-navy/60 text-sm">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full text-sm bg-brand-navy/10 text-brand-navy/70"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-white border-t border-brand-navy/10">
          <div className="container-content">
            <h2 className="text-brand-navy text-center mb-8 text-xl sm:text-2xl md:text-h2">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <BlogCard
                  key={relatedPost.id}
                  slug={relatedPost.slug}
                  title={relatedPost.title}
                  excerpt={relatedPost.excerpt || relatedPost.custom_excerpt}
                  featureImage={relatedPost.feature_image}
                  featureImageAlt={relatedPost.feature_image_alt}
                  publishedAt={relatedPost.published_at}
                  readingTime={relatedPost.reading_time}
                  tag={relatedPost.primary_tag}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-brand-navy py-section">
        <div className="container-content text-center">
          <h2 className="text-white mb-4 text-xl sm:text-2xl md:text-h2">Want to Work With Us?</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            If you found this helpful, imagine what we could do for your
            business.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/pricing" className="btn-primary">
              Get Instant Quote
            </Link>
            <Link href="/book" className="btn-secondary-light">
              Book a Strategy Call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
