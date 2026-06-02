import Link from 'next/link';
import { getAllGlossaryTermsSafe } from '@/lib/glossary-db';
import {
  getPublishedGlossarySlugs,
  listGlossaryFrontmatter,
} from '@/lib/glossary-mdx';

interface RelatedTermsProps {
  slugs: string[];
  currentSlug: string;
}

export async function RelatedTerms({ slugs, currentSlug }: RelatedTermsProps) {
  const published = new Set(await getPublishedGlossarySlugs());
  const [articles, dictionary] = await Promise.all([
    listGlossaryFrontmatter(),
    getAllGlossaryTermsSafe(),
  ]);

  const titleBySlug = new Map(articles.map((article) => [article.slug, article.term]));
  const termBySlug = new Map(dictionary.map((entry) => [entry.slug, entry.term]));

  const items = slugs
    .filter((slug) => slug !== currentSlug && published.has(slug))
    .map((slug) => ({
      slug,
      label: titleBySlug.get(slug) ?? termBySlug.get(slug) ?? slug,
    }));

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-brand-navy/10 pt-8">
      <h2 className="mb-4 font-headline text-2xl text-brand-navy">
        Related terms
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/glossary/${item.slug}`}
              className="block rounded-xl border border-brand-navy/10 bg-white px-4 py-3 text-brand-navy shadow-sm transition hover:border-brand-gold/60 hover:shadow-md"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
