import { cache } from "react";

import { auth, signIn as legacySignIn, signOut as legacySignOut } from "./auth";
import type { User } from "./type";

const demoId = process.env.DEMO_ID;

export const getUser = cache(async (): Promise<User> => {
	const session = await auth();
	const userId = session?.user?.id;
	const username = session?.user?.name;
	const email = session?.user?.email;
	const hasPackage = session?.user?.hasPackage;

	if (!userId || !username || !email) {
		signIn();
		throw new Error("User not found");
	}

	return {
		userId,
		username,
		email,
		image: session?.user?.image ?? undefined,
		isDemo: session?.user?.name === "Demo" && userId === demoId,
		hasPackage: hasPackage ?? false,
	};
});

export const signIn = async (callbackUrl?: string) => {
	await legacySignIn("spotify", {
		redirectTo: callbackUrl ?? "/",
	});
};

export const signInDemo = async (callbackUrl?: string) => {
	await legacySignIn("credentials", {
		username: "demo",
		password: "demo",
		redirectTo: callbackUrl ?? "/",
	});
};

export const signOut = async (callbackUrl?: string) => {
	await legacySignOut({
		redirect: true,
		redirectTo: callbackUrl ?? "/",
	});
};
