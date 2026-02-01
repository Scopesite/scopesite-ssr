'use client';

/**
 * Brand Upload Section Component
 * 
 * Displays a category section with upload zone and file list.
 * Used on the Brand page for Brand Assets, Fonts, and Documents.
 */

import { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  X, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Download,
  Trash2,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileRow, FileFolderCategory } from '@/types/portal';

interface BrandUploadSectionProps {
  title: string;
  description: string;
  category: FileFolderCategory;
  icon: React.ElementType;
  acceptedTypes: string[];
  acceptedExtensions: string[];
  files: FileRow[];
  isAdmin?: boolean;
  onFileUploaded?: () => void;
}

interface UploadState {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export function BrandUploadSection({
  title,
  description,
  category,
  icon: Icon,
  acceptedTypes,
  acceptedExtensions,
  files,
  isAdmin = false,
  onFileUploaded,
}: BrandUploadSectionProps) {
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Upload a single file
  const uploadFile = async (uploadState: UploadState): Promise<UploadState> => {
    const formData = new FormData();
    formData.append('files', uploadState.file);
    formData.append('category', category);

    try {
      const response = await fetch('/api/portal/files/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data?.files?.[0]) {
        return {
          ...uploadState,
          status: 'success',
          progress: 100,
        };
      } else {
        return {
          ...uploadState,
          status: 'error',
          error: result.error || 'Upload failed',
        };
      }
    } catch {
      return {
        ...uploadState,
        status: 'error',
        error: 'Upload failed. Please try again.',
      };
    }
  };

  // Handle file selection
  const handleFiles = useCallback(
    async (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;

      const newUploads: UploadState[] = Array.from(selectedFiles).map((file) => ({
        file,
        status: 'pending' as const,
        progress: 0,
      }));

      setUploads((prev) => [...prev, ...newUploads]);

      // Upload each file
      for (const uploadState of newUploads) {
        // Set uploading status
        setUploads((prev) =>
          prev.map((u) =>
            u.file === uploadState.file ? { ...u, status: 'uploading' as const, progress: 50 } : u
          )
        );

        // Upload
        const result = await uploadFile(uploadState);

        // Update state with result
        setUploads((prev) =>
          prev.map((u) => (u.file === uploadState.file ? result : u))
        );

        // Notify parent to refresh file list
        if (result.status === 'success' && onFileUploaded) {
          onFileUploaded();
        }
      }
    },
    [category, onFileUploaded]
  );

  // Remove upload from list
  const removeUpload = useCallback((uploadState: UploadState) => {
    setUploads((prev) => prev.filter((u) => u !== uploadState));
  }, []);

  // Delete file (admin only)
  const handleDeleteFile = async (fileId: string) => {
    if (!isAdmin) return;
    
    setIsDeleting(fileId);
    try {
      const response = await fetch(`/api/portal/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok && onFileUploaded) {
        onFileUploaded();
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-navy/5 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-brand-navy" />
        </div>
        <div>
          <h2 className="font-semibold text-brand-navy">{title}</h2>
          <p className="text-sm text-brand-navy/50">{description}</p>
        </div>
        <span className="ml-auto text-sm text-brand-navy/40">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="p-6 space-y-4">
        {/* Upload Zone */}
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
            isDragOver
              ? 'border-brand-gold bg-brand-gold/10'
              : 'border-gray-300 hover:border-brand-gold/50 hover:bg-brand-gold/5'
          )}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptedExtensions.join(',')}
            onChange={handleInputChange}
            className="sr-only"
            aria-hidden="true"
          />

          <Upload
            className={cn(
              'w-8 h-8 mx-auto mb-2 transition-colors',
              isDragOver ? 'text-brand-gold' : 'text-gray-400'
            )}
          />

          <p className="text-brand-navy text-sm font-medium mb-1">
            {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-gray-500 text-xs">
            or <span className="text-brand-gold-accessible font-medium">click to browse</span>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            {acceptedExtensions.join(', ')} • Max 10MB per file
          </p>
        </div>

        {/* Upload Progress */}
        {uploads.length > 0 && (
          <div className="space-y-2">
            {uploads.map((uploadState, index) => (
              <div
                key={`${uploadState.file.name}-${index}`}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                  uploadState.status === 'success' && 'border-green-200 bg-green-50',
                  uploadState.status === 'error' && 'border-red-200 bg-red-50',
                  uploadState.status === 'uploading' && 'border-brand-gold/30 bg-brand-gold/5',
                  uploadState.status === 'pending' && 'border-gray-200 bg-white'
                )}
              >
                <div className="shrink-0">
                  {uploadState.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-brand-gold animate-spin" />
                  )}
                  {uploadState.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {uploadState.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-brand-navy font-medium truncate">
                    {uploadState.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadState.file.size)}
                    {uploadState.status === 'uploading' && ' • Uploading...'}
                    {uploadState.status === 'error' && (
                      <span className="text-red-500"> • {uploadState.error}</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => removeUpload(uploadState)}
                  className="shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
                  aria-label={`Remove ${uploadState.file.name}`}
                  type="button"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File List */}
        {files.length > 0 ? (
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-navy text-sm truncate">
                    {file.file_name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(file.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Download button */}
                  <a
                    href={file.blob_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-brand-navy/50 hover:text-brand-navy hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label={`Download ${file.file_name}`}
                  >
                    <Download size={16} />
                  </a>

                  {/* Delete button (admin only) */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      disabled={isDeleting === file.id}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      aria-label={`Delete ${file.file_name}`}
                    >
                      {isDeleting === file.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-4">
            No files uploaded yet
          </p>
        )}
      </div>
    </div>
  );
}
