"use server";

import { revalidatePath } from "next/cache";

import { getUser } from "@repo/auth";

import {
	createShareableLink,
	deleteShareableLink,
	getShareableLink,
	getShareableLinks,
} from "../data/shareable-links";

export const createShareableLinkAction = async (data: {
	usageLimit: number;
	expirationDate: Date | null;
}) => {
	const { userId, isDemo } = await getUser();

	if (!userId || isDemo)
		return {
			success: false,
			message: "You must be logged in to create a shareable link",
		};

	const shareableLinks = await getShareableLinks(userId);
	if (shareableLinks.length >= 10) {
		return {
			success: false,
			message: "You have reached the maximum number of shareable links",
		};
	}

	const shareableLink = await createShareableLink({
		userId,
		usageLimit: data.usageLimit,
		expirationDate: data.expirationDate,
	});

	revalidatePath("/social/shareable-links");

	return {
		success: true,
		message: "Shareable link created successfully",
		shareableLink: shareableLink[0],
	};
};

export const deleteShareableLinkAction = async (id: string) => {
	const { userId, isDemo } = await getUser();

	if (!userId || isDemo)
		return {
			success: false,
			message: "You must be logged in to delete a shareable link",
		};

	const shareableLink = await getShareableLink(id);
	if (!shareableLink) {
		return {
			success: false,
			message: "Shareable link not found",
		};
	}

	if (shareableLink.userId !== userId) {
		return {
			success: false,
			message: "You are not authorized to delete this shareable link",
		};
	}

	await deleteShareableLink(id);

	revalidatePath("/social/shareable-links");

	return {
		success: true,
		message: "Shareable link deleted successfully",
	};
};
