'use client';

import { useRouter } from 'next/navigation';
import { Image, Type, FileText } from 'lucide-react';
import { BrandUploadSection } from '@/components/portal/BrandUploadSection';
import { BrandProfileEditors } from '@/components/portal/BrandProfileEditors';
import { ClientPicker, type ClientPickerOption } from '@/components/portal/ClientPicker';
import type { BrandProfileRow, FileRow } from '@/types/portal';

interface BrandPageClientProps {
  brandAssets: FileRow[];
  fonts: FileRow[];
  documents: FileRow[];
  profile: BrandProfileRow;
  clientId: string;
  companyName: string;
  isAdmin: boolean;
  showClientPicker: boolean;
}

export function BrandPageClient({
  brandAssets,
  fonts,
  documents,
  profile,
  clientId,
  companyName,
  isAdmin,
  showClientPicker,
}: BrandPageClientProps) {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  const handleAdminClientSelect = (id: string | null, client: ClientPickerOption | null) => {
    if (id && client) {
      router.push(`/portal/brand?clientId=${encodeURIComponent(id)}`);
    }
  };

  const uploadClientId = isAdmin ? clientId : undefined;

  return (
    <div className="space-y-8">
      {showClientPicker && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <ClientPicker
            value={clientId || null}
            onChange={handleAdminClientSelect}
          />
        </div>
      )}

      {clientId ? (
        <>
          <p className="text-sm text-brand-navy/60">
            Managing brand for <strong className="text-brand-navy">{companyName}</strong>
          </p>

          <BrandProfileEditors
            initialProfile={profile}
            clientId={clientId}
            canEdit
          />

          <BrandUploadSection
            title="Brand assets"
            description="Logos (light/dark), favicon, social square, icons"
            category="brand_assets"
            icon={Image}
            acceptedTypes={[
              'image/png',
              'image/jpeg',
              'image/jpg',
              'image/webp',
              'image/svg+xml',
            ]}
            acceptedExtensions={['.png', '.jpg', '.jpeg', '.webp', '.svg']}
            files={brandAssets}
            isAdmin={isAdmin}
            uploadClientId={uploadClientId}
            onFileUploaded={handleRefresh}
          />

          <BrandUploadSection
            title="Font files"
            description="Uploaded font files (TTF, OTF, WOFF)"
            category="fonts"
            icon={Type}
            acceptedTypes={[
              'font/ttf',
              'font/otf',
              'font/woff',
              'font/woff2',
              'application/x-font-ttf',
              'application/x-font-otf',
              'application/font-woff',
              'application/font-woff2',
            ]}
            acceptedExtensions={['.ttf', '.otf', '.woff', '.woff2']}
            files={fonts}
            isAdmin={isAdmin}
            uploadClientId={uploadClientId}
            onFileUploaded={handleRefresh}
          />

          <BrandUploadSection
            title="Brand guidelines"
            description="PDF or Word brand guidelines and reference docs"
            category="documents"
            icon={FileText}
            acceptedTypes={[
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'text/plain',
            ]}
            acceptedExtensions={['.pdf', '.doc', '.docx', '.txt']}
            files={documents}
            isAdmin={isAdmin}
            uploadClientId={uploadClientId}
            onFileUploaded={handleRefresh}
          />
        </>
      ) : (
        <p className="text-brand-navy/60 text-sm">Select a client to view and edit their brand.</p>
      )}
    </div>
  );
}
