/**
 * Vercel Blob Storage Utility
 * 
 * Handles file uploads to Vercel Blob storage.
 */

import { put, del } from '@vercel/blob';

// Allowed file types
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/zip',
  'application/x-zip-compressed',
];

// Allowed extensions
export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.zip'];

// Max file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Max number of files
export const MAX_FILES = 5;

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export interface UploadError {
  filename: string;
  error: string;
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): string | null {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File "${file.name}" exceeds maximum size of 10MB`;
  }

  // Check file type
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return `File "${file.name}" has an unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`;
  }

  return null;
}

/**
 * Upload a single file to Vercel Blob
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `briefs/${timestamp}-${sanitizedName}`;

  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
  });

  return {
    url: blob.url,
    filename: file.name,
    size: file.size,
  };
}

/**
 * Upload multiple files to Vercel Blob
 */
export async function uploadFiles(
  files: File[]
): Promise<{ successful: UploadResult[]; errors: UploadError[] }> {
  const successful: UploadResult[] = [];
  const errors: UploadError[] = [];

  // Validate file count
  if (files.length > MAX_FILES) {
    return {
      successful: [],
      errors: [{ filename: 'Multiple files', error: `Maximum ${MAX_FILES} files allowed` }],
    };
  }

  // Process each file
  for (const file of files) {
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      errors.push({ filename: file.name, error: validationError });
      continue;
    }

    try {
      const result = await uploadFile(file);
      successful.push(result);
    } catch (error) {
      errors.push({
        filename: file.name,
        error: 'Failed to upload file. Please try again.',
      });
    }
  }

  return { successful, errors };
}

/**
 * Delete a file from Vercel Blob
 */
export async function deleteFile(url: string): Promise<boolean> {
  try {
    await del(url);
    return true;
  } catch (error) {
    console.error('Failed to delete file:', error);
    return false;
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

