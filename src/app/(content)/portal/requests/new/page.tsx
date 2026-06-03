import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { NewRequestPageClient } from './NewRequestPageClient';
import { isPortalAdmin } from '@/lib/portal-auth';
import { getClientByClerkId } from '@/lib/portal-db';

export const metadata = {
  title: 'New Request - Client Portal',
};

export default async function NewRequestPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/portal/sign-in');
  }

  const isAdmin = isPortalAdmin(userId);
  let clientId: string | null = null;

  if (isAdmin) {
    // Admin picks client in the form
  } else {
    const client = await getClientByClerkId(userId);
    if (!client) {
      redirect('/portal/dashboard');
    }
    clientId = client.id;
  }

  return <NewRequestPageClient isAdmin={isAdmin} clientId={clientId} />;
}
