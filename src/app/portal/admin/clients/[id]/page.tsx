import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Building, Calendar, DollarSign, FileText } from 'lucide-react';
import { 
  getClientById, 
  getChangeRequestsByClientId,
  getActivityByClientId 
} from '@/lib/portal-db';
import { StatusBadge } from '@/components/portal/StatusBadge';
import { ActivityFeed } from '@/components/portal/ActivityFeed';
import type { ChangeRequestProgress } from '@/types/portal';

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ClientDetailPageProps) {
  const resolvedParams = await params;
  const client = await getClientById(resolvedParams.id);
  return {
    title: client ? `${client.company_name} - Admin Portal` : 'Client Not Found',
  };
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const resolvedParams = await params;
  const client = await getClientById(resolvedParams.id);

  if (!client) {
    notFound();
  }

  const [requests, activity] = await Promise.all([
    getChangeRequestsByClientId(client.id),
    getActivityByClientId(client.id, 15),
  ]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Calculate stats
  const openRequests = requests.filter(r => !['invoice_sent', 'invoice_paid'].includes(r.progress));
  const completedRequests = requests.filter(r => ['invoice_sent', 'invoice_paid'].includes(r.progress));
  const totalRevenue = completedRequests.reduce((sum, r) => {
    if (r.one_off_payment) return sum + r.one_off_payment;
    if (r.hours_estimated && r.rate_charged) return sum + (r.hours_estimated * r.rate_charged);
    return sum;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/portal/admin/clients"
          className="inline-flex items-center gap-2 text-sm text-brand-navy/60 hover:text-brand-navy mb-4"
        >
          <ArrowLeft size={16} /> Back to clients
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">{client.company_name}</h1>
            <p className="text-brand-navy/60 mt-1">{client.primary_contact_name}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium self-start ${
            client.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : client.status === 'pending_invite'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {client.status === 'pending_invite' ? 'Pending Invite' : 
             client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-brand-navy/60">Total Requests</p>
          <p className="text-2xl font-bold text-brand-navy mt-1">{requests.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-brand-navy/60">Open</p>
          <p className="text-2xl font-bold text-brand-navy mt-1">{openRequests.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-brand-navy/60">Completed</p>
          <p className="text-2xl font-bold text-brand-navy mt-1">{completedRequests.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-brand-navy/60">Total Revenue</p>
          <p className="text-2xl font-bold text-brand-navy mt-1">£{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-brand-navy mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-navy/40" />
                <div>
                  <p className="text-xs text-brand-navy/50 uppercase">Email</p>
                  <a href={`mailto:${client.email}`} className="text-brand-navy hover:text-brand-gold-accessible">
                    {client.email}
                  </a>
                </div>
              </div>
              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-navy/40" />
                  <div>
                    <p className="text-xs text-brand-navy/50 uppercase">Phone</p>
                    <a href={`tel:${client.phone}`} className="text-brand-navy hover:text-brand-gold-accessible">
                      {client.phone}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-brand-navy/40" />
                <div>
                  <p className="text-xs text-brand-navy/50 uppercase">Hourly Rate</p>
                  <p className="text-brand-navy">
                    {client.hourly_rate ? `£${client.hourly_rate}/hr` : 'Not set'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-brand-navy/40" />
                <div>
                  <p className="text-xs text-brand-navy/50 uppercase">Client Since</p>
                  <p className="text-brand-navy">{formatDate(client.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Requests */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-brand-navy">Requests</h2>
            </div>
            
            {requests.length > 0 ? (
              <div className="space-y-3">
                {requests.map((request) => (
                  <Link
                    key={request.id}
                    href={`/portal/requests/${request.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-brand-navy truncate">{request.title}</p>
                      <p className="text-xs text-brand-navy/50 mt-0.5">
                        {formatDate(request.created_at)}
                      </p>
                    </div>
                    <StatusBadge status={request.progress as ChangeRequestProgress} size="sm" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-brand-navy/50">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No requests yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-brand-navy mb-4">Actions</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${client.email}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-graphite transition-colors"
              >
                <Mail size={16} /> Send Email
              </a>
              {client.status === 'pending_invite' && (
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-brand-gold text-brand-gold-accessible rounded-lg hover:bg-brand-gold/5 transition-colors"
                >
                  Resend Invitation
                </button>
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-brand-navy mb-4">Recent Activity</h3>
            <ActivityFeed activities={activity} />
          </div>
        </div>
      </div>
    </div>
  );
}
