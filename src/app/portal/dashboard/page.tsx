import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { 
  getClientByClerkId, 
  getChangeRequestsByClientId, 
  getActivityByClientId,
  getClientDashboardStats,
  linkClerkUserToClient 
} from '@/lib/portal-db';
import { RequestCard } from '@/components/portal/RequestCard';
import { ActivityFeed } from '@/components/portal/ActivityFeed';
import { currentUser } from '@clerk/nextjs/server';

export const metadata = {
  title: 'Dashboard - Client Portal',
};

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/portal/sign-in');
  }

  // Get or link client
  let client = await getClientByClerkId(userId);
  
  // If no client found, try to link by email
  if (!client) {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    
    if (email) {
      client = await linkClerkUserToClient(email, userId);
    }
  }

  // If still no client, show onboarding message
  if (!client) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-brand-gold" />
        </div>
        <h1 className="text-2xl font-bold text-brand-navy mb-4">
          Welcome to ScopeSite Portal
        </h1>
        <p className="text-brand-navy/70 mb-6">
          Your account is set up, but it hasn&apos;t been linked to a client profile yet.
          Please contact Dan to complete your setup.
        </p>
        <a
          href="mailto:dan@scopesite.co.uk?subject=Portal%20Setup%20Request"
          className="btn-primary inline-flex"
        >
          Contact Dan
        </a>
      </div>
    );
  }

  // Fetch dashboard data
  const [recentRequests, activities, stats] = await Promise.all([
    getChangeRequestsByClientId(client.id, 5),
    getActivityByClientId(client.id, 10),
    getClientDashboardStats(client.id),
  ]);

  // Check for requests needing action
  const needsAction = recentRequests.filter(r => 
    ['estimate_added', 'awaiting_approval', 'awaiting_client_info'].includes(r.progress)
  );

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">
          Welcome back, {client.primary_contact_name.split(' ')[0]}
        </h1>
        <p className="text-brand-navy/60 mt-1">
          Here&apos;s what&apos;s happening with your projects
        </p>
      </div>

      {/* Action needed banner */}
      {needsAction.length > 0 && (
        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-brand-navy" />
            </div>
            <div>
              <h2 className="font-semibold text-brand-navy">
                {needsAction.length} {needsAction.length === 1 ? 'request needs' : 'requests need'} your attention
              </h2>
              <p className="text-sm text-brand-navy/70 mt-1">
                {needsAction.some(r => r.progress === 'estimate_added' || r.progress === 'awaiting_approval')
                  ? 'You have quotes waiting for approval.'
                  : 'We need some information from you to continue.'}
              </p>
              <Link
                href="/portal/requests"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-gold-accessible mt-2 hover:text-brand-orange-accessible"
              >
                View requests <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Requests" 
          value={stats.totalRequests} 
          href="/portal/requests" 
        />
        <StatCard 
          label="Open" 
          value={stats.openRequests} 
          highlight={stats.openRequests > 0}
        />
        <StatCard 
          label="In Progress" 
          value={stats.inProgress} 
        />
        <StatCard 
          label="Completed" 
          value={stats.completed} 
        />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/portal/requests/new"
          className="flex items-center gap-4 p-6 bg-brand-navy text-white rounded-xl hover:bg-brand-graphite transition-colors"
        >
          <div className="w-12 h-12 bg-brand-gold rounded-lg flex items-center justify-center">
            <Plus className="w-6 h-6 text-brand-navy" />
          </div>
          <div>
            <h3 className="font-semibold">Submit New Request</h3>
            <p className="text-sm text-white/70">Start a new change request or project</p>
          </div>
        </Link>

        <Link
          href="/portal/files"
          className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:border-brand-gold/50 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-brand-navy/5 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-brand-navy" />
          </div>
          <div>
            <h3 className="font-semibold text-brand-navy">View Files</h3>
            <p className="text-sm text-brand-navy/60">Browse your project files</p>
          </div>
        </Link>
      </div>

      {/* Two columns: Recent requests & Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent requests */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-navy">Recent Requests</h2>
            <Link 
              href="/portal/requests" 
              className="text-sm text-brand-gold-accessible hover:text-brand-orange-accessible font-medium"
            >
              View all
            </Link>
          </div>
          
          {recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <FileText className="w-12 h-12 text-brand-navy/20 mx-auto mb-3" />
              <p className="text-brand-navy/60">No requests yet</p>
              <Link
                href="/portal/requests/new"
                className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-brand-gold-accessible hover:text-brand-orange-accessible"
              >
                <Plus size={16} /> Submit your first request
              </Link>
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div>
          <h2 className="text-lg font-semibold text-brand-navy mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  href, 
  highlight = false 
}: { 
  label: string; 
  value: number; 
  href?: string; 
  highlight?: boolean;
}) {
  const content = (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-brand-gold/5 border-brand-gold/30' : 'bg-white border-gray-200'}`}>
      <p className="text-sm text-brand-navy/60">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-brand-gold-accessible' : 'text-brand-navy'}`}>
        {value}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
