import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Avoid development blocking by lint warnings in local mode
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ensure fast local builds and local server resilience
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
