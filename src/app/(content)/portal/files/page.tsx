import { redirect } from 'next/navigation';

interface FilesPageProps {
  searchParams: Promise<{ clientId?: string }>;
}

/** Legacy route: brand assets live at /portal/brand */
export default async function FilesPage({ searchParams }: FilesPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.clientId
    ? `?clientId=${encodeURIComponent(resolvedParams.clientId)}`
    : '';
  redirect(`/portal/brand${query}`);
}
