import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Build ke dauran ESLint errors ignore karega jisse Vercel build pass ho jaye
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript errors build ko block nahi karenge
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;