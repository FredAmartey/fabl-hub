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
    ],
  },
};

export default nextConfig;