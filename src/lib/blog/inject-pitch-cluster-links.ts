/**
 * Injects pitch-cluster internal links into Ghost HTML when missing from CMS content.
 */

const VOICE_LINK_ANCHOR = 'check your AI visibility';
const VOICE_LINK_HTML = `<p>Ready to go beyond free checkers? <a href="/voice">check your AI visibility</a> with a free V.O.I.C.E. Pro scan that covers schema, crawler access, and AI readiness in one report.</p>`;

export function injectPitchClusterLinks(slug: string, html: string): string {
  if (slug !== 'free-ai-visibility-tools' || !html) {
    return html;
  }

  const anchorPattern = new RegExp(`>${VOICE_LINK_ANCHOR}<`, 'i');
  if (anchorPattern.test(html)) {
    return html;
  }

  const keyTakeawayMatch = html.match(/<p[^>]*class="[^"]*key-takeaway[^"]*"[^>]*>/i);
  if (keyTakeawayMatch && keyTakeawayMatch.index !== undefined) {
    const closingTagIndex = html.indexOf('</p>', keyTakeawayMatch.index);
    if (closingTagIndex !== -1) {
      const insertAt = closingTagIndex + 4;
      return `${html.slice(0, insertAt)}${VOICE_LINK_HTML}${html.slice(insertAt)}`;
    }
  }

  const firstParagraphEnd = html.indexOf('</p>');
  if (firstParagraphEnd === -1) {
    return `${VOICE_LINK_HTML}${html}`;
  }

  const insertAt = firstParagraphEnd + 4;
  return `${html.slice(0, insertAt)}${VOICE_LINK_HTML}${html.slice(insertAt)}`;
}
