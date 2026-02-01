'use client';

import { useState } from 'react';
import { Send, Loader2, User, MessageSquare } from 'lucide-react';
import { type CommentRow } from '@/types/portal';
import { cn } from '@/lib/utils';

interface CommentThreadProps {
  requestId: string;
  comments: CommentRow[];
  clientName: string;
}

export function CommentThread({ requestId, comments, clientName }: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/portal/requests/${requestId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newComment }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post comment');
      }

      // Add the new comment to local state
      setLocalComments(prev => [...prev, data.data]);
      setNewComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Comments list */}
      {localComments.length > 0 ? (
        <div className="space-y-4">
          {localComments.map((comment) => (
            <div
              key={comment.id}
              className={cn(
                'flex gap-3',
                comment.user_type === 'client' ? 'flex-row-reverse' : ''
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  comment.user_type === 'admin'
                    ? 'bg-brand-navy text-white'
                    : 'bg-brand-gold text-brand-navy'
                )}
              >
                <User size={16} />
              </div>

              {/* Message bubble */}
              <div
                className={cn(
                  'flex-1 max-w-[80%]',
                  comment.user_type === 'client' ? 'text-right' : ''
                )}
              >
                <div
                  className={cn(
                    'inline-block p-3 rounded-xl text-sm',
                    comment.user_type === 'admin'
                      ? 'bg-gray-100 text-brand-navy rounded-tl-none'
                      : 'bg-brand-gold/10 text-brand-navy rounded-tr-none'
                  )}
                >
                  <p className="whitespace-pre-wrap">{comment.message}</p>
                </div>
                <p className="text-xs text-brand-navy/40 mt-1">
                  {comment.user_name} · {formatDate(comment.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-brand-navy/50">
          <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
          <p>No comments yet</p>
          <p className="text-sm mt-1">Start the conversation below</p>
        </div>
      )}

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center flex-shrink-0">
          <User size={16} />
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your message..."
            rows={2}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30"
          />
          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-graphite disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
