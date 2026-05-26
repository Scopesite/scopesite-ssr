/**
 * Portal File Upload API
 * 
 * POST /api/portal/files/upload - Upload files to Vercel Blob
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { put } from '@vercel/blob';
import {
  getClientByClerkId,
  getClientById,
  getChangeRequestById,
  createFile,
  logActivity,
} from '@/lib/portal-db';
import { isPortalAdmin } from '@/lib/portal-auth';
import type { FileFolderCategory } from '@/types/portal';

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;
const ALLOWED_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/zip',
  // Images
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  // Fonts
  'font/ttf',
  'font/otf',
  'font/woff',
  'font/woff2',
  'application/x-font-ttf',
  'application/x-font-otf',
  'application/font-woff',
  'application/font-woff2',
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

    const formData = await request.formData();
    const formClientId = formData.get('clientId') as string | null;
    const admin = isPortalAdmin(userId);

    let client = await getClientByClerkId(userId);

    if (admin && formClientId) {
      const target = await getClientById(formClientId);
      if (!target) {
        return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
      }
      client = target;
    } else if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const uploadedByRole: 'client' | 'admin' = admin && formClientId ? 'admin' : 'client';
    const files = formData.getAll('files') as File[];
    const changeRequestId = formData.get('changeRequestId') as string | null;
    const category = (formData.get('category') as FileFolderCategory) || 'change_requests';

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

    // If linked to a change request, verify ownership
    if (changeRequestId) {
      const changeRequest = await getChangeRequestById(changeRequestId);
      if (!changeRequest || changeRequest.client_id !== client.id) {
        return NextResponse.json(
          { success: false, error: 'Invalid change request' },
          { status: 400 }
        );
      }
    }

    const uploadedFiles: { id: string; name: string; url: string }[] = [];
    const errors: { name: string; error: string }[] = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push({ name: file.name, error: 'File type not allowed' });
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
        const blobPath = `portal/${client.id}/${timestamp}-${sanitizedName}`;

        // Upload to Vercel Blob
        const blob = await put(blobPath, file, {
          access: 'public',
          addRandomSuffix: false,
        });

        // Create file record in database
        const fileRecord = await createFile({
          client_id: client.id,
          change_request_id: changeRequestId || undefined,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          blob_url: blob.url,
          folder_category: category,
          uploaded_by: uploadedByRole,
          visible_to_client: true,
        });

        uploadedFiles.push({
          id: fileRecord.id,
          name: file.name,
          url: blob.url,
        });

        // Log activity
        await logActivity({
          client_id: client.id,
          change_request_id: changeRequestId || undefined,
          action_type: 'file_uploaded',
          description: `File uploaded: ${file.name}`,
          actor_type: 'client',
          actor_name: client.primary_contact_name,
        });
      } catch (uploadError) {
        console.error(`Error uploading ${file.name}:`, uploadError);
        errors.push({ name: file.name, error: 'Upload failed' });
      }
    }

    // TODO: Add Trello comment with file links (Phase 4)

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

// GET - Return upload limits and allowed types
export async function GET() {
  return NextResponse.json({
    maxFileSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    allowedTypes: ALLOWED_TYPES,
    allowedExtensions: ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.zip', '.txt', '.ttf', '.otf', '.woff', '.woff2'],
  });
}
