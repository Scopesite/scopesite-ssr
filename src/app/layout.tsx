import type { Metadata, Viewport } from 'next';
import { Paytone_One, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FooterVisibility } from '@/components/layout/FooterVisibility';
import { JsonLd } from '@/components/JsonLd';
import { SkipLink, RouteAnnouncer } from '@/components/a11y';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/schema';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Fonts
const paytoneOne = Paytone_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-paytone',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Base URL for canonical URLs and OG images
const BASE_URL = 'https://scopesite.co.uk';

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A1B36',
};

// Site-wide metadata defaults
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Website Designer Somerset | ScopeSite',
    template: '%s | ScopeSite',
  },
  description:
    'Veteran-owned website designers in Somerset. We make your business visible to ChatGPT & AI search. V.O.I.C.E™ methodology. Free AI visibility audit.',
  keywords: [
    'website designer Somerset',
    'AI visibility',
    'web design Somerset',
    'ChatGPT SEO',
    'AI search optimization',
    'V.O.I.C.E methodology',
    'Somerset web design',
    'veteran owned business UK',
    'GEO optimization',
  ],
  authors: [{ name: 'Dan Cartwright', url: `${BASE_URL}/about` }],
  creator: 'ScopeSite Digital Studios',
  publisher: 'ScopeSite Digital Studios',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: BASE_URL,
    siteName: 'ScopeSite Digital Studios',
    title: 'Website Designer Somerset | AI Visibility Experts | ScopeSite Digital Studios',
    description:
      'Veteran-owned website designers in Somerset. We make your business visible to ChatGPT & AI search. V.O.I.C.E™ methodology. Free AI visibility audit.',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite Digital Studios - Website Designer Somerset, AI Visibility Experts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Designer Somerset | AI Visibility Experts | ScopeSite Digital Studios',
    description:
      'Veteran-owned website designers in Somerset. We make your business visible to ChatGPT & AI search. V.O.I.C.E™ methodology.',
    images: [`${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: BASE_URL,
  },
  category: 'technology',
  classification: 'Web Design Agency',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en-GB">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <JsonLd schema={[organizationSchema, websiteSchema]} />
      </head>
      <body
        className={`${paytoneOne.variable} ${inter.variable} font-body`}
      >
        <SkipLink />
        <Header />
        <main id="main-content" className="pt-32" tabIndex={-1}>
          {children}
        </main>
        <FooterVisibility><Footer /></FooterVisibility>
        <RouteAnnouncer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
