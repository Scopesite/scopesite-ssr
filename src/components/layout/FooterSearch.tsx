'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function FooterSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-md mx-auto md:mx-0 relative flex items-center"
      aria-label="Site search"
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-white/50" />
      </div>
      <input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-colors sm:text-sm"
        placeholder="Search ScopeSite..."
        aria-label="Search ScopeSite"
      />
      <button 
        type="submit" 
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white transition-colors"
        aria-label="Submit search"
      >
        <span className="sr-only">Search</span>
        <span className="text-sm font-medium px-2 py-1 bg-white/10 rounded border border-white/20 hover:bg-white/20 transition-colors">
          ↵
        </span>
      </button>
    </form>
  );
}
