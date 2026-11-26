import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["10.0.0.100"],
  devIndicators: false,
};

export default nextConfig;

