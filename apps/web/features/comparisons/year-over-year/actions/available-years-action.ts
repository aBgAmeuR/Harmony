"use server";

import { getUser } from "@repo/auth";

import { getAvailableYears } from "../data/available-years";

export async function getAvailableYearsAction() {
	const { userId } = await getUser();
	return await getAvailableYears(userId);
}
