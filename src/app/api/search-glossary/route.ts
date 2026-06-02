import { NextResponse } from 'next/server';
import { listGlossaryFrontmatter } from '@/lib/glossary-mdx';
import type { SearchEntry } from '@/lib/search-index';

export async function GET() {
  try {
    const articles = await listGlossaryFrontmatter();

    const glossaryEntries: SearchEntry[] = articles.map((article) => {
      const keywords = [
        article.term,
        article.alternateName ?? '',
        ...article.term.split(/\s+/),
      ].filter((keyword): keyword is string => keyword.length > 0);

      return {
        title: article.term,
        description: article.definition,
        url: `/glossary/${article.slug}`,
        category: 'Glossary',
        keywords,
      };
    });

    return NextResponse.json(glossaryEntries);
  } catch (error) {
    console.error('Error building glossary search entries:', error);
    return NextResponse.json([], { status: 500 });
  }
}
