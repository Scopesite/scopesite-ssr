'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trello } from 'lucide-react';

interface SyncTrelloButtonProps {
  requestId: string;
}

export function SyncTrelloButton({ requestId }: SyncTrelloButtonProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/portal/admin/requests/${requestId}/sync-trello`,
        { method: 'POST' }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync to Trello');
      }

      setSuccess(data.trelloUrl ? 'Trello card created' : (data.message as string));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 space-y-3">
      <p className="text-sm text-amber-900 font-medium">Not linked to Trello</p>
      <p className="text-sm text-amber-800/80">
        This request exists in the portal only. Sync now to create the Trello card (and client list if
        needed).
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
        onClick={handleSync}
        disabled={syncing}
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-graphite disabled:opacity-50"
      >
        {syncing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Trello size={16} />
        )}
        Sync to Trello
      </button>
    </div>
  );
}
