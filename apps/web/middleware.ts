export { middleware } from "@repo/auth/middleware";

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|favicon-96x96.png|favicon.svg|site.webmanifest|demo|images|web-app-manifest-512x512.png|web-app-manifest-192x192.png|$).*)",
	],
	runtime: "nodejs",
};
