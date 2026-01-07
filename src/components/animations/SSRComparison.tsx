'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Loader2, Zap } from 'lucide-react';

interface SSRComparisonProps {
  className?: string;
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

export function SSRComparison({
  className = '',
  autoPlay = true,
  autoPlayDelay = 1000,
}: SSRComparisonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [phase, setPhase] = useState<'loading' | 'loaded'>('loading');
  const [hasAnimated, setHasAnimated] = useState(false);

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (!isInView || hasAnimated || !autoPlay) return;

    if (prefersReducedMotion) {
      setPhase('loaded');
      setHasAnimated(true);
      return;
    }

    // Start animation sequence
    const timer1 = setTimeout(() => {
      setPhase('loaded');
      setHasAnimated(true);
    }, autoPlayDelay + 2000);

    return () => {
      clearTimeout(timer1);
    };
  }, [isInView, hasAnimated, autoPlay, autoPlayDelay, prefersReducedMotion]);

  return (
    <div ref={ref} className={`grid md:grid-cols-2 gap-6 ${className}`}>
      {/* CSR Side */}
      <motion.div
        className="relative rounded-2xl border border-white/10 bg-brand-graphite/50 overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 bg-red-500/10">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-white">Traditional Website (CSR)</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[300px]">
          {/* Browser mockup */}
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <AnimatePresence mode="wait">
              {phase === 'loading' ? (
                <motion.div
                  key="csr-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {/* Skeleton loader */}
                  <div className="h-6 bg-white/10 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
                  <div className="h-4 bg-white/10 rounded animate-pulse w-5/6" />
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
                  </div>
                  <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
                </motion.div>
              ) : (
                <motion.div
                  key="csr-loaded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div className="h-6 bg-white/20 rounded w-3/4" />
                  <div className="h-4 bg-white/15 rounded w-full" />
                  <div className="h-4 bg-white/15 rounded w-5/6" />
                  <div className="h-20 bg-white/10 rounded" />
                  <div className="h-4 bg-white/15 rounded w-2/3" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* What AI sees */}
          <div className="space-y-2">
            <span className="text-xs text-white/50 uppercase tracking-wider">What AI Crawlers See:</span>
            <div className="font-mono text-sm bg-black/30 rounded-lg p-3 text-red-400">
              <span className="text-white/40">&lt;div</span> id=&quot;root&quot;<span className="text-white/40">&gt;&lt;/div&gt;</span>
            </div>
          </div>

          {/* Status indicators */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-white/60">JavaScript required</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-white/60">Content invisible to AI</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-white/60">No schema markup</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-red-500"
            initial={{ width: 0 }}
            animate={isInView ? { width: phase === 'loaded' ? '100%' : '30%' } : { width: 0 }}
            transition={{ duration: phase === 'loading' ? 2 : 0.5 }}
          />
        </div>
      </motion.div>

      {/* SSR Side */}
      <motion.div
        className="relative rounded-2xl border border-brand-gold/30 bg-brand-graphite/50 overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          boxShadow: '0 0 40px rgba(236, 182, 21, 0.15)',
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-brand-gold/20 bg-green-500/10">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-medium text-white">SSR Website (Next.js)</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[300px]">
          {/* Browser mockup - Always fully rendered */}
          <motion.div
            className="bg-white/5 rounded-lg p-4 mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="space-y-3">
              <div className="h-6 bg-brand-gold/30 rounded w-3/4" />
              <div className="h-4 bg-white/20 rounded w-full" />
              <div className="h-4 bg-white/20 rounded w-5/6" />
              <div className="h-20 bg-white/15 rounded flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div className="h-4 bg-white/20 rounded w-2/3" />
            </div>
          </motion.div>

          {/* What AI sees */}
          <div className="space-y-2">
            <span className="text-xs text-white/50 uppercase tracking-wider">What AI Crawlers See:</span>
            <div className="font-mono text-xs bg-black/30 rounded-lg p-3 text-green-400 overflow-x-auto">
              <div><span className="text-brand-gold">&lt;article</span> <span className="text-brand-orange">itemscope</span><span className="text-brand-gold">&gt;</span></div>
              <div className="pl-2"><span className="text-brand-gold">&lt;h1&gt;</span><span className="text-white">Your Content</span><span className="text-brand-gold">&lt;/h1&gt;</span></div>
              <div className="pl-2"><span className="text-brand-gold">&lt;p&gt;</span><span className="text-white">Full text...</span><span className="text-brand-gold">&lt;/p&gt;</span></div>
              <div><span className="text-brand-gold">&lt;/article&gt;</span></div>
            </div>
          </div>

          {/* Status indicators */}
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-white/60">No JavaScript needed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-white/60">Instant AI visibility</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-white/60">Rich schema included</span>
            </div>
          </motion.div>
        </div>

        {/* Progress bar - Instant */}
        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={isInView ? { width: '100%' } : { width: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  );
}



