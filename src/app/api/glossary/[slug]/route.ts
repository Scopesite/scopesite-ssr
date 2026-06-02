import { NextResponse } from 'next/server';
import { getGlossaryTermBySlug } from '@/lib/glossary-db';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const term = await getGlossaryTermBySlug(slug);

    if (!term) {
      return NextResponse.json(
        { error: 'Glossary term not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(term);
  } catch (error) {
    console.error('Error fetching glossary term:', error);
    return NextResponse.json(
      { error: 'Failed to fetch glossary term' },
      { status: 500 }
    );
  }
}
