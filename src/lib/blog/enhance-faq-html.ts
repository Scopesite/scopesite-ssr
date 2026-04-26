const FAQ_SECTION_PATTERN =
  /(<h2[^>]*>[\s\S]*?(?:FAQ|FAQs|Frequently Asked Questions?)[\s\S]*?<\/h2>)([\s\S]*?)(?=<h2\b|$)/gi;

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
  return html.replace(FAQ_SECTION_PATTERN, (sectionMatch: string) => {
    if (sectionMatch.includes('blog-faq-section')) {
      return sectionMatch;
    }

    let enhancedSection = addClassToOpeningTags(sectionMatch, 'h3', 'blog-faq-question');
    enhancedSection = addClassToOpeningTags(enhancedSection, 'h4', 'blog-faq-question');
    enhancedSection = addClassToOpeningTags(enhancedSection, 'p', 'faq-answer');

    return `<section class="blog-faq-section">${enhancedSection}</section>`;
  });
}
