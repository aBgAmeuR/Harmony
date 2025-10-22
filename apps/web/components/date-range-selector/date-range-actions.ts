"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { getUser } from "@repo/auth";

import { getDateRangeSliderData, setDateRange } from "./date-range";

export const setDateRangeAction = async (dateStart: Date, dateEnd: Date) => {
	const { userId, isDemo } = await getUser();

	if (!userId || isDemo) return;

	await setDateRange(userId, dateStart, dateEnd);

	revalidateTag(userId, "hours");
	revalidatePath("/(app)/");
};

export const getDateRangeSliderDataAction = async () => {
	const { userId } = await getUser();

	if (!userId) return;

	return await getDateRangeSliderData(userId);
};
