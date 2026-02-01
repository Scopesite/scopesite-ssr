import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Paperclip, ExternalLink } from 'lucide-react';
import { 
  getClientByClerkId, 
  getChangeRequestById, 
  getCommentsByRequestId,
  getFilesByRequestId 
} from '@/lib/portal-db';
import { StatusBadge } from '@/components/portal/StatusBadge';
import { CommentThread } from '@/components/portal/CommentThread';
import { CostDisplay } from '@/components/portal/CostDisplay';
import { ApprovalButtons } from '@/components/portal/ApprovalButtons';
import { TYPE_OF_WORK_LABELS } from '@/types/portal';

interface RequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RequestDetailPageProps) {
  const resolvedParams = await params;
  return {
    title: `Request ${resolvedParams.id.slice(0, 8)}... - Client Portal`,
  };
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/portal/sign-in');
  }

  const client = await getClientByClerkId(userId);
  
  if (!client) {
    redirect('/portal/dashboard');
  }

  const resolvedParams = await params;
  const request = await getChangeRequestById(resolvedParams.id);

  // Verify request belongs to this client
  if (!request || request.client_id !== client.id) {
    notFound();
  }

  // Get comments and files
  const [comments, files] = await Promise.all([
    getCommentsByRequestId(request.id),
    getFilesByRequestId(request.id),
  ]);

  const typeLabel = TYPE_OF_WORK_LABELS[request.type_of_work] || request.type_of_work;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if estimate can be approved
  const canApprove = ['estimate_added', 'awaiting_approval'].includes(request.progress);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/portal/requests"
        className="inline-flex items-center gap-2 text-sm text-brand-navy/60 hover:text-brand-navy mb-6"
      >
        <ArrowLeft size={16} /> Back to requests
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-brand-navy/50 mb-1">{typeLabel}</p>
                <h1 className="text-xl font-bold text-brand-navy">{request.title}</h1>
              </div>
              <StatusBadge status={request.progress} />
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none text-brand-navy/80">
              <p className="whitespace-pre-wrap">{request.description}</p>
            </div>

            {/* Meta info */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-6 text-sm text-brand-navy/50">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Submitted {formatDate(request.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Cost & Approval section */}
          {(request.hours_estimated || request.one_off_payment) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-brand-navy mb-4">Quote</h2>
              <CostDisplay request={request} />
              
              {canApprove && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <ApprovalButtons requestId={request.id} />
                </div>
              )}
            </div>
          )}

          {/* Attachments */}
          {files.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                <Paperclip size={18} />
                Attachments ({files.length})
              </h2>
              <div className="space-y-2">
                {files.map((file) => (
                  <a
                    key={file.id}
                    href={file.blob_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-brand-navy/5 rounded-lg hover:bg-brand-navy/10 transition-colors"
                  >
                    <span className="text-sm text-brand-navy truncate">{file.file_name}</span>
                    <ExternalLink size={16} className="text-brand-navy/50 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-brand-navy mb-4">
              Discussion ({comments.length})
            </h2>
            <CommentThread 
              requestId={request.id} 
              comments={comments}
              clientName={client.primary_contact_name}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-brand-navy mb-4">Status</h3>
            <StatusTimeline progress={request.progress} />
          </div>

          {/* Quick info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-brand-navy mb-4">Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-brand-navy/50">Request ID</dt>
                <dd className="font-mono text-brand-navy">{request.id.slice(0, 8)}...</dd>
              </div>
              <div>
                <dt className="text-brand-navy/50">Type</dt>
                <dd className="text-brand-navy">{typeLabel}</dd>
              </div>
              {request.due_date && (
                <div>
                  <dt className="text-brand-navy/50">Due Date</dt>
                  <dd className="text-brand-navy">
                    {new Date(request.due_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </dd>
                </div>
              )}
              {request.invoice_number && (
                <div>
                  <dt className="text-brand-navy/50">Invoice</dt>
                  <dd className="text-brand-navy">{request.invoice_number}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Help */}
          <div className="p-4 bg-brand-navy/5 rounded-xl text-sm">
            <p className="text-brand-navy/70">
              Have questions about this request?{' '}
              <a 
                href="mailto:dan@scopesite.co.uk" 
                className="text-brand-gold-accessible hover:text-brand-orange-accessible font-medium"
              >
                Contact Dan
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusTimeline({ progress }: { progress: string }) {
  const steps = [
    { key: 'not_seen_yet', label: 'Submitted' },
    { key: 'submission_viewed', label: 'Under Review' },
    { key: 'estimate_added', label: 'Quote Ready' },
    { key: 'approved', label: 'Approved' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'in_review', label: 'In Review' },
    { key: 'invoice_sent', label: 'Complete' },
  ];

  const currentIndex = steps.findIndex(s => s.key === progress);

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex || progress === 'invoice_paid';
        const isCurrent = step.key === progress || 
          (progress === 'awaiting_approval' && step.key === 'estimate_added') ||
          (progress === 'awaiting_client_info' && step.key === 'in_progress') ||
          (progress === 'invoice_paid' && step.key === 'invoice_sent');

        return (
          <div key={step.key} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              isComplete ? 'bg-green-500' : 
              isCurrent ? 'bg-brand-gold' : 
              'bg-gray-200'
            }`} />
            <span className={`text-sm ${
              isCurrent ? 'font-medium text-brand-navy' : 
              isComplete ? 'text-green-700' : 
              'text-brand-navy/40'
            }`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
