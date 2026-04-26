import {
  extractHeadingId,
  getUniqueHeadingId,
  stripHtmlToPlainText,
} from './extract-headings';

const HEADING_PATTERN = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;

export function injectHeadingIds(html: string): string {
  const seenIds = new Map<string, number>();

  return html.replace(
    HEADING_PATTERN,
    (fullMatch, level: string, attributes: string, content: string) => {
      const existingId = extractHeadingId(attributes || '');

      if (existingId) {
        seenIds.set(existingId, (seenIds.get(existingId) || 0) + 1);
        return fullMatch;
      }

      const text = stripHtmlToPlainText(content || '');

      if (!text) {
        return fullMatch;
      }

      const id = getUniqueHeadingId(text, seenIds);

      return `<h${level}${attributes || ''} id="${id}">${content}</h${level}>`;
    }
  );
}
