"use client";

import { toast } from "@repo/ui/sonner";
import { useState } from "react";
import {
	PROCESSING_STEPS_NAME,
	type ProcessingStepType,
} from "~/app/api/package/new/PackageStreamer";
import { readStreamResponse } from "~/lib/utils";
import { ProcessingStep } from "./steps-components/processing-step";
import { UploadStep } from "./steps-components/upload-step";

type PackageProgressData = {
	percentage: number;
	error?: string;
	processingSteps: ProcessingStepType[];
};

export const Client = () => {
	const [processingProgress, setProcessingProgress] = useState(0);
	const [processingSteps, setProcessingSteps] =
		useState<ProcessingStepType[]>();

	const onClientUploadComplete = async (packageId: string) => {
		setProcessingSteps(
			PROCESSING_STEPS_NAME.map((step) => ({
				name: step,
				status: "pending",
			})),
		);

		try {
			const response = await fetch("/api/package/new", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ packageId }),
			});

			const cancelStream = await readStreamResponse<PackageProgressData>({
				response,
				onProgress: (progressData) => {
					setProcessingProgress(progressData.percentage);
					setProcessingSteps(progressData.processingSteps);
					if (progressData.error) {
						toast.error(progressData.error);
						cancelStream().catch(console.error);
					}
					if (progressData.percentage >= 100) {
						cancelStream().catch(console.error);
					}
				},
				onError: (error) => {
					toast.error(`Streaming error: ${error.message}`);
				},
				onComplete: () => {},
			});
		} catch (error) {
			setProcessingSteps(undefined);
			toast.error(
				`Streaming error: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	};

	return (
		<>
			{processingSteps ? (
				<ProcessingStep
					processingProgress={processingProgress}
					processingSteps={processingSteps}
				/>
			) : (
				<UploadStep onClientUploadComplete={onClientUploadComplete} />
			)}
		</>
	);
};
