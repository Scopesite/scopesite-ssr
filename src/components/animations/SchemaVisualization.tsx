'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface SchemaNode {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'tertiary';
}

// Define nodes with their labels and types
const schemaNodes: SchemaNode[] = [
  { id: 'org', label: 'Organization', type: 'primary' },
  { id: 'person', label: 'Person', type: 'secondary' },
  { id: 'website', label: 'WebSite', type: 'secondary' },
  { id: 'service', label: 'Service', type: 'tertiary' },
  { id: 'faq', label: 'FAQPage', type: 'tertiary' },
  { id: 'webpage', label: 'WebPage', type: 'tertiary' },
  { id: 'blog', label: 'BlogPosting', type: 'tertiary' },
];

// Define connections between nodes
const connections = [
  { from: 'org', to: 'person' },
  { from: 'org', to: 'website' },
  { from: 'org', to: 'service' },
  { from: 'org', to: 'faq' },
  { from: 'website', to: 'webpage' },
  { from: 'website', to: 'blog' },
];

// Fixed pixel positions for clean layout (based on 800x300 viewBox)
const nodePositions: Record<string, { x: number; y: number }> = {
  org: { x: 400, y: 150 },      // Center
  person: { x: 150, y: 70 },    // Top left
  website: { x: 650, y: 70 },   // Top right
  service: { x: 100, y: 230 },  // Bottom left
  faq: { x: 280, y: 230 },      // Bottom center-left
  webpage: { x: 520, y: 230 },  // Bottom center-right
  blog: { x: 700, y: 230 },     // Bottom right
};

interface SchemaVisualizationProps {
  className?: string;
}

export function SchemaVisualization({ className = '' }: SchemaVisualizationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const getNodeColors = (type: SchemaNode['type']) => {
    switch (type) {
      case 'primary':
        return {
          fill: '#ECB615',
          stroke: '#ECB615',
          text: '#0A1B36',
        };
      case 'secondary':
        return {
          fill: 'rgba(236, 182, 21, 0.15)',
          stroke: 'rgba(236, 182, 21, 0.6)',
          text: '#ECB615',
        };
      case 'tertiary':
        return {
          fill: 'rgba(255, 255, 255, 0.05)',
          stroke: 'rgba(255, 255, 255, 0.2)',
          text: 'rgba(255, 255, 255, 0.8)',
        };
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Title */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-white font-bold text-xl mb-2">Auto-Generated Schema Structure</h3>
        <p className="text-white/50 text-sm">Interconnected structured data on every page</p>
      </motion.div>

      {/* Visualization Container */}
      <div className="relative bg-brand-graphite/30 rounded-2xl border border-white/10 overflow-hidden p-4">
        <svg 
          viewBox="0 0 800 300" 
          className="w-full h-auto"
          style={{ minHeight: '250px', maxHeight: '350px' }}
        >
          {/* Connection Lines */}
          {connections.map((conn, index) => {
            const fromPos = nodePositions[conn.from];
            const toPos = nodePositions[conn.to];
            
            return (
              <motion.line
                key={`${conn.from}-${conn.to}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="rgba(236, 182, 21, 0.4)"
                strokeWidth="2"
                strokeDasharray="6,4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.6,
                  delay: prefersReducedMotion ? 0 : 0.2 + index * 0.1,
                  ease: 'easeOut',
                }}
              />
            );
          })}

          {/* Schema Nodes */}
          {schemaNodes.map((node, index) => {
            const pos = nodePositions[node.id];
            const colors = getNodeColors(node.type);
            const textWidth = node.label.length * 8 + 24;
            const pillWidth = Math.max(textWidth, 80);
            const pillHeight = 32;
            
            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.4,
                  delay: prefersReducedMotion ? 0 : index * 0.08,
                  type: 'spring',
                  stiffness: 200,
                }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                {/* Pill shape */}
                <rect
                  x={pos.x - pillWidth / 2}
                  y={pos.y - pillHeight / 2}
                  width={pillWidth}
                  height={pillHeight}
                  rx={pillHeight / 2}
                  ry={pillHeight / 2}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="2"
                />
                
                {/* Text label */}
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={colors.text}
                  fontSize="13"
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                >
                  {node.label}
                </text>

                {/* Pulse effect for primary node */}
                {node.type === 'primary' && (
                  <motion.rect
                    x={pos.x - pillWidth / 2}
                    y={pos.y - pillHeight / 2}
                    width={pillWidth}
                    height={pillHeight}
                    rx={pillHeight / 2}
                    ry={pillHeight / 2}
                    fill="none"
                    stroke="#ECB615"
                    strokeWidth="2"
                    animate={{ 
                      scale: [1, 1.15, 1], 
                      opacity: [0.6, 0, 0.6] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: 'easeInOut' 
                    }}
                    style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                  />
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* @id Reference Label */}
        <motion.div
          className="absolute bottom-3 left-4 text-xs text-white/40 font-mono"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          Connected via @id references
        </motion.div>

        {/* JSON-LD indicator */}
        <motion.div
          className="absolute top-3 right-4 flex items-center gap-2 text-xs text-brand-gold/70 font-mono"
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          application/ld+json
        </motion.div>
      </div>
    </div>
  );
}
