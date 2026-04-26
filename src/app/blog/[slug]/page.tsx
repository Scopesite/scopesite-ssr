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
import { AuthorBio } from '@/components/blog/AuthorBio';
import { JsonLd } from '@/components/JsonLd';
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateBlogPostingSchema,
  generateBlogFAQSchema,
  generateBlogHowToSchema,
  generateSpeakableSchema,
} from '@/lib/schema';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { extractHeadingsFromHtml } from '@/lib/blog/extract-headings';
import { injectHeadingIds } from '@/lib/blog/inject-heading-ids';
import { enhanceFaqHtml } from '@/lib/blog/enhance-faq-html';

const BASE_URL = 'https://scopesite.co.uk';

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function truncateAuthorBio(bio: string, maxLength = 80): string {
  const trimmedBio = bio.trim();

  if (trimmedBio.length <= maxLength) {
    return trimmedBio;
  }

  const cutPoint = trimmedBio.slice(0, maxLength + 1).lastIndexOf(' ');
  const safeLength = cutPoint > 0 ? cutPoint : maxLength;

  return `${trimmedBio.slice(0, safeLength).trimEnd()}...`;
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
      title: { absolute: 'Post Not Found' },
    };
  }

  const pageUrl = `${BASE_URL}/blog/${slug}`;

  const description = post.meta_description || post.excerpt || post.custom_excerpt || `Read ${post.title} on the ScopeSite blog.`;
  const ogImage = post.og_image || post.feature_image;
  const twitterImage = post.twitter_image || post.feature_image;

  // Blog posts opt out of the root layout's `%s | ScopeSite` title template.
  // Editorial control of the SEO title lives in Ghost (post.meta_title); fall
  // back to the visible post title when no meta_title is set. We never append
  // brand text automatically — if the brand should appear, it must be written
  // into Ghost.
  const ghostMetaTitle = post.meta_title?.trim();
  const seoTitle = ghostMetaTitle || post.title;

  return {
    title: {
      absolute: seoTitle,
    },
    description,
    openGraph: {
      title: post.og_title || ghostMetaTitle || post.title,
      description: post.og_description || description,
      type: 'article',
      url: pageUrl,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: post.primary_author?.name ? [post.primary_author.name] : undefined,
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: post.feature_image_alt || post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.twitter_title || ghostMetaTitle || post.title,
      description: post.twitter_description || description,
      images: twitterImage ? [twitterImage] : undefined,
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

  // Prefer same-tag related posts so older topical articles keep receiving
  // internal links. Fall back to latest posts for untagged Ghost content.
  const tagSlug = post.primary_tag?.slug;
  const { posts: taggedPosts } = tagSlug
    ? await getPosts({ filter: `tag:${tagSlug}`, limit: 4 })
    : { posts: [] };
  let relatedPosts = taggedPosts.filter((p) => p.id !== post.id).slice(0, 3);

  if (relatedPosts.length < 3) {
    const { posts: latestPosts } = await getPosts({ limit: 6 });
    const fillers = latestPosts.filter(
      (p) => p.id !== post.id && !relatedPosts.some((related) => related.id === p.id)
    );
    relatedPosts = [...relatedPosts, ...fillers].slice(0, 3);
  }

  // Generate schemas — wrapped in try/catch so a schema failure never
  // prevents the page from rendering (degrades gracefully without JSON-LD)
  let schemas: Record<string, unknown>[] = [];
  try {
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: BASE_URL },
      { name: 'Blog', url: `${BASE_URL}/blog` },
      { name: post.title, url: pageUrl },
    ]);

    const description =
      post.meta_description || post.excerpt || post.custom_excerpt || `Read ${post.title} on the ScopeSite blog.`;

    const schemaTitle = post.meta_title?.trim() || post.title;
    const webPageSchema = {
      ...generateWebPageSchema(schemaTitle, description, pageUrl),
      mainEntity: { '@id': `${pageUrl}/#article` },
    };

    const blogPostingSchema = generateBlogPostingSchema(post, pageUrl);
    blogPostingSchema.speakable = generateSpeakableSchema([
      'h1',
      '.key-takeaway',
      '.prose-scopesite h2',
      '.prose-scopesite h3',
      '.prose-scopesite .faq-answer',
    ]);

    schemas = [webPageSchema, breadcrumbSchema, blogPostingSchema];

    const faqSchema = generateBlogFAQSchema(post);
    if (faqSchema) schemas.push(faqSchema);

    const howToSchema = generateBlogHowToSchema(post, pageUrl);
    if (howToSchema) schemas.push(howToSchema);
  } catch (e) {
    console.error('[BlogPost] Schema generation failed for', slug, e);
  }

  const rawPostHtml = post.html || '';
  const blogHeadings = extractHeadingsFromHtml(rawPostHtml);
  const showTableOfContents = blogHeadings.filter((heading) => heading.level === 2).length >= 3;
  const renderedPostHtml = showTableOfContents ? injectHeadingIds(rawPostHtml) : rawPostHtml;
  const enhancedPostHtml = enhanceFaqHtml(renderedPostHtml);

  return (
    <>
      {schemas.length > 0 && <JsonLd schema={schemas} />}

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
            <div className="space-y-3">
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
                  <span>{post.reading_time || 1} min read</span>
                </div>
              </div>
              {post.primary_author?.bio && (
                <p className="max-w-2xl text-sm leading-relaxed text-white/70">
                  {truncateAuthorBio(post.primary_author.bio)}
                </p>
              )}
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
                  sizes="(max-width: 768px) 100vw, 896px"
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
          <div
            className={
              showTableOfContents
                ? 'grid grid-cols-1 gap-10 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:items-start lg:justify-center lg:gap-12'
                : ''
            }
          >
            {showTableOfContents && <TableOfContents headings={blogHeadings} />}
            <article className={showTableOfContents ? 'w-full max-w-[48rem] lg:col-start-2' : 'max-w-3xl mx-auto'}>
            {post.html ? (
              <div
                className="prose-scopesite"
                dangerouslySetInnerHTML={{ __html: enhancedPostHtml }}
              />
            ) : (
              <p className="text-brand-navy/70">
                {post.excerpt || 'Content coming soon...'}
              </p>
            )}
            </article>
          </div>
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

      {/* Author Bio */}
      {post.primary_author && <AuthorBio author={post.primary_author} />}

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
            <Link href="/voice" className="btn-secondary-light">
              Get Your Free V.O.I.C.E Report
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
