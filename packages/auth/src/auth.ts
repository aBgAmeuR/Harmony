import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type DefaultSession, type NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { accounts, db, users } from "@repo/database";

import authConfig from "./auth.config";
import { getUserByShareableLinkToken } from "./queries";

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
	...authConfig,
	adapter: {
		...DrizzleAdapter(db, {
			usersTable: users,
			accountsTable: accounts,
		}),
	},
	session: { strategy: "jwt" },
	providers: [
		...authConfig.providers,
		Credentials({
			id: "shareable-link",
			name: "Shareable Link",
			credentials: {
				token: { label: "Token", type: "string" },
			},
			async authorize(credentials) {
				const data = await getUserByShareableLinkToken(
					credentials.token as string,
				);

				if (!data) return null;

				return {
					name: "Shareable Link",
					email: "demo@demo.com",
					id: data.User.id,
					hasPackage: data.User.hasPackage ?? false,
				};
			},
		}),
	],
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
