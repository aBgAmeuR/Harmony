import { handlers, signIn, signOut, auth } from "./auth";
import NextAuth, { type Session, type User } from "next-auth";

import authConfig from "./auth.config";
import { SessionProvider, useSession } from "next-auth/react";

const middleware: any = NextAuth(authConfig).auth(async (req) => {
  if (
    process.env.APP_MAINTENANCE === "true" &&
    req.nextUrl.pathname !== "/" &&
    req.nextUrl.pathname !== "/site.webmanifest"
  ) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (
    !req.auth &&
    req.nextUrl.pathname !== "/" &&
    req.nextUrl.pathname !== "/site.webmanifest" &&
    !req.nextUrl.pathname.startsWith("/api/auth")
  ) {
    const newUrl = new URL("/api/login", req.nextUrl.origin);
    newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);

    return Response.redirect(newUrl);
  }
});

export { handlers, signIn, signOut, auth, middleware, Session, User, SessionProvider, useSession };
