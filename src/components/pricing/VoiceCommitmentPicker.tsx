'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/calculate-quote';
import { VOICE_SPEC } from '@/lib/pricing-config';
import type { VoiceCommitment } from '@/types/pricing';

interface VoiceCommitmentPickerProps {
  value?: VoiceCommitment;
  onChange: (value: VoiceCommitment) => void;
}

/**
 * Two-card commitment picker for standalone V.O.I.C.E™ flows.
 * Reads all pricing, labels, and copy from VOICE_SPEC.commitmentOptions
 * (no hardcoded numbers).
 *
 * Used when projectType === 'visibility'. Replaces the generic 4-option
 * contract picker for this flow.
 */
export function VoiceCommitmentPicker({ value, onChange }: VoiceCommitmentPickerProps) {
  const { six, twelve } = VOICE_SPEC.commitmentOptions;

  const options: Array<{
    id: VoiceCommitment;
    data: typeof six | typeof twelve;
    badgeStyle: string;
    isBestValue: boolean;
  }> = [
    {
      id: 'six',
      data: six,
      badgeStyle: 'bg-brand-navy text-white',
      isBestValue: false,
    },
    {
      id: 'twelve',
      data: twelve,
      badgeStyle: 'bg-brand-gold text-brand-navy',
      isBestValue: true,
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-brand-graphite">
        Choose your V.O.I.C.E™ commitment. No setup fee, fully monthly — cancel
        anytime after the minimum term with {VOICE_SPEC.noticePeriodDays} days notice.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {options.map(({ id, data, badgeStyle, isBestValue }) => {
          const isSelected = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-pressed={isSelected}
              className={cn(
                'relative flex flex-col text-left p-5 rounded-xl border-2 transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2',
                isSelected
                  ? isBestValue
                    ? 'border-brand-gold bg-brand-gold/10 shadow-[0_0_20px_rgba(236,182,21,0.2)]'
                    : 'border-brand-gold bg-brand-gold/5'
                  : 'border-brand-graphite/20 hover:border-brand-gold/50'
              )}
            >
              <span
                className={cn(
                  'absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1',
                  badgeStyle
                )}
              >
                {isBestValue && <Star className="w-3 h-3" />}
                {data.badge}
              </span>

              <div className="pt-2">
                <h3 className="font-bold text-brand-navy text-lg mb-1">
                  {data.label}
                </h3>
                <p className="text-body-sm text-brand-graphite mb-4">
                  {data.description}
                </p>

                <div className="mb-4">
                  <span className="text-3xl font-headline text-brand-gold font-bold">
                    {formatCurrency(data.monthlyPrice)}
                  </span>
                  <span className="text-body-sm text-brand-graphite ml-1">/mo</span>
                </div>

                <div className="space-y-1 text-body-sm text-brand-navy/70">
                  <div className="flex justify-between">
                    <span>Setup fee</span>
                    <span className="font-medium">{formatCurrency(VOICE_SPEC.setupFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total over {data.months} months</span>
                    <span className="font-bold text-brand-navy">
                      {formatCurrency(data.totalCost)}
                    </span>
                  </div>
                  {'savingsVsSixMonth' in data && (
                    <div className="flex justify-between pt-2 mt-1 border-t border-brand-graphite/10">
                      <span className="text-green-700 font-medium">
                        Save vs 6-month
                      </span>
                      <span className="text-green-700 font-bold">
                        {formatCurrency(data.savingsVsSixMonth)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-caption text-brand-graphite/70 text-center">
        Minimum commitment: {VOICE_SPEC.minimumCommitmentMonths} months •{' '}
        {VOICE_SPEC.noticePeriodDays}-day notice period after that
      </p>
    </div>
  );
}
