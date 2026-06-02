'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { GlossaryHeading } from '@/lib/rehype-collect-headings';

interface GlossaryTocProps {
  headings: GlossaryHeading[];
}

export function GlossaryToc({ headings }: GlossaryTocProps) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null
  );

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav aria-label="On this page" className="sticky top-24">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-brand-navy/60">
        On this page
      </p>
      <ul className="space-y-1 border-l border-brand-navy/10">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  '-ml-px block border-l-2 py-1.5 pl-3 pr-2 text-sm transition-colors',
                  isActive
                    ? 'border-brand-gold font-semibold text-brand-navy'
                    : 'border-transparent text-brand-navy/60 hover:border-brand-gold/40 hover:text-brand-navy'
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
