import type { ApplicationStatus } from '@/lib/territory/types';

const LABELS: Record<ApplicationStatus, string> = {
  received: 'New',
  qualified: 'Qualified',
  declined: 'Declined',
  converted: 'Converted',
  expired: 'Expired',
};

const CLASSES: Record<ApplicationStatus, string> = {
  received: 'bg-brand-gold/20 text-brand-gold-accessible border-brand-gold/40',
  qualified: 'bg-brand-navy/10 text-brand-navy border-brand-navy/30',
  converted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  declined: 'bg-slate-100 text-slate-600 border-slate-200',
  expired: 'bg-slate-100 text-slate-500 border-slate-200',
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${CLASSES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
