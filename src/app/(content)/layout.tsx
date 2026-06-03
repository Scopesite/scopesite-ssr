import { JsonLd } from '@/components/JsonLd';
import { generateLeanOrganizationSchema } from '@/lib/schema';

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateLeanOrganizationSchema();
  return (
    <>
      <JsonLd schema={[organizationSchema]} />
      {children}
    </>
  );
}