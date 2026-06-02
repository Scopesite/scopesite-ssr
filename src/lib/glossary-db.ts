/**
 * Glossary Database Functions
 *
 * Database operations for the glossary feature.
 * Uses the existing Neon Postgres connection from db.ts.
 */

import { getDb } from './db';

export interface GlossaryTerm {
  id: number;
  term: string;
  slug: string;
  definition: string;
  display_title: string | null;
  category: string | null;
  related_slugs: string[];
  created_at: Date;
  updated_at: Date;
}

export interface NewGlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  display_title?: string | null;
  category?: string;
  related_slugs?: string[];
}

function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Human-readable label for related-term cards and popups. */
export function getGlossaryDisplayLabel(
  entry: Pick<GlossaryTerm, 'display_title' | 'term' | 'slug'>
): string {
  return entry.display_title ?? entry.term ?? slugToLabel(entry.slug);
}

const BASE_GLOSSARY_SEED: NewGlossaryTerm[] = [
  {
    term: 'JSON Schema',
    slug: 'json-schema',
    definition:
      'A way of describing the structure of JSON data so machines can understand and validate it.',
    category: 'Structured Data',
    related_slugs: ['structured-data'],
  },
  {
    term: 'Structured Data',
    slug: 'structured-data',
    definition:
      'Information on a web page organised in a standard format so search engines and AI can read it accurately.',
    category: 'Structured Data',
    related_slugs: ['json-schema', 'schema-markup'],
  },
  {
    term: 'Schema Markup',
    slug: 'schema-markup',
    definition:
      'Code added to a website that labels its content so search engines and AI assistants know what each part means.',
    category: 'Structured Data',
    related_slugs: ['structured-data'],
  },
];

export const INTEL_DECK_GLOSSARY_SEED: NewGlossaryTerm[] = [
  {
    term: 'Generative Engine Optimisation',
    slug: 'generative-engine-optimisation',
    definition:
      'Getting your business named inside the AI-written answer at the top of search, rather than just ranking in the blue links below it.',
    category: 'AI Search',
    related_slugs: [
      'answer-engine-optimisation',
      'ai-overviews',
      'ai-citation',
      'llms-txt',
      'robots-txt-for-ai-bots',
    ],
  },
  {
    term: 'Answer Engine Optimisation',
    slug: 'answer-engine-optimisation',
    definition:
      'Writing your pages so a search engine can lift your words straight into the answer box at the top, without the reader needing to click through.',
    category: 'AI Search',
    related_slugs: [
      'generative-engine-optimisation',
      'ai-overviews',
      'query-fan-out',
      'ai-citation',
      'ai-mode',
    ],
  },
  {
    term: 'AI Overviews',
    slug: 'ai-overviews',
    definition:
      "Google's AI-generated answer box that sits above the normal blue links and answers the question directly.",
    category: 'AI Search',
    related_slugs: ['generative-engine-optimisation'],
  },
  {
    term: 'Featured snippet',
    slug: 'featured-snippet',
    display_title: 'Featured snippet',
    definition:
      'The short, direct answer Google lifts from a single page and shows in a box at the very top of the results, also called position zero.',
    category: 'SEO',
    related_slugs: ['answer-engine-optimisation'],
  },
  {
    term: 'Query Fan-out',
    slug: 'query-fan-out',
    display_title: 'Query Fan-out',
    definition:
      'When an AI search expands one question into several related sub-queries before stitching the answer together.',
    category: 'AI Search',
    related_slugs: ['answer-engine-optimisation'],
  },
  {
    term: 'AI Mode',
    slug: 'ai-mode',
    display_title: 'AI Mode',
    definition:
      "Google's AI-powered search interface that answers questions in a conversational panel instead of only listing links.",
    category: 'AI Search',
    related_slugs: ['answer-engine-optimisation'],
  },
  {
    term: 'Schema',
    slug: 'schema',
    definition:
      'Hidden code on a page that labels what each part means, so machines can read it accurately.',
    category: 'Structured Data',
    related_slugs: ['structured-data', 'schema-markup'],
  },
  {
    term: 'Indexed',
    slug: 'indexed',
    definition:
      "Stored in a search engine's library of pages, so it's eligible to be shown or quoted in results.",
    category: 'SEO',
    related_slugs: ['generative-engine-optimisation'],
  },
  {
    term: 'Search Engine Optimisation',
    slug: 'search-engine-optimisation',
    definition:
      'The older craft of getting a page to rank in the ten blue links, as opposed to inside the AI answer.',
    category: 'SEO',
    related_slugs: ['generative-engine-optimisation'],
  },
  {
    term: 'AI Answer',
    slug: 'ai-answer',
    definition:
      'The written response an AI engine builds at the top of the results instead of just listing links.',
    category: 'AI Search',
    related_slugs: ['generative-engine-optimisation', 'ai-overviews'],
  },
  {
    term: 'AI Citation',
    slug: 'ai-citation',
    display_title: 'AI Citation',
    definition:
      'When an AI answer names or quotes your site as the source it used to build the reply.',
    category: 'AI Search',
    related_slugs: ['generative-engine-optimisation'],
  },
  {
    term: 'llms.txt',
    slug: 'llms-txt',
    display_title: 'llms.txt',
    definition:
      'A plain-text file at /llms.txt that tells AI crawlers what your site is and which pages matter most.',
    category: 'AI Search',
    related_slugs: ['generative-engine-optimisation'],
  },
  {
    term: 'robots.txt for AI bots',
    slug: 'robots-txt-for-ai-bots',
    display_title: 'robots.txt for AI bots',
    definition:
      'Rules in robots.txt that say which AI crawlers may read your site and which paths they should skip.',
    category: 'AI Search',
    related_slugs: ['generative-engine-optimisation'],
  },
];

function toStaticGlossaryTerm(
  entry: NewGlossaryTerm,
  index: number
): GlossaryTerm {
  const now = new Date('2026-06-01T00:00:00.000Z');
  return {
    id: index + 1,
    term: entry.term,
    slug: entry.slug,
    definition: entry.definition,
    display_title: entry.display_title ?? null,
    category: entry.category ?? null,
    related_slugs: entry.related_slugs ?? [],
    created_at: now,
    updated_at: now,
  };
}

export const STATIC_GLOSSARY_TERMS: GlossaryTerm[] = [
  ...BASE_GLOSSARY_SEED,
  ...INTEL_DECK_GLOSSARY_SEED,
].map(toStaticGlossaryTerm);

async function insertGlossaryTerm(entry: NewGlossaryTerm): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO glossary_terms (term, slug, definition, display_title, category, related_slugs)
    VALUES (
      ${entry.term},
      ${entry.slug},
      ${entry.definition},
      ${entry.display_title ?? null},
      ${entry.category ?? null},
      ${entry.related_slugs ?? []}
    )
    ON CONFLICT (slug) DO UPDATE SET
      term = EXCLUDED.term,
      definition = EXCLUDED.definition,
      display_title = EXCLUDED.display_title,
      category = EXCLUDED.category,
      related_slugs = EXCLUDED.related_slugs,
      updated_at = NOW()
  `;
}

/**
 * Initialize the glossary_terms table
 */
export async function initializeGlossaryTable(): Promise<void> {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS glossary_terms (
      id SERIAL PRIMARY KEY,
      term TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      definition TEXT NOT NULL,
      category TEXT,
      related_slugs TEXT[] NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE glossary_terms
    ADD COLUMN IF NOT EXISTS display_title TEXT
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_glossary_terms_slug ON glossary_terms(slug)
  `;
}

/**
 * Get all glossary terms
 */
export async function getAllGlossaryTerms(): Promise<GlossaryTerm[]> {
  const sql = getDb();
  const result = await sql`
    SELECT * FROM glossary_terms
    ORDER BY term ASC
  `;

  return result as GlossaryTerm[];
}

/**
 * DB-backed glossary terms with a static seed fallback for build/prerender
 * when DATABASE_URL is unavailable locally.
 */
export async function getAllGlossaryTermsSafe(): Promise<GlossaryTerm[]> {
  try {
    return await getAllGlossaryTerms();
  } catch (error) {
    console.warn('Using static glossary fallback terms:', error);
    return STATIC_GLOSSARY_TERMS;
  }
}

/**
 * Get a glossary term by slug
 */
export async function getGlossaryTermBySlug(
  slug: string
): Promise<GlossaryTerm | null> {
  try {
    const sql = getDb();
    const result = (await sql`
      SELECT * FROM glossary_terms
      WHERE slug = ${slug}
      LIMIT 1
    `) as GlossaryTerm[];

    return result[0] || null;
  } catch (error) {
    console.warn(`Using static glossary fallback for slug "${slug}":`, error);
    return STATIC_GLOSSARY_TERMS.find((term) => term.slug === slug) ?? null;
  }
}

/**
 * Seed initial glossary terms (idempotent)
 */
export async function seedGlossaryTerms(): Promise<void> {
  for (const entry of BASE_GLOSSARY_SEED) {
    await insertGlossaryTerm(entry);
  }

  await seedIntelDeckGlossaryTerms();
}

/**
 * Popup dictionary + Intel Deck glossary terms.
 * Idempotent upsert — safe to run on every db:init.
 */
export async function seedIntelDeckGlossaryTerms(): Promise<void> {
  for (const entry of INTEL_DECK_GLOSSARY_SEED) {
    await insertGlossaryTerm(entry);
  }
}
