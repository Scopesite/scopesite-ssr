'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface VisualProgressProps {
  progress: number; // 0-100
  status: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function VisualProgress({ 
  progress, 
  status,
  showLabel = true, 
  size = 'md',
  animated = true 
}: VisualProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const isComplete = status === 'invoice_paid' || status === 'invoice_sent';
  const actualProgress = isComplete ? 100 : Math.min(100, Math.max(0, progress));

  // Animate progress on mount
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(actualProgress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      queueMicrotask(() => setDisplayProgress(actualProgress));
    }
  }, [actualProgress, animated]);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const getStatusMessage = () => {
    if (isComplete) return 'Project Complete';
    if (actualProgress === 0) return 'Not started yet';
    if (actualProgress < 25) return 'Just getting started';
    if (actualProgress < 50) return 'Making progress';
    if (actualProgress < 75) return 'Over halfway there';
    if (actualProgress < 100) return 'Nearly complete';
    return 'Complete';
  };

  const getGradient = () => {
    if (isComplete) {
      return 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400';
    }
    if (actualProgress < 33) {
      return 'bg-gradient-to-r from-brand-gold via-amber-400 to-yellow-400';
    }
    if (actualProgress < 66) {
      return 'bg-gradient-to-r from-brand-gold via-orange-400 to-amber-400';
    }
    return 'bg-gradient-to-r from-emerald-500 via-brand-gold to-amber-400';
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <Clock className="w-5 h-5 text-brand-gold" />
            )}
            <span className="text-sm font-medium text-brand-navy">
              {getStatusMessage()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {isComplete && <Sparkles className="w-4 h-4 text-brand-gold" />}
            <span className={`text-lg font-bold ${isComplete ? 'text-emerald-600' : 'text-brand-navy'}`}>
              {Math.round(displayProgress)}%
            </span>
          </div>
        </div>
      )}

      {/* Progress bar container */}
      <div className={`relative ${sizeClasses[size]} bg-gray-100 rounded-full overflow-hidden shadow-inner`}>
        {/* Background shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        
        {/* Progress fill */}
        <div
          className={`
            absolute inset-y-0 left-0 rounded-full
            ${getGradient()}
            transition-all duration-1000 ease-out
            ${animated ? 'transform-gpu' : ''}
          `}
          style={{ width: `${displayProgress}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10" />
          
          {/* Animated pulse at the end when in progress */}
          {!isComplete && displayProgress > 0 && displayProgress < 100 && (
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/50 rounded-full animate-pulse" />
          )}
        </div>

        {/* Completion glow effect */}
        {isComplete && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 animate-pulse" />
        )}
      </div>

      {/* Milestone markers (optional for larger sizes) */}
      {size === 'lg' && (
        <div className="flex justify-between px-1 text-xs text-brand-navy/40">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for cards/lists
 */
export function VisualProgressCompact({ progress, status }: { progress: number; status: string }) {
  const isComplete = status === 'invoice_paid' || status === 'invoice_sent';
  const actualProgress = isComplete ? 100 : Math.min(100, Math.max(0, progress));

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete 
              ? 'bg-emerald-500' 
              : 'bg-gradient-to-r from-brand-gold to-amber-400'
          }`}
          style={{ width: `${actualProgress}%` }}
        />
      </div>
      <span className={`text-xs font-medium tabular-nums ${
        isComplete ? 'text-emerald-600' : 'text-brand-navy/60'
      }`}>
        {Math.round(actualProgress)}%
      </span>
    </div>
  );
}
