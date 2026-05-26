/**
 * Admin client search for typeahead (on-behalf request form)
 * GET /api/portal/admin/clients/search?q=
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAllClients } from '@/lib/portal-db';
import { isPortalAdmin } from '@/lib/portal-auth';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId || !isPortalAdmin(userId)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';
    const clients = await getAllClients();

    const filtered = clients
      .filter((c) => {
        if (!q) return true;
        return (
          c.company_name.toLowerCase().includes(q) ||
          c.primary_contact_name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        );
      })
      .slice(0, 25)
      .map((c) => ({
        id: c.id,
        company_name: c.company_name,
        primary_contact_name: c.primary_contact_name,
        email: c.email,
      }));

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Error searching clients:', error);
    return NextResponse.json({ success: false, error: 'Failed to search clients' }, { status: 500 });
  }
}
