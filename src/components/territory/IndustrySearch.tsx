'use client';

/**
 * Territory Command - shared industry picker.
 *
 * A single searchable combobox used in THREE places on /territory so the
 * UX never diverges:
 *
 *   - TerritoryChecker (hero bar)     - for the availability-check flow.
 *   - PilotCheckerModal (map pilot click) - for the apply flow.
 *   - AreaWaitlistForm (reserve/non-pilot) - for the waitlist flow.
 *
 * The component is controlled via `value` + `onChange`. It displays
 * `value.label` (for known sectors) or `value.text` (for freeform
 * entries) in the input while the user is not actively editing. Typing
 * flips to an internal "editing" mode - the parent's committed value
 * clears immediately via `onChange(null)` so dependent CTAs
 * (Continue / Submit / Check) disable until the user re-commits.
 *
 * Freeform industries are captured inline: if the typed text matches no
 * sector in the taxonomy, pressing Enter commits the raw text as a
 * freeform value. There is NO separate "Industry not listed?" link.
 */

import { useMemo, useRef, useState } from 'react';
import type { SectorTile } from '@/lib/territory/types';

export type IndustryValue =
  | { kind: 'sector'; slug: string; label: string }
  | { kind: 'freeform'; text: string };

interface Props {
  allSectors: SectorTile[];
  value: IndustryValue | null;
  onChange: (value: IndustryValue | null) => void;
  inputId?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  /**
   * Forwarded to the input for aria-describedby so screen readers announce
   * any form-level error/help text the parent renders.
   */
  ariaDescribedBy?: string;
}

const MAX_RESULTS = 8;

function valueAsText(v: IndustryValue | null): string {
  if (!v) return '';
  return v.kind === 'sector' ? v.label : v.text;
}

export function IndustrySearch({
  allSectors,
  value,
  onChange,
  inputId,
  placeholder = 'Start typing your industry...',
  className,
  required = true,
  ariaDescribedBy,
}: Props) {
  // `editing` drives whether the input reflects internal `query` or the
  // parent's `value`. Typing into the input flips it true; committing
  // (Enter / click) or clearing flips it false.
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

  const displayed = editing ? query : valueAsText(value);
  const trimmed = query.trim();
  const hasQuery = editing && trimmed.length > 0;

  const filtered = useMemo<SectorTile[]>(() => {
    if (!hasQuery) return [];
    const q = trimmed.toLowerCase();
    return allSectors
      .filter((s) => s.label.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS);
  }, [allSectors, trimmed, hasQuery]);

  const showSuggestions = editing && hasQuery && filtered.length > 0;
  const showFreeformHint = editing && hasQuery && filtered.length === 0;

  const helperId = inputId ? `${inputId}-helper` : undefined;

  const describedBy =
    [ariaDescribedBy, (showSuggestions || showFreeformHint) ? helperId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const commitSector = (s: SectorTile) => {
    setEditing(false);
    setQuery('');
    onChange({ kind: 'sector', slug: s.slug, label: s.label });
  };

  const commitFreeform = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setEditing(false);
    setQuery('');
    onChange({ kind: 'freeform', text: t });
  };

  const clearCommitted = () => {
    if (value !== null) onChange(null);
  };

  const onInputChange = (raw: string) => {
    setEditing(true);
    setQuery(raw);
    setActiveIndex(0);
    clearCommitted();
    if (raw.trim().length === 0) {
      // Back to STATE A - empty input, no committed value.
      setEditing(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      if (!editing || filtered.length === 0) return;
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      if (!editing || filtered.length === 0) return;
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      if (!editing) return;
      if (filtered.length > 0) {
        const pick = filtered[Math.min(activeIndex, filtered.length - 1)];
        if (pick) {
          e.preventDefault();
          commitSector(pick);
        }
      } else if (trimmed.length > 0) {
        e.preventDefault();
        commitFreeform(trimmed);
      }
    } else if (e.key === 'Escape') {
      // Swallow only when there's something to clear; otherwise let any
      // ancestor (e.g. Radix Dialog) handle Escape normally.
      if (editing || value !== null) {
        e.preventDefault();
        e.stopPropagation();
        setEditing(false);
        setQuery('');
        clearCommitted();
      }
    }
  };

  const onFocus = () => {
    // If there's already a committed value, show it in the input but keep
    // `editing` false so a single keystroke at the start/end still flips
    // into edit mode via onInputChange.
    if (!value) return;
    // No-op: displayed value is already driven by value.
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Ignore blurs that move focus into the listbox (row clicks use
    // onMouseDown preventDefault to avoid this, but keep the check as a
    // defence in depth).
    const next = e.relatedTarget as Node | null;
    if (next && listboxRef.current?.contains(next)) return;
    // If user typed but didn't commit, reset back to the last committed
    // value's display (or empty if none).
    if (editing) {
      window.setTimeout(() => {
        setEditing(false);
        setQuery('');
      }, 100);
    }
  };

  const inputClassName = [
    'w-full rounded-md border border-slate-300 bg-white text-brand-navy placeholder:text-slate-400 px-3 py-2.5 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="relative">
      <input
        id={inputId}
        ref={inputRef}
        type="text"
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls={inputId ? `${inputId}-listbox` : undefined}
        aria-describedby={describedBy}
        placeholder={placeholder}
        required={required && value === null}
        value={displayed}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={inputClassName}
      />

      {showSuggestions ? (
        <div
          ref={listboxRef}
          id={inputId ? `${inputId}-listbox` : undefined}
          role="listbox"
          className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg"
        >
          {filtered.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                commitSector(s);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={[
                'w-full flex items-center px-3 py-2 text-left text-sm',
                i === activeIndex
                  ? 'bg-brand-gold/10 text-brand-navy'
                  : 'bg-white text-slate-800 hover:bg-slate-50',
              ].join(' ')}
            >
              <span className="truncate">{s.label}</span>
            </button>
          ))}
        </div>
      ) : null}

      {showSuggestions ? (
        <p
          id={helperId}
          className="mt-1.5 text-xs text-slate-500"
          aria-live="polite"
        >
          Press Enter to select, or keep typing for your own industry.
        </p>
      ) : null}

      {showFreeformHint ? (
        <div className="mt-2" aria-live="polite">
          {/* Gold pill leading with the action, not the rejection. onMouseDown
              preventDefault keeps focus on the input so the 100ms blur-reset
              timeout in onBlur can't clear `query` before the click commits. */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => commitFreeform(trimmed)}
            className="w-full rounded-lg bg-brand-gold px-4 py-3 text-left font-semibold text-brand-navy shadow-sm hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 transition-colors"
          >
            {`+ Use \u201C${trimmed}\u201D as your industry`}
          </button>
          <p id={helperId} className="mt-2 text-xs text-slate-500">
            Can&rsquo;t find your industry in our list? No problem &mdash; we
            work with every sector.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default IndustrySearch;
