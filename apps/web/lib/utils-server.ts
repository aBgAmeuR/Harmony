"server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { auth, type Session } from "@repo/auth";
import { db, eq, users } from "@repo/database";

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
	const session = await auth();
	const userId = session?.user?.id;
	const isDemo = session?.user?.name === "Demo";
	const hasPackage = session?.user?.hasPackage;

	if (!userId) {
		redirect("/api/login");
	}

	return {
		userId,
		isDemo,
		hasPackage,
	};
});
