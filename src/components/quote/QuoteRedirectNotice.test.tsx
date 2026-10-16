/** @vitest-environment jsdom */
import { StrictMode } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { QuoteRedirectNotice } from './QuoteRedirectNotice';

afterEach(() => { cleanup(); sessionStorage.clear(); });

describe('QuoteRedirectNotice', () => {
  it('consumes the browser message once and retains it through strict-mode subscription replay', () => {
    sessionStorage.setItem('scopesite_quote_redirect_notice', 'Your existing quote can be discussed on the call.');
    expect(renderToString(<QuoteRedirectNotice />)).toBe('');
    const view = render(<StrictMode><QuoteRedirectNotice /></StrictMode>);
    expect(screen.getByRole('status').textContent).toContain('Your existing quote');
    expect(sessionStorage.getItem('scopesite_quote_redirect_notice')).toBeNull();
    view.rerender(<StrictMode><QuoteRedirectNotice /></StrictMode>);
    expect(screen.getByRole('status').textContent).toContain('Your existing quote');
    view.unmount();
    render(<QuoteRedirectNotice />);
    expect(screen.queryByRole('status')).toBeNull();
  });
});
