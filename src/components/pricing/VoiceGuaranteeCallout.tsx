'use client';

import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VOICE_SPEC } from '@/lib/pricing-config';

interface VoiceGuaranteeCalloutProps {
  /**
   * Visual variant:
   *  - 'default' (navy card on light bg) for mid-flow use on the commitment step
   *  - 'highlight' (gold-accent card) for the summary page where it needs to pop
   */
  variant?: 'default' | 'highlight';
  className?: string;
}

/**
 * Prominent callout for the 80 Score Guarantee.
 * All copy pulled from VOICE_SPEC.guarantee — no hardcoded text.
 */
export function VoiceGuaranteeCallout({
  variant = 'default',
  className,
}: VoiceGuaranteeCalloutProps) {
  const { guarantee } = VOICE_SPEC;

  if (!guarantee.enabled) return null;

  return (
    <div
      className={cn(
        'rounded-xl p-5 md:p-6 border-2',
        variant === 'highlight'
          ? 'bg-brand-navy text-white border-brand-gold shadow-[0_0_20px_rgba(236,182,21,0.15)]'
          : 'bg-brand-gold/10 border-brand-gold/30',
        className
      )}
      role="note"
      aria-labelledby="voice-guarantee-heading"
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
            variant === 'highlight' ? 'bg-brand-gold' : 'bg-brand-navy'
          )}
        >
          <Target
            className={cn(
              'w-6 h-6',
              variant === 'highlight' ? 'text-brand-navy' : 'text-brand-gold'
            )}
          />
        </div>
        <div className="flex-1">
          <h3
            id="voice-guarantee-heading"
            className={cn(
              'font-headline font-black text-sm uppercase tracking-wider mb-2',
              variant === 'highlight' ? 'text-brand-gold' : 'text-brand-navy'
            )}
          >
            The {guarantee.name}
          </h3>
          <p
            className={cn(
              'text-body-sm leading-relaxed',
              variant === 'highlight' ? 'text-white/90' : 'text-brand-navy/80'
            )}
          >
            {guarantee.summary}
          </p>
        </div>
      </div>
    </div>
  );
}
