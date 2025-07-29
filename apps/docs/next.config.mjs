import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	output: "export",
	trailingSlash: true,
	assetPrefix: "/docs",
	distDir: "../web/public/docs",
};

export default withMDX(config);
