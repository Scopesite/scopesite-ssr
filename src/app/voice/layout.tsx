import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'V.O.I.C.E™ - AI Visibility Experts UK',
  description: 'Get your free AI visibility score. Our V.O.I.C.E™ system makes ChatGPT, Siri and AI assistants find and recommend your business.',
  openGraph: {
    title: 'V.O.I.C.E™ - AI Visibility Experts UK | ScopeSite',
    description: 'Get your free AI visibility score. Our V.O.I.C.E™ system makes ChatGPT, Siri and AI assistants find and recommend your business.',
  },
};

export default function VoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


