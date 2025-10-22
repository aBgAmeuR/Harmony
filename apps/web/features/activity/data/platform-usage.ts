"server-only";

import { cacheLife, cacheTag } from "next/cache";

import { auth, db, sql, sum, tracks } from "@repo/database";

import { getMonthRange } from "~/lib/dal";
import { formatMonth } from "~/lib/utils";

export const getPlatformUsageData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "platform-usage");

	const monthRange = await getMonthRange(userId, isDemo);

	const platforms = await db
		.select({
			month: sql<string>`TO_CHAR(timestamp, 'YYYY-MM')`,
			platform: tracks.platform,
			totalmsplayed: sum(tracks.msPlayed),
		})
		.from(tracks)
		.where(auth(userId, { monthRange }))
		.groupBy(({ month }) => [month, tracks.platform])
		.orderBy(({ month }) => month);

	const PLATFORMS: Record<"web" | "mobile" | "desktop", string[]> = {
		web: ["web"],
		mobile: ["android", "ios"],
		desktop: ["windows", "mac", "linux"],
	} as const;

	const data: Record<string, Record<string, number>> = {};
	const platformsMap = new Map<string, number>();

	platforms.forEach((platform) => {
		const date = new Date(platform.month);
		const key = formatMonth(date);
		const platformKey = (
			Object.keys(PLATFORMS) as Array<keyof typeof PLATFORMS>
		).find((key) =>
			PLATFORMS[key].some((p) => platform.platform.toLowerCase().includes(p)),
		);

		if (!platformKey) return;

		if (!data[key]) data[key] = {};
		data[key][platformKey] =
			(data[key][platformKey] || 0) + Number(platform.totalmsplayed);

		const currentMsPlayed = platformsMap.get(platformKey) ?? 0;
		platformsMap.set(
			platformKey,
			currentMsPlayed + Number(platform.totalmsplayed),
		);
	});

	const mostUsedPlatform = Array.from(platformsMap.entries()).reduce(
		(acc, [key, value]) => {
			if (value > acc.value) {
				acc.key = key;
				acc.value = value;
			}
			return acc;
		},
		{ key: "", value: 0 },
	);

	return {
		data: Object.entries(data).map(([month, platforms]) => ({
			month,
			mobile: platforms.mobile ?? 0,
			desktop: platforms.desktop ?? 0,
			web: platforms.web ?? 0,
		})),
		mostUsedPlatform: {
			platform: mostUsedPlatform.key,
			value: mostUsedPlatform.value,
		},
	};
};
