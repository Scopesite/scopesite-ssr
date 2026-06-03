import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/territory/admin-session';
import { AdminLoginForm } from '@/components/territory/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Territory Admin - Sign in',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function TerritoryAdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith('/territory/admin')
    ? params.next
    : '/territory/admin';

  if (await isAdminAuthenticated()) {
    redirect(next);
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-brand-gold-accessible font-semibold">
            Territory Command
          </p>
          <h1 className="mt-1 font-headline text-2xl sm:text-3xl text-brand-navy">
            Admin sign in
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Single-operator console. Enter the admin passphrase.
          </p>
          <div className="mt-6">
            <AdminLoginForm redirectTo={next} />
          </div>
        </div>
      </div>
    </section>
  );
}
