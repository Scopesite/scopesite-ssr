import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { GlossaryPopup } from './GlossaryPopup';
import {
  InlineImageFromFrontmatter,
  StatCallouts,
} from './GlossaryFrontmatterContext';
import { cn } from '@/lib/utils';

function confidenceClass(value: string): string | undefined {
  const normalized = value.trim().toUpperCase();
  if (normalized === 'HIGH') {
    return 'inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800';
  }
  if (normalized === 'MEDIUM') {
    return 'inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900';
  }
  return undefined;
}

function ConfidenceCell({ children }: { children: ReactNode }) {
  if (typeof children === 'string') {
    const pillClass = confidenceClass(children);
    if (pillClass) {
      return <span className={pillClass}>{children}</span>;
    }
  }

  if (Array.isArray(children)) {
    const text = children.join('').trim();
    const pillClass = confidenceClass(text);
    if (pillClass) {
      return <span className={pillClass}>{text}</span>;
    }
  }

  return <>{children}</>;
}

export function createGlossaryMdxComponents() {
  return {
    GlossaryPopup,
    StatCallouts,
    FeatureImage: () => null,
    InlineImage: InlineImageFromFrontmatter,
    a: ({
      href,
      children,
      ...props
    }: ComponentPropsWithoutRef<'a'>) => {
      const isExternal = href?.startsWith('http');
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-gold-accessible underline decoration-brand-gold/40 underline-offset-2 hover:text-brand-navy"
            {...props}
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href ?? '#'}
          className="font-medium text-brand-gold-accessible underline decoration-brand-gold/40 underline-offset-2 hover:text-brand-navy"
          {...props}
        >
          {children}
        </Link>
      );
    },
    p: ({
      className,
      children,
      ...props
    }: ComponentPropsWithoutRef<'p'>) => {
      const childText =
        typeof children === 'string'
          ? children
          : Array.isArray(children)
            ? children.join('')
            : '';
      const isSignOff = childText.includes('Cheers, Dan');

      return (
        <p
          className={cn(
            'mb-6 text-[1.125rem] leading-[1.8] text-brand-navy/90',
            className?.includes('glossary-definition') &&
              'my-8 rounded-r-xl border-l-4 border-brand-gold bg-brand-gold/[0.08] p-6 text-[1.25rem] font-semibold leading-relaxed text-brand-navy not-italic',
            isSignOff &&
              'mt-10 border-t border-brand-navy/10 pt-6 text-base italic text-brand-navy/70',
            className
          )}
          {...props}
        >
          {children}
        </p>
      );
    },
    h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => (
      <h1
        className="mb-6 font-headline text-4xl leading-tight text-brand-navy sm:text-5xl"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
      <h2
        className="mb-4 mt-14 scroll-mt-24 font-headline text-2xl font-bold text-brand-navy sm:text-3xl"
        {...props}
      >
        {children}
      </h2>
    ),
    hr: () => <hr className="my-10 border-brand-navy/10" />,
    table: ({ children, ...props }: ComponentPropsWithoutRef<'table'>) => (
      <div className="my-8 overflow-x-auto not-prose">
        <table
          className="w-full min-w-[32rem] border-collapse text-left text-sm"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: ComponentPropsWithoutRef<'thead'>) => (
      <thead className="border-b border-brand-navy/15 bg-brand-navy/[0.03]" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: ComponentPropsWithoutRef<'th'>) => (
      <th className="px-4 py-3 font-semibold text-brand-navy" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: ComponentPropsWithoutRef<'td'>) => (
      <td className="border-t border-brand-navy/10 px-4 py-3 align-top text-brand-navy/80" {...props}>
        <ConfidenceCell>{children}</ConfidenceCell>
      </td>
    ),
    strong: ({ children, ...props }: ComponentPropsWithoutRef<'strong'>) => (
      <strong className="font-semibold text-brand-navy" {...props}>
        {children}
      </strong>
    ),
  };
}
