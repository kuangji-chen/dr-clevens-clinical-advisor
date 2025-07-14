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
  
  // Cache optimization for knowledge base files
  async headers() {
    return [
      {
        source: '/knowledge-chunks.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/knowledge-metadata.json',
        headers: [
          {
            key: 'Cache-Control', 
            value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/clevens-clinic-knowledge.pdf',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
