import { prisma } from "@repo/database";
import { cache } from "react";

export const getMonthRange = cache(async (userId: string, isDemo: boolean) => {
	if (isDemo) {
		const date = new Date("2023-12-31T23:00:00.000Z");
		return {
			dateStart: date,
			dateEnd: new Date(),
		};
	}

	const monthsDates = await prisma.user.findFirst({
		where: { id: userId },
		select: { timeRangeDateEnd: true, timeRangeDateStart: true },
	});

	if (!monthsDates) throw new Error("User not found");

	return {
		dateStart: monthsDates.timeRangeDateStart,
		dateEnd: monthsDates.timeRangeDateEnd,
	};
});
