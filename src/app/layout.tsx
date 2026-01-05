import type { Metadata, Viewport } from 'next';
import { Paytone_One, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/JsonLd';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/schema';

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
    default: 'AI-First Web Design Agency | ScopeSite Digital Studios',
    template: '%s | ScopeSite Digital Studios',
  },
  description:
    'Veteran-owned UK web design agency specializing in AI visibility. Get your business recommended by ChatGPT using our V.O.I.C.E™ methodology. Free AI visibility audit.',
  keywords: [
    'AI web design',
    'ChatGPT SEO',
    'AI visibility',
    'web design UK',
    'Somerset web design',
    'voice search optimization',
    'V.O.I.C.E methodology',
    'AI search optimization',
    'veteran owned business',
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
    title: 'AI-First Web Design Agency | ScopeSite Digital Studios',
    description:
      'Veteran-owned UK web design agency specializing in AI visibility. Get your business recommended by ChatGPT using our V.O.I.C.E™ methodology.',
    images: [
      {
        url: `${BASE_URL}/images/scopesite-websites-found-hero-ai.webp`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite Digital Studios - AI-First Web Design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-First Web Design Agency | ScopeSite Digital Studios',
    description:
      'Veteran-owned UK web design agency specializing in AI visibility. Get your business recommended by ChatGPT.',
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
      { url: '/favicon.ico', sizes: 'any' },
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
  // Generate base schemas for every page
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en-GB">
      <head>
        {/* Base structured data for entire site */}
        <JsonLd schema={[organizationSchema, websiteSchema]} />
      </head>
      <body
        className={`${paytoneOne.variable} ${inter.variable} font-body antialiased`}
      >
        <Header />
        <main className="pt-32">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
