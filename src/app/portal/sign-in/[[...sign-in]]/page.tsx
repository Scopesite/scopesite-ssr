import { SignIn } from '@clerk/nextjs';

export const metadata = {
  title: 'Sign In - Client Portal',
  description: 'Sign in to your ScopeSite client portal',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="font-headline text-2xl text-white mb-2">
          SCOPESITE
        </h1>
        <p className="text-white/70">Client Portal</p>
      </div>
      
      {/* Clerk Sign In Component */}
      <SignIn 
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-white shadow-xl rounded-xl',
            headerTitle: 'text-brand-navy font-headline',
            headerSubtitle: 'text-brand-navy/70',
            formButtonPrimary: 'bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold',
            formFieldInput: 'border-brand-navy/20 focus:border-brand-gold focus:ring-brand-gold/20',
            footerActionLink: 'text-brand-gold-accessible hover:text-brand-orange-accessible',
            identityPreviewEditButton: 'text-brand-gold-accessible',
          },
          variables: {
            colorPrimary: '#ECB615',
            colorText: '#0A1B36',
            colorTextSecondary: '#1E2D50',
            borderRadius: '0.75rem',
          },
        }}
        routing="path"
        path="/portal/sign-in"
        signUpUrl="/portal/sign-up"
        afterSignInUrl="/portal/dashboard"
      />
      
      {/* Help text */}
      <p className="mt-8 text-white/50 text-sm text-center max-w-sm">
        Don&apos;t have an account? Contact{' '}
        <a 
          href="mailto:dan@scopesite.co.uk" 
          className="text-brand-gold hover:text-brand-gold/80 underline"
        >
          dan@scopesite.co.uk
        </a>{' '}
        to get started.
      </p>
    </div>
  );
}
