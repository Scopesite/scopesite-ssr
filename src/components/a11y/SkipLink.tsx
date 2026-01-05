/**
 * Skip Link Component
 * 
 * Provides a skip link for keyboard users to bypass navigation
 * and jump directly to main content. Only visible on focus.
 * 
 * WCAG 2.4.1 - Bypass Blocks (Level A)
 */

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] 
                 focus:bg-brand-gold focus:text-brand-navy focus:px-4 focus:py-2 focus:rounded-lg 
                 focus:font-bold focus:shadow-lg focus:outline-none"
    >
      Skip to main content
    </a>
  );
}

export default SkipLink;

