"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { auth, db, tracks } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

export const getListeningSessionData = async (
	userId: string,
	isDemo: boolean,
) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "listening-session");

	const monthRange = await getMonthRange(userId, isDemo);

	const tracksData = await db
		.select({
			timestamp: tracks.timestamp,
			msPlayed: tracks.msPlayed,
		})
		.from(tracks)
		.where(auth(userId, { monthRange }))
		.orderBy(tracks.timestamp);

	const sessionDurations: number[] = [];
	let currentSessionStart: Date | null = null;
	let currentSessionDuration = 0;

	for (let i = 0; i < tracksData.length; i++) {
		const track = tracksData[i];
		const trackTime = track.timestamp;

		if (!currentSessionStart) {
			currentSessionStart = track.timestamp;
			currentSessionDuration = Number(track.msPlayed) || 0;
		} else {
			const lastTimestamp = currentSessionStart;
			const diff =
				Math.abs(trackTime.getTime() - lastTimestamp.getTime()) / 60000;

			if (diff > 30) {
				sessionDurations.push(currentSessionDuration);
				currentSessionStart = track.timestamp;
				currentSessionDuration = Number(track.msPlayed) || 0;
			} else {
				currentSessionDuration += Number(track.msPlayed) || 0;
				currentSessionStart = track.timestamp;
			}
		}

		if (i === tracksData.length - 1) {
			sessionDurations.push(currentSessionDuration);
		}
	}

	const totalSessions = sessionDurations.length;
	const totalDuration = sessionDurations.reduce(
		(sum, duration) => sum + duration,
		0,
	);
	const longestSession = sessionDurations.length
		? Math.max(...sessionDurations)
		: 0;
	const averageSessionTime = totalSessions ? totalDuration / totalSessions : 0;

	return {
		averageSessionTime: Math.round(averageSessionTime),
		longestSession,
		totalSessions,
	};
};
