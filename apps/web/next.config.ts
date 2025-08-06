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
	transpilePackages: ["@repo/ui", "api"],
	env: { DATABASE_URL: process.env.DATABASE_URL },
	experimental: {
		staleTimes: {
			dynamic: 30,
			static: 180,
		},
		// @ts-expect-error - Unrecognized key in canary (nextjs#82122)
		nodeMiddleware: true,
		clientSegmentCache: true,
		reactCompiler: true,
		cacheComponents: true,
		useCache: true,
		browserDebugInfoInTerminal: true,
	},
	pageExtensions: ["mdx", "ts", "tsx"],
	async rewrites() {
		return {
			afterFiles: [
				{
					source: "/docs/:path*",
					destination: process.env.DOCS_URL + "/docs/:path*",
				},
			],
		};
	},
};

const config: NextConfig = withMDX(nextConfig);
export default config;
