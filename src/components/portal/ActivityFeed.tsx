import { 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Upload, 
  Bell,
  Receipt,
  UserPlus,
  Trash2
} from 'lucide-react';
import { type ActivityRow, type ActivityActionType } from '@/types/portal';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  activities: ActivityRow[];
  className?: string;
}

const ACTION_ICONS: Record<ActivityActionType, React.ElementType> = {
  request_submitted: FileText,
  status_changed: Bell,
  estimate_added: Receipt,
  estimate_approved: CheckCircle,
  estimate_rejected: XCircle,
  file_uploaded: Upload,
  file_deleted: Trash2,
  comment_added: MessageSquare,
  invoice_sent: Receipt,
  invoice_paid: CheckCircle,
  client_created: UserPlus,
  client_invited: UserPlus,
};

const ACTION_COLORS: Record<ActivityActionType, string> = {
  request_submitted: 'bg-blue-100 text-blue-600',
  status_changed: 'bg-gray-100 text-gray-600',
  estimate_added: 'bg-yellow-100 text-yellow-600',
  estimate_approved: 'bg-green-100 text-green-600',
  estimate_rejected: 'bg-red-100 text-red-600',
  file_uploaded: 'bg-purple-100 text-purple-600',
  file_deleted: 'bg-red-100 text-red-600',
  comment_added: 'bg-indigo-100 text-indigo-600',
  invoice_sent: 'bg-emerald-100 text-emerald-600',
  invoice_paid: 'bg-emerald-100 text-emerald-600',
  client_created: 'bg-blue-100 text-blue-600',
  client_invited: 'bg-blue-100 text-blue-600',
};

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className={cn('text-center py-8 text-brand-navy/50', className)}>
        <Bell size={32} className="mx-auto mb-2 opacity-50" />
        <p>No activity yet</p>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {activities.map((activity) => {
        const Icon = ACTION_ICONS[activity.action_type] || Bell;
        const colorClass = ACTION_COLORS[activity.action_type] || 'bg-gray-100 text-gray-600';

        return (
          <div key={activity.id} className="flex gap-3">
            {/* Icon */}
            <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', colorClass)}>
              <Icon size={16} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-brand-navy">
                {activity.description}
              </p>
              <p className="text-xs text-brand-navy/50 mt-0.5">
                {activity.actor_name} · {formatDate(activity.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
