import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'linked-posts.routemisr.com',// Domain
        pathname: '/uploads/**',
      }
    ]
  },
  env:{
    baseUrl:"https://linked-posts.routemisr.com"
  }
};

export default nextConfig;
