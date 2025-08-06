"use server";

import { getUser } from "@repo/auth";

import { getYearMetrics } from "../data/year-metrics";

export async function getYearMetricsAction(year: number) {
	const { userId } = await getUser();

	const time = performance.now();
	const metrics = await getYearMetrics(userId, year);
	const endTime = performance.now();

	console.log(`getYearMetricsAction took ${endTime - time}ms for ${year}`);

	return metrics;
}
