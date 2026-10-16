/** Keep GA measurements on the public production site, including its www alias. */
export function isProductionAnalyticsHostname(hostname: string): boolean {
  return ['scopesite.co.uk', 'www.scopesite.co.uk'].includes(hostname.toLowerCase());
}
