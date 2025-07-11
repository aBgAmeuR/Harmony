"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { auth, db, desc, sql, sum, tracks } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

const TOP_PLATFORMS_LIMIT = 4 as const;

export const getTopPlatformsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "top-platforms");

	const monthRange = await getMonthRange(userId, isDemo);

	const platformCase = sql<string>`
    CASE
      WHEN LOWER(TRIM(${tracks.platform})) LIKE '%windows%' THEN 'windows'
      WHEN LOWER(TRIM(${tracks.platform})) LIKE '%mac%' THEN 'mac'
      WHEN LOWER(TRIM(${tracks.platform})) LIKE '%linux%' THEN 'linux'
      WHEN LOWER(TRIM(${tracks.platform})) LIKE '%android%' THEN 'android'
      WHEN LOWER(TRIM(${tracks.platform})) LIKE '%ios%' THEN 'ios'
      ELSE 'Other'
    END
  `;

	const data = await db
		.select({
			platform: platformCase,
			msPlayed: sum(tracks.msPlayed),
		})
		.from(tracks)
		.where(auth(userId, { monthRange }))
		.groupBy(({ platform }) => platform)
		.orderBy(({ msPlayed }) => desc(msPlayed))
		.limit(TOP_PLATFORMS_LIMIT + 1);

	if (!data.length) return [{ platform: "Other", msPlayed: 1 }];

	const topPlatforms = data.slice(0, TOP_PLATFORMS_LIMIT);
	const otherMsPlayed = data
		.slice(TOP_PLATFORMS_LIMIT)
		.reduce((acc, { msPlayed }) => acc + Number(msPlayed), 0);

	if (otherMsPlayed > 0) {
		topPlatforms.push({ platform: "Other", msPlayed: String(otherMsPlayed) });
	}

	return topPlatforms.map(({ platform, msPlayed }) => ({
		platform,
		msPlayed: Number(msPlayed),
	}));
};
