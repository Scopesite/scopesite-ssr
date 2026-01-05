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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 0),
      }}
    />
  );
}

export default JsonLd;

