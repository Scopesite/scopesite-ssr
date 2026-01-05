import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/schema';

const BASE_URL = 'https://scopesite.co.uk';
const PAGE_URL = `${BASE_URL}/accessibility`;

export const metadata: Metadata = {
  title: 'Accessibility Statement | ScopeSite Digital Studios',
  description:
    'Our commitment to digital accessibility. Learn about the accessibility features on the ScopeSite website and how to report accessibility issues.',
  openGraph: {
    title: 'Accessibility Statement | ScopeSite Digital Studios',
    description:
      'Our commitment to digital accessibility. Learn about the accessibility features on the ScopeSite website.',
    url: PAGE_URL,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Accessibility Statement | ScopeSite Digital Studios',
    description:
      'Our commitment to digital accessibility. Learn about the accessibility features on the ScopeSite website.',
  },
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const accessibilityFeatures = [
  {
    category: 'Navigation & Structure',
    items: [
      'Skip link to bypass navigation and jump to main content',
      'Semantic HTML with proper heading hierarchy (h1-h6)',
      'ARIA landmarks for main, header, footer, and navigation regions',
      'Breadcrumb navigation for easy orientation',
      'Consistent navigation structure across all pages',
    ],
  },
  {
    category: 'Keyboard Accessibility',
    items: [
      'All interactive elements are keyboard accessible',
      'Visible focus indicators on all focusable elements',
      'No keyboard traps - users can navigate freely',
      'Tab order follows logical reading order',
      'Mobile menu is fully keyboard operable',
    ],
  },
  {
    category: 'Visual Accessibility',
    items: [
      'Sufficient colour contrast ratios (WCAG AA minimum)',
      'Text is resizable up to 200% without loss of functionality',
      'No content conveyed through colour alone',
      'Focus indicators meet 3:1 contrast ratio',
      'High contrast mode support for Windows users',
    ],
  },
  {
    category: 'Screen Reader Support',
    items: [
      'Alternative text for all meaningful images',
      'ARIA labels for interactive elements without visible text',
      'Page titles change dynamically on navigation',
      'Form fields have associated labels',
      'Error messages are announced to screen readers',
    ],
  },
  {
    category: 'Forms & Inputs',
    items: [
      'All form fields have visible labels',
      'Required fields are clearly indicated',
      'Error messages identify the field in error',
      'Input purpose is programmatically determinable (autocomplete)',
      'Instructions are provided before form submission',
    ],
  },
  {
    category: 'Motion & Animation',
    items: [
      'Reduced motion support respects user preferences',
      'No auto-playing video or audio content',
      'Animations can be paused or disabled',
      'No content that flashes more than 3 times per second',
    ],
  },
];

const knownLimitations = [
  {
    issue: 'Some older blog posts may have images without alt text',
    status: 'Being addressed as content is reviewed',
  },
  {
    issue: 'Third-party embedded content (e.g., Calendly) has independent accessibility',
    status: 'We select accessible third-party tools where possible',
  },
];

export default function AccessibilityPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Accessibility', url: PAGE_URL },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />

      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="link-navy inline-flex items-center gap-2 text-brand-navy hover:opacity-70 transition-opacity mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-headline text-brand-navy mb-4">
              ACCESSIBILITY STATEMENT
            </h1>
            <p className="text-brand-navy text-lg">
              Our commitment to making the web accessible for everyone.
            </p>
            <p className="text-brand-navy/70 text-sm mt-2">
              Last updated: January 2026
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-white" aria-labelledby="commitment-heading">
        <div className="container-content">
          <div className="max-w-4xl mx-auto">
            {/* Commitment Statement */}
            <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-xl p-6 mb-12">
              <h2 id="commitment-heading" className="text-xl font-bold text-brand-navy mb-3">
                Our Commitment
              </h2>
              <p className="text-brand-navy/80 leading-relaxed">
                ScopeSite Digital Studios is committed to ensuring digital accessibility for people
                with disabilities. We are continually improving the user experience for everyone
                and applying the relevant accessibility standards. This includes compliance with
                the European Accessibility Act (EAA) which came into effect in June 2025.
              </p>
            </div>

            {/* Standards */}
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-headline text-brand-navy mb-4 uppercase tracking-tight">
                Conformance Status
              </h2>
              <p className="text-brand-navy/80 leading-relaxed mb-4">
                We strive to conform to the{' '}
                <a
                  href="https://www.w3.org/WAI/WCAG21/quickref/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-navy text-brand-navy font-semibold underline hover:opacity-70 transition-opacity"
                >
                  Web Content Accessibility Guidelines (WCAG) 2.1
                </a>{' '}
                at Level AA. These guidelines explain how to make web content more accessible for
                people with disabilities and more user-friendly for everyone.
              </p>
              <p className="text-brand-navy/80 leading-relaxed">
                This website is <strong className="text-brand-navy">partially conformant</strong>{' '}
                with WCAG 2.1 Level AA. We continue to make improvements to meet full conformance.
              </p>
            </div>

            {/* Accessibility Features */}
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-headline text-brand-navy mb-6 uppercase tracking-tight">
                Accessibility Features
              </h2>
              <div className="space-y-8">
                {accessibilityFeatures.map((section) => (
                  <div key={section.category}>
                    <h3 className="text-lg font-bold text-brand-navy mb-3">{section.category}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle
                            className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="text-brand-navy/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Known Limitations */}
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-headline text-brand-navy mb-6 uppercase tracking-tight">
                Known Limitations
              </h2>
              <p className="text-brand-navy/80 leading-relaxed mb-4">
                Despite our best efforts, there may be some limitations. Below is a description of
                known limitations and potential solutions:
              </p>
              <div className="space-y-4">
                {knownLimitations.map((limitation, index) => (
                  <div
                    key={index}
                    className="bg-brand-navy/5 border border-brand-navy/10 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className="w-5 h-5 text-brand-orange shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-brand-navy font-medium">{limitation.issue}</p>
                        <p className="text-brand-navy/60 text-sm mt-1">{limitation.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-headline text-brand-navy mb-4 uppercase tracking-tight">
                Technical Specifications
              </h2>
              <p className="text-brand-navy/80 leading-relaxed mb-4">
                Accessibility of this website relies on the following technologies:
              </p>
              <ul className="list-disc list-outside ml-6 space-y-2 text-brand-navy/80">
                <li>HTML5</li>
                <li>CSS3</li>
                <li>JavaScript (with progressive enhancement)</li>
                <li>WAI-ARIA 1.1</li>
              </ul>
              <p className="text-brand-navy/80 leading-relaxed mt-4">
                These technologies are relied upon for conformance with the accessibility standards
                used.
              </p>
            </div>

            {/* Testing */}
            <div className="mb-12">
              <h2 className="text-xl sm:text-2xl font-headline text-brand-navy mb-4 uppercase tracking-tight">
                Assessment & Testing
              </h2>
              <p className="text-brand-navy/80 leading-relaxed mb-4">
                We assess our website accessibility using the following methods:
              </p>
              <ul className="list-disc list-outside ml-6 space-y-2 text-brand-navy/80">
                <li>Self-evaluation using automated testing tools (axe-core, Lighthouse)</li>
                <li>Manual testing with keyboard navigation</li>
                <li>Testing with screen readers (NVDA, VoiceOver)</li>
                <li>Contrast ratio verification</li>
                <li>Real user feedback</li>
              </ul>
            </div>

            {/* Feedback */}
            <div className="bg-brand-navy text-white rounded-xl p-6 mb-12">
              <h2 className="text-xl sm:text-2xl font-headline text-white mb-4 uppercase tracking-tight">
                Feedback & Contact
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We welcome your feedback on the accessibility of this website. If you encounter
                accessibility barriers or have suggestions for improvement, please let us know:
              </p>
              <ul className="space-y-2 text-white/80">
                <li>
                  <strong className="text-white">Email:</strong>{' '}
                  <a
                    href="mailto:support@scopesite.co.uk"
                    className="text-brand-gold hover:text-brand-orange transition-colors"
                  >
                    support@scopesite.co.uk
                  </a>
                </li>
                <li>
                  <strong className="text-white">Phone:</strong>{' '}
                  <a
                    href="tel:+441373311339"
                    className="text-brand-gold hover:text-brand-orange transition-colors"
                  >
                    01373 311 339
                  </a>
                </li>
                <li>
                  <strong className="text-white">Response time:</strong> We aim to respond within 5
                  business days.
                </li>
              </ul>
            </div>

            {/* Footer Note */}
            <div className="pt-8 border-t border-brand-navy/10">
              <p className="text-brand-navy/60 text-sm">
                This statement was created on 5th January 2026 and is reviewed regularly to ensure
                accuracy.
              </p>

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

