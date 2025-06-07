import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import { getMsPlayedInMinutes } from "~/lib/utils";

interface AlbumTracklistItem {
	id: string;
	name: string;
	href: string;
	image?: string;
	artists: string;
	stat1: string;
	stat2: string;
	track_number: number;
	explicit: boolean;
}

interface AlbumGlobalStats {
	totalplays: number;
	totalminutes: number;
	firstlisten: Date | null;
	lastlisten: Date | null;
}

interface AlbumFavoriteTrack {
	id: string;
	name: string;
	plays: number;
}

interface AlbumMonthlyTrend {
	month: string;
	plays: number;
}

interface AlbumChartData {
	hour?: string;
	day?: string;
	msPlayed: number;
}

interface AlbumInsight {
	type: string;
	icon: string;
	title: string;
	description: string;
	metadata: Record<string, any>;
}

export async function getAlbumDetails({
	albumId,
	userId,
}: { albumId: string; userId?: string }) {
	// Infos de base Spotify
	const album = await spotify.albums.get(albumId);
	const tracks = album?.tracks?.items || [];
	const image = album?.images?.[0]?.url;

	// Stats utilisateur par track
	let statsByTrack: Record<string, { msPlayed: number; count: number }> = {};
	if (userId && tracks.length) {
		const stats = await prisma.track.groupBy({
			by: ["spotifyId"],
			_sum: { msPlayed: true },
			_count: { _all: true },
			where: {
				userId,
				albumId,
				spotifyId: { in: tracks.map((t) => t.id) },
			},
		});
		statsByTrack = Object.fromEntries(
			stats.map((s) => [
				s.spotifyId,
				{
					msPlayed: Number(s._sum.msPlayed) || 0,
					count: s._count._all || 0,
				},
			]),
		);
	}

	// Tracklist enrichie
	const tracklist: AlbumTracklistItem[] = tracks.map((track) => {
		const stats = statsByTrack[track.id] || { msPlayed: 0, count: 0 };
		return {
			id: track.id,
			name: track.name,
			href: track.external_urls.spotify,
			image,
			artists: track.artists.map((a) => a.name).join(", "),
			stat1: `${getMsPlayedInMinutes(stats.msPlayed)} minutes`,
			stat2: `${stats.count} streams`,
			track_number: track.track_number,
			explicit: track.explicit,
		};
	});

	// Stats globales album pour l'utilisateur (pour AlbumListeningStats)
	let globalStats: AlbumGlobalStats | null = null;
	let favoriteTrack: AlbumFavoriteTrack | null = null;
	let monthlyTrend: AlbumMonthlyTrend[] = [];
	if (userId) {
		const [row] = await prisma.$queryRaw<
			[
				{
					totalplays: number;
					totalminutes: number;
					firstlisten: Date | null;
					lastlisten: Date | null;
				},
			]
		>`
      SELECT COUNT(*) as totalplays, ROUND(SUM("msPlayed")::numeric / 1000 / 60) as totalminutes, MIN("timestamp") as firstlisten, MAX("timestamp") as lastlisten
      FROM "Track"
      WHERE "userId" = ${userId} AND "albumId" = ${albumId}
    `;
		globalStats = row || null;

		// Favorite track
		const [fav] = await prisma.$queryRaw<
			[{ spotifyid: string; plays: number }]
		>`
      SELECT "spotifyId" as spotifyid, COUNT(*) as plays
      FROM "Track"
      WHERE "userId" = ${userId} AND "albumId" = ${albumId}
      GROUP BY "spotifyId"
      ORDER BY plays DESC
      LIMIT 1
    `;
		if (fav?.spotifyid) {
			try {
				const [track] = await spotify.tracks.list([fav.spotifyid]);
				favoriteTrack = {
					id: fav.spotifyid,
					name: track?.name || "Track",
					plays: Number(fav.plays),
				};
			} catch {
				favoriteTrack = {
					id: fav.spotifyid,
					name: "Track",
					plays: Number(fav.plays),
				};
			}
		}

		// Monthly trend
		const monthly = await prisma.$queryRaw<
			{
				month: string;
				plays: number;
			}[]
		>`
      SELECT TO_CHAR("timestamp", 'YYYY-MM') as month, COUNT(*) as plays
      FROM "Track"
      WHERE "userId" = ${userId} AND "albumId" = ${albumId}
      AND "timestamp" > NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `;
		monthlyTrend = (monthly || []).map((m) => ({
			month: new Date(`${m.month}-01`).toLocaleDateString("en-US", {
				month: "short",
			}),
			plays: Number(m.plays),
		}));
	}

	// Stats par heure
	let hoursData: AlbumChartData[] = [];
	if (userId) {
		const raw = await prisma.$queryRaw<
			{
				hour: string;
				msPlayed: any;
			}[]
		>`
      SELECT TO_CHAR("timestamp", 'HH24') AS hour, SUM("msPlayed") as "msPlayed"
      FROM "Track"
      WHERE "userId" = ${userId} AND "albumId" = ${albumId}
      GROUP BY TO_CHAR("timestamp", 'HH24')
      ORDER BY TO_CHAR("timestamp", 'HH24')::int ASC
    `;
		hoursData = (raw || []).map((row) => ({
			hour: row.hour,
			msPlayed: Number(row.msPlayed),
		}));
	}

	// Stats par jour
	let daysData: AlbumChartData[] = [];
	if (userId) {
		const raw = await prisma.$queryRaw<
			{
				day: string;
				msPlayed: any;
			}[]
		>`
      SELECT TO_CHAR("timestamp", 'Day') AS day, SUM("msPlayed") as "msPlayed"
      FROM "Track"
      WHERE "userId" = ${userId} AND "albumId" = ${albumId}
      GROUP BY TO_CHAR("timestamp", 'Day')
      ORDER BY TO_CHAR("timestamp", 'Day') ASC
    `;
		daysData = (raw || []).map((row) => ({
			day: row.day.trim(),
			msPlayed: Number(row.msPlayed),
		}));
	}

	// Insights (AlbumInsights)
	const insights: AlbumInsight[] = [];
	if (userId) {
		// 1. Get all users' play counts for this album (for percentile)
		const userPlayCounts = await prisma.$queryRaw<
			{
				userId: string;
				plays: number;
			}[]
		>`
      SELECT "userId", COUNT(*) as plays
      FROM "Track"
      WHERE "albumId" = ${albumId}
      GROUP BY "userId"
    `;
		const sorted = userPlayCounts.map((u) => u.plays).sort((a, b) => b - a);
		const userPlays = globalStats?.totalplays || 0;
		const rank = sorted.findIndex((p) => p <= userPlays) + 1;
		const percentile =
			rank > 0 ? Math.round((1 - (rank - 1) / sorted.length) * 100) : 0;

		// 2. Most listened day
		const [dayStats] = await prisma.$queryRaw<[{ day: string; plays: number }]>`
      SELECT TO_CHAR("timestamp", 'Day') as day, COUNT(*) as plays
      FROM "Track"
      WHERE "userId" = ${userId} AND "albumId" = ${albumId}
      GROUP BY day
      ORDER BY plays DESC
      LIMIT 1
    `;

		// 3. Least played track
		let leastTrackName = "";
		const [leastTrack] = await prisma.$queryRaw<
			[{ spotifyid: string; plays: number }]
		>`
      SELECT "spotifyId" as spotifyid, COUNT(*) as plays
      FROM "Track"
      WHERE "userId" = ${userId} AND "albumId" = ${albumId}
      GROUP BY "spotifyId"
      ORDER BY plays ASC
      LIMIT 1
    `;
		if (leastTrack?.spotifyid) {
			try {
				const [track] = await spotify.tracks.list([leastTrack.spotifyid]);
				leastTrackName = track?.name || "Track";
			} catch {
				leastTrackName = "Track";
			}
		}

		// Achievement: top 5% listener
		if (percentile >= 95) {
			insights.push({
				type: "achievement",
				icon: "Star",
				title: "Super Fan Status",
				description: "You're in the top 5% of listeners for this album!",
				metadata: { percentage: percentile },
			});
		}
		// Milestone: 100 plays
		if (globalStats && globalStats.totalplays >= 100) {
			insights.push({
				type: "milestone",
				icon: "Target",
				title: "100 Plays Milestone",
				description: "You've reached 100 total plays of this album!",
				metadata: {
					value: `${globalStats.totalplays} plays`,
					date: globalStats.lastlisten
						? globalStats.lastlisten.toISOString().slice(0, 10)
						: undefined,
				},
			});
		}
		// Pattern: most listened day
		if (dayStats?.day) {
			insights.push({
				type: "pattern",
				icon: "Brain",
				title: "Listening Pattern",
				description: `You listen to this album most on ${dayStats.day.trim()}`,
				metadata: { value: dayStats.day.trim() },
			});
		}
		// Recommendation: least played track
		if (leastTrack?.spotifyid) {
			insights.push({
				type: "recommendation",
				icon: "Lightbulb",
				title: "Hidden Gem",
				description: `${leastTrackName} has the lowest play count - give it another listen!`,
				metadata: { value: `${leastTrack?.plays} plays` },
			});
		}
	}

	return {
		album,
		tracklist,
		globalStats,
		favoriteTrack,
		monthlyTrend,
		hoursData,
		daysData,
		insights,
	};
}
