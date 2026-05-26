'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Loader2, Trello } from 'lucide-react';

interface AdminTrelloPanelProps {
  requestId: string;
  trelloCardId: string | null;
  trelloCardUrl: string | null;
  clientId?: string;
  clientListNeedsFix?: boolean;
  clientListName?: string | null;
}

export function AdminTrelloPanel({
  requestId,
  trelloCardId,
  trelloCardUrl,
  clientId,
  clientListNeedsFix,
  clientListName,
}: AdminTrelloPanelProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isLinked = Boolean(trelloCardId && trelloCardUrl);
  const isStale = Boolean(trelloCardId && !trelloCardUrl);

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

      setSuccess('Trello card ready');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  if (isLinked) {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p className="text-sm font-medium text-emerald-900">Linked to Trello</p>
        <a
          href={trelloCardUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-navy hover:text-brand-gold-accessible"
        >
          Open card
          <ExternalLink size={14} />
        </a>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold text-amber-900">
          {isStale ? 'Trello link broken' : 'Not in Trello yet'}
        </p>
        <p className="text-sm text-amber-800/90 mt-1">
          {isStale
            ? 'Portal has an old card ID but Trello has no matching card. Sync again to create a new card.'
            : 'This request is only in the portal. Sync creates the client list (if needed) and the Trello card. Project is optional.'}
        </p>
        {clientListNeedsFix && clientId && (
          <p className="text-sm text-amber-800/90 mt-2">
            Client list
            {clientListName ? ` "${clientListName}"` : ''} is archived or missing.{' '}
            <Link
              href={`/portal/admin/clients/${clientId}`}
              className="font-semibold text-brand-navy underline hover:text-brand-gold-accessible"
            >
              Create & assign a new list
            </Link>{' '}
            before syncing.
          </p>
        )}
      </div>
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
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-graphite disabled:opacity-50"
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
