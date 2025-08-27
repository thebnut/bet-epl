/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server external packages
  serverExternalPackages: [],
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.bookmakers.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Optimize for production
  compress: true,
  poweredByHeader: false,

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

export default nextConfig;