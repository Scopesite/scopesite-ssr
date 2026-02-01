/**
 * Admin Client Management API
 * 
 * GET /api/portal/admin/clients/[id] - Get single client
 * PATCH /api/portal/admin/clients/[id] - Update client details
 * DELETE /api/portal/admin/clients/[id] - Archive client (soft delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  getClientById,
  updateClient,
  logActivity 
} from '@/lib/portal-db';

const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').map(id => id.trim());

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch single client
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    const client = await getClientById(id);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

// PATCH - Update client details
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

    // Validate client exists
    const existingClient = await getClientById(id);
    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Extract allowed fields only
    const allowedFields = [
      'company_name',
      'primary_contact_name',
      'email',
      'phone',
      'hourly_rate',
      'status',
      'trello_list_id',
      'trello_label_id',
    ];

    const updates: Record<string, unknown> = {};
    const changedFields: string[] = [];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
        // Track what changed for activity log
        if (body[field] !== (existingClient as Record<string, unknown>)[field]) {
          changedFields.push(field);
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update client
    const updatedClient = await updateClient(id, updates);

    if (!updatedClient) {
      return NextResponse.json(
        { success: false, error: 'Failed to update client' },
        { status: 500 }
      );
    }

    // Log activity for significant changes
    if (changedFields.length > 0) {
      const fieldDescriptions = changedFields.map(field => {
        const value = updates[field];
        switch (field) {
          case 'company_name':
            return `Company name changed to "${value}"`;
          case 'primary_contact_name':
            return `Primary contact changed to "${value}"`;
          case 'email':
            return `Email changed to "${value}"`;
          case 'phone':
            return value ? `Phone updated to "${value}"` : 'Phone number removed';
          case 'hourly_rate':
            return value ? `Hourly rate set to £${value}/hr` : 'Hourly rate removed';
          case 'status':
            return `Status changed to "${value}"`;
          default:
            return `${field} updated`;
        }
      });

      await logActivity({
        client_id: id,
        action_type: 'status_changed',
        description: fieldDescriptions.join('. '),
        actor_type: 'admin',
        actor_name: 'Admin',
        metadata: { changedFields, updates },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedClient,
      message: 'Client updated successfully',
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

// DELETE - Archive client (soft delete)
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

    // Validate client exists
    const existingClient = await getClientById(id);
    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting status to 'archived'
    const archivedClient = await updateClient(id, { status: 'archived' });

    if (!archivedClient) {
      return NextResponse.json(
        { success: false, error: 'Failed to archive client' },
        { status: 500 }
      );
    }

    // Log activity
    await logActivity({
      client_id: id,
      action_type: 'status_changed',
      description: `Client "${existingClient.company_name}" archived`,
      actor_type: 'admin',
      actor_name: 'Admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Client archived successfully',
    });
  } catch (error) {
    console.error('Error archiving client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to archive client' },
      { status: 500 }
    );
  }
}
