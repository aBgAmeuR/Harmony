import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type DefaultSession, type NextAuthResult } from "next-auth";

import { accounts, db, users } from "@repo/database";

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
	adapter: {
		...DrizzleAdapter(db, {
			usersTable: users,
			accountsTable: accounts,
		}),
	},
	session: { strategy: "jwt" },
	...authConfig,
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
