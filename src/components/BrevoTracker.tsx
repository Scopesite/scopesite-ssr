/**
 * Brevo marketing / website tracker (SDK v2)
 *
 * - Hoists `_sc` / `_se` (Brevo email-link first-party params) onto the visible
 *   URL when they only appear inside an encoded return URL (e.g. Clerk
 *   `redirect_url`), so the SDK can read them before the bar is cleaned.
 * - Loads init + sdk-loader. Client key via NEXT_PUBLIC_BREVO_CLIENT_KEY.
 *
 * Performance note (LCP / main thread): `beforeInteractive` scripts run very early
 * on every route and compete with hydration. The SDK loader uses
 * `afterInteractive` on desktop; `lazyOnload` on narrow viewports (&lt;768px) to
 * reduce mobile lab TBT (email bootstrap + init stay early).
 *
 * @see https://help.brevo.com/hc/en-us/articles/4409601214226-Troubleshooting-Implementing-first-party-cookies-on-your-website
 * @see https://developers.brevo.com/docs/getting-started-with-js-implementation
 */

'use client';

import Script from 'next/script';
import { useLayoutEffect, useState } from 'react';

const MOBILE_MAX_PX = 768;

/** Inline, runs before other scripts so `_sc` / `_se` stay visible for the tracker. */
const emailLinkBootstrap = `
(function(){
  function hasBrevoParams(search) {
    try {
      var p = new URLSearchParams(search.indexOf('?') === 0 ? search.slice(1) : search);
      return p.has('_sc') || p.has('_se');
    } catch (e) { return false; }
  }
  function mergeFromNestedUrls(searchSource, target) {
    var changed = false;
    try {
      var q = searchSource.indexOf('?') === 0 ? searchSource.slice(1) : searchSource;
      var p = new URLSearchParams(q);
      var keys = ['redirect_url','redirectUrl','returnUrl','return_url','callbackUrl','callback_url'];
      for (var i = 0; i < keys.length; i++) {
        var raw = p.get(keys[i]);
        if (!raw) continue;
        var decoded = raw;
        try { decoded = decodeURIComponent(raw); } catch (e1) {}
        try {
          var nested = new URL(decoded, window.location.origin);
          var sc = nested.searchParams.get('_sc');
          var se = nested.searchParams.get('_se');
          if (sc && !target.has('_sc')) { target.set('_sc', sc); changed = true; }
          if (se && !target.has('_se')) { target.set('_se', se); changed = true; }
        } catch (e2) {}
      }
    } catch (e) {}
    return changed;
  }
  try {
    var cur = window.location.search || '';
    if (hasBrevoParams(cur)) return;
    var next = new URLSearchParams(cur.slice(1));
    mergeFromNestedUrls(cur, next);
    var h = window.location.hash || '';
    if (h.indexOf('?') !== -1) {
      mergeFromNestedUrls(h.slice(h.indexOf('?')), next);
    }
    if (!hasBrevoParams('?' + next.toString())) return;
    var qs = next.toString();
    var path = window.location.pathname || '/';
    var newUrl = path + (qs ? '?' + qs : '') + (h ? h : '');
    window.history.replaceState(window.history.state, '', newUrl);
  } catch (e) {}
})();`;

export function BrevoTracker() {
  const clientKey = process.env.NEXT_PUBLIC_BREVO_CLIENT_KEY;
  const [sdkStrategy, setSdkStrategy] = useState<'afterInteractive' | 'lazyOnload' | null>(
    null,
  );

  useLayoutEffect(() => {
    setSdkStrategy(
      window.innerWidth < MOBILE_MAX_PX ? 'lazyOnload' : 'afterInteractive',
    );
  }, []);

  if (!clientKey) return null;

  const initSnippet = `window.Brevo = window.Brevo || [];
window.Brevo.push(["init", { client_key: ${JSON.stringify(clientKey)} }]);`;

  return (
    <>
      {/* App Router: root layout is the supported place for beforeInteractive scripts. */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- root layout; Brevo needs params before URL cleanup */}
      <Script id="brevo-email-link-bootstrap" strategy="beforeInteractive">
        {emailLinkBootstrap}
      </Script>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- root layout; Brevo recommends early init */}
      <Script id="brevo-init" strategy="beforeInteractive">
        {initSnippet}
      </Script>
      {sdkStrategy ? (
        <Script
          id="brevo-sdk-loader"
          src="https://cdn.brevo.com/js/sdk-loader.js"
          strategy={sdkStrategy}
          async
        />
      ) : null}
    </>
  );
}
