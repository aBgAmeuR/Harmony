export { proxy } from "@repo/auth/proxy";

export const config = {
	matcher: [
		"/changelog/:path*",
		"/comparisons/:path*",
		"/detail/:path*",
		"/forgotten-gems/:path*",
		"/milestones/:path*",
		"/overview/:path*",
		"/rankings/:path*",
		"/recently-played/:path*",
		"/settings/:path*",
		"/stats/:path*",
		"/top/:path*",
	],
};
