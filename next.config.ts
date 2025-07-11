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
    ],
  },
};

export default nextConfig;
