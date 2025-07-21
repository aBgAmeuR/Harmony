import { cache } from "react";
import { redirect } from "next/navigation";

import { auth, signIn as legacySignIn, signOut as legacySignOut } from "./auth";
import type { User } from "./type";

const demoId = process.env.DEMO_ID;

export const getUser = cache(async (): Promise<User> => {
	const user = await getUserOrNull();

	if (!user) {
		redirect("/api/signin");
	}

	return user;
});

export const getUserOrNull = cache(async (): Promise<User | null> => {
	const session = await auth();
	const userId = session?.user?.id;
	const username = session?.user?.name;
	const email = session?.user?.email;
	const hasPackage = session?.user?.hasPackage;

	if (!userId || !username || !email) {
		return null;
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
		redirect: true,
		redirectTo: callbackUrl ?? "/",
	});
};

export const signInDemo = async (callbackUrl?: string) => {
	await legacySignIn("credentials", {
		username: "demo",
		password: "demo",
		redirect: true,
		redirectTo: callbackUrl ?? "/",
	});
};

export const signOut = async (callbackUrl?: string) => {
	await legacySignOut({
		redirect: true,
		redirectTo: callbackUrl ?? "/",
	});
};
