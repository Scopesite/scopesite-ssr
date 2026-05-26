'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FileUpload, type UploadedFile } from '@/components/FileUpload';
import { ClientPicker } from '@/components/portal/ClientPicker';
import { ProjectPicker } from '@/components/portal/ProjectPicker';
import { TYPE_OF_WORK_LABELS, URGENCY_LABELS, type ChangeRequestType, type CommenceWorkBy } from '@/types/portal';

interface NewRequestPageClientProps {
  isAdmin: boolean;
  /** Set for client users; admin resolves via onBehalfClientId */
  clientId?: string | null;
}

export function NewRequestPageClient({ isAdmin, clientId: initialClientId }: NewRequestPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [onBehalfClientId, setOnBehalfClientId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  const resolvedClientId = isAdmin ? onBehalfClientId : initialClientId ?? null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type_of_work: 'change_request' as ChangeRequestType,
    commence_work_by: '3_5_days' as Exclude<CommenceWorkBy, null>,
  });

  const isBillable =
    formData.type_of_work === 'change_request' || formData.type_of_work === 'new_project';

  const handleClientChange = (clientId: string | null) => {
    setOnBehalfClientId(clientId);
    setProjectId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (isAdmin && !onBehalfClientId) {
      setError('Please select a client for this request');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/portal/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          commence_work_by: isBillable ? formData.commence_work_by : null,
          file_urls: uploadedFiles.map((f) => f.url),
          ...(isAdmin && onBehalfClientId
            ? { on_behalf_client_id: onBehalfClientId }
            : {}),
          ...(projectId ? { project_id: projectId } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      router.push(`/portal/requests/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href={isAdmin ? '/portal/admin/requests' : '/portal/requests'}
          className="inline-flex items-center gap-2 text-sm text-brand-navy/60 hover:text-brand-navy mb-4"
        >
          <ArrowLeft size={16} /> Back to requests
        </Link>
        <h1 className="text-2xl font-bold text-brand-navy">New Request</h1>
        <p className="text-brand-navy/60 mt-1">
          {isAdmin
            ? 'Create a request on behalf of a client'
            : 'Submit a change request, report an issue, or start a new project'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {isAdmin && (
          <ClientPicker value={onBehalfClientId} onChange={handleClientChange} />
        )}

        {resolvedClientId && (
          <ProjectPicker
            clientId={resolvedClientId}
            value={projectId}
            onChange={setProjectId}
          />
        )}

        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Type of Request *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(TYPE_OF_WORK_LABELS) as [ChangeRequestType, string][]).map(
              ([value, label]) => (
                <label
                  key={value}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    formData.type_of_work === value
                      ? 'border-brand-gold bg-brand-gold/5'
                      : 'border-gray-200 hover:border-brand-gold/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="type_of_work"
                    value={value}
                    checked={formData.type_of_work === value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type_of_work: e.target.value as ChangeRequestType,
                      }))
                    }
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-brand-navy">{label}</span>
                </label>
              )
            )}
          </div>
        </div>

        {isBillable && (
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Urgency / Timeframe *
            </label>
            <p className="text-xs text-brand-navy/60 mb-3">
              How quickly do you need this completed? Faster turnaround = higher rate.
            </p>
            <div className="space-y-2">
              {(Object.entries(URGENCY_LABELS) as [Exclude<CommenceWorkBy, null>, string][]).map(
                ([value, label]) => (
                  <label
                    key={value}
                    className={`flex flex-col items-start p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.commence_work_by === value
                        ? 'border-brand-gold bg-brand-gold/5'
                        : 'border-gray-200 hover:border-brand-gold/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="commence_work_by"
                      value={value}
                      checked={formData.commence_work_by === value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          commence_work_by: e.target.value as Exclude<CommenceWorkBy, null>,
                        }))
                      }
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-brand-navy">{label}</span>
                    {value === 'out_of_hours' && (
                      <span className="block text-xs text-brand-navy/60 mt-1">
                        Outside 0900-1700 Mon-Sat
                      </span>
                    )}
                  </label>
                )
              )}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-brand-navy mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            placeholder="Brief summary of your request"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="input-brand"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-brand-navy mb-2">
            Description *
          </label>
          <textarea
            id="description"
            required
            rows={6}
            placeholder="Please provide as much detail as possible. What do you need? What pages/sections does it affect? Any specific requirements?"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="input-brand resize-none"
          />
          <p className="text-xs text-brand-navy/50 mt-1">
            The more detail you provide, the more accurate the quote will be.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">
            Attachments (optional)
          </label>
          <FileUpload
            onFilesChange={setUploadedFiles}
            maxFiles={5}
            maxSize="10MB"
            acceptedTypes={['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.zip']}
          />
          <p className="text-xs text-brand-navy/50 mt-2">
            Upload screenshots, documents, or any files that help explain your request.
            Max 5 files, 10MB each.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !formData.title ||
              !formData.description ||
              (isAdmin && !onBehalfClientId)
            }
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={20} />
                {isAdmin ? 'Create Request' : 'Submit Request'}
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-brand-navy/5 rounded-lg text-sm text-brand-navy/70">
          <p className="font-medium text-brand-navy mb-1">What happens next?</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>We&apos;ll review your request within 1 business day</li>
            <li>If needed, we&apos;ll prepare a quote for your approval</li>
            <li>Once approved, we&apos;ll get to work</li>
            <li>You can track progress right here in the portal</li>
          </ol>
        </div>
      </form>
    </div>
  );
}
