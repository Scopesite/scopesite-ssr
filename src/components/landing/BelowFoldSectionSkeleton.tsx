/** Lightweight placeholder for below-the-fold `next/dynamic` sections (RSC-safe). */
export function BelowFoldSectionSkeleton() {
  return (
    <div
      className="border-b border-brand-navy/10 bg-white/40 py-section"
      aria-busy="true"
      aria-label="Loading section"
    >
      <div className="container-content mx-auto max-w-4xl">
        <div className="min-h-[12rem] animate-pulse rounded-xl bg-brand-navy/[0.06]" />
      </div>
    </div>
  );
}
