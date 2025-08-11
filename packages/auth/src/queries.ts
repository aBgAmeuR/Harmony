"use server";

import { db, eq, profileShareLinks, users } from "@repo/database";

export const getUserByShareableLinkToken = async (token: string) => {
	const data = await db
		.select()
		.from(profileShareLinks)
		.innerJoin(users, eq(profileShareLinks.userId, users.id))
		.where(eq(profileShareLinks.token, token));

	return data.length > 0 ? data[0] : null;
};
