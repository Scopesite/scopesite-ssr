import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGlossaryTermsSafe } from '@/lib/glossary-db';
import type { GlossaryTerm } from '@/lib/glossary-db';
import { JsonLd } from '@/components/JsonLd';
import { generateGlossaryDefinedTermSetSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Glossary | ScopeSite',
  description:
    'Plain-English definitions of the web, SEO and AI search terms we use, from structured data to generative engine optimisation.',
};

const CATEGORY_ORDER = ['AI Search', 'Structured Data', 'SEO'];
const FALLBACK_CATEGORY = 'Other';

function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface CategoryGroup {
  category: string;
  slug: string;
  terms: GlossaryTerm[];
}

function groupByCategory(terms: GlossaryTerm[]): CategoryGroup[] {
  const buckets = new Map<string, GlossaryTerm[]>();

  for (const term of terms) {
    const key = term.category ?? FALLBACK_CATEGORY;
    const bucket = buckets.get(key) ?? [];
    bucket.push(term);
    buckets.set(key, bucket);
  }

  const orderedKeys = [
    ...CATEGORY_ORDER.filter((key) => buckets.has(key)),
    ...[...buckets.keys()]
      .filter((key) => !CATEGORY_ORDER.includes(key))
      .sort((a, b) => a.localeCompare(b)),
  ];

  return orderedKeys.map((category) => ({
    category,
    slug: categorySlug(category),
    terms: (buckets.get(category) ?? []).sort((a, b) =>
      a.term.localeCompare(b.term)
    ),
  }));
}

export default async function GlossaryIndexPage() {
  const terms = await getAllGlossaryTermsSafe();
  const setSchema = generateGlossaryDefinedTermSetSchema(terms);
  const groups = groupByCategory(terms);

  return (
    <>
      <JsonLd schema={setSchema} />
      <main className="container-content py-section">
        <header className="max-w-2xl">
          <h1>Glossary</h1>
          <p className="mt-4 text-lg text-brand-navy/70">
            Plain-English definitions of the web, SEO and AI search terms we
            use, from structured data to generative engine optimisation.
          </p>
          <p className="mt-3 text-sm font-medium uppercase tracking-wide text-brand-navy/45">
            {terms.length} {terms.length === 1 ? 'term' : 'terms'}
          </p>
        </header>

        {groups.length > 1 && (
          <nav aria-label="Browse by category" className="mt-8">
            <ul className="flex flex-wrap gap-3">
              {groups.map((group) => (
                <li key={group.slug}>
                  <Link
                    href={`#${group.slug}`}
                    className="link-navy inline-flex min-h-[44px] items-center rounded-full border border-brand-navy/15 bg-white px-4 py-2 text-sm font-semibold text-brand-navy no-underline transition hover:border-brand-gold/60 hover:bg-brand-gold/[0.08]"
                  >
                    {group.category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mt-12 space-y-14">
          {groups.map((group) => (
            <section
              key={group.slug}
              id={group.slug}
              aria-labelledby={`${group.slug}-heading`}
              className="scroll-mt-24"
            >
              <h2
                id={`${group.slug}-heading`}
                className="mb-6 font-headline text-2xl font-bold text-brand-navy sm:text-3xl"
              >
                {group.category}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.terms.map((term) => (
                  <li key={term.slug}>
                    <Link
                      href={`/glossary/${term.slug}`}
                      className="link-navy group flex h-full flex-col gap-2 rounded-xl border border-brand-navy/10 bg-white p-5 no-underline shadow-sm transition hover:-translate-y-1 hover:border-brand-gold/60 hover:shadow-md"
                    >
                      <span className="font-headline text-lg font-bold text-brand-navy">
                        {term.term}
                      </span>
                      <span className="text-sm leading-snug text-brand-navy/70">
                        {term.definition}
                      </span>
                      <span className="mt-auto pt-1 text-xs font-medium uppercase tracking-wide text-brand-navy/45">
                        {term.category ?? FALLBACK_CATEGORY}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
