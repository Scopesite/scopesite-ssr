import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Web Apps UK | Quote Builders, Portals & Business Tools',
  description: 'Custom web applications for UK businesses. Quote calculators, client portals, compliance tools, booking systems. Built to solve YOUR problems.',
  openGraph: {
    title: 'Custom Web Apps UK | Quote Builders, Portals & Business Tools | ScopeSite',
    description: 'Custom web applications for UK businesses. Quote calculators, client portals, compliance tools, booking systems. Built to solve YOUR problems.',
  },
};

export default function WebAppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


