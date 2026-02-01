/**
 * Admin Single Contact API
 * 
 * PATCH /api/portal/admin/contacts/[id] - Update a contact
 * DELETE /api/portal/admin/contacts/[id] - Delete a contact
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  getContactById,
  updateClientContact,
  deleteClientContact,
  logActivity 
} from '@/lib/portal-db';

const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').map(id => id.trim());

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH - Update contact
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;
    const body = await request.json();

    // Verify contact exists
    const existingContact = await getContactById(id);
    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    const updatedContact = await updateClientContact(id, body);

    if (!updatedContact) {
      return NextResponse.json(
        { success: false, error: 'Failed to update contact' },
        { status: 500 }
      );
    }

    // Log activity
    await logActivity({
      client_id: existingContact.client_id,
      action_type: 'status_changed',
      description: `Contact updated: ${updatedContact.name}`,
      actor_type: 'admin',
      actor_name: 'Admin',
    });

    return NextResponse.json({
      success: true,
      data: updatedContact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params;

    // Verify contact exists
    const existingContact = await getContactById(id);
    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Prevent deletion of last primary contact
    if (existingContact.is_primary) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the primary contact. Set another contact as primary first.' },
        { status: 400 }
      );
    }

    const deleted = await deleteClientContact(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete contact' },
        { status: 500 }
      );
    }

    // Log activity
    await logActivity({
      client_id: existingContact.client_id,
      action_type: 'status_changed',
      description: `Contact removed: ${existingContact.name}`,
      actor_type: 'admin',
      actor_name: 'Admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
