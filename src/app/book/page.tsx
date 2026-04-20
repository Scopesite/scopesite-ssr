'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const CAL_LINK = 'scopesite/30min';
const CAL_URL = `https://cal.com/${CAL_LINK}`;

const CAL_INIT_SCRIPT = `
(function (C, A, L) {
  let p = function (a, ar) { a.q.push(ar); };
  let d = C.document;
  C.Cal = C.Cal || function () {
    let cal = C.Cal;
    let ar = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      d.head.appendChild(d.createElement("script")).src = A;
      cal.loaded = true;
    }
    if (ar[0] === L) {
      const api = function () { p(api, arguments); };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        cal.ns[namespace] = cal.ns[namespace] || api;
        p(cal.ns[namespace], ar);
        p(cal, ["initNamespace", namespace]);
      } else p(cal, ar);
      return;
    }
    p(cal, ar);
  };
})(window, "https://app.cal.com/embed/embed.js", "init");

Cal("init", "30min", { origin: "https://cal.com" });
Cal.ns["30min"]("inline", {
  elementOrSelector: "#cal-embed",
  calLink: "${CAL_LINK}",
  layout: "month_view"
});
Cal.ns["30min"]("ui", {
  hideEventTypeDetails: false,
  layout: "month_view"
});
`;

export default function BookPage() {
  useEffect(() => {
    const target = document.getElementById('cal-embed');
    if (!target) return;

    const demote = () => {
      target.querySelectorAll('h1').forEach((el) => {
        const h2 = document.createElement('h2');
        for (const attr of Array.from(el.attributes)) {
          h2.setAttribute(attr.name, attr.value);
        }
        h2.innerHTML = el.innerHTML;
        el.replaceWith(h2);
      });
    };

    demote();
    const observer = new MutationObserver(demote);
    observer.observe(target, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-brand-navy pt-12 pb-8">
        <div className="container-content text-center">
          <span className="badge-gold mb-4">Zero Pressure</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display text-white mb-4">
            BOOK A <span className="text-brand-gold">FREE STRATEGY CALL</span>
          </h1>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
            No sales pitch. No pressure. Just a straight-talking conversation
            about your website and how AI search engines find your business.
          </p>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="bg-brand-navy/95 py-12">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-white font-bold text-lg mb-4">What We&apos;ll Cover</h2>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Your current situation - what&apos;s working, what isn&apos;t</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>What you actually need (which might be different from what you think)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Realistic timelines and rough costs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold mt-1">•</span>
                    <span>Whether we&apos;re actually the right fit for your project</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-white font-bold text-lg mb-4">Who You&apos;ll Speak To</h2>
                <p className="text-white/70 mb-4">
                  You&apos;ll be talking directly to Dan Cartwright - no account managers, 
                  no junior staff, no handoffs. Dan&apos;s a British Army veteran who founded 
                  ScopeSite after watching businesses get burned by agencies that overpromise 
                  and underdeliver.
                </p>
                <p className="text-white/70">
                  He&apos;ll give you straight advice, even if that means telling you we&apos;re 
                  not the right choice for your project. No hard sell. Ever.
                </p>
              </div>
            </div>
            <div className="mt-8 bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-6 text-center">
              <p className="text-white/80">
                <strong className="text-brand-gold">Not sure if you need a call?</strong>{' '}
                Try our <a href="/pricing" className="text-brand-gold underline hover:text-white transition-colors">instant quote calculator</a> first - 
                you might find exactly what you need without needing to talk to anyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cal.com Booking Section */}
      <section className="bg-white py-8">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <div
              id="cal-embed"
              style={{ width: '100%', minHeight: '600px', overflow: 'auto' }}
            />
            <Script
              id="cal-embed-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: CAL_INIT_SCRIPT }}
            />
            <p className="text-center text-brand-graphite/50 text-sm mt-4">
              Having trouble seeing the booking calendar?{' '}
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors"
                style={{ color: '#996D00' }}
              >
                Click here to book directly
              </a>.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-brand-navy/5">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-h2 text-brand-gold font-headline mb-2">
                30 min
              </div>
              <div className="text-body-sm text-brand-graphite">
                Focused strategy call
              </div>
            </div>
            <div>
              <div className="text-h2 text-brand-gold font-headline mb-2">
                100%
              </div>
              <div className="text-body-sm text-brand-graphite">
                Free, no obligation
              </div>
            </div>
            <div>
              <div className="text-h2 text-brand-gold font-headline mb-2">
                24hr
              </div>
              <div className="text-body-sm text-brand-graphite">
                Response time
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
