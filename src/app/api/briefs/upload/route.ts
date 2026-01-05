/**
 * File Upload API Route
 * 
 * Handles file uploads to Vercel Blob storage.
 * POST /api/briefs/upload
 * 
 * Accepts multipart form data with files.
 * Returns array of uploaded file URLs.
 * 
 * Limits:
 * - Max 5 files
 * - Max 10MB per file
 * - Allowed types: .pdf, .doc, .docx, .png, .jpg, .jpeg, .zip
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  uploadFiles,
  validateFile,
  MAX_FILES,
  ALLOWED_EXTENSIONS,
} from '@/lib/blob';

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    // Check if files were provided
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Check file count
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        {
          success: false,
          error: `Maximum ${MAX_FILES} files allowed. You uploaded ${files.length}.`,
        },
        { status: 400 }
      );
    }

    // Validate all files first
    const validationErrors: string[] = [];
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(error);
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'File validation failed',
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Upload files to Vercel Blob
    const result = await uploadFiles(files);

    // Check for upload errors
    if (result.errors.length > 0 && result.successful.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'All file uploads failed',
          errors: result.errors.map((e) => e.error),
        },
        { status: 500 }
      );
    }

    // Return results
    return NextResponse.json({
      success: true,
      files: result.successful,
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process upload. Please try again.' },
      { status: 500 }
    );
  }
}

// Return allowed file types info
export async function GET() {
  return NextResponse.json({
    maxFiles: MAX_FILES,
    maxFileSize: '10MB',
    allowedExtensions: ALLOWED_EXTENSIONS,
  });
}


