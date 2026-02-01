'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2, MessageSquare } from 'lucide-react';

interface ApprovalButtonsProps {
  requestId: string;
}

export function ApprovalButtons({ requestId }: ApprovalButtonsProps) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setIsApproving(true);
    setError(null);

    try {
      const response = await fetch(`/api/portal/requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve estimate');
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for querying the estimate');
      return;
    }

    setIsRejecting(true);
    setError(null);

    try {
      const response = await fetch(`/api/portal/requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reject',
          reason: rejectReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to query estimate');
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsRejecting(false);
    }
  };

  if (showRejectForm) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-brand-navy font-medium">
          What would you like to discuss?
        </p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Let us know your questions or concerns about this estimate..."
          rows={3}
          className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30"
          autoFocus
        />
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowRejectForm(false);
              setRejectReason('');
              setError(null);
            }}
            className="flex-1 px-4 py-3 border border-gray-200 text-brand-navy text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isRejecting}
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={isRejecting || !rejectReason.trim()}
            className="flex-1 px-4 py-3 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-graphite disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isRejecting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <MessageSquare size={16} />
                Send Query
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-navy/70">
        Please review the estimate above. By approving, you authorize us to proceed with the work.
      </p>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setShowRejectForm(true)}
          disabled={isApproving}
          className="flex-1 px-4 py-3 border border-gray-200 text-brand-navy text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          <X size={16} />
          Query Estimate
        </button>
        <button
          onClick={handleApprove}
          disabled={isApproving || isRejecting}
          className="flex-1 px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isApproving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <Check size={16} />
              Approve Estimate
            </>
          )}
        </button>
      </div>
    </div>
  );
}
