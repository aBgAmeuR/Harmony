import { CardContent } from "@repo/ui/card";
import { NumberFlow } from "@repo/ui/components/number";
import { cn } from "@repo/ui/lib/utils";
import { Progress } from "@repo/ui/progress";
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTitle,
} from "@repo/ui/stepper";
import React, { useState, useEffect } from "react";
import type { ProcessingStepType } from "~/app/api/package/new/PackageStreamer";

type ProcessingStepProps = {
	processingProgress: number;
	processingSteps: ProcessingStepType[];
};

const calculateStepTime = (step: ProcessingStepType): string => {
	if (step.startTime) {
		return `${Math.floor(
			((step.endTime ? step.endTime : Date.now()) - step.startTime) / 1000,
		)}s`;
	}
	return "0s";
};

export const ProcessingStep = ({
	processingProgress,
	processingSteps,
}: ProcessingStepProps) => {
	const currentStepIndex = processingSteps.findIndex(
		(step) => step.status === "processing",
	);
	const [elapsedTime, setElapsedTime] = useState<number>(0);
	useEffect(() => {
		const firstStepStartTime = processingSteps[0]?.startTime || 0;
		if (!firstStepStartTime) return;

		const lastStep = processingSteps[processingSteps.length - 1];

		if (lastStep.endTime) {
			setElapsedTime(
				Math.floor((lastStep.endTime - firstStepStartTime) / 1000),
			);
			return;
		}

		const timer = setInterval(() => {
			setElapsedTime(Math.floor((Date.now() - firstStepStartTime) / 1000));
		}, 1000);

		return () => clearInterval(timer);
	}, [processingSteps]);

	return (
		<CardContent className="space-y-4 px-6">
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<span>
						<span className="font-medium">Overall Progress</span>
						<span className="text-muted-foreground text-sm">{` - ${elapsedTime}s`}</span>
					</span>
					<span className="font-bold text-primary text-sm">
						<NumberFlow value={processingProgress} suffix="%" />
					</span>
				</div>
				<Progress value={processingProgress} className="h-2.5" />
			</div>

			<div className="rounded-lg border bg-background/50 p-4">
				<Stepper value={currentStepIndex + 1} orientation="vertical">
					{processingSteps.map((step, index) => (
						<StepperItem
							key={step.name}
							step={index + 1}
							className="relative not-last:flex-1 items-start"
							loading={step.status === "processing"}
						>
							<div className="flex items-start rounded pb-6 last:pb-0">
								<StepperIndicator />
								<div className="mt-0.5 px-2 text-left">
									<StepperTitle
										className={cn(
											"text-sm",
											step.status === "processing" &&
												"font-medium text-foreground",
											step.status === "completed" && "text-muted-foreground",
											step.status === "error" && "text-destructive",
										)}
									>
										<span>{step.name}</span>
										{step.startTime && (
											<span className="text-muted-foreground text-xs">
												{` - ${calculateStepTime(step)}`}
											</span>
										)}
									</StepperTitle>
								</div>
							</div>
							{index < processingSteps.length - 1 && (
								<StepperSeparator className="-order-1 -translate-x-1/2 absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 m-0 group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
							)}
						</StepperItem>
					))}
				</Stepper>
			</div>
		</CardContent>
	);
};
