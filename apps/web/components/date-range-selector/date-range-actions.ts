"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { getUserInfos } from "~/lib/utils";

import { getDateRangeSliderData, setDateRange } from "./date-range";

export const setDateRangeAction = async (dateStart: Date, dateEnd: Date) => {
	const { userId, isDemo } = await getUserInfos();

	if (!userId || isDemo) return;

	await setDateRange(userId, dateStart, dateEnd);

	revalidateTag(userId);
	revalidatePath("/(app)/");
};

export const getDateRangeSliderDataAction = async () => {
	const { userId } = await getUserInfos();

	if (!userId) return;

	return await getDateRangeSliderData(userId);
};
