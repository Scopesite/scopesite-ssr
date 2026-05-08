import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/territory/admin-session';
import { AdminLogoutButton } from '@/components/territory/admin/AdminLogoutButton';

export const dynamic = 'force-dynamic';

/**
 * Route group `(protected)` means every page nested under this layout is
 * gated by the admin session check. The bare `/territory/admin/login`
 * page lives OUTSIDE this group so it can render for unauthenticated
 * visitors.
 */
export default async function TerritoryAdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect('/territory/admin/login');
  }

  return (
    <div className="min-h-[60vh]">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4">
          <Link
            href="/territory/admin"
            className="font-headline text-lg text-brand-navy link-navy"
          >
            Territory Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/territory/admin"
              className="text-slate-600 hover:text-brand-navy link-navy"
            >
              Dashboard
            </Link>
            <Link
              href="/territory/admin/applications"
              className="text-slate-600 hover:text-brand-navy link-navy"
            >
              Applications
            </Link>
            <Link
              href="/territory/admin/waitlist"
              className="text-slate-600 hover:text-brand-navy link-navy"
            >
              Waitlist
            </Link>
            <Link
              href="/territory/admin/postcodes"
              className="text-slate-600 hover:text-brand-navy link-navy"
            >
              Postcodes
            </Link>
            <Link
              href="/territory/admin/sectors"
              className="text-slate-600 hover:text-brand-navy link-navy"
            >
              Sectors
            </Link>
            <Link
              href="/territory/admin/activity"
              className="text-slate-600 hover:text-brand-navy link-navy"
            >
              Activity
            </Link>
          </nav>
          <div className="ml-auto">
            <AdminLogoutButton />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}
