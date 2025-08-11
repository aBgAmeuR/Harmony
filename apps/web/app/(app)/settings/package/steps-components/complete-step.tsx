import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@repo/ui/button";
import { CardContent } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";

import type { ProcessingStepType } from "../package-streamer";

type CompleteStepProps = {
	processingSteps: ProcessingStepType[];
	errorMessage?: string;
};

export const CompleteStep = ({
	processingSteps,
	errorMessage,
}: CompleteStepProps) => {
	const hasError = processingSteps.some((step) => step.status === "error");
	const totalTime = processingSteps.reduce((acc, step) => {
		if (step.startTime && step.endTime) {
			return acc + (step.endTime - step.startTime);
		}
		return acc;
	}, 0);

	const handleRetry = () => {
		window.location.reload();
	};

	return (
		<CardContent className="space-y-4 px-6">
			<div className="flex flex-col items-center justify-center space-y-2 py-8">
				{hasError ? (
					<XCircle className="size-12 text-destructive" />
				) : (
					<CheckCircle2 className="size-12 text-primary" />
				)}
				<div className="text-center">
					<h3
						className={cn(
							"font-semibold text-lg",
							hasError ? "text-destructive" : "text-primary",
						)}
					>
						{hasError ? "Processing Failed" : "Processing Complete"}
					</h3>
					<p className="text-muted-foreground text-sm">
						{hasError
							? errorMessage ||
							"An error occurred during processing. Please try again."
							: `Total processing time: ${Math.floor(totalTime / 1000)}s`}
					</p>
				</div>
				{hasError && (
					<Button variant="outline" size="sm" onClick={handleRetry}>
						Retry
					</Button>
				)}
			</div>
		</CardContent>
	);
};
