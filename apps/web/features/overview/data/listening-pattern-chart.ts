"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { auth, db, sql, sum, tracks } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

export const getListeningPatternData = async (
	userId: string,
	isDemo: boolean,
) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "listening-pattern-chart");

	const monthRange = await getMonthRange(userId, isDemo);

	const periodCase = sql<string>`
		CASE
			WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 6 AND 12 THEN 'Morning'
			WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 12 AND 14 THEN 'Noon'
			WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 14 AND 18 THEN 'Afternoon'
			WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 18 AND 20 THEN 'Early Evening'
			WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 20 AND 24 THEN 'Late Evening'
			ELSE 'Night'
		END
	`;

	const listeningTime = await db
		.select({
			period: periodCase,
			time: sum(tracks.msPlayed),
		})
		.from(tracks)
		.where(auth(userId, { monthRange }))
		.groupBy(({ period }) => period);

	const sortedListeningTime = listeningTime
		?.map((data) => ({
			subject: data.period,
			time: Number(data.time),
		}))
		.sort((a, b) => {
			const order = [
				"Morning",
				"Noon",
				"Afternoon",
				"Early Evening",
				"Late Evening",
				"Night",
			];
			return order.indexOf(a.subject) - order.indexOf(b.subject);
		});

	return sortedListeningTime;
};
