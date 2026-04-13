import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/ghost';
import { SearchEntry } from '@/lib/search-index';

export async function GET() {
  try {
    // Fetch up to 100 posts to ensure we get all of them for the search index
    const response = await getPosts({ limit: 100 });
    
    const ghostSearchEntries: SearchEntry[] = response.posts.map(post => ({
      title: post.title,
      description: post.excerpt || post.custom_excerpt || '',
      url: `/blog/${post.slug}`,
      category: 'Blog',
      keywords: post.tags?.map(t => t.name) || [],
    }));

    return NextResponse.json(ghostSearchEntries);
  } catch (error) {
    console.error('Error fetching Ghost posts for search index:', error);
    return NextResponse.json([], { status: 500 });
  }
}
