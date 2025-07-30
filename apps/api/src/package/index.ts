import { Context } from "hono";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { db, eq, tracks, users } from "@repo/database";
import { spotify } from "@repo/spotify";
import type { ArtistSimplified, Track } from "@repo/spotify/types";

import { extractZipAndGetFiles, parseZipFiles } from "~/lib/zip";

import { ApiError, batchArray, isAuthenticatedOrThrow } from "./api-utils";
import { PackageStreamer, PackageStreamerError } from "./PackageStreamer";
import { getPackage, setPackageStatus } from "./package-utils";
import type { DataType, ProcessedTrack, TrackInfo } from "./types";

const MIN_PLAY_DURATION_MS = 10000;
const TRACK_BATCH_SIZE = 5000;

export async function createPackageStream(c: Context) {
	const packageSteamer = new PackageStreamer();

	try {
		const { userId } = await isAuthenticatedOrThrow();
		// await isRateLimitedOrThrow(userId, ONE_DAY_IN_MS);
		const { packageId } = z
			.object({ packageId: z.string() })
			.parse(await c.req.json());

		const stream = new ReadableStream({
			async start(controller) {
				try {
					packageSteamer.setController(controller);
					await processUserPackage(userId, packageId, packageSteamer);
				} catch (error) {
					if (error instanceof PackageStreamerError) {
						packageSteamer.emitError(error.message, error.step);
					} else {
						console.error("An unexpected error occurred:", error);
					}
				} finally {
					controller.enqueue(new TextEncoder().encode("{}\n"));
					controller.close();
					revalidateTag(userId);
				}
			},
		});

		return c.newResponse(stream, {
			headers: { "Content-Type": "application/x-ndjson" },
		});
	} catch (error) {
		return c.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to process package",
			},
			500,
		);
	}
}

async function processUserPackage(
	userId: string,
	packageId: string,
	packageSteamer: PackageStreamer,
) {
	packageSteamer.emit(0, "Extracting files from archive", "pending");

	const packageData = await getPackage(userId, packageId);
	if (!packageData?.tempFileLink) {
		throw new PackageStreamerError(
			"Package not found",
			"Extracting files from archive",
		);
	}

	await db.delete(tracks).where(eq(tracks.userId, userId));
	packageSteamer.emit(5, "Extracting files from archive", "processing");

	const processingResult = await processPackageFile(
		packageData.tempFileLink,
		userId,
		packageSteamer,
	);

	if (!processingResult) {
		throw new PackageStreamerError(
			"No valid tracks found in package",
			"Retrieving additional track details",
		);
	}

	packageSteamer.emit(90, "Retrieving additional track details", "completed");
	packageSteamer.emit(90, "Saving your listening history", "processing");

	await setPackageStatus(packageId, "processed");

	await db.update(users).set({ hasPackage: true }).where(eq(users.id, userId));

	await setDefaulMonthStats(userId);

	packageSteamer.emit(100, "Saving your listening history", "completed");
}

async function processPackageFile(
	fileUrl: string,
	userId: string,
	packageSteamer: PackageStreamer,
) {
	const response = await fetch(fileUrl);
	const buffer = await response.arrayBuffer();

	packageSteamer.emit(10);

	const filesRegexPattern =
		/Spotify Extended Streaming History\/Streaming_History_Audio_(\d{4}(-\d{4})?)_(\d+)\.json/;

	const files = await extractZipAndGetFiles(buffer, filesRegexPattern);

	packageSteamer.emit(15, "Extracting files from archive", "completed");
	packageSteamer.emit(15, "Processing track information", "processing");

	const data = parseZipFiles<DataType>(files);

	packageSteamer.emit(20);

	const trackUris = extractValidTrackUris(data);

	packageSteamer.emit(25, "Processing track information", "completed");

	if (!trackUris.size) return null;

	packageSteamer.emit(30, "Retrieving additional track details", "processing");

	await spotify.me.get();

	packageSteamer.emit(35);

	const trackUriArray = Array.from(trackUris.keys());
	const trackUriBatches = batchArray(trackUriArray, 200);

	packageSteamer.emit(40);

	const totalBatches = trackUriBatches.length;
	let completedBatches = 0;

	if (totalBatches === 0) {
		throw new PackageStreamerError(
			"No valid tracks found in package",
			"Retrieving additional track details",
		);
	}

	await Promise.all(
		trackUriBatches.map(async (batch) => {
			await processTrackBatch(batch as string[], data, userId);
			completedBatches++;

			const progress = 40 + Math.floor((completedBatches / totalBatches) * 50);
			packageSteamer.emit(progress);
		}),
	);

	return true;
}

/**
 * Validates if a track should be filtered out based on metadata completeness
 */
const shouldFilterTrack = (track: DataType): boolean =>
	!track.spotify_track_uri ||
	!track.master_metadata_album_album_name ||
	!track.master_metadata_album_artist_name ||
	track.ms_played < MIN_PLAY_DURATION_MS;

/**
 * Extracts valid track URIs from streaming history data
 */
function extractValidTrackUris(data: DataType[][]) {
	const trackUriMap = new Map<string, number>();

	for (const track of data.flat()) {
		if (shouldFilterTrack(track)) continue;

		const trackUri = track.spotify_track_uri.split(":")[2];
		trackUriMap.set(trackUri, (trackUriMap.get(trackUri) || 0) + 1);
	}

	// Filter out tracks with less than 1 play count
	return new Map([...trackUriMap].filter(([_, count]) => count >= 1));
}

/**
 * Saves processed tracks to the database in batches
 */
async function saveTracksToDatabase(
	newTracks: ProcessedTrack[],
	userId: string,
) {
	const trackBatches = batchArray(newTracks, TRACK_BATCH_SIZE);
	await Promise.all(
		trackBatches.map(async (batch) => {
			await db.insert(tracks).values(
				batch.map((track) => ({
					...track,
					timestamp: new Date(track.timestamp),
					msPlayed: BigInt(track.msPlayed),
					userId,
				})),
			);
		}),
	);
}

/**
 * Processes a batch of track URIs
 */
async function processTrackBatch(
	trackUris: string[],
	data: DataType[][],
	userId: string,
) {
	if (!trackUris.length) return;

	try {
		const tracksFromSpotify = await spotify.tracks.list(trackUris);
		if (!Array.isArray(tracksFromSpotify)) {
			throw new ApiError("Invalid response from Spotify API:", 500);
		}

		const trackInfoMap = createTrackInfoMap(tracksFromSpotify);
		if (trackInfoMap.size === 0) {
			throw new ApiError("No valid tracks found in Spotify response", 400);
		}

		const trackInfoObj = Object.fromEntries(trackInfoMap);
		const dataTracks = mapTrackDataForDb(data.flat(), trackInfoObj);

		if (dataTracks.length > 0) {
			await saveTracksToDatabase(dataTracks, userId);
		}
	} catch (error) {
		console.error("Error processing track batch:", error);
	}
}

/**
 * Creates a map of track IDs to track info from Spotify API response
 */
function createTrackInfoMap(tracksFromSpotify: Track[]) {
	const trackInfoMap = new Map<string, TrackInfo>();

	for (const track of tracksFromSpotify) {
		if (!track?.id || !track?.name || !track?.uri) continue;

		trackInfoMap.set(track.id, {
			artists: track.artists.map((artist: ArtistSimplified) => artist.id),
			album: track.album.id,
			artistsAlbums: track.album.artists.map(
				(artist: ArtistSimplified) => artist.id,
			),
		});
	}

	return trackInfoMap;
}

/**
 * Maps raw track data to database-ready format
 */
function mapTrackDataForDb(
	tracks: DataType[],
	trackInfoObj: Record<string, TrackInfo>,
): ProcessedTrack[] {
	return tracks.reduce<ProcessedTrack[]>((acc, track) => {
		if (shouldFilterTrack(track)) return acc;

		const trackUri = track.spotify_track_uri.split(":")[2];
		const trackInfo = trackInfoObj[trackUri];

		if (!trackInfo) return acc;

		acc.push({
			timestamp: track.ts,
			platform: track.platform,
			msPlayed: track.ms_played,
			spotifyId: trackUri,
			artistIds: trackInfo.artists,
			albumId: trackInfo.album,
			albumArtistIds: trackInfo.artistsAlbums,
			reasonStart: track.reason_start,
			reasonEnd: track.reason_end,
			shuffle: track.shuffle,
			skipped: track.skipped,
			offline: track.offline,
		});

		return acc;
	}, []);
}

async function setDefaulMonthStats(userId: string) {
	await db.transaction(async (tx) => {
		const [minDate, maxDate] = await Promise.all([
			tx.query.tracks.findFirst({
				where: (tracks, { eq }) => eq(tracks.userId, userId),
				orderBy: (tracks, { asc }) => asc(tracks.timestamp),
			}),
			tx.query.tracks.findFirst({
				where: (tracks, { eq }) => eq(tracks.userId, userId),
				orderBy: (tracks, { desc }) => desc(tracks.timestamp),
			}),
		]);

		await tx
			.update(users)
			.set({
				timeRangeDateStart: minDate?.timestamp,
				timeRangeDateEnd: maxDate?.timestamp,
			})
			.where(eq(users.id, userId));
	});
}
