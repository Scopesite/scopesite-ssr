import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GlossaryArticleLayout } from '@/components/glossary/GlossaryArticleLayout';
import { JsonLd } from '@/components/JsonLd';
import { getGlossaryMdx, listGlossarySlugs } from '@/lib/glossary-mdx';
import { getGlossaryTermBySlug } from '@/lib/glossary-db';
import {
  generateGlossaryArticleGraph,
  generateGlossaryDefinedTermSchema,
} from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';

interface GlossaryTermPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await listGlossarySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GlossaryTermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getGlossaryMdx(slug);

  if (article) {
    const { frontmatter } = article;
    const pageUrl = `${BASE_URL}/glossary/${frontmatter.slug}`;

    return {
      title: `${frontmatter.term} | ScopeSite Glossary`,
      description: frontmatter.metaDescription,
      alternates: {
        canonical: pageUrl,
      },
      openGraph: {
        title: frontmatter.term,
        description: frontmatter.metaDescription,
        url: pageUrl,
        type: 'article',
        images: [
          {
            url: `${BASE_URL}${frontmatter.featureImage}`,
            width: 1200,
            height: 630,
            alt: frontmatter.featureAlt,
          },
        ],
      },
    };
  }

  const term = await getGlossaryTermBySlug(slug);
  if (!term) {
    return {};
  }

  return {
    title: `${term.term} | ScopeSite Glossary`,
    description: term.definition,
    alternates: {
      canonical: `${BASE_URL}/glossary/${term.slug}`,
    },
  };
}

export default async function GlossaryTermPage({
  params,
}: GlossaryTermPageProps) {
  const { slug } = await params;
  const article = await getGlossaryMdx(slug);

  if (article) {
    const graph = generateGlossaryArticleGraph(
      article.frontmatter,
      article.matchedTerms
    );

    return (
      <>
        <JsonLd schema={graph} />
        <GlossaryArticleLayout
          frontmatter={article.frontmatter}
          headings={article.headings}
        >
          {article.content}
        </GlossaryArticleLayout>
      </>
    );
  }

  const term = await getGlossaryTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const termSchema = generateGlossaryDefinedTermSchema(term);

  return (
    <>
      <JsonLd schema={termSchema} />
      <main className="mx-auto max-w-[760px] px-4 py-8">
        <h1 className="mb-4 font-headline text-4xl text-brand-navy">
          {term.term}
        </h1>
        {term.category ? (
          <p className="mb-4 text-sm uppercase tracking-wide text-brand-navy/60">
            {term.category}
          </p>
        ) : null}
        <p className="glossary-definition mb-6 text-lg font-semibold text-brand-navy">
          {term.definition}
        </p>
        {term.related_slugs.length > 0 ? (
          <ul className="space-y-2">
            {term.related_slugs.map((relatedSlug) => (
              <li key={relatedSlug}>
                <Link
                  href={`/glossary/${relatedSlug}`}
                  className="text-brand-gold-accessible underline"
                >
                  {relatedSlug}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </main>
    </>
  );
}
