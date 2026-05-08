/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { AreaWaitlistForm } from './AreaWaitlistForm';
import { AREA_WAITLIST_EVENT } from '@/lib/territory/events';

const plumbing = {
  id: 'sec-1',
  slug: 'plumbing',
  label: 'Plumbing',
  category: 'Trades',
  availableCount: 0,
  isActive: true,
  isFeatured: false,
};

describe('AreaWaitlistForm postcode mode copy', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, currentQueueSize: 0 }),
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('does not pair open-for-applications headline with first-in-queue banner', async () => {
    render(<AreaWaitlistForm allSectorsByCategory={{ Trades: [plumbing] }} />);

    window.dispatchEvent(
      new CustomEvent(AREA_WAITLIST_EVENT, {
        detail: {
          entrySource: 'postcode_not_in_pilot',
          postcode: 'WV',
          sectorSlug: 'plumbing',
        },
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('Register interest — WV')).toBeTruthy();
    });

    expect(screen.queryByText(/open for applications/i)).toBeNull();

    await waitFor(() => {
      expect(screen.getByText(/first in the queue for WV/i)).toBeTruthy();
    });
  });
});
