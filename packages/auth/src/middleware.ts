import NextAuth from "next-auth";

import authConfig from "./auth.config";

export const middleware: any = NextAuth(authConfig).auth(async (req) => {
	const isMaintenance = process.env.APP_MAINTENANCE === "true";
	const url = req.nextUrl;

	if (isMaintenance) {
		const newUrl = new URL("/", url.origin);
		return Response.redirect(newUrl);
	}
	if (!req.auth && !isMaintenance) {
		const newUrl = new URL("/signin", url.origin);
		newUrl.searchParams.set("callbackUrl", url.pathname);

		return Response.redirect(newUrl);
	}
});
