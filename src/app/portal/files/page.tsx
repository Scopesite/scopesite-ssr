import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { 
  FolderOpen, 
  FileText, 
  Image, 
  FileCode, 
  File, 
  ExternalLink,
  Calendar
} from 'lucide-react';
import { getClientByClerkId, getFilesByClientId } from '@/lib/portal-db';
import { type FileFolderCategory } from '@/types/portal';

export const metadata = {
  title: 'Files - Client Portal',
};

const FOLDER_LABELS: Record<FileFolderCategory, string> = {
  brand_assets: 'Brand Assets',
  content: 'Content',
  designs: 'Designs',
  documents: 'Documents',
  deliverables: 'Deliverables',
  change_requests: 'Change Requests',
};

const FOLDER_ICONS: Record<FileFolderCategory, React.ElementType> = {
  brand_assets: Image,
  content: FileText,
  designs: FileCode,
  documents: File,
  deliverables: FolderOpen,
  change_requests: FileText,
};

export default async function FilesPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/portal/sign-in');
  }

  const client = await getClientByClerkId(userId);
  
  if (!client) {
    redirect('/portal/dashboard');
  }

  // Get all files for the client
  const files = await getFilesByClientId(client.id);

  // Group files by category
  const filesByCategory = files.reduce((acc, file) => {
    if (!acc[file.folder_category]) {
      acc[file.folder_category] = [];
    }
    acc[file.folder_category].push(file);
    return acc;
  }, {} as Record<string, typeof files>);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.includes('pdf')) return FileText;
    if (mimeType.includes('document') || mimeType.includes('word')) return FileText;
    return File;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Files</h1>
        <p className="text-brand-navy/60 mt-1">
          All files related to your projects
        </p>
      </div>

      {/* Files by category */}
      {Object.keys(FOLDER_LABELS).length > 0 ? (
        <div className="space-y-8">
          {(Object.entries(FOLDER_LABELS) as [FileFolderCategory, string][]).map(
            ([category, label]) => {
              const categoryFiles = filesByCategory[category] || [];
              const CategoryIcon = FOLDER_ICONS[category];

              return (
                <div key={category}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-brand-navy/5 rounded-lg flex items-center justify-center">
                      <CategoryIcon className="w-5 h-5 text-brand-navy" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-brand-navy">{label}</h2>
                      <p className="text-sm text-brand-navy/50">
                        {categoryFiles.length} file{categoryFiles.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Files list */}
                  {categoryFiles.length > 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                      {categoryFiles.map((file) => {
                        const FileIcon = getFileIcon(file.file_type);
                        return (
                          <a
                            key={file.id}
                            href={file.blob_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileIcon className="w-5 h-5 text-brand-gold-accessible" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-brand-navy truncate">
                                {file.file_name}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-brand-navy/50 mt-0.5">
                                <span>{formatFileSize(file.file_size)}</span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {formatDate(file.created_at)}
                                </span>
                              </div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-brand-navy/30 flex-shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center text-brand-navy/50 text-sm">
                      No files in this category yet
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-brand-navy/20 mx-auto mb-3" />
          <p className="text-brand-navy/60">No files uploaded yet</p>
          <p className="text-sm text-brand-navy/40 mt-1">
            Files will appear here when you or Dan upload them to your projects
          </p>
        </div>
      )}
    </div>
  );
}
