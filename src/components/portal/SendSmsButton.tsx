'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SendSmsButtonProps {
  requestId: string;
  canSend: boolean;
  disabledReason?: string;
}

const MAX_CHARS = 320;
const WARN_CHARS = 160;

export function SendSmsButton({
  requestId,
  canSend,
  disabledReason = "Client hasn't opted in to SMS updates",
}: SendSmsButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!canSend || !message.trim()) return;

    setSending(true);
    setFeedback(null);
    setError(null);

    try {
      const response = await fetch(`/api/portal/admin/requests/${requestId}/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send SMS');
      }

      setFeedback('SMS sent');
      setMessage('');
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 font-semibold text-brand-navy">
          <MessageSquare size={18} className="text-brand-navy/50" />
          Send SMS to client
        </span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4 space-y-3">
          {!canSend ? (
            <p className="text-sm text-brand-navy/60">{disabledReason}</p>
          ) : (
            <>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Short update for the client…"
                rows={4}
                className="input-brand w-full resize-y"
                disabled={sending}
              />
              <p
                className={cn(
                  'text-xs',
                  message.length > WARN_CHARS ? 'text-amber-600' : 'text-brand-navy/50'
                )}
              >
                {message.length}/{MAX_CHARS} characters
                {message.length > WARN_CHARS && ' (2 SMS segments)'}
              </p>
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              {feedback && (
                <p className="text-sm text-green-700" role="status">
                  {feedback}
                </p>
              )}
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || !message.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-graphite disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <MessageSquare size={16} />
                )}
                Send SMS
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
