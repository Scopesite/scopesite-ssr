/** @vitest-environment jsdom */
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProjectPicker } from './ProjectPicker';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('ProjectPicker client changes', () => {
  it('clears old options immediately and ignores an abandoned request', async () => {
    const pending: Array<{ resolve: (response: unknown) => void; signal: AbortSignal }> = [];
    vi.stubGlobal('fetch', vi.fn((_url, options) => new Promise(resolve => {
      pending.push({ resolve, signal: options.signal });
    })));
    const props = { value: null, onChange: vi.fn() };
    const view = render(<ProjectPicker {...props} clientId="client-a" />);
    view.rerender(<ProjectPicker {...props} clientId="client-b" />);
    expect(pending[0].signal.aborted).toBe(true);
    expect((screen.getByRole('combobox') as HTMLSelectElement).disabled).toBe(true);
    await act(async () => {
      pending[0].resolve({ ok: true, json: async () => ({ success: true, data: [{ id: 'a', name: 'Previous client project' }] }) });
      pending[1].resolve({ ok: true, json: async () => ({ success: true, data: [{ id: 'b', name: 'Current client project' }] }) });
    });
    expect(screen.queryByText('Previous client project')).toBeNull();
    expect(screen.getByText('Current client project')).toBeTruthy();
    expect((screen.getByRole('combobox') as HTMLSelectElement).disabled).toBe(false);
    view.rerender(<ProjectPicker {...props} clientId={null} />);
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(pending[1].signal.aborted).toBe(true);
  });
});
