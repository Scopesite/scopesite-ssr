import { ClerkProvider } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import { PortalNav } from '@/components/portal/PortalNav';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { BrevoIdentifyPortal } from '@/components/BrevoIdentifyPortal';
import { getClientByClerkId } from '@/lib/portal-db';

export const metadata = {
  title: 'Client Portal',
  description: 'ScopeSite Client Portal - Manage your projects and requests',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <ClerkProvider>
        <BrevoIdentifyPortal />
        <div className="-mt-32">{children}</div>
      </ClerkProvider>
    );
  }

  const user = await currentUser();
  const client = await getClientByClerkId(userId);
  const adminIds = process.env.ADMIN_CLERK_IDS?.split(',') || [];
  const isAdmin = adminIds.includes(userId);

  return (
    <ClerkProvider>
      <BrevoIdentifyPortal />
      <div className="-mt-32 min-h-screen bg-gray-50">
        <PortalNav
          userName={user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'}
          userEmail={user?.emailAddresses[0]?.emailAddress || ''}
          isAdmin={isAdmin}
          companyName={client?.company_name}
        />

        <div className="flex">
          <PortalSidebar isAdmin={isAdmin} />

          <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64 pt-24 lg:pt-20">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ClerkProvider>
  );
}
