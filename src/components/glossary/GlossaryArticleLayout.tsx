import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type {
  GlossaryArticleFrontmatter,
} from '@/lib/glossary-mdx';
import type { GlossaryHeading } from '@/lib/rehype-collect-headings';
import { getGlossaryTermBySlug } from '@/lib/glossary-db';
import { GlossaryFrontmatterProvider } from './GlossaryFrontmatterContext';
import { GlossaryToc } from './GlossaryToc';
import { RelatedTerms } from './RelatedTerms';

interface GlossaryArticleLayoutProps {
  frontmatter: GlossaryArticleFrontmatter;
  headings: GlossaryHeading[];
  children: ReactNode;
}

export async function GlossaryArticleLayout({
  frontmatter,
  headings,
  children,
}: GlossaryArticleLayoutProps) {
  const prerequisite = frontmatter.prerequisiteSlug
    ? await getGlossaryTermBySlug(frontmatter.prerequisiteSlug)
    : null;

  return (
    <main className="bg-white pb-16 pt-8">
      <div className="mx-auto w-full max-w-[1060px] px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,760px)_13rem] lg:justify-center lg:gap-12">
        <div className="w-full max-w-[760px]">
          {prerequisite ? (
            <p className="mb-6 text-sm text-brand-navy/70">
              Prerequisite reading: start with{' '}
              <Link
                href={`/glossary/${prerequisite.slug}`}
                className="font-medium text-brand-gold-accessible underline underline-offset-2"
              >
                {prerequisite.term}
              </Link>
            </p>
          ) : null}

          <figure className="mb-8 not-prose">
            <Image
              src={frontmatter.featureImage}
              alt={frontmatter.featureAlt}
              width={1200}
              height={630}
              priority
              className="h-auto w-full rounded-2xl shadow-sm"
              sizes="(max-width: 760px) 100vw, 760px"
            />
          </figure>

          <GlossaryFrontmatterProvider value={frontmatter}>
            <article className="glossary-article">{children}</article>
          </GlossaryFrontmatterProvider>

          <RelatedTerms slugs={frontmatter.relatedSlugs} />
        </div>

        <aside className="hidden lg:block">
          <GlossaryToc headings={headings} />
        </aside>
      </div>
    </main>
  );
}
