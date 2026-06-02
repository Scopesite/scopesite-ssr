import { NextResponse } from 'next/server';
import { getAllGlossaryTerms } from '@/lib/glossary-db';

export async function GET() {
  try {
    const terms = await getAllGlossaryTerms();
    return NextResponse.json(terms);
  } catch (error) {
    console.error('Error fetching glossary terms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch glossary terms' },
      { status: 500 }
    );
  }
}
