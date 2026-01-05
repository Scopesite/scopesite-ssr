'use client';

import { useState, useTransition } from 'react';
import { BlogCard } from '@/components/blog';
import { GhostPost } from '@/lib/ghost';
import { Loader2 } from 'lucide-react';

interface BlogLoadMoreProps {
  initialPage: number;
  totalPages: number;
}

export function BlogLoadMore({ initialPage, totalPages }: BlogLoadMoreProps) {
  const [page, setPage] = useState(initialPage);
  const [posts, setPosts] = useState<GhostPost[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(page < totalPages);

  const loadMore = async () => {
    const nextPage = page + 1;
    
    startTransition(async () => {
      try {
        const response = await fetch(`/api/blog?page=${nextPage}&limit=9`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        setPosts(prev => [...prev, ...data.posts]);
        setPage(nextPage);
        setHasMore(data.meta.pagination.next !== null);
      } catch (error) {
        console.error('Error loading more posts:', error);
      }
    });
  };

  if (!hasMore && posts.length === 0) {
    return null;
  }

  return (
    <>
      {/* Additional loaded posts */}
      {posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {posts.map((post) => (
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
      
      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Posts'
            )}
          </button>
        </div>
      )}
    </>
  );
}



