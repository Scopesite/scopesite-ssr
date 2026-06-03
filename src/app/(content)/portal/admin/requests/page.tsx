import Link from 'next/link';
import { Filter } from 'lucide-react';
import { getAllClients, getAllChangeRequests } from '@/lib/portal-db';
import { StatusBadge } from '@/components/portal/StatusBadge';
import { AdminDeleteButton } from '@/components/portal/AdminDeleteButton';
import { PROGRESS_LABELS, type ChangeRequestProgress } from '@/types/portal';

export const metadata = {
  title: 'All Requests - Admin Portal',
};

interface AdminRequestsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminRequestsPage({ searchParams }: AdminRequestsPageProps) {
  const resolvedParams = await searchParams;
  const statusFilter = resolvedParams.status as ChangeRequestProgress | undefined;

  const [clients, allRequests] = await Promise.all([
    getAllClients(),
    getAllChangeRequests(),
  ]);

  // Create a map for quick client lookup
  const clientMap = new Map(clients.map(c => [c.id, c]));

  // Filter if status param is provided
  const filteredRequests = statusFilter
    ? allRequests.filter(r => r.progress === statusFilter)
    : allRequests;

  // Group requests by status for quick stats
  const statusCounts = allRequests.reduce((acc, req) => {
    acc[req.progress] = (acc[req.progress] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">All Requests</h1>
        <p className="text-brand-navy/60 mt-1">
          {allRequests.length} total request{allRequests.length !== 1 ? 's' : ''} across {clients.length} clients
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        <FilterPill 
          label="All" 
          count={allRequests.length} 
          href="/portal/admin/requests" 
          active={!statusFilter}
        />
        {Object.entries(statusCounts)
          .sort((a, b) => {
            // Custom sort order - prioritize action items
            const order = ['not_seen_yet', 'estimate_added', 'awaiting_client_info', 'approved', 'in_progress'];
            return order.indexOf(a[0]) - order.indexOf(b[0]);
          })
          .map(([status, count]) => (
            <FilterPill
              key={status}
              label={PROGRESS_LABELS[status as ChangeRequestProgress] || status}
              count={count}
              href={`/portal/admin/requests?status=${status}`}
              active={statusFilter === status}
            />
          ))}
      </div>

      {/* Requests table */}
      {filteredRequests.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy">Request</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy hidden md:table-cell">Client</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy hidden lg:table-cell">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy">Status</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-brand-navy">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((request) => {
                const client = clientMap.get(request.client_id);
                const isSlaBreached =
                  request.sla_due_at &&
                  !request.is_complete &&
                  new Date(request.sla_due_at).getTime() < Date.now();
                return (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/portal/requests/${request.id}`} className="block">
                        <p className="font-medium text-brand-navy hover:text-brand-gold-accessible">
                          {request.title}
                        </p>
                        <p className="text-sm text-brand-navy/50 md:hidden mt-0.5">
                          {client?.company_name || 'Unknown'}
                        </p>
                      </Link>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {client ? (
                        <Link href={`/portal/admin/clients/${client.id}`} className="text-brand-navy/70 hover:text-brand-navy">
                          {client.company_name}
                        </Link>
                      ) : (
                        <span className="text-brand-navy/40">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-brand-navy/60">{formatDate(request.created_at)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={request.progress as ChangeRequestProgress} size="sm" />
                        {request.is_rejected && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">HALTED</span>
                        )}
                        {request.is_complete && !request.is_rejected && (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded">DONE</span>
                        )}
                        {isSlaBreached && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded font-medium">
                            SLA
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AdminDeleteButton requestId={request.id} requestTitle={request.title} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Filter className="w-12 h-12 text-brand-navy/20 mx-auto mb-3" />
          <p className="text-brand-navy/60 mb-4">
            {statusFilter 
              ? `No requests with status "${PROGRESS_LABELS[statusFilter]}"`
              : 'No requests yet'}
          </p>
          {statusFilter && (
            <Link
              href="/portal/admin/requests"
              className="text-brand-gold-accessible hover:text-brand-orange-accessible font-medium"
            >
              Clear filter
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
