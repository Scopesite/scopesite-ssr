import { cn } from '@/lib/utils';
import { 
  type ChangeRequestProgress, 
  PROGRESS_LABELS, 
  PROGRESS_COLORS 
} from '@/types/portal';

interface StatusBadgeProps {
  status: ChangeRequestProgress;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const label = PROGRESS_LABELS[status] || status;
  const colorClass = PROGRESS_COLORS[status] || 'bg-gray-100 text-gray-800';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      {/* Status dot */}
      <span 
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-2',
          status === 'awaiting_client_info' && 'bg-orange-500 animate-pulse',
          status === 'estimate_added' && 'bg-yellow-500',
          status === 'in_progress' && 'bg-purple-500',
          status === 'invoice_paid' && 'bg-emerald-500',
          !['awaiting_client_info', 'estimate_added', 'in_progress', 'invoice_paid'].includes(status) && 'bg-current opacity-50'
        )}
      />
      {label}
    </span>
  );
}
