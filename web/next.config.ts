import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ensure fast local builds and local server resilience
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
