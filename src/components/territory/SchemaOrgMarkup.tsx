import { JsonLd } from '@/components/JsonLd';
import { generateTerritoryJsonLd } from '@/lib/territory/schema-jsonld';

export function SchemaOrgMarkup() {
  return <JsonLd schema={generateTerritoryJsonLd()} />;
}

export default SchemaOrgMarkup;
