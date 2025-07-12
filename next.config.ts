import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['www.drclevens.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.drclevens.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      // Support for legacy 2023 images and new 2024 real photos
      {
        protocol: 'https',
        hostname: 'www.drclevens.com',
        port: '',
        pathname: '/wp-content/uploads/2023/**',
      },
      {
        protocol: 'https',
        hostname: 'www.drclevens.com',
        port: '',
        pathname: '/wp-content/uploads/2024/**',
      },
    ],
    // Enable image optimization for better performance
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24, // Cache images for 24 hours
  },
};

export default nextConfig;
