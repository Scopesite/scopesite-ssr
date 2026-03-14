/**
 * JSON-LD Schema Component
 * 
 * Server component that injects structured data into the page.
 * Renders a <script type="application/ld+json"> tag with the schema.
 */

interface JsonLdProps {
  schema: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ schema }: JsonLdProps) {
  // If array is passed, wrap in @graph structure
  const structuredData = Array.isArray(schema)
    ? {
        '@context': 'https://schema.org',
        '@graph': schema,
      }
    : {
        '@context': 'https://schema.org',
        ...schema,
      };

  // Escape < as \u003c to prevent </script> in content from breaking the tag.
  // JSON parsers decode \u003c back to < so the schema remains valid.
  const safeJson = JSON.stringify(structuredData).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}

export default JsonLd;

