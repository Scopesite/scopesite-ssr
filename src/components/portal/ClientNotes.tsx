'use client';

/**
 * Client Notes Component
 * 
 * Internal admin notes/memos for a client.
 * Not visible to clients.
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  StickyNote, 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  Loader2,
  Check,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClientNoteRow } from '@/types/portal';

interface ClientNotesProps {
  clientId: string;
  notes: ClientNoteRow[];
  adminName?: string;
}

export function ClientNotes({ clientId, notes, adminName = 'Admin' }: ClientNotesProps) {
  const router = useRouter();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const resetForm = useCallback(() => {
    setNoteContent('');
    setIsAddingNote(false);
    setEditingNoteId(null);
    setError(null);
  }, []);

  const startEditing = useCallback((note: ClientNoteRow) => {
    setNoteContent(note.content);
    setEditingNoteId(note.id);
    setIsAddingNote(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const url = editingNoteId 
        ? `/api/portal/admin/notes/${editingNoteId}`
        : '/api/portal/admin/notes';
      
      const method = editingNoteId ? 'PATCH' : 'POST';
      
      const body = editingNoteId
        ? { content: noteContent }
        : { client_id: clientId, content: noteContent, created_by: adminName };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save note');
      }

      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    setDeletingId(noteId);
    setError(null);

    try {
      const response = await fetch(`/api/portal/admin/notes/${noteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete note');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-brand-navy/40" />
          <h3 className="font-semibold text-brand-navy">Internal Notes</h3>
          <span className="text-sm text-brand-navy/40">({notes.length})</span>
        </div>
        {!isAddingNote && !editingNoteId && (
          <button
            onClick={() => {
              setNoteContent('');
              setIsAddingNote(true);
            }}
            className="flex items-center gap-1 text-sm text-brand-gold-accessible hover:text-brand-orange-accessible font-medium transition-colors"
          >
            <Plus size={16} /> Add
          </button>
        )}
      </div>

      <p className="text-xs text-brand-navy/40 mb-4">
        Internal memos - not visible to clients
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAddingNote || editingNoteId) && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="relative">
            <textarea
              placeholder="Add a note..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold resize-none"
              autoFocus
            />
            <button
              type="button"
              onClick={resetForm}
              className="absolute top-2 right-2 p-1 text-brand-navy/40 hover:text-brand-navy rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-sm text-brand-navy hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !noteContent.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-brand-gold text-brand-navy font-medium rounded-lg hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {editingNoteId ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                'p-3 rounded-lg border transition-colors',
                'bg-yellow-50/50 border-yellow-200/50'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-brand-navy whitespace-pre-wrap flex-1">
                  {note.content}
                </p>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEditing(note)}
                    className="p-1 text-brand-navy/40 hover:text-brand-navy hover:bg-white rounded transition-colors"
                    title="Edit note"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={deletingId === note.id}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    title="Delete note"
                  >
                    {deletingId === note.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-brand-navy/40">
                <span>{note.created_by}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {formatDate(note.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isAddingNote && (
          <p className="text-center text-brand-navy/40 text-sm py-4">
            No notes yet
          </p>
        )
      )}
    </div>
  );
}
