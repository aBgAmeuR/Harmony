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

type PackageProgressData = {
	percentage: number;
	error?: string;
	processingSteps: ProcessingStepType[];
};

export class PackageStreamer {
	private encoder = new TextEncoder();
	private steps: ProcessingStepType[] = PROCESSING_STEPS_NAME.map((step) => ({
		name: step,
		status: "pending",
	}));
	private controller: ReadableStreamDefaultController<Uint8Array> | null = null;

	private send(progress: Omit<PackageProgressData, "processingSteps">) {
		const chunk = this.encoder.encode(
			`${JSON.stringify({
				...progress,
				processingSteps: this.steps,
			})}\n`,
		);
		this.controller?.enqueue(chunk);
	}

	public setController(
		controller: ReadableStreamDefaultController<Uint8Array>,
	) {
		this.controller = controller;
	}

	public emit(
		percentage: number,
		name?: ProcessingStepName,
		status: Exclude<Status, "error"> = "pending",
	) {
		const now = Date.now();
		this.steps = this.steps.map((step) => {
			if (step.name === name) {
				const updatedStep: ProcessingStepType = {
					...step,
					status,
				};

				if (status === "processing" && step.status !== "processing") {
					updatedStep.startTime = now;
				}
				if (status === "completed" && step.status !== "completed") {
					updatedStep.endTime = now;
				}

				return updatedStep;
			}
			return step;
		});

		return this.send({ percentage });
	}

	public emitError(error: string, name: ProcessingStepName) {
		this.steps = this.steps.map((step) => ({
			...step,
			status: step.name === name ? "error" : step.status,
		}));
		return this.send({ percentage: 100, error });
	}
}

export class PackageStreamerError extends Error {
	public step: ProcessingStepName;

	constructor(message: string, step: ProcessingStepName) {
		super(message);
		this.step = step;
	}
}
