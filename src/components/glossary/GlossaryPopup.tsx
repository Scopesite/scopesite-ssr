'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export const POPUP_APPEAR_DELAY = 400;
export const POPUP_FADE_IN = 200;
export const POPUP_DISAPPEAR_DELAY = 300;
export const POPUP_FADE_OUT = 350;

interface GlossaryPopupProps {
  term: string;
  definition: string;
  href: string;
  children: ReactNode;
}

export function GlossaryPopup({
  term,
  definition,
  href,
  children,
}: GlossaryPopupProps) {
  const popupId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const appearTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<'above' | 'below'>('below');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const clearTimers = useCallback(() => {
    if (appearTimerRef.current !== null) {
      window.clearTimeout(appearTimerRef.current);
      appearTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const updatePlacement = useCallback(() => {
    const trigger = triggerRef.current;
    const card = cardRef.current;
    if (!trigger || !card) return;

    const triggerRect = trigger.getBoundingClientRect();
    const cardHeight = card.offsetHeight || 180;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    if (spaceBelow < cardHeight + 16 && spaceAbove > spaceBelow) {
      setPlacement('above');
    } else {
      setPlacement('below');
    }
  }, []);

  const showPopup = useCallback(() => {
    clearTimers();
    setOpen(true);
    window.requestAnimationFrame(() => {
      updatePlacement();
      setVisible(true);
    });
  }, [clearTimers, updatePlacement]);

  const hidePopup = useCallback(() => {
    clearTimers();
    setVisible(false);
    hideTimerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, POPUP_FADE_OUT);
  }, [clearTimers]);

  const scheduleShow = useCallback(() => {
    if (isTouchDevice) return;
    clearTimers();
    appearTimerRef.current = window.setTimeout(showPopup, POPUP_APPEAR_DELAY);
  }, [clearTimers, isTouchDevice, showPopup]);

  const scheduleHide = useCallback(() => {
    if (isTouchDevice) return;
    clearTimers();
    hideTimerRef.current = window.setTimeout(hidePopup, POPUP_DISAPPEAR_DELAY);
  }, [clearTimers, hidePopup, isTouchDevice]);

  const handleTriggerClick = useCallback(() => {
    if (!isTouchDevice) return;
    if (open) {
      hidePopup();
    } else {
      showPopup();
    }
  }, [hidePopup, isTouchDevice, open, showPopup]);

  useEffect(() => {
    const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    const syncTouch = () => setIsTouchDevice(touchQuery.matches);
    syncTouch();
    touchQuery.addEventListener('change', syncTouch);
    return () => touchQuery.removeEventListener('change', syncTouch);
  }, []);

  useEffect(() => {
    if (!open || !isTouchDevice) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        cardRef.current?.contains(target)
      ) {
        return;
      }
      hidePopup();
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [hidePopup, isTouchDevice, open]);

  useEffect(() => {
    if (!open) return;
    updatePlacement();
    window.addEventListener('resize', updatePlacement);
    window.addEventListener('scroll', updatePlacement, true);
    return () => {
      window.removeEventListener('resize', updatePlacement);
      window.removeEventListener('scroll', updatePlacement, true);
    };
  }, [open, updatePlacement]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <span className="relative inline">
      <span
        ref={triggerRef}
        className="cursor-help border-b border-dotted border-brand-navy/35 text-inherit"
        aria-describedby={open ? popupId : undefined}
        onMouseEnter={scheduleShow}
        onMouseLeave={scheduleHide}
        onFocus={showPopup}
        onBlur={hidePopup}
        onClick={handleTriggerClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleTriggerClick();
          }
          if (event.key === 'Escape') {
            hidePopup();
          }
        }}
        tabIndex={0}
        role="button"
      >
        {children}
      </span>

      {open ? (
        <span
          ref={cardRef}
          id={popupId}
          role="tooltip"
          className={cn(
            'absolute left-1/2 z-50 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-brand-navy/10 bg-white p-4 text-left shadow-lg transition-opacity',
            placement === 'below' ? 'top-[calc(100%+0.75rem)]' : 'bottom-[calc(100%+0.75rem)]',
            visible ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            transitionDuration: `${visible ? POPUP_FADE_IN : POPUP_FADE_OUT}ms`,
          }}
          onMouseEnter={scheduleShow}
          onMouseLeave={scheduleHide}
        >
          <span
            aria-hidden="true"
            className={cn(
              'absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border border-brand-navy/10 bg-white',
              placement === 'below' ? '-top-1.5 border-b-0 border-r-0' : '-bottom-1.5 border-l-0 border-t-0'
            )}
          />
          {isTouchDevice ? (
            <button
              type="button"
              className="absolute right-2 top-2 text-brand-navy/50 hover:text-brand-navy"
              aria-label="Close definition"
              onClick={hidePopup}
            >
              ×
            </button>
          ) : null}
          <strong className="block pr-6 text-sm text-brand-navy">{term}</strong>
          <p className="mt-2 text-sm leading-relaxed text-brand-navy/80">
            {definition}
          </p>
          <Link
            href={href}
            className="mt-3 inline-block text-sm font-medium text-brand-gold-accessible hover:text-brand-navy"
          >
            Read full definition →
          </Link>
        </span>
      ) : null}
    </span>
  );
}
