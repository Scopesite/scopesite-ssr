import Image from 'next/image';
import Link from 'next/link';
import { PROOF } from '@/lib/territory/copy';
import { resolveProofImage } from '@/lib/territory/proof-images';
import { AIOverviewMockup } from './AIOverviewMockup';
import { H4TLTProofMockup } from './H4TLTProofMockup';

/**
 * ProofSection renders three case-study cards. Each card declares an
 * imageSlug; we resolve it to /territory/proof/{slug}.webp, falling back
 * to .png, falling back to an SVG mockup component. Resolution happens
 * at server-render time so the initial HTML contains either the real
 * image or the mockup - never a broken <img>.
 */
export function ProofSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-3xl sm:text-4xl text-brand-navy text-center mb-12">
          {PROOF.sectionTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PROOF.cards.map((card) => {
            const resolved = resolveProofImage(card.imageSlug);
            return (
              <article
                key={card.imageSlug}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  {resolved ? (
                    <Image
                      src={resolved}
                      alt={card.imageAlt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : card.mockup.kind === 'ai-overview' ? (
                    <AIOverviewMockup
                      variant={card.mockup.variant}
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <H4TLTProofMockup className="absolute inset-0 h-full w-full" />
                  )}
                </div>
                <div className="p-5 lg:p-6 flex-1 flex flex-col">
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed flex-1">
                    {card.caption}
                  </p>
                  {'link' in card && card.link ? (
                    <Link
                      href={card.link.href}
                      className="mt-4 inline-flex items-center text-brand-gold-accessible font-semibold hover:underline"
                    >
                      {card.link.label} &rarr;
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProofSection;
