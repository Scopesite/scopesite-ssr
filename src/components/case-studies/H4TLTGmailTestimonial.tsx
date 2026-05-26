/**
 * H4TLT Gmail-style Testimonial Card
 *
 * GDPR / UK DPA 2018 NOTICE
 * -------------------------
 * The original email from Mark Ashmore contained business landline,
 * personal mobile, and personal email address in the signature block.
 * Those data items are intentionally NOT reproduced in this component.
 * Lawful basis for sharing details with ScopeSite was contract performance
 * (Article 6(1)(b)); republishing on a public marketing page is a separate
 * processing purpose with no lawful basis on file.
 *
 * Do not reintroduce:
 *   - Mark's email address
 *   - Mark's landline
 *   - Mark's mobile
 *   - Dan's email address
 *
 * The visible "Contact details removed for privacy" caption is a legal
 * requirement, not optional decoration. Do not remove.
 */

import Image from 'next/image';
import {
  ArrowLeft,
  Archive,
  AlertOctagon,
  Trash2,
  MoreVertical,
  Star,
} from 'lucide-react';

const H4TLT_BLUE = '#0083cb';
const GMAIL_BLUE = '#1A73E8';
const GMAIL_STAR = '#F4B400';

export function H4TLTGmailTestimonial() {
  return (
    <div className="max-w-3xl mx-auto">
      <article
        aria-label="Client testimonial from Mark Ashmore, Hear 4 The Long Term, dated 14 April 2026"
        className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden font-sans"
      >
        {/* Gmail-style toolbar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#f4f4f4] border-b border-slate-200 text-slate-500">
          <div className="flex items-center gap-4 sm:gap-5">
            <ArrowLeft size={18} aria-hidden="true" />
            <Archive size={18} aria-hidden="true" className="hidden sm:block" />
            <AlertOctagon size={18} aria-hidden="true" className="hidden sm:block" />
            <Trash2 size={18} aria-hidden="true" className="hidden sm:block" />
          </div>
          <MoreVertical size={18} aria-hidden="true" />
        </header>

        {/* Subject row */}
        <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <Star
              size={22}
              role="img"
              aria-label="starred"
              className="flex-shrink-0 mt-1 fill-amber-400 text-amber-400"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
                  Re: UK&rsquo;s Top HSE Industrial hearing test company
                </h3>
                <span
                  className="self-start inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-white bg-brand-navy whitespace-nowrap"
                >
                  Client Testimonial
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sender block */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <Image
              src="/images/mark-ashmore-h4tlt-headshot.png"
              alt="Mark Ashmore"
              width={40}
              height={40}
              className="flex-shrink-0 w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    Mark Ashmore
                  </p>
                  <p className="text-xs text-slate-500">
                    Founder, Hear 4 The Long Term
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    to ScopeSite Digital Studios
                  </p>
                </div>
                <p className="text-xs text-slate-500 sm:text-right whitespace-nowrap">
                  Tue, 14 Apr 2026, 19:06
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-6 text-slate-800 text-[15px] leading-relaxed space-y-4">
          <p>Hi Dan</p>
          <p>
            Proof positive you know what you&rsquo;re at! Excellent result which we can only build
            on. Well done &amp; thanks. Onwards and upwards!
          </p>
          <p>Cheers</p>
          <p>Mark</p>

          {/* Signature */}
          <hr className="my-5 border-slate-200" />
          <div className="space-y-1.5 text-[13px]">
            <p className="font-bold text-slate-900">Mark Ashmore</p>
            <p className="italic text-slate-600">Founder</p>
            <div className="flex items-center gap-2 pt-1">
              <Image
                src="/images/hear_4_the_long_term_logo.webp"
                alt="Hear 4 The Long Term logo"
                width={28}
                height={28}
                className="h-7 w-auto"
              />
              <span
                className="font-bold"
                style={{ color: H4TLT_BLUE }}
              >
                Hear 4 The Long Term
              </span>
            </div>
            <p className="text-xs text-slate-500">RHAD, MIOA</p>
          </div>
        </div>

        {/* Footer action bar (visual only, non-interactive) */}
        <footer className="px-4 sm:px-6 py-4 bg-[#f4f4f4] border-t border-slate-200 flex gap-3">
          <span
            aria-hidden="true"
            className="inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-medium"
            style={{ color: GMAIL_BLUE, borderColor: GMAIL_BLUE }}
          >
            Reply
          </span>
          <span
            aria-hidden="true"
            className="inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-medium"
            style={{ color: GMAIL_BLUE, borderColor: GMAIL_BLUE }}
          >
            Forward
          </span>
        </footer>
      </article>

      <p className="mt-4 text-xs italic text-slate-500 text-center sm:text-left leading-relaxed">
        Excerpt from email correspondence with Mark Ashmore, RHAD, MIOA, Founder of Hear 4 The Long
        Term. Reproduced with permission as part of the H4TLT case study engagement. Contact details
        removed for privacy.
      </p>
    </div>
  );
}

export default H4TLTGmailTestimonial;
