export const PROCESSING_STEPS_NAME = [
	"Extracting files from archive",
	"Processing track information",
	"Retrieving additional track details",
	"Saving your listening history",
] as const;

type Status = "pending" | "processing" | "completed" | "error";
type ProcessingStepName = (typeof PROCESSING_STEPS_NAME)[number];
export type ProcessingStepType = {
	name: ProcessingStepName;
	status: Status;
	startTime?: number;
	endTime?: number;
};