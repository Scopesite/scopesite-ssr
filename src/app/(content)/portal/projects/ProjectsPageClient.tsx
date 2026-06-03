'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Folder, Plus, Loader2 } from 'lucide-react';
import { ClientPicker, type ClientPickerOption } from '@/components/portal/ClientPicker';
import type { ProjectRow } from '@/types/portal';

interface ProjectsPageClientProps {
  projects: ProjectRow[];
  clientId: string | null;
  companyName: string;
  isAdmin: boolean;
  showClientPicker: boolean;
}

export function ProjectsPageClient({
  projects: initialProjects,
  clientId,
  companyName,
  isAdmin,
  showClientPicker,
}: ProjectsPageClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminClientSelect = (id: string | null, client: ClientPickerOption | null) => {
    if (id && client) {
      router.push(`/portal/projects?clientId=${encodeURIComponent(id)}`);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !name.trim()) return;

    setCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/portal/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          client_id: clientId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project');
      }

      setProjects((prev) => [data.data, ...prev]);
      setName('');
      setDescription('');
      setShowCreate(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {showClientPicker && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <ClientPicker value={clientId} onChange={handleAdminClientSelect} />
        </div>
      )}

      {clientId && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-brand-navy/60 text-sm">
              {companyName ? `Projects for ${companyName}` : 'Your projects'}
            </p>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowCreate((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-graphite"
              >
                <Plus size={16} />
                New project
              </button>
            )}
          </div>

          {showCreate && isAdmin && (
            <form
              onSubmit={handleCreate}
              className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
            >
              <h2 className="font-semibold text-brand-navy">Create project</h2>
              <div>
                <label htmlFor="project-name" className="block text-sm font-medium text-brand-navy mb-1">
                  Name *
                </label>
                <input
                  id="project-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-brand w-full"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="project-desc"
                  className="block text-sm font-medium text-brand-navy mb-1"
                >
                  Description
                </label>
                <textarea
                  id="project-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="input-brand w-full resize-y"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-navy text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {creating && <Loader2 size={16} className="animate-spin" />}
                Create
              </button>
            </form>
          )}

          {projects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portal/projects/${project.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-gold/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-brand-navy/5 rounded-lg flex items-center justify-center">
                      <Folder className="w-5 h-5 text-brand-navy" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-brand-navy truncate">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-brand-navy/60 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <p className="text-xs text-brand-navy/40 mt-2 capitalize">{project.status}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Folder className="w-12 h-12 text-brand-navy/20 mx-auto mb-3" />
              <p className="text-brand-navy/60">No projects yet</p>
              {isAdmin && (
                <p className="text-sm text-brand-navy/40 mt-2">
                  Create a project to group related requests.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {!clientId && isAdmin && (
        <p className="text-brand-navy/60">Select a client to view or create projects.</p>
      )}
    </div>
  );
}
