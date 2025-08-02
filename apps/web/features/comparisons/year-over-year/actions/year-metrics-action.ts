"use server";

import { getUser } from "@repo/auth";

import { getYearMetrics } from "../data/year-metrics";

export async function getYearMetricsAction(year: number) {
	const { userId } = await getUser();

	return getYearMetrics(userId, year);
}
