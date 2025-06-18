import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{ hostname: "avatars.githubusercontent.com" },
			{ hostname: "i.scdn.co" },
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	transpilePackages: ["@repo/ui"],
	env: { DATABASE_URL: process.env.DATABASE_URL },
	experimental: {
		staleTimes: {
			dynamic: 30,
			static: 180,
		},
		ppr: "incremental",
		reactCompiler: true,
		dynamicIO: true,
		useCache: true,
	},
};

const config: NextConfig = nextConfig;
export default config;
