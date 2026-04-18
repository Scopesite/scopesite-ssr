'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function AdminLogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    setBusy(true);
    try {
      await fetch('/api/territory/admin/logout', { method: 'POST' });
      router.replace('/territory/admin/login');
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      type="button"
      variant="brandOutline"
      size="brand"
      onClick={onClick}
      disabled={busy}
      className="py-2 text-sm"
    >
      {busy ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}
