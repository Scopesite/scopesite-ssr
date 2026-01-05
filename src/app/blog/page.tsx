import { Metadata } from 'next';
import { getPosts } from '@/lib/ghost';
import { BlogCard } from '@/components/blog';
import { BlogLoadMore } from './BlogLoadMore';

export const metadata: Metadata = {
  title: 'Blog | Web Design & AI Visibility Insights',
  description: 'Insights on web design, AI visibility, SEO, and digital marketing for UK businesses. Practical tips and strategies from the ScopeSite team.',
  openGraph: {
    title: 'Blog | Web Design & AI Visibility Insights | ScopeSite',
    description: 'Insights on web design, AI visibility, SEO, and digital marketing for UK businesses.',
  },
};

export default async function BlogPage() {
  const { posts, meta } = await getPosts({ page: 1, limit: 9 });
  
  // Separate featured post from the rest
  const featuredPost = posts.find(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-section">
        <div className="container-content text-center">
          <span className="badge-gold-lg mb-6 inline-flex items-center justify-center">Insights & Resources</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline text-white mb-4">
            THE <span className="text-brand-gold">BLOG</span>
          </h1>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            AI visibility insights, web design tips, and zero bullshit advice.
          </p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="section-white">
        <div className="container-content">
          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-12">
              <BlogCard
                slug={featuredPost.slug}
                title={featuredPost.title}
                excerpt={featuredPost.excerpt || featuredPost.custom_excerpt}
                featureImage={featuredPost.feature_image}
                featureImageAlt={featuredPost.feature_image_alt}
                publishedAt={featuredPost.published_at}
                readingTime={featuredPost.reading_time}
                tag={featuredPost.primary_tag}
                featured={true}
              />
            </div>
          )}
          
          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
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
          
          {/* Load More */}
          {meta.pagination.pages > 1 && (
            <BlogLoadMore 
              initialPage={1} 
              totalPages={meta.pagination.pages} 
            />
          )}

          {/* Empty State */}
          {posts.length === 0 && (
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

