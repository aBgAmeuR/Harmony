import { and, eq, gte, lt } from "drizzle-orm";

import { tracks } from "./schema";

/**
 * Flexible where clause builder for tracks filtering by userId and optionally monthRange.
 *
 * Usage:
 *   .where(auth(userId))
 *   .where(auth(userId, { monthRange }))
 *   .where(and(auth(userId, { monthRange }), otherClause))
 *
 * @param userId - The user ID to filter by
 * @param options - Optional object: { monthRange?: { dateStart: Date | string; dateEnd: Date | string } }
 * @returns Drizzle ORM where clause
 */
export function auth(
	userId: string,
	options?: {
		monthRange?: { dateStart: Date; dateEnd: Date };
	},
) {
	const clauses = [eq(tracks.userId, userId)];
	if (options?.monthRange) {
		clauses.push(
			gte(tracks.timestamp, options.monthRange.dateStart),
			lt(tracks.timestamp, options.monthRange.dateEnd),
		);
	}
	return and(...clauses);
}
