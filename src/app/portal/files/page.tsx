import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Image, Type, FileText } from 'lucide-react';
import { getClientByClerkId, getFilesByClientId } from '@/lib/portal-db';
import { BrandPageClient } from './BrandPageClient';

export const metadata = {
  title: 'Brand - Client Portal',
};

const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || '').split(',').map(id => id.trim());

export default async function BrandPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/portal/sign-in');
  }

  const client = await getClientByClerkId(userId);
  
  if (!client) {
    redirect('/portal/dashboard');
  }

  const isAdmin = ADMIN_CLERK_IDS.includes(userId);

  // Get all files for the client
  const files = await getFilesByClientId(client.id);

  // Group files by category
  const brandAssets = files.filter(f => f.folder_category === 'brand_assets');
  const fonts = files.filter(f => f.folder_category === 'fonts');
  const documents = files.filter(f => f.folder_category === 'documents');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Brand</h1>
        <p className="text-brand-navy/60 mt-1">
          Upload and manage your brand assets, fonts, and project documents
        </p>
      </div>

      {/* Brand Assets Section */}
      <BrandPageClient
        brandAssets={brandAssets}
        fonts={fonts}
        documents={documents}
        isAdmin={isAdmin}
      />
    </div>
  );
}
