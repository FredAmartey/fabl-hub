import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Studio runs on port 3001
  // Main app runs on port 3000
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'stream.mux.com',
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com',
      },
    ],
  },
};

export default nextConfig;