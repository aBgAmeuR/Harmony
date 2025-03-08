import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import { z } from "zod";

import { extractZipAndGetFiles, parseZipFiles } from "~/lib/zip";
import { DataType } from "~/types/data";

import { utapi } from "../../uploadthing/core";
import {
  ApiError,
  batchArray,
  createJsonResponse,
  isAuthenticatedOrThrow,
  isRateLimitedOrThrow,
} from "../api-utils";
import { getPackage, setPackageStatus } from "../package-utils";
import { ProcessedTrack, TrackInfo } from "./types";

export const runtime = "nodejs";
export const maxDuration = 60;

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const MIN_PLAY_DURATION_MS = 10000;
const TRACK_BATCH_SIZE = 10000;

export const bodySchema = z.object({
  packageId: z.string(),
});

/**
 * Processes the HTTP POST request for creating a new package
 */
export async function POST(req: Request) {
  try {
    const { id: userId } = await isAuthenticatedOrThrow();
    // await isRateLimitedOrThrow(userId, ONE_DAY_IN_MS);

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
  // Fetch package
  const packageData = await getPackage(userId, packageId);
  if (!packageData?.tempFileLink) {
    throw new ApiError("Package not found", 404);
  }

  // Clear existing user tracks
  await prisma.track.deleteMany({ where: { userId } });

  // Process package data
  const processingResult = await processPackageFile(
    packageData.tempFileLink,
    userId,
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

  return createJsonResponse("Package processed successfully", 200);
}

/**
 * Processes the package file to extract track data
 */
async function processPackageFile(fileUrl: string, userId: string) {
  // Fetch and extract files from the zip archive
  const response = await fetch(fileUrl);
  const buffer = await response.arrayBuffer();
  const filesRegexPattern =
    /Spotify Extended Streaming History\/Streaming_History_Audio_(\d{4}(-\d{4})?)_(\d+)\.json/;

  const files = await extractZipAndGetFiles(buffer, filesRegexPattern);
  const data = parseZipFiles<DataType>(files);

  // Extract unique track URIs
  const trackUris = extractValidTrackUris(data);
  if (!trackUris.size) return null;

  // Fetch track details from Spotify
  await spotify.me.get();
  const trackUriArray = Array.from(trackUris.keys());
  const trackUriBatches = batchArray(trackUriArray, 200);

  // Process all batches in parallel
  await Promise.all(
    trackUriBatches.map((batch) => processTrackBatch(batch, data, userId)),
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
  // eslint-disable-next-line no-unused-vars
  return new Map([...trackUriMap].filter(([_, count]) => count >= 1));
}

/**
 * Saves processed tracks to the database in batches
 */
async function saveTracksToDatabase(
  tracks: ProcessedTrack[],
  userId: string,
): Promise<void> {
  // Split tracks into manageable batches
  const trackBatches = batchArray(tracks, TRACK_BATCH_SIZE);

  // Process all batches in parallel
  await Promise.all(
    trackBatches.map((batch) =>
      prisma.track.createMany({
        data: batch.map((track) => ({
          ...track,
          timestamp: new Date(track.timestamp),
          userId,
        })),
      }),
    ),
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
