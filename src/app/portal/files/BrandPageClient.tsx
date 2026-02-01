'use client';

import { useRouter } from 'next/navigation';
import { Image, Type, FileText } from 'lucide-react';
import { BrandUploadSection } from '@/components/portal/BrandUploadSection';
import type { FileRow } from '@/types/portal';

interface BrandPageClientProps {
  brandAssets: FileRow[];
  fonts: FileRow[];
  documents: FileRow[];
  isAdmin: boolean;
}

export function BrandPageClient({ 
  brandAssets, 
  fonts, 
  documents, 
  isAdmin 
}: BrandPageClientProps) {
  const router = useRouter();

  // Refresh the page to get updated file lists
  const handleFileUploaded = () => {
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Brand Assets Section */}
      <BrandUploadSection
        title="Brand Assets"
        description="Logos, icons, and brand images"
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
        onFileUploaded={handleFileUploaded}
      />

      {/* Fonts Section */}
      <BrandUploadSection
        title="Fonts"
        description="Brand typography files"
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
        onFileUploaded={handleFileUploaded}
      />

      {/* Project Documents Section */}
      <BrandUploadSection
        title="Project Documents"
        description="Briefs, guidelines, and project files"
        category="documents"
        icon={FileText}
        acceptedTypes={[
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'application/zip',
        ]}
        acceptedExtensions={['.pdf', '.doc', '.docx', '.txt', '.zip']}
        files={documents}
        isAdmin={isAdmin}
        onFileUploaded={handleFileUploaded}
      />
    </div>
  );
}
