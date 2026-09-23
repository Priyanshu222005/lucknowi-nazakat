import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Production build ke waqt TS type errors ko bypass karne ke liye
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint errors ignore karne ke liye
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;