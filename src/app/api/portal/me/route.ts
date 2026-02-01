/**
 * Portal Me API
 * 
 * GET /api/portal/me - Get current client profile
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getClientByClerkId } from '@/lib/portal-db';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await getClientByClerkId(userId);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: client.id,
        company_name: client.company_name,
        primary_contact_name: client.primary_contact_name,
        email: client.email,
        phone: client.phone,
        status: client.status,
      },
    });
  } catch (error) {
    console.error('Error fetching client profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
