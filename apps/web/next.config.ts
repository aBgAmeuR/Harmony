import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: true,
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "i.scdn.co" },
    ],
  },
  transpilePackages: ["@repo/ui"],
  env: { DATABASE_URL: process.env.DATABASE_URL },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    ppr: 'incremental',
    reactCompiler: true,
    // dynamicIO: true,
    // useCache: true,
  },
};

const config: NextConfig = withBundleAnalyzer(nextConfig);
export default config;
