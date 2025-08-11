import { useEffect, useState } from "react";

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

import type { ProcessingStepType } from "../package-streamer";

type ProcessingStepProps = {
	processingProgress: number;
	processingSteps: ProcessingStepType[];
};

const calculateStepTime = (
	step: ProcessingStepType,
	currentTime: number,
): string => {
	if (step.startTime) {
		const endTime = step.endTime ?? currentTime;
		const duration = Math.max(0, Math.floor((endTime - step.startTime) / 1000));
		return `${duration}s`;
	}
	return "0s";
};

export const ProcessingStep = ({
	processingProgress,
	processingSteps,
}: ProcessingStepProps) => {
	const [currentTime, setCurrentTime] = useState(Date.now());
	const currentStepIndex = processingSteps.findIndex(
		(step) => step.status === "processing",
	);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(Date.now());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const totalTime = processingSteps.reduce((acc, step) => {
		if (step.startTime) {
			const endTime = step.endTime ?? currentTime;
			return acc + Math.max(0, endTime - step.startTime);
		}
		return acc;
	}, 0);

	return (
		<CardContent className="space-y-4 px-6">
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<span>
						<span className="font-medium">Overall Progress</span>
						<span className="text-muted-foreground text-sm">{` - ${Math.max(0, Math.floor(totalTime / 1000))}s`}</span>
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
												{` - ${calculateStepTime(step, currentTime)}`}
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
