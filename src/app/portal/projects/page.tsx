import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ProjectsPageClient } from './ProjectsPageClient';
import { isPortalAdmin } from '@/lib/portal-auth';
import {
  getClientByClerkId,
  getClientById,
  getProjectsByClientId,
} from '@/lib/portal-db';

export const metadata = {
  title: 'Projects - Client Portal',
};

interface ProjectsPageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/portal/sign-in');
  }

  const resolvedParams = await searchParams;
  const isAdmin = isPortalAdmin(userId);

  let clientId: string | null = null;
  let companyName = '';

  if (isAdmin) {
    if (resolvedParams.clientId) {
      const target = await getClientById(resolvedParams.clientId);
      if (!target) {
        redirect('/portal/admin/clients');
      }
      clientId = target.id;
      companyName = target.company_name;
    }
  } else {
    const client = await getClientByClerkId(userId);
    if (!client) {
      redirect('/portal/dashboard');
    }
    clientId = client.id;
    companyName = client.company_name;
  }

  const projects = clientId ? await getProjectsByClientId(clientId) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Projects</h1>
        <p className="text-brand-navy/60 mt-1">
          Group related requests under a single project
        </p>
      </div>

      <ProjectsPageClient
        projects={projects}
        clientId={clientId}
        companyName={companyName}
        isAdmin={isAdmin}
        showClientPicker={isAdmin && !resolvedParams.clientId}
      />
    </div>
  );
}
