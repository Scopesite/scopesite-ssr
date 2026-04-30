import type { Metadata, Viewport } from 'next';
import { Paytone_One, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FooterVisibility } from '@/components/layout/FooterVisibility';
import { JsonLd } from '@/components/JsonLd';
import {
  DeferredAhrefsAnalytics,
  DeferredSpeedInsights,
  DeferredVercelAnalytics,
} from '@/components/DeferredViewportAnalytics';
import { SkipLink, RouteAnnouncer } from '@/components/a11y';
import { getAlternates } from '@/lib/hreflang-map';
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateVOICEDefinedTermSetSchema,
  generateBusinessAudienceSchema,
  generateScheduleActionSchema,
} from '@/lib/schema';

// Fonts
const paytoneOne = Paytone_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-paytone',
  display: 'swap',
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: true,
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
  title: 'AI-Visible Web Design Somerset | ScopeSite Digital Studios',
  description:
    'Veteran-owned web design studio in Somerset. We build server-side rendered websites that show up in Google, ChatGPT, Claude and Perplexity.',
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
    title: 'AI-Visible Web Design Somerset | ScopeSite Digital Studios',
    description:
      'Veteran-owned web design studio in Somerset. We build server-side rendered websites that show up in Google, ChatGPT, Claude and Perplexity.',
    images: [
      {
        url: `${BASE_URL}/images/og/og-home.png`,
        width: 1200,
        height: 630,
        alt: 'ScopeSite Digital Studios - AI-Visible Web Design Somerset',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Visible Web Design Somerset | ScopeSite Digital Studios',
    description:
      'Veteran-owned web design studio in Somerset. We build server-side rendered websites that show up in Google, ChatGPT, Claude and Perplexity.',
    images: [`${BASE_URL}/images/og/og-home.png`],
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
  alternates: getAlternates('/', BASE_URL),
  category: 'technology',
  classification: 'Web Design Agency',
  other: {
    'p:domain_verify': 'c0bc8507e736642b13b269c380fa6aac',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const voiceTermSetSchema = generateVOICEDefinedTermSetSchema();
  const audienceSchema = generateBusinessAudienceSchema();
  const scheduleActionSchema = generateScheduleActionSchema();

  return (
    <html lang="en-GB">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <JsonLd schema={[organizationSchema, websiteSchema, voiceTermSetSchema, audienceSchema, scheduleActionSchema]} />
        {process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY ? (
          <link rel="preconnect" href="https://analytics.ahrefs.com" crossOrigin="anonymous" />
        ) : null}
        <DeferredAhrefsAnalytics />
      </head>
      <body
        suppressHydrationWarning
        className={`${paytoneOne.variable} ${inter.variable} font-body`}
      >
        <SkipLink />
        <Header />
        <main id="main-content" className="pt-32" tabIndex={-1}>
          {children}
        </main>
        <FooterVisibility><Footer /></FooterVisibility>
        <RouteAnnouncer />
        <DeferredVercelAnalytics />
        <DeferredSpeedInsights />
      </body>
    </html>
  );
}
