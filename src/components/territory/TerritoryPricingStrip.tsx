'use client';

import type { PostcodeDisplayState } from '@/lib/territory/postcodePricingLogic';
import {
  effectiveMonthlyGbp,
  effectiveSetupGbp,
} from '@/lib/territory/postcodePricingLogic';
import { PromotionCountdown } from '@/components/territory/PromotionCountdown';

function formatSetupGbp(setup: number | null): string {
  if (setup === null || setup === 0) return 'No setup fee';
  return `£${setup.toFixed(0)} setup`;
}

interface Props {
  state: PostcodeDisplayState;
  onPromoExpired?: () => void;
  /** Promo monthly price emphasis (ResultCard uses brand gold; modal uses navy). */
  promoMonthlyClassName?: string;
}

export function TerritoryPricingStrip({
  state,
  onPromoExpired,
  promoMonthlyClassName = 'text-2xl font-black text-brand-navy',
}: Props) {
  const tierLabel = state.tier === 'premium' ? 'Premium' : 'Standard';

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
            state.tier === 'premium'
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          {tierLabel}
        </span>
      </div>

      {state.isPromotional && state.promotion ? (
        <div
          className={`rounded-xl border p-4 ${
            state.promotion.originTier === 'premium'
              ? 'border-purple-300 bg-gradient-to-br from-amber-50 via-amber-50 to-purple-100'
              : 'border-amber-200 bg-amber-50/90'
          }`}
        >
          {state.promotion.headline ? (
            <p className="font-headline text-lg text-brand-navy">{state.promotion.headline}</p>
          ) : (
            <p className="font-headline text-lg text-brand-navy">Limited-time offer</p>
          )}
          {state.promotion.description ? (
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">{state.promotion.description}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <span className={promoMonthlyClassName}>
              £{state.promotion.promotionalMonthlyPriceGbp.toFixed(0)}/mo
            </span>
            <span className="text-sm text-slate-500 line-through">
              £{state.baseMonthlyPriceGbp.toFixed(0)}/mo
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-3 text-sm text-slate-700">
            <span className="font-semibold text-brand-navy">
              {formatSetupGbp(effectiveSetupGbp(state))}
            </span>
            {state.baseSetupFeeGbp != null &&
            state.baseSetupFeeGbp > 0 &&
            effectiveSetupGbp(state) !== state.baseSetupFeeGbp ? (
              <span className="text-slate-500 line-through">
                {formatSetupGbp(state.baseSetupFeeGbp)}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Ends in{' '}
            <PromotionCountdown
              expiresAt={state.promotion.expiresAt}
              onExpired={onPromoExpired}
            />
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-4">
          <p className="font-headline text-lg text-brand-navy">
            £{effectiveMonthlyGbp(state).toFixed(0)}/mo
            <span className="text-base font-normal text-slate-600">
              {' '}
              · {formatSetupGbp(effectiveSetupGbp(state))}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
