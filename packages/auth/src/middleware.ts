import NextAuth from "next-auth";

import authConfig from "./auth.config";

export const middleware = NextAuth(authConfig).auth(async (req) => {
	const isMaintenance = process.env.APP_MAINTENANCE === "true";
	const url = req.nextUrl;

	if (isMaintenance) {
		const newUrl = new URL("/", url.origin);
		return Response.redirect(newUrl);
	}
	if (!req.auth && !isMaintenance) {
		const newUrl = new URL("/api/login", url.origin);
		newUrl.searchParams.set("callbackUrl", url.pathname);

		return Response.redirect(newUrl);
	}
});
