import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { User, Mail, Building, Phone, Shield } from 'lucide-react';
import { getClientByClerkId } from '@/lib/portal-db';
import { isPortalAdmin } from '@/lib/portal-auth';
import { SettingsForm } from './SettingsForm';

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
  const isAdmin = isPortalAdmin(userId);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Account Settings</h1>
        <p className="text-brand-navy/60 mt-1">
          Manage your profile and notification preferences
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-brand-navy">Profile Information</h2>
        </div>
        <div className="p-6 space-y-4">
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
            </div>
          ) : isAdmin ? (
            <p className="text-brand-navy/60 text-sm">
              You are logged in as an administrator. Admin accounts do not receive client SMS
              updates.
            </p>
          ) : (
            <p className="text-brand-navy/60 text-sm">
              Your account hasn&apos;t been linked to a client profile yet.
            </p>
          )}
        </div>
      </div>

      {client && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <Phone size={18} className="text-brand-navy/50" />
            <h2 className="font-semibold text-brand-navy">SMS notifications</h2>
          </div>
          <SettingsForm
            initialPhone={client.phone}
            initialSmsOptIn={client.sms_opt_in ?? false}
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-semibold text-brand-navy">Account</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-brand-navy/60">
            To update your name or password, use Clerk account management.
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

      <div className="bg-brand-navy/5 rounded-xl p-6">
        <h3 className="font-semibold text-brand-navy mb-2">Need Help?</h3>
        <p className="text-sm text-brand-navy/70 mb-4">
          Questions about your account? Contact support.
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
