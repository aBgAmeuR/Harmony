import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type NextAuthResult, type DefaultSession } from "next-auth";

import { db } from "@repo/database";
import authConfig from "./auth.config";

declare module "next-auth" {
	interface Session {
		user: {
			hasPackage: boolean;
		} & DefaultSession["user"];
	}

	interface User {
		hasPackage?: boolean;
	}
}

const result = NextAuth({
	adapter: DrizzleAdapter(db),
	session: {
		strategy: "jwt",
	},
	...authConfig,
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
