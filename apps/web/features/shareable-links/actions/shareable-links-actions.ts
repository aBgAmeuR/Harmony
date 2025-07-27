"use server";

import { getUser } from "@repo/auth";

import {
	createShareableLink,
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

	return {
		success: true,
		message: "Shareable link created successfully",
		shareableLink: shareableLink[0],
	};
};
