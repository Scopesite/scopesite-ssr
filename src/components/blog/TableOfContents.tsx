'use client';

import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import type { BlogHeading } from '@/lib/blog/extract-headings';

interface TableOfContentsProps {
  headings: BlogHeading[];
}

function getHeadingClass(level: 2 | 3, isActive: boolean): string {
  const levelClass = level === 3 ? 'pl-5 text-sm' : 'pl-3 text-sm font-medium';
  const stateClass = isActive
    ? 'border-brand-gold text-brand-navy font-bold'
    : 'border-transparent text-brand-navy/65 hover:border-brand-gold/40 hover:text-brand-navy';

  return [
    'block border-l-2 py-2 pr-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2',
    levelClass,
    stateClass,
  ].join(' ');
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const headingIds = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const [activeId, setActiveId] = useState<string>(headingIds[0] || '');

  useEffect(() => {
    if (headingIds.length === 0) {
      return;
    }

    const headingElements = headingIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (headingElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries[0]?.target.id) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-6rem 0px -65% 0px',
        threshold: [0, 1],
      }
    );

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [headingIds]);

  const handleClick = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    const heading = document.getElementById(id);

    if (!heading) {
      return;
    }

    event.preventDefault();
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', `#${id}`);
    setActiveId(id);
  };

  return (
    <nav aria-label="Table of contents" className="lg:sticky lg:top-24 lg:max-h-[60vh] lg:overflow-y-auto">
      <details className="mb-8 rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-sm lg:hidden">
        <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide text-brand-navy marker:text-brand-gold">
          Jump to Section
        </summary>
        <div className="mt-4 space-y-1">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={handleClick(heading.id)}
              className={getHeadingClass(heading.level, activeId === heading.id)}
            >
              {heading.text}
            </a>
          ))}
        </div>
      </details>

      <div className="hidden rounded-2xl border border-brand-navy/10 bg-white p-4 shadow-sm lg:block">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-navy/60">
          In This Article
        </p>
        <div className="space-y-1">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={handleClick(heading.id)}
              className={getHeadingClass(heading.level, activeId === heading.id)}
            >
              {heading.text}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default TableOfContents;
