import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PortalNav } from '@/components/portal/PortalNav';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
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
  
  // If not signed in, the middleware will redirect to sign-in
  // But we also check here for the layout to work properly
  if (!userId) {
    redirect('/portal/sign-in');
  }
  
  // Get the current user from Clerk
  const user = await currentUser();
  
  // Try to get the client from our database
  const client = await getClientByClerkId(userId);
  
  // Check if user is admin (you can customize this list)
  const adminIds = process.env.ADMIN_CLERK_IDS?.split(',') || [];
  const isAdmin = adminIds.includes(userId);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <PortalNav 
        userName={user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'}
        userEmail={user?.emailAddresses[0]?.emailAddress || ''}
        isAdmin={isAdmin}
        companyName={client?.company_name}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <PortalSidebar isAdmin={isAdmin} />
        
        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64 pt-20">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
