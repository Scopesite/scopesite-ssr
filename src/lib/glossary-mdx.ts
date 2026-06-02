import { readFile, readdir } from 'fs/promises';
import path from 'path';
import type { ReactElement } from 'react';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { createGlossaryMdxComponents } from '@/components/glossary/mdx-components';
import { getAllGlossaryTermsSafe, type GlossaryTerm } from './glossary-db';
import { rehypeGlossaryPopups } from './rehype-glossary-popups';
import {
  rehypeCollectHeadings,
  type GlossaryHeading,
} from './rehype-collect-headings';

const CONTENT_DIR = path.join(process.cwd(), 'content/scopesite-intel-deck');

export interface GlossaryCitation {
  name: string;
  url: string;
}

export interface GlossaryStat {
  value: string;
  label: string;
  source: string;
}

export interface GlossaryArticleFrontmatter {
  term: string;
  slug: string;
  alternateName?: string;
  definition: string;
  metaDescription: string;
  featureImage: string;
  featureAlt: string;
  inlineImage: string;
  inlineAlt: string;
  relatedSlugs: string[];
  citations: GlossaryCitation[];
  author: string;
  publishDate: string;
  pageConfidence?: string;
  prerequisiteSlug?: string;
  stats?: GlossaryStat[];
}

export interface GlossaryMdxArticle {
  frontmatter: GlossaryArticleFrontmatter;
  content: ReactElement;
  matchedTerms: GlossaryTerm[];
  headings: GlossaryHeading[];
}

function extractFrontmatterField(source: string, field: string): string | undefined {
  const match = source.match(
    new RegExp(`^${field}:\\s*"(.*?)"`, 'm')
  );
  return match?.[1];
}

export async function listGlossarySlugs(): Promise<string[]> {
  const entries = await readdir(CONTENT_DIR);
  return entries
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
    .sort();
}

export async function readGlossarySource(slug: string): Promise<string | null> {
  try {
    return await readFile(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf8');
  } catch {
    return null;
  }
}

export async function getGlossaryFrontmatter(
  slug: string
): Promise<GlossaryArticleFrontmatter | null> {
  const source = await readGlossarySource(slug);
  if (!source) return null;

  const { frontmatter } = await compileMDX<GlossaryArticleFrontmatter>({
    source,
    options: { parseFrontmatter: true },
    components: {},
  });

  return frontmatter;
}

export async function listGlossaryFrontmatter(): Promise<GlossaryArticleFrontmatter[]> {
  const slugs = await listGlossarySlugs();
  const articles = await Promise.all(
    slugs.map(async (slug) => getGlossaryFrontmatter(slug))
  );
  return articles.filter(
    (article): article is GlossaryArticleFrontmatter => article !== null
  );
}

export async function getGlossaryMdx(
  slug: string
): Promise<GlossaryMdxArticle | null> {
  const source = await readGlossarySource(slug);
  if (!source) return null;

  const matchedTerms: GlossaryTerm[] = [];
  const headings: GlossaryHeading[] = [];
  const terms = await getAllGlossaryTermsSafe();
  const currentTerm = extractFrontmatterField(source, 'term');
  const alternateName = extractFrontmatterField(source, 'alternateName');

  const { content, frontmatter } = await compileMDX<GlossaryArticleFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeGlossaryPopups,
            {
              terms,
              currentSlug: slug,
              alternateName,
              currentTerm,
              matchedTerms,
            },
          ],
          [rehypeCollectHeadings, headings],
        ],
      },
    },
    components: createGlossaryMdxComponents(),
  });

  return {
    frontmatter,
    content,
    matchedTerms,
    headings,
  };
}

export function hasGlossaryMdx(slug: string): Promise<boolean> {
  return readGlossarySource(slug).then((source) => source !== null);
}
