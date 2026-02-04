import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.eu-north-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'se-mudak.s3.eu-north-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
