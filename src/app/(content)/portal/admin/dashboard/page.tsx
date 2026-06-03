import Link from 'next/link';
import { 
  Users, 
  FileText, 
  DollarSign, 
  Clock, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { 
  getAdminDashboardStats, 
  getAllClients, 
  getAllChangeRequests,
  getRecentActivity 
} from '@/lib/portal-db';
import { ActivityFeed } from '@/components/portal/ActivityFeed';
import { StatusBadge } from '@/components/portal/StatusBadge';
import { PROGRESS_LABELS, type ChangeRequestProgress } from '@/types/portal';

export const metadata = {
  title: 'Admin Dashboard - Client Portal',
};

export default async function AdminDashboardPage() {
  const [stats, clients, requests, activity] = await Promise.all([
    getAdminDashboardStats(),
    getAllClients(),
    getAllChangeRequests(10),
    getRecentActivity(15),
  ]);

  // Get requests needing attention
  const needsAttention = requests.filter(r => 
    ['not_seen_yet', 'awaiting_client_info'].includes(r.progress)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Admin Dashboard</h1>
        <p className="text-brand-navy/60 mt-1">
          Overview of all clients and requests
        </p>
      </div>

      {/* Alert banner */}
      {needsAttention.length > 0 && (
        <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-brand-navy">
                {needsAttention.length} request{needsAttention.length !== 1 ? 's' : ''} need attention
              </h2>
              <p className="text-sm text-brand-navy/70 mt-1">
                New submissions to review or requests waiting on client response.
              </p>
              <Link
                href="/portal/admin/requests"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-orange-accessible mt-2 hover:text-brand-orange"
              >
                View all requests <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Users}
          label="Total Clients"
          value={stats.totalClients}
          subValue={`${stats.activeClients} active`}
          href="/portal/admin/clients"
        />
        <StatCard 
          icon={FileText}
          label="Open Requests"
          value={stats.openRequests}
          subValue={`${stats.totalRequests} total`}
          href="/portal/admin/requests"
          highlight={stats.openRequests > 0}
        />
        <StatCard 
          icon={Clock}
          label="Awaiting Approval"
          value={stats.awaitingApproval}
          href="/portal/admin/requests?status=estimate_added"
          highlight={stats.awaitingApproval > 0}
        />
        <StatCard 
          icon={DollarSign}
          label="Revenue (This Month)"
          value={`£${stats.revenueThisMonth.toLocaleString()}`}
          isMonetary
        />
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent requests */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-navy">Recent Requests</h2>
            <Link 
              href="/portal/admin/requests" 
              className="text-sm text-brand-gold-accessible hover:text-brand-orange-accessible font-medium"
            >
              View all
            </Link>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {requests.length > 0 ? (
              requests.map((request) => {
                const client = clients.find(c => c.id === request.client_id);
                return (
                  <Link
                    key={request.id}
                    href={`/portal/requests/${request.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-brand-navy truncate">{request.title}</p>
                      <p className="text-sm text-brand-navy/50 mt-0.5">
                        {client?.company_name || 'Unknown client'}
                      </p>
                    </div>
                    <StatusBadge status={request.progress as ChangeRequestProgress} size="sm" />
                  </Link>
                );
              })
            ) : (
              <div className="p-8 text-center text-brand-navy/50">
                No requests yet
              </div>
            )}
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <h2 className="text-lg font-semibold text-brand-navy mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <ActivityFeed activities={activity} />
          </div>
        </div>
      </div>

      {/* Clients overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-brand-navy">Clients</h2>
          <Link 
            href="/portal/admin/clients" 
            className="text-sm text-brand-gold-accessible hover:text-brand-orange-accessible font-medium"
          >
            Manage clients
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.slice(0, 6).map((client) => (
            <Link
              key={client.id}
              href={`/portal/admin/clients/${client.id}`}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-gold/50 hover:shadow-md transition-all"
            >
              <p className="font-semibold text-brand-navy">{client.company_name}</p>
              <p className="text-sm text-brand-navy/50 mt-1">{client.primary_contact_name}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  client.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : client.status === 'pending_invite'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {client.status === 'pending_invite' ? 'Pending' : client.status}
                </span>
                {client.hourly_rate && (
                  <span className="text-xs text-brand-navy/40">
                    £{client.hourly_rate}/hr
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon,
  label, 
  value, 
  subValue,
  href, 
  highlight = false,
  isMonetary = false,
}: { 
  icon: React.ElementType;
  label: string; 
  value: string | number; 
  subValue?: string;
  href?: string; 
  highlight?: boolean;
  isMonetary?: boolean;
}) {
  const content = (
    <div className={`p-5 rounded-xl border ${highlight ? 'bg-brand-gold/5 border-brand-gold/30' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highlight ? 'bg-brand-gold/20' : 'bg-brand-navy/5'}`}>
          <Icon className={`w-5 h-5 ${highlight ? 'text-brand-gold-accessible' : 'text-brand-navy'}`} />
        </div>
      </div>
      <p className="text-sm text-brand-navy/60">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-brand-gold-accessible' : 'text-brand-navy'}`}>
        {value}
      </p>
      {subValue && (
        <p className="text-xs text-brand-navy/40 mt-1">{subValue}</p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
