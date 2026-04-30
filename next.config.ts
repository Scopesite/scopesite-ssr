import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

// Browserslist targets live only in package.json (no .browserslistrc). To trace which
// modules feed the first-party polyfill/runtime chunk, run `npm run analyze` and inspect
// the client bundle treemap in the generated report.
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

const nextConfig: NextConfig = {
  trailingSlash: false,
  output: 'standalone',

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'motion/react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-slider',
      '@radix-ui/react-progress',
      '@radix-ui/react-separator',
    ],
  },

  // www-to-non-www redirect stays here because it needs a host matcher.
  // All path-based 301s live in vercel.json as the single source of truth.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.scopesite.co.uk' }],
        destination: 'https://scopesite.co.uk/:path*',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    // Prefer AVIF for better compression, fallback to WebP
    formats: ['image/avif', 'image/webp'],
    // Optimized device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Cache images for 1 year (Vercel CDN handles invalidation)
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scopesite.co.uk',
      },
      // Ghost CMS images
      {
        protocol: 'https',
        hostname: 'static.ghost.org',
      },
      {
        protocol: 'https',
        hostname: '*.ghost.io',
      },
      // Unsplash for mock/placeholder images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
