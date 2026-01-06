import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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

  // Image optimization
  images: {
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
