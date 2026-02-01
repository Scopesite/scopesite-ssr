/**
 * Admin File Management API
 * 
 * DELETE /api/portal/admin/files/[id] - Delete a file (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { del } from '@vercel/blob';
import { 
  getFileById,
  deleteFile,
  logActivity 
} from '@/lib/portal-db';

const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').map(id => id.trim());

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin status
    if (!ADMIN_CLERK_IDS.includes(userId)) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id: fileId } = await params;

    // Get the file record
    const file = await getFileById(fileId);
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Delete from Vercel Blob
    try {
      await del(file.blob_url);
    } catch (blobError) {
      console.error('Error deleting from blob storage:', blobError);
      // Continue with database deletion even if blob delete fails
    }

    // Delete from database
    const deleted = await deleteFile(fileId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete file record' },
        { status: 500 }
      );
    }

    // Log activity
    await logActivity({
      client_id: file.client_id,
      action_type: 'file_deleted',
      description: `File deleted: ${file.file_name}`,
      actor_type: 'admin',
      actor_name: 'Admin',
    });

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
