import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Admin Clerk IDs - you'll set this in environment variables
const ADMIN_CLERK_IDS = process.env.ADMIN_CLERK_IDS?.split(',') || [];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/portal/sign-in');
  }
  
  // Check if user is admin
  if (!ADMIN_CLERK_IDS.includes(userId)) {
    redirect('/portal/dashboard');
  }
  
  return <>{children}</>;
}
