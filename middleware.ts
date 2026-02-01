import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * Protected routes - require authentication
 */
const isProtectedRoute = createRouteMatcher([
  '/portal/dashboard(.*)',
  '/portal/requests(.*)',
  '/portal/files(.*)',
  '/portal/admin(.*)',
  '/portal/settings(.*)',
  '/api/portal/((?!webhooks).*)', // Portal APIs except webhooks
]);

/**
 * Public routes - no authentication required
 */
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/pricing',
  '/book',
  '/brief',
  '/blog(.*)',
  '/web-design',
  '/web-apps',
  '/voice',
  '/case-studies(.*)',
  '/privacy-policy',
  '/terms-and-conditions',
  '/accessibility-statement',
  '/portal/sign-in(.*)',
  '/portal/sign-up(.*)',
  '/api/health',
  '/api/speed-test',
  '/api/quote(.*)',
  '/api/briefs(.*)',
  '/api/blog',
  '/api/webhooks(.*)', // All webhooks (Trello, Clerk)
]);

export default clerkMiddleware(async (auth, req) => {
  // If it's a protected route and user is not signed in, redirect to sign-in
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
