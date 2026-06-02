/**
 * Rehype plugin: collects h2 headings (with slug ids) into a shared array.
 * Run AFTER rehype-slug so the ids match the rendered anchors exactly.
 */

import type { Element, Root, Text } from 'hast';

export interface GlossaryHeading {
  id: string;
  text: string;
}

function getHeadingText(element: Element): string {
  return element.children
    .map((child) => (child.type === 'text' ? (child as Text).value : ''))
    .join('')
    .trim();
}

export function rehypeCollectHeadings(headings: GlossaryHeading[]) {
  return (tree: Root) => {
    for (const node of tree.children) {
      if (node.type !== 'element' || node.tagName !== 'h2') continue;

      const id = node.properties?.id;
      const text = getHeadingText(node);

      if (typeof id === 'string' && text) {
        headings.push({ id, text });
      }
    }
  };
}
