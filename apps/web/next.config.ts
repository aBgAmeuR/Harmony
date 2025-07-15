import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
	// Add markdown plugins here, as desired
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
		nodeMiddleware: true,
		clientSegmentCache: true,
		reactCompiler: true,
		dynamicIO: true,
		useCache: true,
	},
	pageExtensions: ["mdx", "ts", "tsx"],
};

const config: NextConfig = withMDX(nextConfig);
export default config;
