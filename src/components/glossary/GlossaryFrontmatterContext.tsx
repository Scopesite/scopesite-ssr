'use client';

import Image from 'next/image';
import { createContext, useContext } from 'react';
import type { GlossaryArticleFrontmatter } from '@/lib/glossary-mdx';

const GlossaryFrontmatterContext =
  createContext<GlossaryArticleFrontmatter | null>(null);

export function GlossaryFrontmatterProvider({
  value,
  children,
}: {
  value: GlossaryArticleFrontmatter;
  children: React.ReactNode;
}) {
  return (
    <GlossaryFrontmatterContext.Provider value={value}>
      {children}
    </GlossaryFrontmatterContext.Provider>
  );
}

export function useGlossaryFrontmatter(): GlossaryArticleFrontmatter {
  const value = useContext(GlossaryFrontmatterContext);
  if (!value) {
    throw new Error('Missing glossary frontmatter context');
  }
  return value;
}

export function InlineImageFromFrontmatter() {
  const frontmatter = useGlossaryFrontmatter();

  return (
    <figure className="my-10 not-prose">
      <Image
        src={frontmatter.inlineImage}
        alt={frontmatter.inlineAlt}
        width={1200}
        height={675}
        className="h-auto w-full rounded-2xl shadow-sm"
        sizes="(max-width: 760px) 100vw, 760px"
      />
    </figure>
  );
}

export function StatCallouts() {
  const frontmatter = useGlossaryFrontmatter();
  const stats = frontmatter.stats;

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="my-10 grid gap-4 not-prose sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={`${stat.value}-${stat.label}`}
          className="flex flex-col rounded-xl border border-brand-navy/10 bg-white p-5 shadow-sm"
        >
          <span className="text-3xl font-bold leading-tight text-brand-navy">
            {stat.value}
          </span>
          <span className="mt-2 text-sm leading-snug text-brand-navy/70">
            {stat.label}
          </span>
          <span className="mt-3 text-xs font-medium uppercase tracking-wide text-brand-navy/45">
            {stat.source}
          </span>
        </div>
      ))}
    </div>
  );
}
