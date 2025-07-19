import { cache } from "react";

import { db, eq, users } from "@repo/database";

export const getMonthRange = cache(async (userId: string, isDemo: boolean) => {
	if (isDemo) {
		const date = new Date("2023-12-31T23:00:00.000Z");
		return {
			dateStart: date,
			dateEnd: new Date(),
		};
	}

	const monthsDates = await db.query.users.findFirst({
		where: eq(users.id, userId),
		columns: { timeRangeDateEnd: true, timeRangeDateStart: true },
	});

	if (
		!monthsDates ||
		!monthsDates.timeRangeDateStart ||
		!monthsDates.timeRangeDateEnd
	)
		throw new Error("User not found");

	return {
		dateStart: monthsDates.timeRangeDateStart,
		dateEnd: monthsDates.timeRangeDateEnd,
	};
});
