import { getAllClients, getChangeRequestsByClientId } from '@/lib/portal-db';
import { ClientsListFilters } from '@/components/portal/ClientsListFilters';

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

  return <ClientsListFilters clients={clientsWithStats} />;
}
