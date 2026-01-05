/**
 * Ghost Content API Client
 * 
 * Connects to Ghost CMS for blog content.
 * Falls back to mock data when environment variables are not set.
 * 
 * Environment variables needed:
 * - GHOST_URL: Your Ghost site URL (e.g., https://your-site.ghost.io)
 * - GHOST_CONTENT_API_KEY: Your Ghost Content API key
 */

// Types
export interface GhostTag {
  id: string;
  name: string;
  slug: string;
}

export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  profile_image?: string;
  bio?: string;
}

export interface GhostPost {
  id: string;
  uuid: string;
  slug: string;
  title: string;
  html?: string;
  excerpt?: string;
  custom_excerpt?: string;
  feature_image?: string;
  feature_image_alt?: string;
  featured: boolean;
  published_at: string;
  updated_at: string;
  reading_time: number;
  primary_tag?: GhostTag;
  tags?: GhostTag[];
  primary_author?: GhostAuthor;
  authors?: GhostAuthor[];
}

export interface GhostPostsResponse {
  posts: GhostPost[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      pages: number;
      total: number;
      next: number | null;
      prev: number | null;
    };
  };
}

// Mock Data for development/preview
const MOCK_POSTS: GhostPost[] = [
  {
    id: '1',
    uuid: 'mock-1',
    slug: 'why-ai-visibility-matters-uk-businesses-2025',
    title: 'Why AI Visibility Matters for UK Businesses in 2025',
    excerpt: 'ChatGPT, Siri, and other AI assistants are changing how customers find businesses. If your website isn\'t optimised for AI, you\'re already falling behind.',
    html: '<p>The way people find businesses is changing rapidly. Gone are the days when a simple Google search was the only way customers discovered your services...</p><p>AI assistants like ChatGPT, Siri, and Alexa are now being used by millions of people to find recommendations, compare services, and make purchasing decisions.</p><h2>What This Means for Your Business</h2><p>If your website isn\'t structured in a way that AI can understand, you\'re invisible to a growing segment of potential customers...</p>',
    feature_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
    feature_image_alt: 'AI and technology concept',
    featured: true,
    published_at: '2025-01-03T10:00:00.000Z',
    updated_at: '2025-01-03T10:00:00.000Z',
    reading_time: 5,
    primary_tag: { id: 't1', name: 'AI Visibility', slug: 'ai-visibility' },
    tags: [
      { id: 't1', name: 'AI Visibility', slug: 'ai-visibility' },
      { id: 't2', name: 'SEO', slug: 'seo' },
    ],
    primary_author: {
      id: 'a1',
      name: 'Dan Cartwright',
      slug: 'dan',
      bio: 'Founder & Director of ScopeSite',
    },
  },
  {
    id: '2',
    uuid: 'mock-2',
    slug: 'web-design-mistakes-small-businesses',
    title: '7 Web Design Mistakes That Are Costing Small Businesses Customers',
    excerpt: 'Most small business websites make the same costly mistakes. Here\'s what they are and how to fix them without breaking the bank.',
    html: '<p>After reviewing hundreds of small business websites, we\'ve noticed the same problems appearing again and again...</p>',
    feature_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
    feature_image_alt: 'Web design on laptop',
    featured: false,
    published_at: '2025-01-01T09:00:00.000Z',
    updated_at: '2025-01-01T09:00:00.000Z',
    reading_time: 8,
    primary_tag: { id: 't3', name: 'Web Design', slug: 'web-design' },
    tags: [
      { id: 't3', name: 'Web Design', slug: 'web-design' },
      { id: 't4', name: 'Tips', slug: 'tips' },
    ],
    primary_author: {
      id: 'a1',
      name: 'Dan Cartwright',
      slug: 'dan',
    },
  },
  {
    id: '3',
    uuid: 'mock-3',
    slug: 'structured-data-seo-guide',
    title: 'The Complete Guide to Structured Data for Better SEO',
    excerpt: 'Structured data helps search engines and AI assistants understand your content. Learn how to implement it correctly.',
    html: '<p>Structured data is one of the most powerful yet underutilised tools in SEO...</p>',
    feature_image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop',
    feature_image_alt: 'Data and analytics',
    featured: false,
    published_at: '2024-12-28T14:00:00.000Z',
    updated_at: '2024-12-28T14:00:00.000Z',
    reading_time: 12,
    primary_tag: { id: 't2', name: 'SEO', slug: 'seo' },
    tags: [
      { id: 't2', name: 'SEO', slug: 'seo' },
      { id: 't5', name: 'Technical', slug: 'technical' },
    ],
    primary_author: {
      id: 'a1',
      name: 'Dan Cartwright',
      slug: 'dan',
    },
  },
  {
    id: '4',
    uuid: 'mock-4',
    slug: 'voice-search-optimisation-tips',
    title: 'Voice Search Optimisation: How to Get Found When People Talk to Their Devices',
    excerpt: 'More people are using voice search than ever before. Here\'s how to make sure your business shows up in voice results.',
    html: '<p>Voice search is no longer a novelty - it\'s how millions of people interact with the internet daily...</p>',
    feature_image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=1200&h=630&fit=crop',
    feature_image_alt: 'Voice assistant device',
    featured: false,
    published_at: '2024-12-20T11:00:00.000Z',
    updated_at: '2024-12-20T11:00:00.000Z',
    reading_time: 6,
    primary_tag: { id: 't1', name: 'AI Visibility', slug: 'ai-visibility' },
    tags: [
      { id: 't1', name: 'AI Visibility', slug: 'ai-visibility' },
      { id: 't6', name: 'Voice Search', slug: 'voice-search' },
    ],
    primary_author: {
      id: 'a1',
      name: 'Dan Cartwright',
      slug: 'dan',
    },
  },
  {
    id: '5',
    uuid: 'mock-5',
    slug: 'website-speed-matters',
    title: 'Why Website Speed Matters More Than Ever (And How to Fix It)',
    excerpt: '53% of visitors leave if your site takes more than 3 seconds to load. Here\'s how to make sure that doesn\'t happen.',
    html: '<p>In the age of instant gratification, website speed isn\'t just a nice-to-have - it\'s essential...</p>',
    feature_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop',
    feature_image_alt: 'Speed and performance metrics',
    featured: false,
    published_at: '2024-12-15T16:00:00.000Z',
    updated_at: '2024-12-15T16:00:00.000Z',
    reading_time: 7,
    primary_tag: { id: 't5', name: 'Technical', slug: 'technical' },
    tags: [
      { id: 't5', name: 'Technical', slug: 'technical' },
      { id: 't3', name: 'Web Design', slug: 'web-design' },
    ],
    primary_author: {
      id: 'a1',
      name: 'Dan Cartwright',
      slug: 'dan',
    },
  },
  {
    id: '6',
    uuid: 'mock-6',
    slug: 'choosing-right-web-platform',
    title: 'WordPress, Wix, or Custom? Choosing the Right Platform for Your Business',
    excerpt: 'The platform you choose affects everything from SEO to maintenance costs. Here\'s how to make the right decision.',
    html: '<p>One of the first questions we get from clients is: "What platform should I build my website on?"...</p>',
    feature_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=630&fit=crop',
    feature_image_alt: 'Coding and development',
    featured: false,
    published_at: '2024-12-10T09:00:00.000Z',
    updated_at: '2024-12-10T09:00:00.000Z',
    reading_time: 10,
    primary_tag: { id: 't3', name: 'Web Design', slug: 'web-design' },
    tags: [
      { id: 't3', name: 'Web Design', slug: 'web-design' },
      { id: 't4', name: 'Tips', slug: 'tips' },
    ],
    primary_author: {
      id: 'a1',
      name: 'Dan Cartwright',
      slug: 'dan',
    },
  },
];

// Check if Ghost is configured
const isGhostConfigured = () => {
  return !!(process.env.GHOST_URL && process.env.GHOST_CONTENT_API_KEY);
};

// Ghost API base URL builder
const getGhostApiUrl = (endpoint: string, params: Record<string, string> = {}) => {
  const url = new URL(`${process.env.GHOST_URL}/ghost/api/content/${endpoint}/`);
  url.searchParams.set('key', process.env.GHOST_CONTENT_API_KEY || '');
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  
  return url.toString();
};

/**
 * Get all posts with pagination
 */
export async function getPosts(options: {
  page?: number;
  limit?: number;
  filter?: string;
} = {}): Promise<GhostPostsResponse> {
  const { page = 1, limit = 9, filter } = options;

  // Return mock data if Ghost is not configured
  if (!isGhostConfigured()) {
    const startIndex = (page - 1) * limit;
    const paginatedPosts = MOCK_POSTS.slice(startIndex, startIndex + limit);
    
    return {
      posts: paginatedPosts,
      meta: {
        pagination: {
          page,
          limit,
          pages: Math.ceil(MOCK_POSTS.length / limit),
          total: MOCK_POSTS.length,
          next: startIndex + limit < MOCK_POSTS.length ? page + 1 : null,
          prev: page > 1 ? page - 1 : null,
        },
      },
    };
  }

  // Fetch from Ghost API
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
    include: 'tags,authors',
    fields: 'id,uuid,slug,title,excerpt,custom_excerpt,feature_image,feature_image_alt,featured,published_at,updated_at,reading_time',
  };

  if (filter) {
    params.filter = filter;
  }

  const response = await fetch(getGhostApiUrl('posts', params), {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<GhostPost | null> {
  // Return mock data if Ghost is not configured
  if (!isGhostConfigured()) {
    return MOCK_POSTS.find(post => post.slug === slug) || null;
  }

  const params: Record<string, string> = {
    include: 'tags,authors',
  };

  const response = await fetch(getGhostApiUrl(`posts/slug/${slug}`, params), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch post: ${response.statusText}`);
  }

  const data = await response.json();
  return data.posts?.[0] || null;
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(limit: number = 3): Promise<GhostPost[]> {
  // Return mock data if Ghost is not configured
  if (!isGhostConfigured()) {
    return MOCK_POSTS.filter(post => post.featured).slice(0, limit);
  }

  const params: Record<string, string> = {
    limit: limit.toString(),
    filter: 'featured:true',
    include: 'tags,authors',
    fields: 'id,uuid,slug,title,excerpt,custom_excerpt,feature_image,feature_image_alt,featured,published_at,updated_at,reading_time',
  };

  const response = await fetch(getGhostApiUrl('posts', params), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch featured posts: ${response.statusText}`);
  }

  const data = await response.json();
  return data.posts || [];
}

/**
 * Get all post slugs for static generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  // Return mock data if Ghost is not configured
  if (!isGhostConfigured()) {
    return MOCK_POSTS.map(post => post.slug);
  }

  const params: Record<string, string> = {
    limit: 'all',
    fields: 'slug',
  };

  const response = await fetch(getGhostApiUrl('posts', params), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch post slugs: ${response.statusText}`);
  }

  const data = await response.json();
  return data.posts?.map((post: { slug: string }) => post.slug) || [];
}

/**
 * Format date for display
 */
export function formatPostDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}


