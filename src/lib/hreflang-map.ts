export interface HreflangPair {
  enGB: string;
  enUS: string;
}

export const HREFLANG_PAIRS: HreflangPair[] = [
  { enGB: '/', enUS: '/us' },
  { enGB: '/pricing', enUS: '/us/quote' },
  { enGB: '/voice', enUS: '/us/ai-visibility' },
  { enGB: '/generative-engine-optimisation', enUS: '/us/generative-engine-optimization' },
  { enGB: '/web-design', enUS: '/us/services' },
];

function absoluteUrl(baseUrl: string, pathname: string): string {
  return pathname === '/' ? baseUrl : `${baseUrl}${pathname}`;
}

export function getAlternates(pathname: string, baseUrl: string) {
  const pair = HREFLANG_PAIRS.find(
    ({ enGB, enUS }) => enGB === pathname || enUS === pathname
  );

  if (!pair) return undefined;

  const enGB = absoluteUrl(baseUrl, pair.enGB);
  const enUS = absoluteUrl(baseUrl, pair.enUS);

  return {
    canonical: pathname === pair.enGB ? enGB : enUS,
    languages: {
      'en-GB': enGB,
      'en-US': enUS,
      'x-default': enGB,
    },
  };
}
