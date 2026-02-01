'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  FolderOpen, 
  Settings,
  Users,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortalSidebarProps {
  isAdmin: boolean;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const clientNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
  { name: 'My Requests', href: '/portal/requests', icon: FileText },
  { name: 'New Request', href: '/portal/requests/new', icon: Plus },
  { name: 'Files', href: '/portal/files', icon: FolderOpen },
];

const adminNavItems: NavItem[] = [
  { name: 'Admin Dashboard', href: '/portal/admin/dashboard', icon: BarChart3 },
  { name: 'All Clients', href: '/portal/admin/clients', icon: Users },
  { name: 'All Requests', href: '/portal/admin/requests', icon: FileText },
];

export function PortalSidebar({ isAdmin }: PortalSidebarProps) {
  const pathname = usePathname();

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || 
      (item.href !== '/portal/dashboard' && pathname.startsWith(item.href));
    
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-4 py-3 text-sm font-bold text-white transition-all',
          isActive
            ? 'border-2 border-brand-gold rounded-lg shadow-[0_0_10px_rgba(236,182,21,0.5)]'
            : 'border-2 border-transparent hover:border-white/30 rounded-lg'
        )}
      >
        <item.icon size={20} />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs rounded-full bg-brand-orange text-white">
            {item.badge}
          </span>
        )}
        {isActive && <ChevronRight size={16} className="text-brand-gold" />}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-brand-navy border-r border-brand-graphite p-4 overflow-y-auto">
        {/* Client navigation */}
        <nav className="space-y-1">
          {clientNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className="my-6 border-t border-brand-graphite" />
            <p className="px-4 mb-2 text-xs font-semibold text-brand-gold uppercase tracking-wider">
              Admin
            </p>
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          </>
        )}

        {/* Settings at bottom */}
        <div className="mt-auto pt-4 border-t border-brand-graphite">
          <NavLink 
            item={{ name: 'Settings', href: '/portal/settings', icon: Settings }} 
          />
        </div>
      </aside>

      {/* Mobile sidebar - shown via CSS when menu is open */}
      <aside className="lg:hidden fixed left-0 top-16 bottom-0 w-64 bg-brand-navy border-r border-brand-graphite p-4 overflow-y-auto transform -translate-x-full transition-transform z-50 peer-checked:translate-x-0">
        {/* Same content as desktop */}
        <nav className="space-y-1">
          {clientNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {isAdmin && (
          <>
            <div className="my-6 border-t border-brand-graphite" />
            <p className="px-4 mb-2 text-xs font-semibold text-brand-gold uppercase tracking-wider">
              Admin
            </p>
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          </>
        )}

        <div className="mt-auto pt-4 border-t border-brand-graphite">
          <NavLink 
            item={{ name: 'Settings', href: '/portal/settings', icon: Settings }} 
          />
        </div>
      </aside>
    </>
  );
}
