import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import { z } from "zod";

import { extractZipAndGetFiles, parseZipFiles } from "~/lib/zip";

import type { ArtistSimplified, Track } from "@repo/spotify/types";
import type { DataType } from "~/types/data";
import { utapi } from "../../uploadthing/core";
import {
	ApiError,
	batchArray,
	createJsonResponse,
	isAuthenticatedOrThrow,
	isRateLimitedOrThrow,
} from "../api-utils";
import { getPackage, setPackageStatus } from "../package-utils";
import { PackageStreamer, PackageStreamerError } from "./PackageStreamer";
import type { ProcessedTrack, TrackInfo } from "./types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MIN_PLAY_DURATION_MS = 10000;
const TRACK_BATCH_SIZE = 10000;

export async function POST(req: Request) {
	const packageSteamer = new PackageStreamer();

	try {
		const { id: userId } = await isAuthenticatedOrThrow();
		// await isRateLimitedOrThrow(userId, ONE_DAY_IN_MS);
		const { packageId } = z
			.object({ packageId: z.string() })
			.parse(await req.json());

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
					controller.close();
				}
			},
		});

		return new Response(stream, {
			headers: { "Content-Type": "application/x-ndjson" },
		});
	} catch (error) {
		return createJsonResponse(
			error instanceof Error ? error.message : "Failed to process package",
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

	// Clear existing user tracks
	await prisma.track.deleteMany({ where: { userId } });
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

	if (packageData.fileName) {
		await utapi.deleteFiles(packageData.fileName).catch((error) => {
			console.error("Failed to delete file:", error);
		});
	}

	await prisma.user.update({
		where: { id: userId },
		data: { hasPackage: true },
	});

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
async function saveTracksToDatabase(tracks: ProcessedTrack[], userId: string) {
	const trackBatches = batchArray(tracks, TRACK_BATCH_SIZE);
	await Promise.all(
		trackBatches.map(async (batch) => {
			await prisma.track.createMany({
				data: batch.map((track) => ({
					...track,
					timestamp: new Date(track.timestamp),
					userId,
				})),
			});
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
