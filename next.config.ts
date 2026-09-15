import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  serverExternalPackages: ["sql.js"],
  experimental: { optimizePackageImports: ["framer-motion"] },
};

export default nextConfig;
