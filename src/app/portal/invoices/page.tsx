import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Receipt, Download, Calendar, FileText } from 'lucide-react';
import { getClientByClerkId, getFilesByClientId } from '@/lib/portal-db';

export const metadata = {
  title: 'Invoices - Client Portal',
};

export default async function InvoicesPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/portal/sign-in');
  }

  const client = await getClientByClerkId(userId);
  
  if (!client) {
    redirect('/portal/dashboard');
  }

  // Get all files for the client, filter to invoices only
  const files = await getFilesByClientId(client.id);
  const invoices = files.filter(f => f.folder_category === 'invoices');

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Invoices</h1>
        <p className="text-brand-navy/60 mt-1">
          View and download your invoices
        </p>
      </div>

      {/* Invoices List */}
      {invoices.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-navy/5 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-brand-navy" />
            </div>
            <div>
              <h2 className="font-semibold text-brand-navy">All Invoices</h2>
              <p className="text-sm text-brand-navy/50">
                {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                {/* Invoice icon */}
                <div className="w-12 h-12 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-brand-gold-accessible" />
                </div>

                {/* Invoice details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-navy truncate">
                    {invoice.file_name}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-brand-navy/50 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(invoice.created_at)}
                    </span>
                    <span>{formatFileSize(invoice.file_size)}</span>
                  </div>
                </div>

                {/* Download button */}
                <a
                  href={invoice.blob_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-medium rounded-lg hover:bg-brand-graphite transition-colors"
                >
                  <Download size={16} />
                  Download PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Receipt className="w-12 h-12 text-brand-navy/20 mx-auto mb-3" />
          <p className="text-brand-navy/60">No invoices yet</p>
          <p className="text-sm text-brand-navy/40 mt-1">
            Invoices will appear here once they are issued
          </p>
        </div>
      )}

      {/* Note about invoices */}
      <div className="bg-brand-navy/5 rounded-xl p-6">
        <h3 className="font-semibold text-brand-navy mb-2">Need help with an invoice?</h3>
        <p className="text-sm text-brand-navy/70">
          If you have any questions about your invoices or need to discuss payment, please contact us at{' '}
          <a 
            href="mailto:accounts@scopesite.co.uk" 
            className="text-brand-gold-accessible hover:text-brand-orange-accessible font-medium"
          >
            accounts@scopesite.co.uk
          </a>
        </p>
      </div>
    </div>
  );
}
