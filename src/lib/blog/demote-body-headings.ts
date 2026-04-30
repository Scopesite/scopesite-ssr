/**
 * Ghost post HTML may include <h1>; the blog template already renders the title as <h1>.
 * Demote in-body h1→h2 so the page has exactly one top-level heading for crawlers and AEO.
 */
export function demoteBodyHeadings(html: string): string {
  if (!html) return html;
  return html.replace(/<h1(\b[^>]*)>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');
}
