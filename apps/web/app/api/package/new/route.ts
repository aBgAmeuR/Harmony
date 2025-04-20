import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import { z } from "zod";

import { extractZipAndGetFiles, parseZipFiles } from "~/lib/zip";

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
import {
	clearProgress,
	updateFileProgress,
	updateProgress,
} from "../progress/route";
import type { ProcessedTrack, TrackInfo } from "./types";

export const runtime = "nodejs";
export const maxDuration = 60;

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const MIN_PLAY_DURATION_MS = 10000;
const TRACK_BATCH_SIZE = 10000;

const bodySchema = z.object({
	packageId: z.string(),
});

/**
 * Processes the HTTP POST request for creating a new package
 */
export async function POST(req: Request) {
	try {
		const { id: userId } = await isAuthenticatedOrThrow();
		await isRateLimitedOrThrow(userId, ONE_DAY_IN_MS);

		const { packageId } = bodySchema.parse(await req.json());

		return await processUserPackage(userId, packageId);
	} catch (error) {
		switch (true) {
			case error instanceof ApiError:
				return createJsonResponse(error.message, error.statusCode);
			case error instanceof z.ZodError:
				return createJsonResponse("Invalid request body", 400);
			default:
				console.log("Package processing error:", error);
				return createJsonResponse("Failed to process package", 500);
		}
	}
}

/**
 * Processes a user package by ID
 */
async function processUserPackage(userId: string, packageId: string) {
	// Initialize progress tracking
	updateProgress(userId, packageId, {
		step: "Extract Files",
		percentage: 0,
		stepStatus: "processing",
		message: "Starting package processing...",
	});

	try {
		// Fetch package
		const packageData = await getPackage(userId, packageId);
		if (!packageData?.tempFileLink) {
			throw new ApiError("Package not found", 404);
		}

		// Clear existing user tracks
		await prisma.track.deleteMany({ where: { userId } });
		updateProgress(userId, packageId, {
			step: "Extract Files",
			percentage: 5,
			message: "Preparing to extract files...",
			details: {
				currentFile: packageData.fileName || "spotify-data.zip",
			},
		});

		// Process package data
		const processingResult = await processPackageFile(
			packageData.tempFileLink,
			userId,
			packageId,
		);

		if (!processingResult) {
			throw new ApiError("No valid tracks found in package", 400);
		}

		await setPackageStatus(packageId, "processed");

		// FIXME: This deletion is not working and needs investigation
		// The fileName property might not be in the correct format for utapi.deleteFiles
		if (packageData.fileName) {
			await utapi.deleteFiles(packageData.fileName).catch((error) => {
				console.error("Failed to delete file:", error);
			});
		}

		await prisma.user.update({
			where: { id: userId },
			data: { hasPackage: true },
		});

		// Mark processing as complete in progress tracker
		updateProgress(userId, packageId, {
			step: "Save To Database",
			percentage: 100,
			stepStatus: "completed",
			message: "Package processing complete",
		});

		// Schedule cleanup of progress data after a short delay
		// This allows the client to get the completed state before cleanup
		setTimeout(() => clearProgress(userId, packageId), 60000);

		return createJsonResponse("Package processed successfully", 200);
	} catch (error) {
		// Mark processing as failed in progress tracker
		updateProgress(userId, packageId, {
			step: "Extract Files", // Use whatever step we were on
			percentage: 0,
			stepStatus: "error",
			message:
				error instanceof Error ? error.message : "Unknown error occurred",
		});

		throw error;
	}
}

/**
 * Processes the package file to extract track data
 */
async function processPackageFile(
	fileUrl: string,
	userId: string,
	packageId: string,
) {
	try {
		// Fetch and extract files from the zip archive
		updateProgress(userId, packageId, {
			step: "Extract Files",
			percentage: 10,
			message: "Downloading package file...",
		});

		const response = await fetch(fileUrl);
		const buffer = await response.arrayBuffer();

		updateProgress(userId, packageId, {
			step: "Extract Files",
			percentage: 20,
			message: "Extracting files from archive...",
		});

		const filesRegexPattern =
			/Spotify Extended Streaming History\/Streaming_History_Audio_(\d{4}(-\d{4})?)_(\d+)\.json/;

		const files = await extractZipAndGetFiles(buffer, filesRegexPattern);

		// Update progress with the list of files found
		const fileNames = files.map((file) => file.filename);
		updateProgress(userId, packageId, {
			step: "Extract Files",
			percentage: 30,
			stepStatus: "completed",
			message: `Found ${files.length} files`,
			details: {
				files: fileNames,
				count: files.length,
			},
		});

		// Start processing tracks
		updateProgress(userId, packageId, {
			step: "Process Tracks",
			percentage: 30,
			stepStatus: "processing",
			message: `Processing ${files.length} track history files...`,
		});

		// Process files one by one with progress updates
		const processedFiles: string[] = [];
		const totalFiles = files.length;
		let currentFileIndex = 0;

		for (const file of files) {
			currentFileIndex++;
			const progressPercentage =
				30 + Math.floor((currentFileIndex / totalFiles) * 10);

			// Update progress for individual file
			updateFileProgress(userId, packageId, {
				step: "Process Tracks",
				file: file.filename,
				files: [file.filename],
			});

			updateProgress(userId, packageId, {
				step: "Process Tracks",
				percentage: progressPercentage,
				message: `Processing file ${currentFileIndex}/${totalFiles}...`,
			});

			processedFiles.push(file.filename);
		}

		const data = parseZipFiles<DataType>(files);

		// Extract unique track URIs
		updateProgress(userId, packageId, {
			step: "Process Tracks",
			percentage: 45,
			message: "Identifying unique track data...",
		});

		const trackUris = extractValidTrackUris(data);

		updateProgress(userId, packageId, {
			step: "Process Tracks",
			percentage: 50,
			stepStatus: "completed",
			message: `Found ${trackUris.size} unique tracks`,
			details: {
				count: trackUris.size,
			},
		});

		if (!trackUris.size) return null;

		// Fetch track details from Spotify
		updateProgress(userId, packageId, {
			step: "Fetch Spotify Data",
			percentage: 50,
			stepStatus: "processing",
			message: "Authenticating with Spotify...",
		});

		await spotify.me.get();

		updateProgress(userId, packageId, {
			step: "Fetch Spotify Data",
			percentage: 55,
			message: "Starting Spotify data retrieval...",
		});

		const trackUriArray = Array.from(trackUris.keys());
		const trackUriBatches = batchArray(trackUriArray, 200);
		const totalBatches = trackUriBatches.length;

		updateProgress(userId, packageId, {
			step: "Fetch Spotify Data",
			percentage: 60,
			message: `Processing ${totalBatches} batches of track data...`,
			details: {
				count: totalBatches,
			},
		});

		// Process all batches with progress tracking
		let completedBatches = 0;
		await Promise.all(
			trackUriBatches.map(async (batch, batchIndex) => {
				const batchName = `Batch ${batchIndex + 1}/${totalBatches}`;

				// Update that we're processing this specific batch
				updateFileProgress(userId, packageId, {
					step: "Fetch Spotify Data",
					file: batchName,
				});

				await processTrackBatch(batch as string[], data, userId, packageId);
				completedBatches++;

				const fetchProgress =
					60 + Math.floor((completedBatches / totalBatches) * 15);
				updateProgress(userId, packageId, {
					step: "Fetch Spotify Data",
					percentage: fetchProgress,
					message: `Processed ${completedBatches}/${totalBatches} batches...`,
				});

				// Update with this batch being done
				updateFileProgress(userId, packageId, {
					step: "Fetch Spotify Data",
					files: [batchName],
				});
			}),
		);

		updateProgress(userId, packageId, {
			step: "Fetch Spotify Data",
			percentage: 75,
			stepStatus: "completed",
			message: "Spotify data fetched successfully",
		});

		// Final database save
		updateProgress(userId, packageId, {
			step: "Save To Database",
			percentage: 75,
			stepStatus: "processing",
			message: "Finalizing database records...",
		});

		// Processing is complete at this point
		updateProgress(userId, packageId, {
			step: "Save To Database",
			percentage: 90,
			message: "Completing final database updates...",
		});

		return true;
	} catch (error) {
		console.error("Error processing package file:", error);

		// Update progress with error
		const errorStep = determineErrorStep(userId, packageId);
		updateProgress(userId, packageId, {
			step: errorStep,
			percentage: 0,
			stepStatus: "error",
			message:
				error instanceof Error ? error.message : "Error processing package",
		});

		throw error;
	}
}

/**
 * Determines the current step to mark as error
 */
function determineErrorStep(userId: string, packageId: string): string {
	const progressKey = `${userId}:${packageId}`;
	try {
		// Access progress directly from in-memory store
		const progressStore = global.progressStore;
		const progress = progressStore?.get(progressKey);
		return progress?.step || "Extract Files";
	} catch (e) {
		return "Extract Files";
	}
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
	// eslint-disable-next-line no-unused-vars
	return new Map([...trackUriMap].filter(([_, count]) => count >= 1));
}

/**
 * Saves processed tracks to the database in batches
 */
async function saveTracksToDatabase(
	tracks: ProcessedTrack[],
	userId: string,
	packageId: string,
): Promise<void> {
	// Split tracks into manageable batches
	const trackBatches = batchArray(tracks, TRACK_BATCH_SIZE);
	const totalBatches = trackBatches.length;

	// Process all batches in parallel with progress updates
	let completedBatches = 0;
	await Promise.all(
		trackBatches.map(async (batch, batchIndex) => {
			const batchName = `Database Batch ${batchIndex + 1}/${totalBatches}`;

			// Update that we're processing this specific batch
			updateFileProgress(userId, packageId, {
				step: "Save To Database",
				file: batchName,
			});

			await prisma.track.createMany({
				data: batch.map((track) => ({
					...track,
					timestamp: new Date(track.timestamp),
					userId,
				})),
			});

			completedBatches++;
			const saveProgress =
				75 + Math.floor((completedBatches / Math.max(totalBatches, 1)) * 15);

			// Update with this batch being done
			updateFileProgress(userId, packageId, {
				step: "Save To Database",
				files: [batchName],
			});

			// Don't update progress if we're at 100% already (means we're done)
			if (saveProgress < 100) {
				updateProgress(userId, packageId, {
					step: "Save To Database",
					percentage: saveProgress,
					message: `Saved ${completedBatches}/${totalBatches} batches to database...`,
				});
			}
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
	packageId: string,
) {
	// Ensure we have valid track URIs to process
	if (!trackUris.length) return;

	try {
		const tracksFromSpotify = await spotify.tracks.list(trackUris);
		if (!Array.isArray(tracksFromSpotify)) {
			throw new ApiError("Invalid response from Spotify API:", 500);
		}

		// Create a map of track info
		const trackInfoMap = createTrackInfoMap(tracksFromSpotify);
		if (trackInfoMap.size === 0) {
			throw new ApiError("No valid tracks found in Spotify response", 400);
		}

		const trackInfoObj = Object.fromEntries(trackInfoMap);

		// Process and map tracks
		const dataTracks = mapTrackDataForDb(data.flat(), trackInfoObj);

		// Log the number of tracks we are saving
		updateFileProgress(userId, packageId, {
			step: "Save To Database",
			count: dataTracks.length,
		});

		if (dataTracks.length > 0) {
			await saveTracksToDatabase(dataTracks, userId, packageId);
		}
	} catch (error) {
		console.error("Error processing track batch:", error);
	}
}

/**
 * Creates a map of track IDs to track info from Spotify API response
 */
function createTrackInfoMap(tracksFromSpotify: any[]) {
	const trackInfoMap = new Map<string, TrackInfo>();

	for (const track of tracksFromSpotify) {
		if (!track?.id || !track?.name || !track?.uri) continue;

		trackInfoMap.set(track.id, {
			artists: track.artists.map((artist: any) => artist.id),
			album: track.album.id,
			artistsAlbums: track.album.artists.map((artist: any) => artist.id),
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
