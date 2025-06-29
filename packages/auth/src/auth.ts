/* eslint-disable no-unused-vars */
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession, type NextAuthResult } from "next-auth";

import { prisma } from "@repo/database";

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
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "jwt",
	},
	...authConfig,
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
