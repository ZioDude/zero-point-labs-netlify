import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Disable image optimization for Cloudflare Pages
  images: {
    unoptimized: true,
  },
  // Handle trailing slashes consistently
  trailingSlash: false,
};

export default nextConfig;
