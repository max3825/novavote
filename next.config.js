/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-grade configuration
  reactStrictMode: true,
  
  // Output standalone for smaller Docker images
  output: 'standalone',
  
  // SWC minification (faster than Terser, built-in to Next.js)
  swcMinify: true,
  
  // Font optimization
  optimizeFonts: true,
  
  // Image optimization
  images: {
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
  },
  
  // Compression
  compress: true,
  
  // Production logging only
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  
  // Security headers
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
