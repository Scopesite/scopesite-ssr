import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { GhostPost } from './ghost';
import {
  extractMentionsFromContent,
  generateBlogPostingSchema,
} from './schema';

const URL = 'https://scopesite.co.uk/blog/website-audit-tools-for-beginners';

function post(overrides: Partial<GhostPost> = {}): GhostPost {
  return {
    id: 'p1',
    uuid: 'u1',
    slug: 'website-audit-tools-for-beginners',
    title: '10 website audit tools for beginners: our practical picks',
    meta_title: '10 Website Audit Tools for Beginners | ScopeSite',
    html: '<p>One two three four five.</p>',
    featured: false,
    published_at: '2026-11-19T11:42:00.000+00:00',
    updated_at: '2026-11-19T11:42:00.000+00:00',
    reading_time: 5,
    ...overrides,
  };
}

function nodes(value: unknown, found: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(value)) value.forEach(item => nodes(item, found));
  else if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if ('@type' in record) found.push(record);
    Object.values(record).forEach(item => nodes(item, found));
  }
  return found;
}

describe('BlogPosting headline', () => {
  it('is the title printed on the page, not the SEO title with its brand suffix', () => {
    const schema = generateBlogPostingSchema(post(), URL);
    expect(schema.headline).toBe('10 website audit tools for beginners: our practical picks');
    expect(schema.name).toBe('10 website audit tools for beginners: our practical picks');
    expect(JSON.stringify(schema)).not.toContain('| ScopeSite');
  });

  it('stays the post title when the page supplies its SEO description', () => {
    const schema = generateBlogPostingSchema(post(), URL, undefined, { description: 'Compare ten tools.' });
    expect(schema.headline).toBe('10 website audit tools for beginners: our practical picks');
    expect(schema.description).toBe('Compare ten tools.');
  });

  it('cannot be overridden by a caller passing an SEO title', () => {
    const untyped = { headline: 'Override | ScopeSite', description: 'Compare ten tools.' } as { description: string };
    const schema = generateBlogPostingSchema(post(), URL, undefined, untyped);
    expect(schema.headline).toBe('10 website audit tools for beginners: our practical picks');
  });

  it('is not passed an SEO title by the blog page', () => {
    const page = fs.readFileSync(path.join(import.meta.dirname, '../app/(content)/blog/[slug]/page.tsx'), 'utf8');
    const call = page.slice(page.indexOf('generateBlogPostingSchema(post, pageUrl'));
    expect(call.slice(0, call.indexOf('});'))).not.toMatch(/headline/);
  });
});

describe('BlogPosting wordCount', () => {
  it('does not present a reading-time estimate as a measured word count', () => {
    for (const reading_time of [0, 1, 5, 9]) {
      const schema = generateBlogPostingSchema(post({ reading_time }), URL);
      expect(schema).not.toHaveProperty('wordCount');
      if (reading_time) expect(schema.timeRequired).toBe(`PT${reading_time}M`);
    }
  });

  it('also omits the optional count for missing and markup-heavy bodies', () => {
    for (const html of [undefined, '', '<p>hel<strong>lo</strong> caf&eacute; &eacute;</p>']) {
      const schema = generateBlogPostingSchema(post({ html }), URL);
      expect(schema).not.toHaveProperty('wordCount');
      expect(schema.timeRequired).toBe('PT5M');
    }
  });
});
describe('tools mentioned in an article', () => {
  it('describes Schema.org as a Thing, as it does every other vocabulary or tool', () => {
    const mention = extractMentionsFromContent('<p>Use the Schema.org validator.</p>').find(m => m.name === 'Schema.org');
    expect(mention).toEqual({ name: 'Schema.org', type: 'Thing', description: 'Structured data vocabulary' });
  });

  it('never emits a WebSite node from a mention', () => {
    const html =
      '<p>Schema.org, JSON-LD, Google, Bing, WordPress, Wix, Squarespace, PageSpeed Insights, Lighthouse, Ahrefs, Semrush, ChatGPT, Claude and Gemini.</p>';
    const schema = generateBlogPostingSchema(post({ html }), URL);
    const mentions = schema.mentions as Array<Record<string, unknown>>;
    expect(mentions.map(m => m.name)).toContain('Schema.org');
    expect(nodes(schema).filter(node => node['@type'] === 'WebSite')).toEqual([]);
  });

  it('gives every node that claims to be a website a url', () => {
    const html = '<p>Schema.org and Google.</p>';
    for (const node of nodes(generateBlogPostingSchema(post({ html }), URL))) {
      if (node['@type'] === 'WebSite') expect(node.url).toBeTruthy();
    }
  });
});
