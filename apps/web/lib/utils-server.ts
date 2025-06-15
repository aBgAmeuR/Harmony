"server-only";

import type { Session } from "@repo/auth";
import { prisma } from "@repo/database";
import { cookies } from "next/headers";
import { cache } from "react";

export const isDemo = (session: Session | null) =>
	session?.user?.name === "Demo";

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

	if (!monthsDates) return null;

	return {
		dateStart: monthsDates.timeRangeDateStart,
		dateEnd: monthsDates.timeRangeDateEnd,
	};
});
