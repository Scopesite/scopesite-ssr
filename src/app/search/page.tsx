import { Suspense } from 'react';
import SearchResults from './SearchResults';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Results | ScopeSite Digital Studios',
  description: 'Search across all ScopeSite services, blog posts, case studies and resources.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Search Results</h1>
        <Suspense fallback={<div className="text-zinc-600 dark:text-zinc-400">Loading search results...</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
