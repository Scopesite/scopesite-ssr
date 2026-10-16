/** @vitest-environment jsdom */
import { act, cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PromotionCountdown } from './PromotionCountdown';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-16T12:00:00Z'));
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('PromotionCountdown', () => {
  it('uses a stable server snapshot and fires once per expiry even if the callback changes', () => {
    const expiry = '2026-10-16T12:00:02Z';
    expect(renderToString(<PromotionCountdown expiresAt={expiry} />)).toContain('…');
    const expired = vi.fn();
    const changedCallback = vi.fn();
    const view = render(<PromotionCountdown expiresAt={expiry} onExpired={expired} />);
    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.getByText('0h 00m 00s')).toBeTruthy();
    expect(expired).toHaveBeenCalledTimes(1);
    view.rerender(<PromotionCountdown expiresAt={expiry} onExpired={changedCallback} />);
    act(() => { vi.advanceTimersByTime(5000); });
    expect(changedCallback).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('starts tracking a changed expiry and cleans up on unmount', () => {
    const expired = vi.fn();
    const view = render(<PromotionCountdown expiresAt="2026-10-16T12:00:01Z" onExpired={expired} />);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(expired).toHaveBeenCalledTimes(1);
    view.rerender(<PromotionCountdown expiresAt="2026-10-16T12:00:03Z" onExpired={expired} />);
    act(() => { vi.advanceTimersByTime(2000); });
    expect(expired).toHaveBeenCalledTimes(2);
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
