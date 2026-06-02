/**
 * Rehype plugin: wraps the first occurrence of each glossary term in GlossaryPopup.
 */

import type { Element, ElementContent, Root, Text } from 'hast';
import type { GlossaryTerm } from './glossary-db';

const SKIP_TAGS = new Set([
  'a',
  'code',
  'pre',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'script',
  'style',
  'textarea',
]);

export interface RehypeGlossaryPopupsOptions {
  terms: GlossaryTerm[];
  currentSlug: string;
  alternateName?: string;
  currentTerm?: string;
  matchedTerms: GlossaryTerm[];
}

interface TermPattern {
  term: GlossaryTerm;
  regex: RegExp;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getClassNames(element: Element): string[] {
  const className = element.properties?.className;
  if (Array.isArray(className)) {
    return className.map(String);
  }
  if (typeof className === 'string') {
    return className.split(/\s+/);
  }
  return [];
}

function hasGlossaryDefinitionClass(element: Element): boolean {
  return getClassNames(element).includes('glossary-definition');
}

function shouldSkipElement(element: Element): boolean {
  if (SKIP_TAGS.has(element.tagName)) return true;
  if (hasGlossaryDefinitionClass(element)) return true;
  return false;
}

function buildTermPatterns(
  terms: GlossaryTerm[],
  options: RehypeGlossaryPopupsOptions
): TermPattern[] {
  const skipLabels = new Set<string>();

  if (options.currentTerm) {
    skipLabels.add(options.currentTerm.toLowerCase());
  }
  if (options.alternateName) {
    skipLabels.add(options.alternateName.toLowerCase());
  }

  return terms
    .filter((term) => term.slug !== options.currentSlug)
    .filter((term) => !skipLabels.has(term.term.toLowerCase()))
    .sort((a, b) => b.term.length - a.term.length)
    .map((term) => ({
      term,
      regex: new RegExp(`(?<![\\w-])${escapeRegex(term.term)}(?![\\w-])`, 'i'),
    }));
}

function createMdxJsxAttribute(name: string, value: string) {
  return {
    type: 'mdxJsxAttribute' as const,
    name,
    value,
  };
}

function createGlossaryPopupNode(term: GlossaryTerm, matchedText: string) {
  return {
    type: 'mdxJsxTextElement' as const,
    name: 'GlossaryPopup',
    attributes: [
      createMdxJsxAttribute('term', term.term),
      createMdxJsxAttribute('definition', term.definition),
      createMdxJsxAttribute('href', `/glossary/${term.slug}`),
    ],
    children: [{ type: 'text' as const, value: matchedText }],
  };
}

function splitTextWithTerms(
  text: string,
  patterns: TermPattern[],
  matchedSlugs: Set<string>,
  matchedTerms: GlossaryTerm[]
): ElementContent[] {
  if (!text) return [];

  let earliestMatch: {
    index: number;
    length: number;
    pattern: TermPattern;
    matchedText: string;
  } | null = null;

  for (const pattern of patterns) {
    if (matchedSlugs.has(pattern.term.slug)) continue;

    const match = pattern.regex.exec(text);
    if (!match || match.index === undefined) continue;

    if (
      !earliestMatch ||
      match.index < earliestMatch.index ||
      (match.index === earliestMatch.index &&
        match[0].length > earliestMatch.length)
    ) {
      earliestMatch = {
        index: match.index,
        length: match[0].length,
        pattern,
        matchedText: match[0],
      };
    }
  }

  if (!earliestMatch) {
    return [{ type: 'text', value: text }];
  }

  const before = text.slice(0, earliestMatch.index);
  const after = text.slice(earliestMatch.index + earliestMatch.length);

  matchedSlugs.add(earliestMatch.pattern.term.slug);
  matchedTerms.push(earliestMatch.pattern.term);

  const nodes: ElementContent[] = [];
  if (before) nodes.push({ type: 'text', value: before });
  nodes.push(
    createGlossaryPopupNode(
      earliestMatch.pattern.term,
      earliestMatch.matchedText
    ) as ElementContent
  );
  nodes.push(...splitTextWithTerms(after, patterns, matchedSlugs, matchedTerms));

  return nodes;
}

function processElementChildren(
  element: Element,
  patterns: TermPattern[],
  matchedSlugs: Set<string>,
  matchedTerms: GlossaryTerm[],
  skip: boolean
): void {
  const nextSkip = skip || shouldSkipElement(element);
  const nextChildren: ElementContent[] = [];

  for (const child of element.children) {
    if (child.type === 'element') {
      processElementChildren(
        child,
        patterns,
        matchedSlugs,
        matchedTerms,
        nextSkip
      );
      nextChildren.push(child);
      continue;
    }

    if (child.type !== 'text') {
      nextChildren.push(child);
      continue;
    }

    if (nextSkip) {
      nextChildren.push(child);
      continue;
    }

    nextChildren.push(
      ...splitTextWithTerms(
        (child as Text).value,
        patterns,
        matchedSlugs,
        matchedTerms
      )
    );
  }

  element.children = nextChildren;
}

export function rehypeGlossaryPopups(options: RehypeGlossaryPopupsOptions) {
  const matchedSlugs = new Set<string>();
  const patterns = buildTermPatterns(options.terms, options);

  return (tree: Root) => {
    for (const child of tree.children) {
      if (child.type === 'element') {
        processElementChildren(
          child,
          patterns,
          matchedSlugs,
          options.matchedTerms,
          false
        );
      }
    }
  };
}
