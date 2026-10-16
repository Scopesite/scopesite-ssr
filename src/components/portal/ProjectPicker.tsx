'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProjectOption {
  id: string;
  name: string;
}

interface ProjectPickerProps {
  clientId: string | null;
  value: string | null;
  onChange: (projectId: string | null) => void;
}

export function ProjectPicker({ clientId, value, onChange }: ProjectPickerProps) {
  if (!clientId) return null;
  return <ClientProjectPicker key={clientId} clientId={clientId} value={value} onChange={onChange} />;
}

function ClientProjectPicker({ clientId, value, onChange }: ProjectPickerProps & { clientId: string }) {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const params = new URLSearchParams({ clientId });
    fetch(`/api/portal/projects?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Could not load projects');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data.success && Array.isArray(data.data)) {
          setProjects(
            data.data.map((p: { id: string; name: string }) => ({
              id: p.id,
              name: p.name,
            }))
          );
        } else {
          setProjects([]);
        }
      })
      .catch(() => {
        if (!cancelled) setProjects([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [clientId]);

  return (
    <div>
      <label htmlFor="project_id" className="block text-sm font-medium text-brand-navy mb-2">
        Link to project <span className="text-brand-navy/40 font-normal">(optional)</span>
      </label>
      <div className="relative">
        {loading && (
          <Loader2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-brand-navy/40"
          />
        )}
        <select
          id="project_id"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="input-brand w-full"
          disabled={loading}
        >
          <option value="">No project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
