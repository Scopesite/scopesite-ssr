'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';

interface CodeLine {
  content: string;
  type: 'comment' | 'tag' | 'attribute' | 'content' | 'string' | 'bracket';
}

interface CodeBlockProps {
  lines: CodeLine[];
  title?: string;
  speed?: number;
  delay?: number;
  className?: string;
  variant?: 'dark' | 'light';
}

const getColorClass = (type: CodeLine['type'], variant: 'dark' | 'light') => {
  if (variant === 'dark') {
    switch (type) {
      case 'comment': return 'text-white/40';
      case 'tag': return 'text-brand-gold';
      case 'attribute': return 'text-brand-orange';
      case 'content': return 'text-white';
      case 'string': return 'text-green-400';
      case 'bracket': return 'text-white/60';
      default: return 'text-white';
    }
  } else {
    switch (type) {
      case 'comment': return 'text-brand-navy/40';
      case 'tag': return 'text-brand-gold';
      case 'attribute': return 'text-brand-orange';
      case 'content': return 'text-brand-navy';
      case 'string': return 'text-green-600';
      case 'bracket': return 'text-brand-navy/60';
      default: return 'text-brand-navy';
    }
  }
};

export function CodeBlock({
  lines,
  title,
  speed = 30,
  delay = 0,
  className = '',
  variant = 'dark',
}: CodeBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentLineProgress, setCurrentLineProgress] = useState<number>(0);

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setVisibleLines(lines.length);
      setCurrentLineProgress(100);
      return;
    }

    const startTimeout = setTimeout(() => {
      let lineIndex = 0;
      let charIndex = 0;

      const interval = setInterval(() => {
        if (lineIndex >= lines.length) {
          clearInterval(interval);
          return;
        }

        const currentLine = lines[lineIndex];
        charIndex++;

        if (charIndex >= currentLine.content.length) {
          lineIndex++;
          charIndex = 0;
          setVisibleLines(lineIndex);
          setCurrentLineProgress(0);
        } else {
          setCurrentLineProgress((charIndex / currentLine.content.length) * 100);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [isInView, lines, speed, delay, prefersReducedMotion]);

  const bgClass = variant === 'dark' 
    ? 'bg-brand-graphite/80 border-white/10' 
    : 'bg-white border-brand-navy/10';

  return (
    <motion.div
      ref={ref}
      className={`rounded-xl border overflow-hidden ${bgClass} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      {/* Header */}
      {title && (
        <div className={`px-4 py-2 border-b ${variant === 'dark' ? 'border-white/10 bg-white/5' : 'border-brand-navy/10 bg-brand-navy/5'}`}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className={`text-xs font-mono ${variant === 'dark' ? 'text-white/50' : 'text-brand-navy/50'}`}>
              {title}
            </span>
          </div>
        </div>
      )}
      
      {/* Code content */}
      <div className="p-4 font-mono text-sm overflow-x-auto">
        <pre className="leading-relaxed">
          {lines.map((line, index) => {
            const isVisible = index < visibleLines || 
              (index === visibleLines && currentLineProgress > 0);
            const isCurrentLine = index === visibleLines;
            
            if (!isVisible && !prefersReducedMotion) return null;

            const displayContent = prefersReducedMotion || index < visibleLines
              ? line.content
              : line.content.slice(0, Math.floor((currentLineProgress / 100) * line.content.length));

            return (
              <div key={index} className="flex">
                <span className={`select-none w-8 ${variant === 'dark' ? 'text-white/20' : 'text-brand-navy/20'}`}>
                  {index + 1}
                </span>
                <span className={getColorClass(line.type, variant)}>
                  {displayContent}
                  {isCurrentLine && !prefersReducedMotion && (
                    <motion.span
                      className="text-brand-gold"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    >
                      |
                    </motion.span>
                  )}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
    </motion.div>
  );
}

// Pre-configured comparison blocks
export function CSRCodeBlock({ className = '' }: { className?: string }) {
  const lines: CodeLine[] = [
    { content: '// What AI crawlers see on a Wix/WordPress site:', type: 'comment' },
    { content: '<html>', type: 'tag' },
    { content: '  <body>', type: 'tag' },
    { content: '    <div id="root">', type: 'tag' },
    { content: '      <!-- Loading... -->', type: 'comment' },
    { content: '    </div>', type: 'tag' },
    { content: '    <script src="bundle.js"></script>', type: 'tag' },
    { content: '  </body>', type: 'tag' },
    { content: '</html>', type: 'tag' },
  ];

  return (
    <CodeBlock
      lines={lines}
      title="client-side-rendered.html"
      className={className}
      variant="dark"
    />
  );
}

export function SSRCodeBlock({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const lines: CodeLine[] = [
    { content: '// What AI crawlers see on an SSR site:', type: 'comment' },
    { content: '<html>', type: 'tag' },
    { content: '  <head>', type: 'tag' },
    { content: '    <title>Your Business | Services</title>', type: 'content' },
    { content: '  </head>', type: 'tag' },
    { content: '  <body>', type: 'tag' },
    { content: '    <article itemscope itemtype="WebPage">', type: 'tag' },
    { content: '      <h1>Your Full Content Here</h1>', type: 'content' },
    { content: '      <p>Every word, instantly readable...</p>', type: 'content' },
    { content: '    </article>', type: 'tag' },
    { content: '    <script type="application/ld+json">', type: 'tag' },
    { content: '      {"@context": "https://schema.org"...}', type: 'string' },
    { content: '    </script>', type: 'tag' },
    { content: '  </body>', type: 'tag' },
    { content: '</html>', type: 'tag' },
  ];

  return (
    <CodeBlock
      lines={lines}
      title="server-side-rendered.html"
      className={className}
      variant="dark"
      delay={delay}
    />
  );
}

