/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { PilotCheckerModal } from './PilotCheckerModal';
import { OPEN_PILOT_CHECKER_EVENT } from '@/lib/territory/events';
import type { PostcodeDisplayState } from '@/lib/territory/postcodePricingLogic';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const plumbing = {
  id: 'sec-1',
  slug: 'plumbing',
  label: 'Plumbing',
  category: 'Trades',
  availableCount: 0,
  isActive: true,
  isFeatured: false,
};

describe('PilotCheckerModal pricing fetch', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders monthly and setup from postcode-state API for standard tier', async () => {
    const state: PostcodeDisplayState = {
      postcode: 'WV',
      tier: 'standard',
      baseMonthlyPriceGbp: 500,
      baseSetupFeeGbp: 750,
      isPromotional: false,
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, state }),
      }),
    );

    render(<PilotCheckerModal allSectorsByCategory={{ Trades: [plumbing] }} />);

    window.dispatchEvent(
      new CustomEvent(OPEN_PILOT_CHECKER_EVENT, {
        detail: { postcode: 'WV', town: 'Testville' },
      }),
    );

    await waitFor(() => {
      expect(screen.getByText(/£500\/mo/)).toBeTruthy();
    });
    expect(screen.getByText(/£750 setup/)).toBeTruthy();
    expect(screen.getByText('Standard')).toBeTruthy();
  });

  it('renders premium pricing when API returns premium tier', async () => {
    const state: PostcodeDisplayState = {
      postcode: 'B',
      tier: 'premium',
      baseMonthlyPriceGbp: 750,
      baseSetupFeeGbp: 1250,
      isPromotional: false,
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true, state }),
      }),
    );

    render(<PilotCheckerModal allSectorsByCategory={{ Trades: [plumbing] }} />);

    window.dispatchEvent(
      new CustomEvent(OPEN_PILOT_CHECKER_EVENT, {
        detail: { postcode: 'B' },
      }),
    );

    await waitFor(() => {
      expect(screen.getByText(/£750\/mo/)).toBeTruthy();
    });
    expect(screen.getByText(/£1250 setup/)).toBeTruthy();
    expect(screen.getByText('Premium')).toBeTruthy();
  });
});
