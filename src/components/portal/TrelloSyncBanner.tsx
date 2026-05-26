'use client';

import { useSearchParams } from 'next/navigation';

export function TrelloSyncBanner() {
  const searchParams = useSearchParams();
  const warning = searchParams.get('trelloWarning');

  if (!warning) {
    return null;
  }

  return (
    <div
      className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      role="alert"
    >
      {warning}
    </div>
  );
}
