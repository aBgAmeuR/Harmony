import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { auth, db, desc, sql, tracks } from "@repo/database";

export async function getAvailableYears(userId: string) {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "available-years");

	const results = await db
		.selectDistinct({
			year: sql<number>`EXTRACT(YEAR FROM ${tracks.timestamp})`,
		})
		.from(tracks)
		.where(auth(userId))
		.orderBy(({ year }) => desc(year));

	return results.map((row) => row.year);
}
