'use client';

import { useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';

interface AdminDeleteButtonProps {
  requestId: string;
  requestTitle: string;
  onDeleted?: () => void;
}

export function AdminDeleteButton({ requestId, requestTitle, onDeleted }: AdminDeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/portal/admin/requests/${requestId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete');
      }

      // Refresh the page or call onDeleted
      if (onDeleted) {
        onDeleted();
      } else {
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2">
        {error && (
          <span className="text-xs text-red-600">{error}</span>
        )}
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
          className="px-2 py-1 text-xs text-brand-navy/60 hover:text-brand-navy transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isDeleting ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <AlertTriangle size={12} />
              Confirm Delete
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="inline-flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded text-xs transition-colors"
      title={`Delete "${requestTitle}"`}
    >
      <Trash2 size={14} />
      <span className="hidden sm:inline">Delete</span>
    </button>
  );
}
