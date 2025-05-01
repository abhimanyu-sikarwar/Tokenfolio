import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'assets.coingecko.com',
      'cdn.coingecko.com',
      'coin-images.coingecko.com',
      'assets2.coingecko.com',
      'assets3.coingecko.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.coingecko.com',
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,

};

export default nextConfig;
