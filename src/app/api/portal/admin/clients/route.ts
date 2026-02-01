/**
 * Admin Clients API
 * 
 * GET /api/portal/admin/clients - List all clients
 * POST /api/portal/admin/clients - Create new client
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAllClients, createClient, logActivity } from '@/lib/portal-db';
import { sendClientInvitation } from '@/lib/portal-notifications';

// Admin check
const ADMIN_CLERK_IDS = process.env.ADMIN_CLERK_IDS?.split(',') || [];

function isAdmin(userId: string): boolean {
  return ADMIN_CLERK_IDS.includes(userId);
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId || !isAdmin(userId)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const clients = await getAllClients();

    return NextResponse.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId || !isAdmin(userId)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { company_name, primary_contact_name, email, phone, hourly_rate, send_invite } = body;

    // Validation
    if (!company_name || typeof company_name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      );
    }

    if (!primary_contact_name || typeof primary_contact_name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Contact name is required' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Create the client
    const client = await createClient({
      company_name: company_name.trim(),
      primary_contact_name: primary_contact_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      hourly_rate: hourly_rate || undefined,
    });

    // Log activity
    await logActivity({
      client_id: client.id,
      action_type: 'client_created',
      description: `Client "${client.company_name}" created`,
      actor_type: 'admin',
      actor_name: 'Admin',
    });

    // Send invitation email if requested
    if (send_invite) {
      try {
        await sendClientInvitation({
          email: client.email,
          clientName: client.primary_contact_name,
          companyName: client.company_name,
        });

        await logActivity({
          client_id: client.id,
          action_type: 'client_invited',
          description: `Portal invitation sent to ${client.email}`,
          actor_type: 'admin',
          actor_name: 'Admin',
        });
      } catch (inviteError) {
        console.error('Failed to send invitation:', inviteError);
        // Don't fail the whole request, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
