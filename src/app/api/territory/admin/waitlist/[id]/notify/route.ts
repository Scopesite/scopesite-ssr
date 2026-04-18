import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/territory/admin-session';
import { markAreaWaitlistNotified } from '@/lib/territory/queries';

export const runtime = 'nodejs';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  try {
    const ok = await markAreaWaitlistNotified(id);
    if (!ok) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/waitlist/notify] failed:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
