/**
 * Admin Client Contacts API
 * 
 * POST /api/portal/admin/contacts - Create a new contact
 * GET /api/portal/admin/contacts?clientId=xxx - Get contacts for a client
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  createClientContact,
  getContactsByClientId,
  getClientById,
  logActivity 
} from '@/lib/portal-db';

const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').map(id => id.trim());

// GET - Fetch contacts for a client
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!ADMIN_CLERK_IDS.includes(userId)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const contacts = await getContactsByClientId(clientId);

    return NextResponse.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST - Create a new contact
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!ADMIN_CLERK_IDS.includes(userId)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { client_id, name, email, phone, role, is_primary, can_access_portal, notes } = body;

    if (!client_id || !name) {
      return NextResponse.json(
        { success: false, error: 'Client ID and name are required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await getClientById(client_id);
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const contact = await createClientContact({
      client_id,
      name,
      email,
      phone,
      role,
      is_primary,
      can_access_portal,
      notes,
    });

    // Log activity
    await logActivity({
      client_id,
      action_type: 'status_changed',
      description: `Contact added: ${name}${role ? ` (${role})` : ''}`,
      actor_type: 'admin',
      actor_name: 'Admin',
    });

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
