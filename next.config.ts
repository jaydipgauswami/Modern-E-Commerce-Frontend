import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   reactStrictMode: true,
   images: {
    domains: ['example.com'], // ✅ yaha tumhare image host ka domain
  },
};

export default nextConfig;
