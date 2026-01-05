import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { formatPostDate } from '@/lib/ghost';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt?: string;
  featureImage?: string;
  featureImageAlt?: string;
  publishedAt: string;
  readingTime: number;
  tag?: {
    name: string;
    slug: string;
  };
  featured?: boolean;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  featureImage,
  featureImageAlt,
  publishedAt,
  readingTime,
  tag,
  featured = false,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <article
        className={`h-full rounded-2xl overflow-hidden transition-all duration-400 ease-out
          bg-white border border-brand-navy/10
          hover:translate-y-[-8px]
          hover:shadow-[0_0_40px_rgba(236,182,21,0.2)]
          hover:border-brand-gold/40
          ${featured ? 'md:col-span-2 lg:col-span-3' : ''}`}
        style={{
          boxShadow: '0 4px 24px rgba(10,27,54,0.08)',
        }}
      >
        {/* Feature Image */}
        <div className={`relative overflow-hidden bg-brand-navy/5 ${featured ? 'aspect-[21/9]' : 'aspect-video'}`}>
          {featureImage ? (
            <Image
              src={featureImage}
              alt={featureImageAlt || title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={featured ? '(max-width: 768px) 100vw, 1200px' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-brand-navy/20 text-6xl font-headline">S</div>
            </div>
          )}
          
          {/* Category Tag */}
          {tag && (
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium
                bg-brand-gold text-brand-navy">
                {tag.name}
              </span>
            </div>
          )}
          
          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-4 right-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium
                bg-brand-navy text-white">
                Featured
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className={`p-6 ${featured ? 'md:p-8' : ''}`}>
          {/* Title */}
          <h3 className={`text-brand-navy font-bold mb-3 line-clamp-2 group-hover:text-brand-gold transition-colors
            ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
            {title}
          </h3>
          
          {/* Excerpt */}
          {excerpt && (
            <p className={`text-brand-navy/60 mb-4 line-clamp-3 ${featured ? 'text-base md:text-lg' : 'text-sm'}`}>
              {excerpt}
            </p>
          )}
          
          {/* Meta */}
          <div className="flex items-center gap-4 text-brand-navy/50 text-sm">
            <time dateTime={publishedAt}>
              {formatPostDate(publishedAt)}
            </time>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readingTime} min read
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default BlogCard;



