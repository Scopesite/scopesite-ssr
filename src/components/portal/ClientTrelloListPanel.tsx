'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2, Loader2, Trello } from 'lucide-react';
import type { ClientTrelloListStatus } from '@/lib/portal-trello';

interface ClientTrelloListPanelProps {
  clientId: string;
  companyName: string;
  initialStatus: ClientTrelloListStatus;
}

export function ClientTrelloListPanel({
  clientId,
  companyName,
  initialStatus,
}: ClientTrelloListPanelProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!status.configured) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-brand-navy mb-2">Trello</h3>
        <p className="text-sm text-brand-navy/60">Trello is not configured in this environment.</p>
      </div>
    );
  }

  const handleCreateList = async () => {
    const message = status.needsNewList
      ? `Create a new open Trello list named "${companyName}"?\n\nAll new portal requests for this client will go there. Existing cards on the board are not moved.`
      : `Replace the current list with a new open list named "${companyName}"?\n\nOnly future portal requests use the new list.`;

    if (!window.confirm(message)) {
      return;
    }

    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/portal/admin/clients/${clientId}/trello-list`, {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Trello list');
      }

      setStatus(data.data.status);
      setSuccess(data.data.message);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Trello size={18} className="text-brand-navy/50" />
        <h3 className="font-semibold text-brand-navy">Trello list</h3>
      </div>

      {status.needsNewList ? (
        <div className="flex gap-2 text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
          <p>
            {status.listName
              ? `Assigned list "${status.listName}" is archived or missing. New portal cards were landing there and disappearing from your active board.`
              : 'No Trello list assigned yet. New requests need an open list.'}
          </p>
        </div>
      ) : (
        <div className="flex gap-2 text-sm text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
          <p>
            Active list: <span className="font-medium">{status.listName}</span>
            <span className="block text-emerald-800/80 mt-0.5">
              New portal requests for this client go here.
            </span>
          </p>
        </div>
      )}

      <p className="text-xs text-brand-navy/50">
        Does not move existing Trello cards. Only changes where the next portal request is created.
      </p>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-700" role="status">
          {success}
        </p>
      )}

      <button
        type="button"
        onClick={handleCreateList}
        disabled={creating}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-graphite disabled:opacity-50"
      >
        {creating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Trello size={16} />
        )}
        {status.needsNewList ? 'Create & assign new list' : 'Create new list (replace)'}
      </button>
    </div>
  );
}
