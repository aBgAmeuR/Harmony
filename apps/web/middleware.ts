export { middleware } from "@repo/auth";

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|demo|images|web-app-manifest-512x512.png|web-app-manifest-192x192.png).*)",
	],
	unstable_allowDynamic: ["**/node_modules/@prisma/client/runtime/library.js"],
};
