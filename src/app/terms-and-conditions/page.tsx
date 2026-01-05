import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/terms-and-conditions`;

export const metadata: Metadata = {
  title: 'Terms and Conditions | ScopeSite Digital Studios',
  description:
    'Terms and Conditions for ScopeSite LTD (trading as ScopeSite Digital Studios). Read our full terms of service, payment terms, and policies.',
  openGraph: {
    title: 'Terms and Conditions | ScopeSite Digital Studios',
    description:
      'Terms and Conditions for ScopeSite LTD (trading as ScopeSite Digital Studios). Read our full terms of service, payment terms, and policies.',
    url: PAGE_URL,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms and Conditions | ScopeSite',
    description: 'Terms and Conditions for ScopeSite Digital Studios.',
  },
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Read the markdown file at build time
function getTermsContent(): string {
  const filePath = path.join(process.cwd(), 'public', 'ScopeSite_Terms_and_Conditions_2026.md');
  const content = fs.readFileSync(filePath, 'utf8');
  return content;
}

export default function TermsPage() {
  const termsContent = getTermsContent();

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Terms and Conditions', url: PAGE_URL },
  ]);

  return (
    <>
      {/* Page-specific structured data */}
      <JsonLd schema={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-12 md:py-16">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            {/* Back Navigation */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-brand-gold transition-colors mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-headline text-white mb-4">
              TERMS AND <span className="text-brand-gold">CONDITIONS</span>
            </h1>
            <p className="text-white/70 text-lg">
              ScopeSite LTD (trading as ScopeSite Digital Studios)
            </p>
            <p className="text-white/50 text-sm mt-2">
              Company Registration Number: 16130355 • Effective Date: 28th April 2025
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section-white">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            {/* Table of Contents Quick Nav */}
            <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-xl p-6 mb-12">
              <p className="text-brand-navy/70 text-sm mb-3 font-medium">Quick Navigation</p>
              <p className="text-brand-navy/60 text-sm">
                Use the table of contents below to jump to specific sections. For any questions about these terms,{' '}
                <Link href="/book" className="text-brand-gold hover:text-brand-orange transition-colors">
                  contact us
                </Link>
                .
              </p>
            </div>

            {/* Markdown Content */}
            <article className="terms-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom heading rendering to match site styles
                  h1: ({ children }) => (
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline text-brand-navy mt-12 mb-6 uppercase tracking-tight">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-headline text-brand-navy mt-12 mb-4 uppercase tracking-tight pt-6 border-t border-brand-navy/10">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg sm:text-xl font-body font-black text-brand-navy mt-8 mb-3">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-base sm:text-lg font-body font-bold text-brand-navy mt-6 mb-2">
                      {children}
                    </h4>
                  ),
                  // Paragraphs
                  p: ({ children }) => (
                    <p className="text-brand-navy/80 leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  // Strong/Bold text
                  strong: ({ children }) => (
                    <strong className="font-bold text-brand-navy">{children}</strong>
                  ),
                  // Links
                  a: ({ href, children }) => {
                    // Handle anchor links within the page
                    if (href?.startsWith('#')) {
                      return (
                        <a
                          href={href}
                          className="text-brand-gold hover:text-brand-orange transition-colors"
                        >
                          {children}
                        </a>
                      );
                    }
                    return (
                      <Link
                        href={href || '#'}
                        className="text-brand-gold hover:text-brand-orange transition-colors"
                      >
                        {children}
                      </Link>
                    );
                  },
                  // Unordered lists
                  ul: ({ children }) => (
                    <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-brand-navy/80">
                      {children}
                    </ul>
                  ),
                  // Ordered lists
                  ol: ({ children }) => (
                    <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-brand-navy/80">
                      {children}
                    </ol>
                  ),
                  // List items
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  // Horizontal rule
                  hr: () => (
                    <hr className="my-8 border-brand-navy/10" />
                  ),
                  // Tables - important for section 8.2
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 rounded-lg border border-brand-navy/10">
                      <table className="w-full text-sm">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-brand-navy text-white">
                      {children}
                    </thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-brand-navy/10">
                      {children}
                    </tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-brand-gold/5 transition-colors">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-3 text-left font-bold text-sm">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-3 text-brand-navy/80">
                      {children}
                    </td>
                  ),
                  // Blockquotes (if any)
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-brand-gold pl-4 my-4 italic text-brand-navy/70">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {termsContent}
              </ReactMarkdown>
            </article>

            {/* Footer Note */}
            <div className="mt-16 pt-8 border-t border-brand-navy/10">
              <div className="bg-brand-navy/5 rounded-xl p-6">
                <p className="text-brand-navy/70 text-sm mb-4">
                  <strong className="text-brand-navy">Questions about these terms?</strong>
                </p>
                <p className="text-brand-navy/60 text-sm mb-4">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <ul className="text-brand-navy/70 text-sm space-y-1">
                  <li>
                    Email:{' '}
                    <a
                      href="mailto:support@scopesite.co.uk"
                      className="text-brand-gold hover:text-brand-orange transition-colors"
                    >
                      support@scopesite.co.uk
                    </a>
                  </li>
                  <li>
                    Phone:{' '}
                    <a
                      href="tel:+441373311339"
                      className="text-brand-gold hover:text-brand-orange transition-colors"
                    >
                      01373 311 339
                    </a>
                  </li>
                </ul>
              </div>

              {/* Back to Home */}
              <div className="mt-8 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-brand-navy/60 hover:text-brand-gold transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

