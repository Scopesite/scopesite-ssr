export interface BlogHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

const HEADING_PATTERN = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;

export function stripHtmlToPlainText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&rsquo;/gi, "'")
    .replace(/&lsquo;/gi, "'")
    .replace(/&rdquo;/gi, '"')
    .replace(/&ldquo;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export function createHeadingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function extractHeadingId(attributes: string): string | null {
  const idMatch = attributes.match(/\sid=(["'])(.*?)\1/i);
  return idMatch?.[2] || null;
}

export function getUniqueHeadingId(
  text: string,
  seenIds: Map<string, number>
): string {
  const baseId = createHeadingSlug(text) || 'section';
  const count = seenIds.get(baseId) || 0;
  seenIds.set(baseId, count + 1);

  return count === 0 ? baseId : `${baseId}-${count + 1}`;
}

export function extractHeadingsFromHtml(html: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const seenIds = new Map<string, number>();

  for (const match of html.matchAll(HEADING_PATTERN)) {
    const level = Number(match[1]) as 2 | 3;
    const attributes = match[2] || '';
    const text = stripHtmlToPlainText(match[3] || '');

    if (!text) {
      continue;
    }

    const existingId = extractHeadingId(attributes);
    const id = existingId || getUniqueHeadingId(text, seenIds);

    if (existingId) {
      seenIds.set(existingId, (seenIds.get(existingId) || 0) + 1);
    }

    headings.push({ id, text, level });
  }

  return headings;
}
