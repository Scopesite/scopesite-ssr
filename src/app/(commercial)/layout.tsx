import { JsonLd } from '@/components/JsonLd';
import { generateOrganizationSchema } from '@/lib/schema';

export default function CommercialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  return (
    <>
      <JsonLd schema={[organizationSchema]} />
      {children}
    </>
  );
}