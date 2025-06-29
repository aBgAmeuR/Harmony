"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

const TOP_PLATFORMS_LIMIT = 4 as const;

export const getTopPlatformsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "top-platforms");

	const monthRange = await getMonthRange(userId, isDemo);

	const data: { platform: string; msPlayed: bigint }[] = await prisma.$queryRaw`
    WITH platform_data AS (
      SELECT
        CASE
          WHEN LOWER(TRIM(platform)) LIKE '%windows%' THEN 'windows'
          WHEN LOWER(TRIM(platform)) LIKE '%mac%' THEN 'mac'
          WHEN LOWER(TRIM(platform)) LIKE '%linux%' THEN 'linux'
          WHEN LOWER(TRIM(platform)) LIKE '%android%' THEN 'android'
          WHEN LOWER(TRIM(platform)) LIKE '%ios%' THEN 'ios'
          ELSE 'Other'
        END AS platform,
        SUM("msPlayed") AS "msPlayed"
      FROM "Track"
      WHERE "userId" = ${userId}
        AND timestamp BETWEEN ${monthRange.dateStart} AND ${monthRange.dateEnd}
      GROUP BY platform
    )
    SELECT platform, SUM("msPlayed") AS "msPlayed"
    FROM platform_data
    GROUP BY platform
    ORDER BY "msPlayed" DESC
    LIMIT ${TOP_PLATFORMS_LIMIT + 1}
  `;

	if (!data.length) return [{ platform: "Other", msPlayed: 1 }];

	const topPlatforms = data.slice(0, TOP_PLATFORMS_LIMIT);
	const otherMsPlayed = data
		.slice(TOP_PLATFORMS_LIMIT)
		.reduce((acc, { msPlayed }) => acc + Number(msPlayed), 0);

	if (otherMsPlayed > 0) {
		topPlatforms.push({ platform: "Other", msPlayed: BigInt(otherMsPlayed) });
	}

	return topPlatforms.map(({ platform, msPlayed }) => ({
		platform,
		msPlayed: Number(msPlayed),
	}));
};
