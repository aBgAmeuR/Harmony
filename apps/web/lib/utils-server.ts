"server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { getUserOrNull } from "@repo/auth";
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

	if (!monthsDates) return null;

	return {
		dateStart: monthsDates.timeRangeDateStart,
		dateEnd: monthsDates.timeRangeDateEnd,
	};
});

export const getUserInfos = cache(async () => {
	const user = await getUserOrNull();

	if (!user) {
		return redirect("/api/signin");
	}

	return {
		userId: user.userId,
		isDemo: user.isDemo,
		hasPackage: user.hasPackage,
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
