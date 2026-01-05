'use client';

/**
 * File Upload Component
 * 
 * Drag and drop file upload with progress indicators.
 * Uploads files to Vercel Blob via /api/briefs/upload
 */

import { useState, useCallback, useRef } from 'react';
import { Upload, X, File, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedFile {
  url: string;
  filename: string;
  size: number;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: string;
  acceptedTypes?: string[];
  className?: string;
}

interface FileState {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

export function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSize = '10MB',
  acceptedTypes = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.zip'],
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update parent with successfully uploaded files
  const updateParent = useCallback(
    (fileStates: FileState[]) => {
      const uploaded = fileStates
        .filter((f) => f.status === 'success' && f.url)
        .map((f) => ({
          url: f.url!,
          filename: f.file.name,
          size: f.file.size,
        }));
      onFilesChange(uploaded);
    },
    [onFilesChange]
  );

  // Upload a single file
  const uploadFile = async (fileState: FileState): Promise<FileState> => {
    const formData = new FormData();
    formData.append('files', fileState.file);

    try {
      const response = await fetch('/api/briefs/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.files?.[0]) {
        return {
          ...fileState,
          status: 'success',
          progress: 100,
          url: result.files[0].url,
        };
      } else {
        return {
          ...fileState,
          status: 'error',
          error: result.error || 'Upload failed',
        };
      }
    } catch (error) {
      return {
        ...fileState,
        status: 'error',
        error: 'Upload failed. Please try again.',
      };
    }
  };

  // Handle file selection
  const handleFiles = useCallback(
    async (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;

      // Check max files limit
      const currentCount = files.filter((f) => f.status === 'success').length;
      const remainingSlots = maxFiles - currentCount;

      if (remainingSlots <= 0) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Convert to array and limit
      const newFilesArray = Array.from(selectedFiles).slice(0, remainingSlots);

      // Create file states
      const newFileStates: FileState[] = newFilesArray.map((file) => ({
        file,
        status: 'pending' as const,
        progress: 0,
      }));

      // Add to state
      setFiles((prev) => [...prev, ...newFileStates]);

      // Upload each file
      for (let i = 0; i < newFileStates.length; i++) {
        const fileState = newFileStates[i];

        // Set uploading status
        setFiles((prev) =>
          prev.map((f) =>
            f.file === fileState.file ? { ...f, status: 'uploading' as const, progress: 50 } : f
          )
        );

        // Upload
        const result = await uploadFile(fileState);

        // Update state with result
        setFiles((prev) => {
          const updated = prev.map((f) => (f.file === fileState.file ? result : f));
          updateParent(updated);
          return updated;
        });
      }
    },
    [files, maxFiles, updateParent]
  );

  // Remove a file
  const removeFile = useCallback(
    (fileState: FileState) => {
      setFiles((prev) => {
        const updated = prev.filter((f) => f !== fileState);
        updateParent(updated);
        return updated;
      });
    },
    [updateParent]
  );

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

  // Click to upload
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const successCount = files.filter((f) => f.status === 'success').length;
  const canUploadMore = successCount < maxFiles;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      {canUploadMore && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
            isDragOver
              ? 'border-brand-gold bg-brand-gold/10'
              : 'border-brand-graphite/30 hover:border-brand-gold/50 hover:bg-brand-gold/5'
          )}
          role="button"
          tabIndex={0}
          aria-label="Upload files"
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
            accept={acceptedTypes.join(',')}
            onChange={handleInputChange}
            className="sr-only"
            aria-hidden="true"
          />

          <Upload
            className={cn(
              'w-10 h-10 mx-auto mb-3 transition-colors',
              isDragOver ? 'text-brand-gold' : 'text-brand-graphite/50'
            )}
          />

          <p className="text-brand-navy font-medium mb-1">
            {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-brand-graphite text-sm">
            or <span className="text-brand-gold font-medium">click to browse</span>
          </p>
          <p className="text-brand-graphite/60 text-xs mt-2">
            {acceptedTypes.join(', ')} • Max {maxSize} per file • Up to {maxFiles} files
          </p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2" role="list" aria-label="Uploaded files">
          {files.map((fileState, index) => (
            <div
              key={`${fileState.file.name}-${index}`}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                fileState.status === 'success' && 'border-green-200 bg-green-50',
                fileState.status === 'error' && 'border-red-200 bg-red-50',
                fileState.status === 'uploading' && 'border-brand-gold/30 bg-brand-gold/5',
                fileState.status === 'pending' && 'border-brand-graphite/20 bg-white'
              )}
              role="listitem"
            >
              {/* Icon */}
              <div className="shrink-0">
                {fileState.status === 'uploading' && (
                  <Loader2 className="w-5 h-5 text-brand-gold animate-spin" />
                )}
                {fileState.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {fileState.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                {fileState.status === 'pending' && (
                  <File className="w-5 h-5 text-brand-graphite" />
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-brand-navy font-medium truncate">
                  {fileState.file.name}
                </p>
                <p className="text-xs text-brand-graphite">
                  {formatSize(fileState.file.size)}
                  {fileState.status === 'uploading' && ' • Uploading...'}
                  {fileState.status === 'error' && (
                    <span className="text-red-500"> • {fileState.error}</span>
                  )}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFile(fileState)}
                className="shrink-0 p-1 rounded-full hover:bg-brand-navy/10 transition-colors"
                aria-label={`Remove ${fileState.file.name}`}
                type="button"
              >
                <X className="w-4 h-4 text-brand-graphite" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File count indicator */}
      {successCount > 0 && (
        <p className="text-sm text-brand-graphite">
          {successCount} of {maxFiles} files uploaded
        </p>
      )}
    </div>
  );
}

export default FileUpload;


