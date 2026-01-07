import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, FileText, Zap } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { BriefForm } from '@/components/BriefForm';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/brief`;

export const metadata: Metadata = {
  title: 'Send Us a Brief',
  description:
    'Submit your project brief to ScopeSite Digital Studios. Tell us about your website, web app, or branding project and we\'ll get back to you within 2 business days.',
  openGraph: {
    title: 'Send Us a Brief | ScopeSite Digital Studios',
    description:
      'Submit your project brief and get a tailored response within 2 business days.',
    url: PAGE_URL,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Send Us a Brief | ScopeSite Digital Studios',
    description:
      'Submit your project brief and get a tailored response within 2 business days.',
  },
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BriefPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Send Us a Brief', url: PAGE_URL },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-16 md:py-20">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center">
            {/* Back Navigation */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-brand-gold transition-colors mb-8 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline text-white mb-4">
              SEND US A <span className="text-brand-gold">BRIEF</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Tell us about your project and we&apos;ll get back to you with a tailored response.
              No sales pitch—just honest advice.
            </p>

            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Clock className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                <p className="text-white font-medium text-sm">2-Day Response</p>
                <p className="text-white/60 text-xs">We&apos;ll get back to you fast</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <FileText className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                <p className="text-white font-medium text-sm">Share Documents</p>
                <p className="text-white/60 text-xs">Upload files up to 10MB</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Zap className="w-6 h-6 text-brand-gold mx-auto mb-2" />
                <p className="text-white font-medium text-sm">No Obligation</p>
                <p className="text-white/60 text-xs">Free advice, no strings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-white" aria-labelledby="brief-form-heading">
        <div className="container-content">
          <div className="max-w-3xl mx-auto">
            <h2 id="brief-form-heading" className="sr-only">
              Project Brief Form
            </h2>
            <BriefForm />
          </div>
        </div>
      </section>

      {/* Alternative CTA */}
      <section className="section-navy text-center" aria-labelledby="alternative-cta">
        <div className="container-content">
          <h2 id="alternative-cta" className="text-xl sm:text-2xl font-headline text-white mb-4">
            PREFER TO TALK?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Skip the form and book a free 30-minute strategy call with Dan Cartwright, our
            director.
          </p>
          <Link
            href="/book"
            className="btn-secondary-light inline-flex items-center gap-2"
          >
            Book a Call Instead
          </Link>
        </div>
      </section>
    </>
  );
}


