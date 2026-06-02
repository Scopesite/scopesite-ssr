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
  category: string | null;
  related_slugs: string[];
  created_at: Date;
  updated_at: Date;
}

export interface NewGlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  category?: string;
  related_slugs?: string[];
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
      'Generative Engine Optimisation, or GEO, is the work of getting your website mentioned inside the AI-written answers that now sit at the top of Google and inside tools like ChatGPT, so that when someone asks the machine a question, your business is part of the reply rather than buried on page two of the old blue links.',
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
    term: 'AI Overviews',
    slug: 'ai-overviews',
    definition:
      "Google's AI-generated answer box that sits above the normal blue links and answers the question directly.",
    category: 'AI Search',
    related_slugs: ['generative-engine-optimisation'],
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
    INSERT INTO glossary_terms (term, slug, definition, category, related_slugs)
    VALUES (
      ${entry.term},
      ${entry.slug},
      ${entry.definition},
      ${entry.category ?? null},
      ${entry.related_slugs ?? []}
    )
    ON CONFLICT (slug) DO NOTHING
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
 * Popup dictionary + GEO article term for the Intel Deck glossary trial.
 * Idempotent — safe to run on every db:init.
 */
export async function seedIntelDeckGlossaryTerms(): Promise<void> {
  for (const entry of INTEL_DECK_GLOSSARY_SEED) {
    await insertGlossaryTerm(entry);
  }
}
