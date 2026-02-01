import Link from 'next/link';
import { Plus, Search, Users } from 'lucide-react';
import { getAllClients, getChangeRequestsByClientId } from '@/lib/portal-db';

export const metadata = {
  title: 'Clients - Admin Portal',
};

export default async function ClientsPage() {
  const clients = await getAllClients();

  // Get request counts for each client
  const clientsWithStats = await Promise.all(
    clients.map(async (client) => {
      const requests = await getChangeRequestsByClientId(client.id);
      const openRequests = requests.filter(r => 
        !['invoice_sent', 'invoice_paid'].includes(r.progress)
      ).length;
      return { ...client, totalRequests: requests.length, openRequests };
    })
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Clients</h1>
          <p className="text-brand-navy/60 mt-1">
            {clients.length} total client{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/portal/admin/clients/new"
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          <Plus size={20} /> Add Client
        </Link>
      </div>

      {/* Clients list */}
      {clientsWithStats.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy">Company</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy hidden md:table-cell">Contact</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy hidden lg:table-cell">Rate</th>
                <th className="text-center px-6 py-3 text-sm font-semibold text-brand-navy">Requests</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brand-navy">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientsWithStats.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/portal/admin/clients/${client.id}`} className="block">
                      <p className="font-medium text-brand-navy hover:text-brand-gold-accessible">
                        {client.company_name}
                      </p>
                      <p className="text-sm text-brand-navy/50 md:hidden mt-0.5">
                        {client.primary_contact_name}
                      </p>
                    </Link>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-brand-navy">{client.primary_contact_name}</p>
                    <p className="text-xs text-brand-navy/50">{client.email}</p>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    {client.hourly_rate ? (
                      <span className="text-sm text-brand-navy">£{client.hourly_rate}/hr</span>
                    ) : (
                      <span className="text-sm text-brand-navy/40">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1">
                      <span className="font-medium text-brand-navy">{client.openRequests}</span>
                      <span className="text-brand-navy/40">/ {client.totalRequests}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : client.status === 'pending_invite'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {client.status === 'pending_invite' ? 'Pending Invite' : 
                       client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-brand-navy/20 mx-auto mb-3" />
          <p className="text-brand-navy/60 mb-4">No clients yet</p>
          <Link
            href="/portal/admin/clients/new"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add your first client
          </Link>
        </div>
      )}
    </div>
  );
}
