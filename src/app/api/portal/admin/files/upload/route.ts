/**
 * Admin File Upload API
 * 
 * POST /api/portal/admin/files/upload - Upload files to a specific client (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { put } from '@vercel/blob';
import { 
  getClientById,
  createFile,
  logActivity 
} from '@/lib/portal-db';
import type { FileFolderCategory } from '@/types/portal';

const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').map(id => id.trim());

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 10;
const ALLOWED_TYPES = [
  'application/pdf',
];

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const clientId = formData.get('clientId') as string;
    const category = (formData.get('category') as FileFolderCategory) || 'invoices';

    // Validate client ID
    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await getClientById(clientId);
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Validate files
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 }
      );
    }

    const uploadedFiles: { id: string; name: string; url: string }[] = [];
    const errors: { name: string; error: string }[] = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push({ name: file.name, error: 'Only PDF files are allowed for invoices' });
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push({ name: file.name, error: 'File too large (max 10MB)' });
        continue;
      }

      try {
        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const blobPath = `portal/${clientId}/${category}/${timestamp}-${sanitizedName}`;

        // Upload to Vercel Blob
        const blob = await put(blobPath, file, {
          access: 'public',
          addRandomSuffix: false,
        });

        // Create file record in database
        const fileRecord = await createFile({
          client_id: clientId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          blob_url: blob.url,
          folder_category: category,
          uploaded_by: 'admin',
          visible_to_client: true,
        });

        uploadedFiles.push({
          id: fileRecord.id,
          name: file.name,
          url: blob.url,
        });

        // Log activity
        await logActivity({
          client_id: clientId,
          action_type: 'file_uploaded',
          description: `Invoice uploaded: ${file.name}`,
          actor_type: 'admin',
          actor_name: 'Admin',
        });
      } catch (uploadError) {
        console.error(`Error uploading ${file.name}:`, uploadError);
        errors.push({ name: file.name, error: 'Upload failed' });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        files: uploadedFiles,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
