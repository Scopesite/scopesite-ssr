import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/terms-and-conditions`;

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Full terms and conditions for ScopeSite Digital Studios. Covers pricing, deliverables, IP rights, data protection and change request procedures.',
  openGraph: {
    title: 'Terms & Conditions | ScopeSite Digital Studios',
    description:
      'Full terms and conditions for ScopeSite Digital Studios. Covers pricing, deliverables, IP rights, data protection and change request procedures.',
    url: PAGE_URL,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Terms & Conditions | ScopeSite Digital Studios',
    description:
      'Full terms and conditions for ScopeSite Digital Studios. Covers pricing, deliverables, IP rights, data protection.',
  },
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Table of Contents data - matches actual section numbers in document
const tableOfContents = [
  { num: 1, label: 'Introduction and Definitions', href: '#1-introduction-and-definitions' },
  { num: 2, label: 'Company Information', href: '#2-company-information' },
  { num: 3, label: 'Services and Deliverables', href: '#3-services-and-deliverables' },
  { num: 4, label: 'Payment Terms', href: '#4-payment-terms' },
  { num: 7, label: 'Intellectual Property Rights', href: '#7-intellectual-property-rights' },
  { num: 8, label: 'Revisions and Change Requests', href: '#8-revisions-and-change-requests' },
  { num: 9, label: 'Cancellation and Refunds', href: '#9-cancellation-and-refunds' },
  { num: 10, label: 'Data Protection and Privacy', href: '#10-data-protection-and-privacy' },
  { num: 11, label: 'Liability and Indemnity', href: '#11-liability-and-indemnity' },
  { num: 12, label: 'Subcontracting and Third-Party Services', href: '#12-subcontracting-and-third-party-services' },
  { num: 13, label: 'Platform Risk Disclaimer', href: '#13-platform-risk-disclaimer' },
  { num: 14, label: 'Confidentiality', href: '#14-confidentiality' },
  { num: 15, label: 'Service Level Disclaimer', href: '#15-service-level-disclaimer' },
  { num: 16, label: 'Client Authority', href: '#16-client-authority' },
  { num: 17, label: 'Updates to Terms', href: '#17-updates-to-terms' },
  { num: 18, label: 'Termination', href: '#18-termination' },
  { num: 19, label: 'Dispute Resolution', href: '#19-dispute-resolution' },
  { num: 20, label: 'General Provisions', href: '#20-general-provisions' },
];

// Read the markdown file at build time and remove the TOC section
function getTermsContent(): string {
  const filePath = path.join(process.cwd(), 'public', 'ScopeSite_Terms_and_Conditions_2026.md');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove the original TOC section from markdown (we render it separately)
  // Remove from "## TABLE OF CONTENTS" to the next "---"
  content = content.replace(/## TABLE OF CONTENTS[\s\S]*?(?=---\n\n##)/m, '');
  
  // Also remove the first H1 title since we have it in the hero
  content = content.replace(/^# TERMS AND CONDITIONS\n\n/, '');
  
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
      <section className="bg-white py-12 md:py-16">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            {/* Back Navigation */}
            <Link
              href="/"
              className="link-navy inline-flex items-center gap-2 text-brand-navy hover:opacity-70 transition-opacity mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-headline text-brand-navy mb-4">
              TERMS AND CONDITIONS
            </h1>
            <p className="text-brand-navy text-lg">
              ScopeSite LTD (trading as ScopeSite Digital Studios)
            </p>
            <p className="text-brand-navy text-sm mt-2">
              Company Registration Number: 16130355 • Effective Date: 28th April 2025
            </p>
          </div>
        </div>
      </section>

      {/* Table of Contents Section - Navy Background */}
      <section className="bg-brand-navy py-12 md:py-16">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-headline text-white mb-8 uppercase tracking-tight">
              TABLE OF CONTENTS
            </h2>
            <ol className="space-y-3">
              {tableOfContents.map((item) => (
                <li key={item.num} className="flex items-baseline gap-2">
                  <span className="text-white font-medium">{item.num}.</span>
                  <a
                    href={item.href}
                    className="text-brand-gold hover:text-brand-orange transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section-white">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            {/* Quick Info Box */}
            <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-xl p-6 mb-12">
              <p className="text-brand-navy/60 text-sm">
                For any questions about these terms,{' '}
                <Link href="/book" className="link-navy text-brand-navy font-semibold underline hover:opacity-70 transition-opacity">
                  contact us
                </Link>
                .
              </p>
            </div>

            {/* Markdown Content */}
            <article className="terms-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={{
                  // Custom heading rendering to match site styles - pass through id for anchor links
                  h1: ({ children, id }) => (
                    <h1 id={id} className="text-2xl sm:text-3xl md:text-4xl font-headline text-brand-navy mt-12 mb-6 uppercase tracking-tight scroll-mt-40">
                      {children}
                    </h1>
                  ),
                  h2: ({ children, id }) => (
                    <h2 id={id} className="text-xl sm:text-2xl md:text-3xl font-headline text-brand-navy mt-12 mb-4 uppercase tracking-tight pt-6 border-t border-brand-navy/10 scroll-mt-40">
                      {children}
                    </h2>
                  ),
                  h3: ({ children, id }) => (
                    <h3 id={id} className="text-lg sm:text-xl font-body font-black text-brand-navy mt-8 mb-3 scroll-mt-40">
                      {children}
                    </h3>
                  ),
                  h4: ({ children, id }) => (
                    <h4 id={id} className="text-base sm:text-lg font-body font-bold text-brand-navy mt-6 mb-2 scroll-mt-40">
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
                          className="link-navy text-brand-navy font-semibold underline hover:opacity-70 transition-opacity"
                        >
                          {children}
                        </a>
                      );
                    }
                    return (
                      <Link
                        href={href || '#'}
                        className="link-navy text-brand-navy font-semibold underline hover:opacity-70 transition-opacity"
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
                  // Tables - important for section 8.2 - WCAG 1.3.1
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 rounded-lg border border-brand-navy/10" role="region" aria-label="Data table" tabIndex={0}>
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
                    <th scope="col" className="px-4 py-3 text-left font-bold text-sm">
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
                      className="link-navy text-brand-navy font-semibold underline hover:opacity-70 transition-opacity"
                    >
                      support@scopesite.co.uk
                    </a>
                  </li>
                  <li>
                    Phone:{' '}
                    <a
                      href="tel:+441373311339"
                      className="link-navy text-brand-navy font-semibold underline hover:opacity-70 transition-opacity"
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
                  className="link-navy inline-flex items-center gap-2 text-brand-navy hover:opacity-70 transition-opacity text-sm"
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

