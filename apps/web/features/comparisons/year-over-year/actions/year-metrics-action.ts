"use server";

import { getUser } from "@repo/auth";

import { getYearMetrics } from "../data/year-metrics";

export async function getYearMetricsAction(year: number) {
	console.log("calling", year);

	const { userId } = await getUser();

	const metrics = await getYearMetrics(userId, year);

	console.log("returning", metrics?.label);

	return metrics;
}
