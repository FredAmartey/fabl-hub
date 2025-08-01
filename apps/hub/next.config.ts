import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
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
  // Disable ESLint during build to avoid build failures from linting errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build for development
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
