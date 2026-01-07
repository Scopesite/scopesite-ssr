'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface LighthouseGaugeProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  delay?: number;
  className?: string;
}

export function LighthouseGauge({
  score,
  label,
  size = 120,
  strokeWidth = 8,
  delay = 0,
  className = '',
}: LighthouseGaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Color based on score
  const getColor = () => {
    if (score >= 90) return '#22c55e'; // Green
    if (score >= 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <div ref={ref} className={`relative inline-flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-white/10"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1.5,
              delay: prefersReducedMotion ? 0 : delay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{
              filter: `drop-shadow(0 0 8px ${getColor()}40)`,
            }}
          />
        </svg>
        
        {/* Score number in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              delay: prefersReducedMotion ? 0 : delay + 0.5,
            }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      
      {/* Label */}
      <motion.span
        className="mt-2 text-sm text-white/70 font-medium"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          delay: prefersReducedMotion ? 0 : delay + 0.8,
        }}
      >
        {label}
      </motion.span>
    </div>
  );
}

// Compact version for inline use
interface LighthouseGaugeInlineProps {
  score: number;
  label?: string;
  className?: string;
}

export function LighthouseGaugeInline({
  score,
  label,
  className = '',
}: LighthouseGaugeInlineProps) {
  return (
    <LighthouseGauge
      score={score}
      label={label || ''}
      size={80}
      strokeWidth={6}
      className={className}
    />
  );
}


