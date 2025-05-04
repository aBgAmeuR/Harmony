"use client";

import { useSession } from "@repo/auth";
import { signOut } from "@repo/auth/actions";
import { Button } from "@repo/ui/button";
import { CardContent } from "@repo/ui/card";
import { toast } from "@repo/ui/sonner";
import { Info } from "lucide-react";
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
	const session = useSession();
	const [processingProgress, setProcessingProgress] = useState(0);
	const [processingSteps, setProcessingSteps] =
		useState<ProcessingStepType[]>();

	if (session?.data?.user.name === "Demo") {
		return (
			<CardContent className="mx-6 rounded-lg border border-border bg-background p-4 shadow-black/5 shadow-lg">
				<div className="flex items-center gap-4">
					<Info
						className="text-blue-500"
						size={24}
						strokeWidth={2}
						aria-hidden="true"
					/>
					<div className="flex w-full grow items-center justify-between">
						<div className="space-y-1">
							<p className="font-medium text-sm">
								Sign in to view your package
							</p>
							<p className="text-muted-foreground text-xs">
								You must sign in to view your package and explore your listening
								history with Harmony.
							</p>
						</div>
						<form
							action={async () => {
								await signOut({
									redirect: true,
									redirectTo: "/",
								});
							}}
						>
							<Button className="w-full" size="sm" type="submit">
								Exit demo
							</Button>
						</form>
					</div>
				</div>
			</CardContent>
		);
	}

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
