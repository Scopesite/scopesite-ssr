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
import { VisualProgress } from '@/components/portal/VisualProgress';
import { TYPE_OF_WORK_LABELS, URGENCY_LABELS, type CommenceWorkBy } from '@/types/portal';

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

  // Check for special states
  const isRejected = request.is_rejected;
  const isComplete = request.is_complete;

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
          {/* REJECTED/HALTED Banner */}
          {isRejected && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-red-800">Work Has Been Halted</h2>
                  <p className="text-red-700 mt-1">
                    This project has been paused or cancelled. If you have any questions about this, please contact us.
                  </p>
                  <a 
                    href="mailto:support@scopesite.co.uk"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact support@scopesite.co.uk
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* COMPLETE Celebration Banner */}
          {isComplete && !isRejected && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6 relative overflow-hidden">
              {/* Sparkle decorations */}
              <div className="absolute top-2 right-4 text-2xl animate-pulse">✨</div>
              <div className="absolute bottom-2 left-8 text-xl animate-pulse delay-100">🎉</div>
              <div className="absolute top-4 left-1/3 text-lg animate-pulse delay-200">⭐</div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-800">Project Complete! 🎊</h2>
                  <p className="text-emerald-700 mt-1">
                    Great news! This project has been successfully completed. Thank you for working with ScopeSite!
                  </p>
                  <p className="text-sm text-emerald-600 mt-2">
                    If you need any follow-up work or have a new project in mind, we&apos;d love to help.
                  </p>
                </div>
              </div>
            </div>
          )}

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

          {/* Visual Progress - show when work has started */}
          {(['approved', 'in_progress', 'awaiting_client_info', 'in_review', 'invoice_sent', 'invoice_paid'].includes(request.progress)) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-brand-navy mb-4">Project Progress</h2>
              <VisualProgress 
                progress={request.visual_progress || 0} 
                status={request.progress}
                size="lg"
              />
              
              {/* Completion summary for finished projects */}
              {(request.progress === 'invoice_sent' || request.progress === 'invoice_paid') && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-800">Project Complete!</p>
                        <p className="text-sm text-emerald-600">Thank you for working with us</p>
                      </div>
                    </div>
                    {request.hours_worked && request.rate_charged && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="bg-white/60 rounded p-2 text-center">
                          <p className="text-xs text-emerald-600 uppercase font-medium">Final Hours</p>
                          <p className="text-lg font-bold text-emerald-800">{request.hours_worked}</p>
                        </div>
                        <div className="bg-white/60 rounded p-2 text-center">
                          <p className="text-xs text-emerald-600 uppercase font-medium">Final Total</p>
                          <p className="text-lg font-bold text-emerald-800">
                            £{(request.hours_worked * request.rate_charged).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

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
              {request.commence_work_by && (
                <div>
                  <dt className="text-brand-navy/50">Urgency</dt>
                  <dd className="text-brand-navy text-xs">
                    {URGENCY_LABELS[request.commence_work_by as Exclude<CommenceWorkBy, null>] || request.commence_work_by}
                  </dd>
                </div>
              )}
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
