'use client';

/**
 * Admin Invoice Upload Component
 * 
 * Allows admins to upload invoices (PDFs) to a specific client.
 * Used on the admin client detail page.
 */

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  X, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Download,
  Trash2,
  Calendar,
  FileText,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileRow } from '@/types/portal';

interface AdminInvoiceUploadProps {
  clientId: string;
  invoices: FileRow[];
}

interface UploadState {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export function AdminInvoiceUpload({ clientId, invoices }: AdminInvoiceUploadProps) {
  const router = useRouter();
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
    formData.append('clientId', clientId);
    formData.append('category', 'invoices');

    try {
      const response = await fetch('/api/portal/admin/files/upload', {
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

        // Refresh page to show new invoice
        if (result.status === 'success') {
          router.refresh();
        }
      }
    },
    [clientId, router]
  );

  // Remove upload from list
  const removeUpload = useCallback((uploadState: UploadState) => {
    setUploads((prev) => prev.filter((u) => u !== uploadState));
  }, []);

  // Delete invoice
  const handleDeleteInvoice = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    setIsDeleting(fileId);
    try {
      const response = await fetch(`/api/portal/admin/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete invoice:', error);
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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Receipt className="w-5 h-5 text-brand-gold-accessible" />
        <h3 className="font-semibold text-brand-navy">Invoices</h3>
        <span className="text-sm text-brand-navy/40">
          {invoices.length} uploaded
        </span>
      </div>

      {/* Upload Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all mb-4',
          isDragOver
            ? 'border-brand-gold bg-brand-gold/10'
            : 'border-gray-300 hover:border-brand-gold/50 hover:bg-brand-gold/5'
        )}
        role="button"
        tabIndex={0}
        aria-label="Upload invoice"
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
          accept=".pdf"
          onChange={handleInputChange}
          className="sr-only"
          aria-hidden="true"
        />

        <Upload
          className={cn(
            'w-6 h-6 mx-auto mb-1 transition-colors',
            isDragOver ? 'text-brand-gold' : 'text-gray-400'
          )}
        />

        <p className="text-brand-navy text-sm font-medium">
          {isDragOver ? 'Drop PDFs here' : 'Upload invoice PDFs'}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          PDF only • Max 10MB per file
        </p>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2 mb-4">
          {uploads.map((uploadState, index) => (
            <div
              key={`${uploadState.file.name}-${index}`}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg border transition-colors text-sm',
                uploadState.status === 'success' && 'border-green-200 bg-green-50',
                uploadState.status === 'error' && 'border-red-200 bg-red-50',
                uploadState.status === 'uploading' && 'border-brand-gold/30 bg-brand-gold/5',
                uploadState.status === 'pending' && 'border-gray-200 bg-white'
              )}
            >
              <div className="shrink-0">
                {uploadState.status === 'uploading' && (
                  <Loader2 className="w-4 h-4 text-brand-gold animate-spin" />
                )}
                {uploadState.status === 'success' && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                {uploadState.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-brand-navy font-medium truncate">
                  {uploadState.file.name}
                </p>
                {uploadState.status === 'error' && (
                  <p className="text-xs text-red-500">{uploadState.error}</p>
                )}
              </div>

              <button
                onClick={() => removeUpload(uploadState)}
                className="shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
                aria-label={`Remove ${uploadState.file.name}`}
                type="button"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Invoice List */}
      {invoices.length > 0 ? (
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FileText className="w-5 h-5 text-brand-gold-accessible shrink-0" />
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-navy truncate">
                  {invoice.file_name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatFileSize(invoice.file_size)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {formatDate(invoice.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={invoice.blob_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-brand-navy/50 hover:text-brand-navy hover:bg-white rounded transition-colors"
                  aria-label={`Download ${invoice.file_name}`}
                >
                  <Download size={14} />
                </a>

                <button
                  onClick={() => handleDeleteInvoice(invoice.id)}
                  disabled={isDeleting === invoice.id}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  aria-label={`Delete ${invoice.file_name}`}
                >
                  {isDeleting === invoice.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-2">
          No invoices uploaded yet
        </p>
      )}
    </div>
  );
}
