import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logos.composio.dev',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
};

export default nextConfig;
