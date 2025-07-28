import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Spotify from "next-auth/providers/spotify";

import { getUserByShareableLinkToken } from "./queries";

export default {
	providers: [
		Spotify({
			authorization:
				"https://accounts.spotify.com/authorize?scope=user-read-recently-played%20user-top-read%20user-read-email",
		}),
		Credentials({
			name: "Demo",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (
					credentials.username === "demo" &&
					credentials.password === "demo"
				) {
					return {
						name: "Demo",
						email: "demo@demo.com",
						id: process.env.DEMO_ID,
						hasPackage: true,
					};
				}
				return null;
			},
		}),
		Credentials({
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
	callbacks: {
		authorized: async ({ auth }) => {
			// Logged in users are authenticated, otherwise redirect to login page
			return !!auth;
		},
		jwt: async ({ token, user, trigger, session }) => {
			if (user) {
				token.id = user.id;
				token.hasPackage = user.hasPackage;
			}
			if (trigger === "update" && session) {
				token.hasPackage = true;
			}
			return token;
		},
		session: async ({ session, token }) => {
			session.user.id = token.id as string;
			session.user.hasPackage = token.hasPackage as boolean;
			return session;
		},
	},
	pages: {
		error: "/error",
		signIn: "/signin",
		signOut: "/signout",
	},
	session: {
		strategy: "jwt",
	},
} as NextAuthConfig;
