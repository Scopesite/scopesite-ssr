'use client';

import { usePathname } from 'next/navigation';

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith('/portal');

  return (
    <main 
      id="main-content" 
      className={isPortal ? '' : 'pt-32'} 
      tabIndex={-1}
    >
      {children}
    </main>
  );
}
