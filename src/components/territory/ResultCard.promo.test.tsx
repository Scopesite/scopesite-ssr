/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import type { AvailabilityResult } from '@/lib/territory/types';
import { ResultCard } from './ResultCard';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const baseResult: Extract<
  AvailabilityResult,
  { state: 'available' | 'pending' | 'claimed' | 'not_active' }
> = {
  state: 'available',
  tier: 'standard',
  seatId: 'seat-1',
  territoryId: 'terr-1',
  sectorId: 'sec-1',
  postcode: 'BA1 1AA',
  postcodeDistrict: 'BA1',
  townName: 'Bath',
  sectorSlug: 'plumbing',
  sectorLabel: 'Plumbing',
  monthlyPriceGbp: 500,
  setupFeeGbp: 100,
  pendingUntil: null,
  postcodeDisplayState: {
    postcode: 'BA1',
    tier: 'standard',
    baseMonthlyPriceGbp: 500,
    baseSetupFeeGbp: 100,
    isPromotional: false,
  },
  areaIntelligence: null,
};

describe('ResultCard promotional block', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders promo headline, strike-through base, gold promo price, countdown when promotional', () => {
    const result: typeof baseResult = {
      ...baseResult,
      postcodeDisplayState: {
        postcode: 'BA1',
        tier: 'standard',
        baseMonthlyPriceGbp: 500,
        baseSetupFeeGbp: 100,
        isPromotional: true,
        promotion: {
          id: 'p1',
          promotionalMonthlyPriceGbp: 350,
          promotionalSetupFeeGbp: 50,
          headline: 'Pilot launch offer',
          description: 'Lock this rate today.',
          expiresAt: '2030-01-01T00:00:00.000Z',
          originTier: 'standard',
        },
      },
    };

    render(
      <ResultCard result={result} onJoinWaitlist={() => {}} onReset={() => {}} />,
    );

    expect(screen.getByText('Pilot launch offer')).toBeTruthy();
    expect(screen.getByText('Lock this rate today.')).toBeTruthy();
    expect(screen.getByText('£350/mo')).toBeTruthy();
    expect(screen.getByText('£500/mo')).toBeTruthy();
    expect(screen.getByText(/Ends in/i)).toBeTruthy();
  });

  it('renders base monthly and setup when not promotional', () => {
    render(
      <ResultCard result={baseResult} onJoinWaitlist={() => {}} onReset={() => {}} />,
    );
    expect(screen.getByText(/£500\/mo/)).toBeTruthy();
    expect(screen.getByText(/£100 setup/)).toBeTruthy();
    expect(screen.queryByText(/Limited-time offer/i)).toBeNull();
  });
});
