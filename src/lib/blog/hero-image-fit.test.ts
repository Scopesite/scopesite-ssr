import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (file: string) => fs.readFileSync(path.join(import.meta.dirname, '../..', file), 'utf8');

describe('article cover image', () => {
  const page = read('app/(content)/blog/[slug]/page.tsx');
  const start = page.indexOf('{/* Feature Image */}');
  const hero = page.slice(start, page.indexOf('{/* Post Content */}', start));

  it('is found in the article page', () => {
    expect(start).toBeGreaterThan(-1);
    expect(hero).toContain('src={post.feature_image}');
  });

  it('shows the whole artwork inside the 16:9 frame instead of cropping it', () => {
    expect(hero).toContain('className="object-contain"');
    expect(hero).not.toContain('object-cover');
  });

  it('keeps the same 16:9 rounded frame on the navy band, the same sizes and priority loading', () => {
    expect(hero).toContain('<section className="bg-brand-navy pb-8">');
    expect(hero).toContain('<div className="relative aspect-video rounded-2xl overflow-hidden">');
    expect(hero).toContain('sizes="(max-width: 768px) 100vw, 896px"');
    expect(hero).toMatch(/\bfill\b/);
    expect(hero).toMatch(/\bpriority\b/);
    expect(hero).toContain('alt={post.feature_image_alt || post.title}');
  });

  it('leaves listing cards and the author photo cropped to fill, as before', () => {
    expect(read('components/blog/BlogCard.tsx')).toContain(
      'className="object-cover transition-transform duration-500 group-hover:scale-105"'
    );
    expect(read('components/blog/AuthorBio.tsx')).toContain('className="h-20 w-20 rounded-full object-cover"');
  });

  it('uses object-contain nowhere else on the article page', () => {
    expect(page.match(/object-contain/g)).toHaveLength(1);
  });
});
