import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { User, Mail, Building, Phone, Shield } from 'lucide-react';
import { getClientByClerkId } from '@/lib/portal-db';

const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').map(id => id.trim());

export const metadata = {
  title: 'Settings - Client Portal',
};

export default async function SettingsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/portal/sign-in');
  }

  const user = await currentUser();
  const client = await getClientByClerkId(userId);
  const isAdmin = ADMIN_CLERK_IDS.includes(userId);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Account Settings</h1>
        <p className="text-brand-navy/60 mt-1">
          Manage your profile and account preferences
        </p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-brand-navy">Profile Information</h2>
        </div>
        <div className="p-6 space-y-4">
          {/* User info from Clerk */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-navy rounded-full flex items-center justify-center">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <p className="font-semibold text-brand-navy text-lg">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-brand-navy/60 text-sm">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-brand-gold/10 text-brand-gold-accessible text-xs font-medium rounded">
                  <Shield size={12} /> Admin
                </span>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Client info from database */}
          {client ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building size={18} className="text-brand-navy/40" />
                <div>
                  <p className="text-xs text-brand-navy/50 uppercase font-medium">Company</p>
                  <p className="text-brand-navy">{client.company_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User size={18} className="text-brand-navy/40" />
                <div>
                  <p className="text-xs text-brand-navy/50 uppercase font-medium">Contact Name</p>
                  <p className="text-brand-navy">{client.primary_contact_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-brand-navy/40" />
                <div>
                  <p className="text-xs text-brand-navy/50 uppercase font-medium">Email</p>
                  <p className="text-brand-navy">{client.email}</p>
                </div>
              </div>
              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-brand-navy/40" />
                  <div>
                    <p className="text-xs text-brand-navy/50 uppercase font-medium">Phone</p>
                    <p className="text-brand-navy">{client.phone}</p>
                  </div>
                </div>
              )}
            </div>
          ) : isAdmin ? (
            <p className="text-brand-navy/60 text-sm">
              You are logged in as an administrator.
            </p>
          ) : (
            <p className="text-brand-navy/60 text-sm">
              Your account hasn&apos;t been linked to a client profile yet.
            </p>
          )}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-brand-navy">Account</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-brand-navy/60">
            To update your profile information or change your password, please use the Clerk account management.
          </p>
          <a
            href="https://accounts.scopesite.co.uk/user"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-graphite transition-colors"
          >
            Manage Account
          </a>
        </div>
      </div>

      {/* Support */}
      <div className="bg-brand-navy/5 rounded-xl p-6">
        <h3 className="font-semibold text-brand-navy mb-2">Need Help?</h3>
        <p className="text-sm text-brand-navy/70 mb-4">
          If you need to update your company information or have any questions about your account, please contact us.
        </p>
        <a
          href="mailto:support@scopesite.co.uk"
          className="text-sm font-medium text-brand-gold-accessible hover:text-brand-orange-accessible"
        >
          support@scopesite.co.uk
        </a>
      </div>
    </div>
  );
}
