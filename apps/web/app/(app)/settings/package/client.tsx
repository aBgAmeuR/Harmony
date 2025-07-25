"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { toast } from "@repo/ui/sonner";

import {
	PROCESSING_STEPS_NAME,
	type ProcessingStepType,
} from "~/app/api/package/new/PackageStreamer";
import { readStreamResponse } from "~/lib/utils";

import { CompleteStep } from "./steps-components/complete-step";
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
	const [errorMessage, setErrorMessage] = useState<string>();
	// const { data: session, update } = useSession();
	const router = useRouter();
	const queryClient = useQueryClient();

	const isProcessingComplete =
		processingSteps?.length &&
		(processingSteps[processingSteps.length - 1].endTime !== undefined ||
			processingSteps.some((step) => step.status === "error"));

	const onClientUploadComplete = async (packageId: string) => {
		setProcessingSteps(
			PROCESSING_STEPS_NAME.map((step) => ({
				name: step,
				status: "pending",
			})),
		);
		setErrorMessage(undefined);

		try {
			const response = await fetch("/api/package/new", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ packageId }),
			});

			const cancelStream = await readStreamResponse<PackageProgressData>({
				response,
				onProgress: async (progressData) => {
					setProcessingProgress(progressData.percentage);
					setProcessingSteps(progressData.processingSteps);
					if (progressData.error) {
						setErrorMessage(progressData.error);
						toast.error(progressData.error);
						cancelStream().catch(console.error);
					} else if (progressData.percentage >= 100) {
						cancelStream().catch(console.error);
						// await update({
						// 	...session,
						// 	user: { ...session?.user, hasPackage: true },
						// });
						queryClient.invalidateQueries();
						router.refresh();
					}
				},
				onError: (error) => {
					setErrorMessage(error.message);
				},
			});
		} catch (error) {
			setProcessingSteps(undefined);
			const message = error instanceof Error ? error.message : String(error);
			setErrorMessage(message);
			toast.error(
				"An error occurred while processing your package. Please try again.",
			);
		}
	};

	return (
		<>
			{!processingSteps ? (
				<UploadStep onClientUploadComplete={onClientUploadComplete} />
			) : isProcessingComplete ? (
				<CompleteStep
					processingSteps={processingSteps}
					errorMessage={errorMessage}
				/>
			) : (
				<ProcessingStep
					processingProgress={processingProgress}
					processingSteps={processingSteps}
				/>
			)}
		</>
	);
};
