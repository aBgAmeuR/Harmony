"server-only";

import { db, desc, eq, profileShareLinks } from "@repo/database";

export const createShareableLink = async (data: {
	userId: string;
	usageLimit: number;
	expirationDate: Date | null;
}) => {
	const token = crypto.randomUUID();

	const shareableLink = await db
		.insert(profileShareLinks)
		.values({
			userId: data.userId,
			token,
			usageLimit: data.usageLimit,
			expiresAt: data.expirationDate,
		})
		.returning();

	return shareableLink;
};

export const getShareableLinks = async (userId: string) => {
	const shareableLinks = await db
		.select()
		.from(profileShareLinks)
		.where(eq(profileShareLinks.userId, userId))
		.orderBy(desc(profileShareLinks.createdAt));

	return shareableLinks;
};