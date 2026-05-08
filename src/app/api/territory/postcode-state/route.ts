import { NextRequest, NextResponse } from 'next/server';
import { getPostcodeDisplayState } from '@/lib/territory/postcodePricing';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get('postcode')?.trim() ?? '';
  if (!postcode) {
    return NextResponse.json({ error: 'postcode required' }, { status: 400 });
  }
  try {
    const state = await getPostcodeDisplayState(postcode);
    if (!state) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, state });
  } catch (e) {
    console.error('[postcode-state]', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
