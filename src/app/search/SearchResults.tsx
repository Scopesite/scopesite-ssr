'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { staticSearchIndex, SearchEntry } from '@/lib/search-index';

// We need to fetch Ghost posts on the client side or via a route handler.
// Since we want client-side updates without full page reload, we'll fetch them once on mount.

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [ghostPosts, setGhostPosts] = useState<SearchEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Debounce the input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      // Update URL without full page reload
      const newUrl = query ? `/search?q=${encodeURIComponent(query)}` : '/search';
      router.replace(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, router]);

  // Fetch Ghost posts once to include in the search index
  useEffect(() => {
    async function fetchGhostPosts() {
      try {
        const res = await fetch('/api/search-posts');
        if (res.ok) {
          const posts = await res.json();
          setGhostPosts(posts);
        }
      } catch (error) {
        console.error('Failed to fetch ghost posts for search:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchGhostPosts();
  }, []);

  // Combine static index and ghost posts
  const combinedIndex = useMemo(() => {
    return [...staticSearchIndex, ...ghostPosts];
  }, [ghostPosts]);

  // Initialize Fuse
  const fuse = useMemo(() => {
    return new Fuse(combinedIndex, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1.5 },
        { name: 'keywords', weight: 1 },
        { name: 'category', weight: 0.5 },
      ],
      threshold: 0.3,
      includeMatches: true,
    });
  }, [combinedIndex]);

  // Perform search
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return fuse.search(debouncedQuery).map(result => result.item);
  }, [debouncedQuery, fuse]);

  return (
    <div>
      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-4 border border-zinc-300 dark:border-zinc-700 rounded-lg leading-5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg transition-colors"
          placeholder="Search services, blog posts, case studies..."
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading search index...</p>
        </div>
      ) : (
        <div>
          {debouncedQuery && results.length === 0 ? (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
              <p className="text-lg text-zinc-900 dark:text-white font-medium">No results found for &quot;{debouncedQuery}&quot;</p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Try checking for typos or using different keywords.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result, index) => (
                <Link href={result.url} key={`${result.url}-${index}`} className="block group">
                  <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {result.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {result.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {result.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
