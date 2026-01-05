import type { Metadata } from 'next';
import { Inter, Paytone_One } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const paytoneOne = Paytone_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-paytone',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://scopesite.co.uk'),
  title: {
    default: 'ScopeSite Digital Studios | AI-Optimized Web Design UK',
    template: '%s | ScopeSite Digital Studios',
  },
  description:
    'Veteran-owned UK web design agency specializing in AI visibility, AEO, and GEO optimization. Get websites that rank in both traditional search and AI assistants.',
  keywords: [
    'web design UK',
    'AI visibility',
    'AEO',
    'GEO optimization',
    'SEO',
    'website design Frome',
    'web development Somerset',
    'V.O.I.C.E',
    'AI search optimization',
  ],
  authors: [{ name: 'Dan Cartwright', url: 'https://scopesite.co.uk' }],
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
    url: 'https://scopesite.co.uk',
    siteName: 'ScopeSite Digital Studios',
    title: 'ScopeSite Digital Studios | AI-Optimized Web Design UK',
    description:
      'Veteran-owned UK web design agency specializing in AI visibility, AEO, and GEO optimization.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ScopeSite Digital Studios',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScopeSite Digital Studios | AI-Optimized Web Design UK',
    description:
      'Veteran-owned UK web design agency specializing in AI visibility, AEO, and GEO optimization.',
    images: ['/images/og-image.jpg'],
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
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${paytoneOne.variable}`}>
      <body className="font-body antialiased">
        <Header />
        <main className="pt-32">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
