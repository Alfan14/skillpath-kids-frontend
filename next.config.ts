import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow picsum.photos images used in the hero section
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default nextConfig;