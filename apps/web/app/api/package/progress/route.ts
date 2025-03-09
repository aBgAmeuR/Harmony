import { NextResponse } from "next/server";

import { createJsonResponse, isAuthenticatedOrThrow } from "../api-utils";

// Define the progress data type structure
export interface PackageProgressData {
  step: string;
  percentage: number;
  message: string;
  stepStatus: "pending" | "processing" | "completed" | "error";
  processingSteps: Array<{
    name: string;
    status: "pending" | "processing" | "completed" | "error";
    message: string;
    startTime?: number;
    endTime?: number;
    details?: {
      files?: string[];
      count?: number;
      currentFile?: string;
    };
  }>;
  details?: {
    files?: string[];
    count?: number;
    currentFile?: string;
  };
}

// Create a type-safe global store
type ProgressStore = Map<string, PackageProgressData>;

// Make the store global so it's accessible throughout the application
declare global {
  // eslint-disable-next-line no-unused-vars
  var progressStore: ProgressStore | undefined;
}

// Initialize store if it doesn't exist (handles hot reloading in dev)
if (!global.progressStore) {
  global.progressStore = new Map<string, PackageProgressData>();
}

// Ensure we can safely access the store
const getProgressStore = (): ProgressStore => {
  return global.progressStore as ProgressStore;
};

export const runtime = "nodejs";

/**
 * Gets the current progress for a package being processed
 */
export async function GET(req: Request) {
  try {
    const { id: userId } = await isAuthenticatedOrThrow();
    const url = new URL(req.url);
    const packageId = url.searchParams.get("packageId");

    if (!packageId) {
      return createJsonResponse("Package ID is required", 400);
    }

    // Generate a unique key for this user's package progress
    const progressKey = `${userId}:${packageId}`;
    const progressStore = getProgressStore();

    // Return the current progress or default values if not found
    const progress = progressStore.get(progressKey) || createDefaultProgress();

    return NextResponse.json(progress);
  } catch (error) {
    return createJsonResponse(
      error instanceof Error ? error.message : "Failed to get progress",
      error instanceof Error ? (error as any).statusCode || 500 : 500,
    );
  }
}

/**
 * Creates default progress structure
 */
function createDefaultProgress(): PackageProgressData {
  return {
    step: "Extract Files",
    percentage: 0,
    message: "Starting...",
    stepStatus: "pending",
    processingSteps: [
      {
        name: "Extract Files",
        status: "pending",
        message: "Extracting files from archive",
      },
      {
        name: "Process Tracks",
        status: "pending",
        message: "Processing track information",
      },
      {
        name: "Fetch Spotify Data",
        status: "pending",
        message: "Retrieving additional track details",
      },
      {
        name: "Save To Database",
        status: "pending",
        message: "Saving your listening history",
      },
    ],
  };
}

/**
 * Updates the progress for a package being processed
 * This is for internal use by the package processing functions
 */
export function updateProgress(
  userId: string,
  packageId: string,
  data: {
    step: string;
    percentage: number;
    message?: string;
    stepStatus?: "pending" | "processing" | "completed" | "error";
    details?: {
      files?: string[];
      count?: number;
      currentFile?: string;
    };
  },
) {
  const progressKey = `${userId}:${packageId}`;
  const progressStore = getProgressStore();
  const currentProgress =
    progressStore.get(progressKey) || createDefaultProgress();

  // Update the progress
  const updatedProgress = {
    ...currentProgress,
    step: data.step || currentProgress.step,
    percentage: data.percentage,
    message: data.message || currentProgress.message,
    stepStatus: data.stepStatus || currentProgress.stepStatus,
    details: data.details
      ? {
          ...currentProgress.details,
          ...data.details,
          // If we're updating files, append rather than replace
          files: data.details.files
            ? [...(currentProgress.details?.files || []), ...data.details.files]
            : currentProgress.details?.files,
        }
      : currentProgress.details,
  };

  // Update the status of the current step
  updatedProgress.processingSteps = updatedProgress.processingSteps.map(
    (step) => {
      if (step.name === data.step) {
        return {
          ...step,
          status: data.stepStatus || step.status,
          message: data.message || step.message,
          ...(data.stepStatus === "processing" && !step.startTime
            ? { startTime: Date.now() }
            : {}),
          ...(["completed", "error"].includes(data.stepStatus || "")
            ? { endTime: Date.now() }
            : {}),
          details: data.details
            ? {
                ...step.details,
                ...data.details,
                // If we're updating files, append rather than replace
                files: data.details.files
                  ? [...(step.details?.files || []), ...data.details.files]
                  : step.details?.files,
              }
            : step.details,
        };
      }
      return step;
    },
  );

  // Store the updated progress
  progressStore.set(progressKey, updatedProgress);
  return updatedProgress;
}

/**
 * Updates file-specific progress details
 */
export function updateFileProgress(
  userId: string,
  packageId: string,
  options: {
    step: string;
    file?: string;
    files?: string[];
    count?: number;
  },
) {
  const { step, file, files, count } = options;

  // Build details object
  const details: {
    files?: string[];
    count?: number;
    currentFile?: string;
  } = {};

  if (file) {
    details.currentFile = file;
  }

  if (files && files.length) {
    details.files = files;
  }

  if (count !== undefined) {
    details.count = count;
  }

  // Get current progress to determine percentage
  const progressKey = `${userId}:${packageId}`;
  const progressStore = getProgressStore();
  const currentProgress = progressStore.get(progressKey);

  // Only update with file details, keep other properties the same
  return updateProgress(userId, packageId, {
    step,
    percentage: currentProgress?.percentage || 0,
    details,
  });
}

/**
 * Cleans up progress data after processing is complete
 */
export function clearProgress(userId: string, packageId: string) {
  const progressKey = `${userId}:${packageId}`;
  const progressStore = getProgressStore();
  progressStore.delete(progressKey);
}
