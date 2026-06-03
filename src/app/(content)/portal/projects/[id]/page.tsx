import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Folder } from 'lucide-react';
import {
  getClientByClerkId,
  getProjectById,
  getChangeRequestsByProjectId,
} from '@/lib/portal-db';
import { isPortalAdmin } from '@/lib/portal-auth';
import { StatusBadge } from '@/components/portal/StatusBadge';
import type { ChangeRequestProgress } from '@/types/portal';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/portal/sign-in');
  }

  const isAdmin = isPortalAdmin(userId);
  const viewerClient = await getClientByClerkId(userId);
  const { id } = await params;

  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  if (!isAdmin && viewerClient && project.client_id !== viewerClient.id) {
    notFound();
  }

  const requests = await getChangeRequestsByProjectId(project.id);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        href="/portal/projects"
        className="inline-flex items-center gap-2 text-sm text-brand-navy/60 hover:text-brand-navy"
      >
        <ArrowLeft size={16} /> Back to projects
      </Link>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-brand-navy/5 rounded-xl flex items-center justify-center">
          <Folder className="w-6 h-6 text-brand-navy" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">{project.name}</h1>
          {project.description && (
            <p className="text-brand-navy/60 mt-2">{project.description}</p>
          )}
          <p className="text-xs text-brand-navy/40 mt-2 capitalize">
            Status: {project.status} · Type: {project.type}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-brand-navy">
            Requests ({requests.length})
          </h2>
        </div>
        {requests.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {requests.map((req) => (
              <li key={req.id}>
                <Link
                  href={`/portal/requests/${req.id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-brand-navy truncate">{req.title}</p>
                    <p className="text-xs text-brand-navy/50 mt-0.5">
                      {formatDate(req.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={req.progress as ChangeRequestProgress} size="sm" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-8 text-center text-brand-navy/50 text-sm">
            No requests linked to this project yet.
          </p>
        )}
      </div>
    </div>
  );
}
