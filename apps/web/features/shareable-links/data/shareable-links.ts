"server-only";

import { db, desc, eq, profileShareLinks, sql } from "@repo/database";

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

export const deleteShareableLink = async (id: string) => {
	await db.delete(profileShareLinks).where(eq(profileShareLinks.id, id));
};

export const getShareableLink = async (id: string) => {
	const shareableLink = await db
		.select()
		.from(profileShareLinks)
		.where(eq(profileShareLinks.id, id));

	return shareableLink.length > 0 ? shareableLink[0] : null;
};

export const getShareableLinkByToken = async (token: string) => {
	const shareableLink = await db
		.select()
		.from(profileShareLinks)
		.where(eq(profileShareLinks.token, token));

	return shareableLink.length > 0 ? shareableLink[0] : null;
};

export const incrementShareableLinkUsage = async (token: string) => {
	await db
		.update(profileShareLinks)
		.set({ usageCount: sql`${profileShareLinks.usageCount} + 1` })
		.where(eq(profileShareLinks.token, token));
};
