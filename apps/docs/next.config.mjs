import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	output: "export",
	trailingSlash: true,
	skipTrailingSlashRedirect: true,
	assetPrefix: "/docs",
	images: { unoptimized: true },
};

export default withMDX(config);
