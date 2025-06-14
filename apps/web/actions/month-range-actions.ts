"use server";

import { auth } from "@repo/auth";
import { asc, db, desc, eq, tracks, users } from "@repo/database";
import { revalidatePath } from "next/cache";

import { isDemo } from "~/lib/utils-server";

export const getMonthRangeAction = async () => {
	const session = await auth();

	if (!session || !session.user || !session.user.id) return null;

	if (isDemo(session)) {
		const date = new Date("2023-12-31T23:00:00.000Z");
		return {
			dateStart: date,
			dateEnd: new Date(),
		};
	}

	const monthsDates = await db.query.users.findFirst({
		where: eq(users.id, session.user.id),
		columns: {
			timeRangeDateEnd: true,
			timeRangeDateStart: true,
		},
	});

	if (!monthsDates) return null;

	return {
		dateStart: monthsDates.timeRangeDateStart,
		dateEnd: monthsDates.timeRangeDateEnd,
	};
};

export const setMonthStatsAction = async (dateStart: Date, dateEnd: Date) => {
	const session = await auth();

	if (!session || !session.user || !session.user.id || isDemo(session))
		return null;

	await db
		.update(users)
		.set({
			timeRangeDateStart: dateStart,
			timeRangeDateEnd: dateEnd,
		})
		.where(eq(users.id, session.user.id));

	revalidatePath("/");
};

export const setDefaulMonthStatsAction = async () => {
	const session = await auth();

	if (!session || !session.user || !session.user.id || isDemo(session))
		return null;

	const minDate = await db.query.tracks.findFirst({
		where: eq(tracks.userId, session.user.id),
		columns: { timestamp: true },
		orderBy: asc(tracks.timestamp),
	});

	const maxDate = await db.query.tracks.findFirst({
		where: eq(tracks.userId, session.user.id),
		columns: { timestamp: true },
		orderBy: desc(tracks.timestamp),
	});

	if (!minDate || !maxDate) return null;

	return await setMonthStatsAction(minDate.timestamp, maxDate.timestamp);
};
