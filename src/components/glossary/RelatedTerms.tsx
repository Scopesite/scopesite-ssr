import Link from 'next/link';
import { STATIC_GLOSSARY_TERMS } from '@/lib/glossary-db';

interface RelatedTermsProps {
  slugs: string[];
}

function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function RelatedTerms({ slugs }: RelatedTermsProps) {
  const resolved = slugs.map((relatedSlug) => {
    const term =
      STATIC_GLOSSARY_TERMS.find((entry) => entry.slug === relatedSlug) ?? null;
    return {
      slug: relatedSlug,
      label: term?.term ?? slugToLabel(relatedSlug),
    };
  });

  return (
    <section className="mt-12 border-t border-brand-navy/10 pt-8">
      <h2 className="mb-4 font-headline text-2xl text-brand-navy">
        Related terms
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {resolved.map((item) => (
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
