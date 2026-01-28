import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Consistent URL handling - no trailing slashes
  trailingSlash: false,

  // Enable static generation where possible
  output: 'standalone',

  // Experimental optimizations
  experimental: {
    // Inline critical CSS to reduce render-blocking
    optimizeCss: true,
  },

  // Headers for AI crawlers and SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value:
              'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
    ];
  },

  // 301 redirects for old/changed URLs (legacy Wix site)
  async redirects() {
    return [
      // www to non-www redirect (faster than Vercel-level redirect)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.scopesite.co.uk' }],
        destination: 'https://scopesite.co.uk/:path*',
        permanent: true,
      },
      {
        source: '/affordable-web-design-uk',
        destination: '/web-design',
        permanent: true,
      },
      {
        source: '/faq',
        destination: '/',
        permanent: true,
      },
      {
        source: '/strategy-meeting-uk-web-design',
        destination: '/book',
        permanent: true,
      },
      {
        source: '/cookie-policy',
        destination: '/privacy-policy#8-cookies-and-tracking',
        permanent: true,
      },
      {
        source: '/how-to-get-listed-brave-search',
        destination: '/',
        permanent: true,
      },
      {
        source: '/reviews',
        destination: '/about',
        permanent: true,
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

export default nextConfig;
