const H2_PATTERN = /<h2\b[^>]*>[\s\S]*?<\/h2>/gi;
const FAQ_HEADING_PATTERN = /\b(?:faq|faqs|frequently asked questions?)\b/i;

function stripHtmlToText(markup: string): string {
  return markup
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function addClassToOpeningTags(markup: string, tagName: string, className: string): string {
  const tagPattern = new RegExp(`<${tagName}([^>]*)>`, 'gi');

  return markup.replace(tagPattern, (fullMatch, attributes: string) => {
    const classMatch = attributes.match(/\sclass=(["'])(.*?)\1/i);

    if (!classMatch) {
      return `<${tagName}${attributes} class="${className}">`;
    }

    if (classMatch[2].split(/\s+/).includes(className)) {
      return fullMatch;
    }

    const updatedClass = `${classMatch[2]} ${className}`;
    const updatedAttributes = attributes.replace(classMatch[0], ` class=${classMatch[1]}${updatedClass}${classMatch[1]}`);

    return `<${tagName}${updatedAttributes}>`;
  });
}

export function enhanceFaqHtml(html: string): string {
  const h2Matches = Array.from(html.matchAll(H2_PATTERN));

  if (h2Matches.length === 0) {
    return html;
  }

  let output = '';
  let cursor = 0;
  let hasFaqSection = false;

  for (let index = 0; index < h2Matches.length; index += 1) {
    const currentHeading = h2Matches[index];
    const headingMarkup = currentHeading[0];
    const headingIndex = currentHeading.index ?? -1;

    if (headingIndex < 0) {
      continue;
    }

    const headingText = stripHtmlToText(headingMarkup);
    const isFaqHeading = FAQ_HEADING_PATTERN.test(headingText);

    if (!isFaqHeading) {
      continue;
    }

    const sectionEnd = h2Matches[index + 1]?.index ?? html.length;
    const sectionHtml = html.slice(headingIndex, sectionEnd);

    output += html.slice(cursor, headingIndex);

    if (sectionHtml.includes('class="faq-section"') || sectionHtml.includes("class='faq-section'")) {
      output += sectionHtml;
    } else {
      let enhancedSection = addClassToOpeningTags(sectionHtml, 'h3', 'blog-faq-question');
      enhancedSection = addClassToOpeningTags(enhancedSection, 'h4', 'blog-faq-question');
      enhancedSection = addClassToOpeningTags(enhancedSection, 'p', 'faq-answer');
      enhancedSection = addClassToOpeningTags(enhancedSection, 'ul', 'faq-answer');
      enhancedSection = addClassToOpeningTags(enhancedSection, 'ol', 'faq-answer');

      output += `<div class="faq-section">${enhancedSection}</div>`;
    }

    hasFaqSection = true;
    cursor = sectionEnd;
  }

  if (!hasFaqSection) {
    return html;
  }

  output += html.slice(cursor);
  return output;
}
