"server-only";

import { getUser, User } from "@repo/auth";
import { getTopArtists } from "../stats/data/top-artists";
import { getTopTracks } from "../stats/data/top-tracks";
import { getTimeRangeData } from "../stats/data/time-range";
import { getRankingAlbumsData } from "../rankings/data/ranking-albums";
import { getRankingArtistsData } from "../rankings/data/ranking-artists";
import { getRankingTracksData } from "../rankings/data/ranking-tracks";
import { getStatsCardsData } from "../overview/data/stats-cards";
import { getListeningPatternData } from "../overview/data/listening-pattern-chart";
import { getListeningSessionData } from "../numbers/data/listening-session";
import { getNumbersStatsData } from "../numbers/data/numbers-stats";
import { getHoursHabitsData } from "../listening-habits/data/hours-habits";
import { getDaysHabitsData } from "../listening-habits/data/days-habits";
import { getSkippedHabitsData } from "../listening-habits/data/skipped-habits";
import { getShuffleHabitsData } from "../listening-habits/data/shuffle-habits";
import { getTopPlatformsData } from "../listening-habits/data/top-platforms";
import { getForgottenGems } from "../forgotten-gems/data/forgotten-gems-service";
import { getAvailableYears } from "../comparisons/year-over-year/data/available-years";
import { getYearMetrics } from "../comparisons/year-over-year/data/year-metrics";
import { getTimeEvolutionData } from "../activity/data/time-evolution";
import { getPlatformUsageData } from "../activity/data/platform-usage";
import { getTimeListenedData } from "../activity/data/time-listened";
import { spotify } from "@repo/spotify";

export const preloadUserData = async (userId: string) => {
	const isDemo = true;

	spotify.setUserId(userId);
	await spotify.me.get();

	await Promise.all([
		// Stats
		await getTopArtists(userId, isDemo),
		await getTopTracks(userId, isDemo),
		await getTimeRangeData(userId, isDemo),
		// Rankings
		await getRankingAlbumsData(userId, isDemo),
		await getRankingArtistsData(userId, isDemo),
		await getRankingTracksData(userId, isDemo),
		// Overview
		await getStatsCardsData(userId, isDemo),
		await getListeningPatternData(userId, isDemo),
		// Numbers
		await getListeningSessionData(userId, isDemo),
		await getNumbersStatsData(userId, isDemo),
		// Listening Habits
		await getHoursHabitsData(userId, isDemo),
		await getDaysHabitsData(userId, isDemo),
		await getSkippedHabitsData(userId, isDemo),
		await getShuffleHabitsData(userId, isDemo),
		await getTopPlatformsData(userId, isDemo),
		// Forgotten Gems
		await getForgottenGems(userId),
		// Comparisons
		await getAvailableYears(userId),
		await getYearMetrics(userId, new Date().getFullYear()),
		await getYearMetrics(userId, new Date().getFullYear() - 1),
		// Activity
		await getTimeEvolutionData(userId, isDemo),
		await getPlatformUsageData(userId, isDemo),
		await getTimeListenedData(userId, isDemo),
	]);
};