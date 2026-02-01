import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Filter } from 'lucide-react';
import { getClientByClerkId, getChangeRequestsByClientId } from '@/lib/portal-db';
import { RequestCard } from '@/components/portal/RequestCard';
import { PROGRESS_LABELS, type ChangeRequestProgress } from '@/types/portal';

export const metadata = {
  title: 'My Requests - Client Portal',
};

interface RequestsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/portal/sign-in');
  }

  const client = await getClientByClerkId(userId);
  
  if (!client) {
    redirect('/portal/dashboard');
  }

  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status as ChangeRequestProgress | undefined;

  // Get all requests for the client
  const allRequests = await getChangeRequestsByClientId(client.id);

  // Filter if status param is provided
  const filteredRequests = statusFilter
    ? allRequests.filter(r => r.progress === statusFilter)
    : allRequests;

  // Group requests by status for quick stats
  const statusCounts = allRequests.reduce((acc, req) => {
    acc[req.progress] = (acc[req.progress] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">My Requests</h1>
          <p className="text-brand-navy/60 mt-1">
            {allRequests.length} total request{allRequests.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/portal/requests/new"
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          <Plus size={20} /> New Request
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        <FilterPill 
          label="All" 
          count={allRequests.length} 
          href="/portal/requests" 
          active={!statusFilter}
        />
        {Object.entries(statusCounts).map(([status, count]) => (
          <FilterPill
            key={status}
            label={PROGRESS_LABELS[status as ChangeRequestProgress] || status}
            count={count}
            href={`/portal/requests?status=${status}`}
            active={statusFilter === status}
          />
        ))}
      </div>

      {/* Requests list */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Filter className="w-12 h-12 text-brand-navy/20 mx-auto mb-3" />
          <p className="text-brand-navy/60 mb-4">
            {statusFilter 
              ? `No requests with status "${PROGRESS_LABELS[statusFilter]}"`
              : 'No requests yet'}
          </p>
          {statusFilter ? (
            <Link
              href="/portal/requests"
              className="text-brand-gold-accessible hover:text-brand-orange-accessible font-medium"
            >
              Clear filter
            </Link>
          ) : (
            <Link
              href="/portal/requests/new"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={16} /> Submit your first request
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function FilterPill({ 
  label, 
  count, 
  href, 
  active 
}: { 
  label: string; 
  count: number; 
  href: string; 
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-navy text-white'
          : 'bg-white border border-gray-200 text-brand-navy/70 hover:border-brand-gold/50'
      }`}
    >
      {label}
      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
        active ? 'bg-white/20' : 'bg-brand-navy/5'
      }`}>
        {count}
      </span>
    </Link>
  );
}
