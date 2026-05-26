import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { BrandPageClient } from './BrandPageClient';
import { isPortalAdmin } from '@/lib/portal-auth';
import {
  getClientByClerkId,
  getClientById,
  getFilesByClientId,
  getBrandProfile,
} from '@/lib/portal-db';

export const metadata = {
  title: 'Brand - Client Portal',
};

interface BrandPageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function BrandPage({ searchParams }: BrandPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/portal/sign-in');
  }

  const resolvedParams = await searchParams;
  const isAdmin = isPortalAdmin(userId);

  let clientId: string | null = null;
  let companyName = '';

  if (isAdmin) {
    if (resolvedParams.clientId) {
      const target = await getClientById(resolvedParams.clientId);
      if (!target) {
        redirect('/portal/admin/clients');
      }
      clientId = target.id;
      companyName = target.company_name;
    }
  } else {
    const client = await getClientByClerkId(userId);
    if (!client) {
      redirect('/portal/dashboard');
    }
    clientId = client.id;
    companyName = client.company_name;
  }

  const files = clientId ? await getFilesByClientId(clientId) : [];
  const profile = clientId ? await getBrandProfile(clientId) : null;

  const brandAssets = files.filter((f) => f.folder_category === 'brand_assets');
  const fontFiles = files.filter((f) => f.folder_category === 'fonts');
  const documents = files.filter((f) => f.folder_category === 'documents');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Brand</h1>
        <p className="text-brand-navy/60 mt-1">
          Logos, colours, fonts, tone of voice, and brand guidelines
        </p>
      </div>

      <BrandPageClient
        brandAssets={brandAssets}
        fonts={fontFiles}
        documents={documents}
        profile={
          profile ?? {
            id: '',
            client_id: clientId ?? '',
            palette: [],
            fonts: [],
            tone_voice: null,
            banned_words: [],
            social_handles: [],
            updated_at: new Date(),
            updated_by: null,
          }
        }
        clientId={clientId ?? ''}
        companyName={companyName}
        isAdmin={isAdmin}
        showClientPicker={isAdmin && !resolvedParams.clientId}
      />
    </div>
  );
}
