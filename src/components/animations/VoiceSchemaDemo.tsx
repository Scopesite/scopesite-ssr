'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { TypeWriter } from './TypeWriter';
import { AnimatedCounter } from './AnimatedCounter';
import {
  User,
  Building2,
  HelpCircle,
  Mic,
  Tag,
  Link2,
  TrendingUp,
  Check,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Stage 1 – "You Publish"
// ---------------------------------------------------------------------------

function Stage1Publish({ active }: { active: boolean }) {
  const [pressed, setPressed] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t1 = setTimeout(() => setPressed(true), 800);
    const t2 = setTimeout(() => {
      setPressed(false);
      setPulsing(true);
    }, 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#16213e] rounded-lg border border-white/10 overflow-hidden shadow-xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 text-xs text-white/40 font-mono">Blog Editor</span>
        </div>

        {/* Editor body */}
        <div className="p-5 space-y-4">
          {/* Title field */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Title</div>
            <div className="text-white font-semibold text-sm leading-tight">
              3 SEO Mistakes Frome Businesses Make
            </div>
          </div>

          {/* Fake body lines */}
          <div className="space-y-2">
            <div className="h-2.5 bg-white/8 rounded w-full" />
            <div className="h-2.5 bg-white/8 rounded w-11/12" />
            <div className="h-2.5 bg-white/6 rounded w-10/12" />
            <div className="h-2.5 bg-white/6 rounded w-9/12" />
            <div className="h-2.5 bg-white/4 rounded w-8/12" />
          </div>

          {/* Publish button */}
          <div className="flex justify-end pt-2 relative">
            <motion.button
              className="relative bg-brand-gold text-brand-navy font-bold text-xs px-5 py-2 rounded-md cursor-default"
              animate={
                pressed
                  ? { scale: 0.92 }
                  : { scale: 1 }
              }
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              aria-hidden="true"
              tabIndex={-1}
            >
              Publish
              {/* Glow ring */}
              {pulsing && (
                <span className="absolute inset-0 rounded-md animate-pulse-subtle pointer-events-none" />
              )}
            </motion.button>

            {/* Radiating gold ring */}
            <AnimatePresence>
              {pulsing && (
                <motion.span
                  className="absolute inset-0 rounded-md border-2 border-brand-gold pointer-events-none"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stage 2 – "Schema Generates"
// ---------------------------------------------------------------------------

const schemaBlocks = [
  { label: 'Author: Dan Cartwright', Icon: User, delay: 0.3 },
  { label: 'Publisher: ScopeSite', Icon: Building2, delay: 0.6 },
  { label: 'FAQ: 5 Questions', Icon: HelpCircle, delay: 0.9 },
  { label: 'Speakable: 8 Sections', Icon: Mic, delay: 1.2 },
  { label: 'About: Web Design, AI', Icon: Tag, delay: 1.5 },
  { label: 'Mentions: ChatGPT, Next.js', Icon: Link2, delay: 1.8 },
];

function Stage2Schema({ active }: { active: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setVisibleCount(0);
      return;
    }
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= schemaBlocks.length) clearInterval(iv);
    }, 350);
    return () => clearInterval(iv);
  }, [active]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative bg-[#16213e] rounded-lg border border-white/10 p-5 shadow-xl">
        {/* Counter */}
        <div className="absolute top-3 right-4 flex items-center gap-2 text-xs font-mono">
          <span className="text-white/50">Schema Types:</span>
          <span className="text-brand-gold font-bold">
            {active ? (
              <AnimatedCounter value={6} duration={2.5} className="text-brand-gold" />
            ) : (
              '0'
            )}
          </span>
        </div>

        {/* Central node */}
        <motion.div
          className="mx-auto w-fit mb-5 mt-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="bg-brand-gold text-brand-navy font-bold text-sm px-5 py-2 rounded-lg text-center shadow-lg shadow-brand-gold/20">
            BlogPosting
          </div>
        </motion.div>

        {/* Connected blocks */}
        <div className="grid grid-cols-2 gap-3">
          {schemaBlocks.map((block, idx) => {
            const show = active && idx < visibleCount;
            return (
              <motion.div
                key={block.label}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={show ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <block.Icon className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span className="text-white/80 text-xs leading-tight">{block.label}</span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={show ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
                >
                  <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                </motion.span>
              </motion.div>
            );
          })}
        </div>

        {/* JSON-LD indicator */}
        <motion.div
          className="mt-4 flex items-center gap-2 text-[10px] text-white/30 font-mono"
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2.2 }}
        >
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          application/ld+json injected
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stage 3 – "AI Recommends You"
// ---------------------------------------------------------------------------

const AI_RESPONSE =
  'Based on my analysis, ScopeSite Digital Studios in Frome offers AI-optimised websites with perfect Lighthouse scores and full schema markup.';

function Stage3Recommend({ active }: { active: boolean }) {
  const [typewriterDone, setTypewriterDone] = useState(false);
  const handleComplete = useCallback(() => setTypewriterDone(true), []);

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Chat panel */}
      <div className="bg-[#16213e] rounded-lg border border-white/10 p-4 shadow-xl">
        <div className="text-[10px] uppercase tracking-wider text-white/30 mb-3 font-mono">
          AI Assistant
        </div>

        {/* User bubble */}
        <div className="flex justify-end mb-3">
          <div className="bg-white/10 text-white/90 text-xs rounded-xl rounded-br-sm px-3 py-2 max-w-[80%]">
            Who is the best web designer in Frome?
          </div>
        </div>

        {/* AI response bubble */}
        <div className="flex justify-start">
          <div className="bg-[#0d1729] border-l-2 border-brand-gold text-white/80 text-xs rounded-xl rounded-bl-sm px-3 py-2 max-w-[90%] min-h-[3rem]">
            {active ? (
              <TypeWriter
                text={AI_RESPONSE}
                speed={25}
                delay={400}
                showCursor={!typewriterDone}
                onComplete={handleComplete}
                className="leading-relaxed"
              />
            ) : (
              <span className="text-white/30">...</span>
            )}
            {typewriterDone && (
              <motion.span
                className="inline"
                initial={{ backgroundColor: 'transparent' }}
                animate={{ backgroundColor: 'rgba(236, 182, 21, 0.2)' }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Metrics panel */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'AI Citations', value: 47, suffix: '' },
          { label: 'Organic Traffic', value: 312, suffix: '%' },
          { label: 'Enquiries', value: 24, suffix: '' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#16213e] rounded-lg border border-white/10 p-3 text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
            </div>
            <div className="text-brand-gold font-bold text-lg leading-none">
              {active ? (
                <AnimatedCounter
                  value={stat.value}
                  duration={2}
                  delay={0.5}
                  suffix={stat.suffix}
                  className="text-brand-gold"
                />
              ) : (
                '0'
              )}
            </div>
            <div className="text-white/40 text-[10px] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stage indicator bar
// ---------------------------------------------------------------------------

const STAGE_LABELS = ['Publish', 'Schema Generates', 'AI Recommends'];

function StageIndicator({ current }: { current: number }) {
  return (
    <div className="flex justify-center gap-6 md:gap-8 mb-8">
      {STAGE_LABELS.map((label, i) => {
        const stageNum = i + 1;
        const isActive = stageNum <= current;
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isActive ? 'bg-brand-gold' : 'bg-white/20'
              }`}
            />
            <span
              className={`text-xs font-medium transition-colors duration-300 ${
                isActive ? 'text-brand-gold' : 'text-white/30'
              }`}
            >
              {stageNum}. {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Static fallback (reduced motion / noscript)
// ---------------------------------------------------------------------------

function StaticFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Stage 1 */}
      <div className="bg-[#16213e] rounded-lg border border-white/10 p-5">
        <div className="text-brand-gold font-bold text-xs uppercase tracking-wider mb-3">
          1. Publish
        </div>
        <div className="text-white font-semibold text-sm mb-2">
          You write and publish a blog post in Ghost CMS
        </div>
        <div className="space-y-1.5">
          <div className="h-2 bg-white/8 rounded w-full" />
          <div className="h-2 bg-white/6 rounded w-11/12" />
          <div className="h-2 bg-white/4 rounded w-9/12" />
        </div>
        <div className="mt-3 text-right">
          <span className="bg-brand-gold text-brand-navy text-xs font-bold px-3 py-1 rounded">
            Publish
          </span>
        </div>
      </div>

      {/* Stage 2 */}
      <div className="bg-[#16213e] rounded-lg border border-white/10 p-5">
        <div className="text-brand-gold font-bold text-xs uppercase tracking-wider mb-3">
          2. Schema Generates
        </div>
        <div className="text-white font-semibold text-sm mb-3">
          6 schema types auto-generated
        </div>
        <div className="space-y-2">
          {schemaBlocks.map((block) => (
            <div key={block.label} className="flex items-center gap-2 text-xs text-white/70">
              <block.Icon className="w-3 h-3 text-brand-gold" />
              <span>{block.label}</span>
              <Check className="w-3 h-3 text-green-400 ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Stage 3 */}
      <div className="bg-[#16213e] rounded-lg border border-white/10 p-5">
        <div className="text-brand-gold font-bold text-xs uppercase tracking-wider mb-3">
          3. AI Recommends
        </div>
        <div className="bg-[#0d1729] border-l-2 border-brand-gold rounded-lg p-3 text-xs text-white/80 mb-3">
          &quot;Based on my analysis, ScopeSite Digital Studios in Frome offers AI-optimised
          websites with perfect Lighthouse scores...&quot;
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-brand-gold font-bold text-sm">47</div>
            <div className="text-white/40 text-[9px]">AI Citations</div>
          </div>
          <div>
            <div className="text-brand-gold font-bold text-sm">312%</div>
            <div className="text-white/40 text-[9px]">Traffic</div>
          </div>
          <div>
            <div className="text-brand-gold font-bold text-sm">24</div>
            <div className="text-white/40 text-[9px]">Enquiries</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export function VoiceSchemaDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;

    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 3500);
    const t3 = setTimeout(() => setStage(3), 7500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isInView, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div ref={containerRef}>
        <StaticFallback />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <StageIndicator current={stage} />

      {/* Animated stage container */}
      <div className="relative min-h-[360px] md:min-h-[320px]">
        <AnimatePresence mode="wait">
          {stage === 1 && (
            <motion.div
              key="stage1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-start justify-center"
            >
              <Stage1Publish active />
            </motion.div>
          )}
          {stage === 2 && (
            <motion.div
              key="stage2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-start justify-center"
            >
              <Stage2Schema active />
            </motion.div>
          )}
          {stage === 3 && (
            <motion.div
              key="stage3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-start justify-center"
            >
              <Stage3Recommend active />
            </motion.div>
          )}
          {stage === 0 && (
            <motion.div
              key="placeholder"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0.3 }}
            >
              <div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
