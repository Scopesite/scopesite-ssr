import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Design UK | Websites That Actually Work',
  description: 'UK web design that\'s fast, AI-ready, and built to convert. Mobile-first, SEO included, flexible monthly payments. Get your instant quote.',
  openGraph: {
    title: 'Web Design UK | Websites That Actually Work | ScopeSite',
    description: 'UK web design that\'s fast, AI-ready, and built to convert. Mobile-first, SEO included, flexible monthly payments. Get your instant quote.',
  },
};

export default function WebDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


