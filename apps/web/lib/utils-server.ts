"server-only";

import { cache } from "react";

import type { Session } from "@repo/auth";
import { prisma } from "@repo/database";

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

export async function tryCatch<T>(
	promise: Promise<T>,
): Promise<{ data: T; error: null } | { data: null; error: Error }> {
	try {
		const data = await promise;
		return { data, error: null };
	} catch (error) {
		return { data: null, error: error as Error };
	}
}
