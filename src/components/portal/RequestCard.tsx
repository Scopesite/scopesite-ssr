import Link from 'next/link';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { 
  type ChangeRequestRow, 
  TYPE_OF_WORK_LABELS,
  getCostDisplay 
} from '@/types/portal';
import { cn } from '@/lib/utils';

interface RequestCardProps {
  request: ChangeRequestRow;
  commentCount?: number;
  fileCount?: number;
  className?: string;
}

export function RequestCard({ 
  request, 
  commentCount = 0, 
  fileCount = 0,
  className 
}: RequestCardProps) {
  const cost = getCostDisplay(request);
  const typeLabel = TYPE_OF_WORK_LABELS[request.type_of_work] || request.type_of_work;

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Check if action is needed
  const needsAction = ['estimate_added', 'awaiting_approval', 'awaiting_client_info'].includes(request.progress);

  return (
    <Link
      href={`/portal/requests/${request.id}`}
      className={cn(
        'block p-5 bg-white rounded-xl border transition-all',
        needsAction 
          ? 'border-brand-gold/50 shadow-md hover:shadow-lg hover:border-brand-gold' 
          : 'border-gray-200 hover:border-brand-gold/30 hover:shadow-md',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-brand-navy truncate">
            {request.title}
          </h3>
          <p className="text-sm text-brand-navy/60 mt-0.5">
            {typeLabel}
          </p>
        </div>
        <StatusBadge status={request.progress} size="sm" />
      </div>

      {/* Description preview */}
      {request.description && (
        <p className="text-sm text-brand-navy/70 line-clamp-2 mb-4">
          {request.description}
        </p>
      )}

      {/* Cost display (if estimate added) */}
      {cost.type !== 'pending' && (
        <div className="mb-4 p-3 bg-brand-gold/5 rounded-lg border border-brand-gold/20">
          <p className="text-sm font-medium text-brand-navy">
            {cost.display}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-brand-navy/50">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{formatDate(request.created_at)}</span>
        </div>

        <div className="flex items-center gap-4">
          {commentCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare size={14} />
              <span>{commentCount}</span>
            </div>
          )}
          {fileCount > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip size={14} />
              <span>{fileCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action needed banner */}
      {needsAction && (
        <div className="mt-4 -mx-5 -mb-5 px-5 py-2 bg-brand-gold/10 border-t border-brand-gold/20 rounded-b-xl">
          <p className="text-sm font-medium text-brand-gold-accessible">
            {request.progress === 'estimate_added' || request.progress === 'awaiting_approval'
              ? '⚡ Quote ready for approval'
              : '⚡ Your response needed'}
          </p>
        </div>
      )}
    </Link>
  );
}
