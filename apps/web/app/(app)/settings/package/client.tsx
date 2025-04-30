"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@repo/ui/accordion";
import { Button, buttonVariants } from "@repo/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { Progress } from "@repo/ui/progress";
import { toast } from "@repo/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
	ChartLineIcon,
	ChevronRight,
	Clock,
	CloudUpload,
	FileText,
	Files,
	HelpCircle,
	Layers,
	LineChart,
	Loader2,
	Package,
	Sparkles,
} from "lucide-react";
import {
	type PropsWithChildren,
	useEffect,
	useState,
	useTransition,
} from "react";

import { UploadButton } from "~/lib/uploadthing";
import { verifPackage } from "~/services/packages/verif-package";

import { DocsModal } from "./docs-modal";
import { HistoryModal } from "./history-modal";

type ClientProps = PropsWithChildren<{
	isDemo?: boolean;
	hasPackage?: boolean;
}>;

const PROCESSING_STEPS_NAME = [
	"Extracting files from archive",
	"Processing track information",
	"Retrieving additional track details",
	"Saving your listening history",
] as const;

type Status = "pending" | "processing" | "completed" | "error";
type ProcessingStepName = (typeof PROCESSING_STEPS_NAME)[number];
type ProcessingStep = {
	name: ProcessingStepName;
	status: Status;
};

type PackageProgressData = {
	percentage: number;
	error?: string;
	processingSteps: ProcessingStep[];
};

export const Client = ({
	isDemo = false,
	hasPackage = false,
	children,
}: ClientProps) => {
	const [processingProgress, setProcessingProgress] = useState(0);
	const [isProcessing, setIsProcessing] = useState(false);
	const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>(
		PROCESSING_STEPS_NAME.map((step) => ({
			name: step,
			status: "pending",
		})),
	);

	// Format elapsed time as mm:ss
	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	// Simplify step rendering: remove message/stepStatus logic, only use new API shape
	const getProcessingStatusText = () => {
		const currentStep = processingSteps.find(
			(step) => step.status === "processing",
		);
		return currentStep ? currentStep.name : "Preparing...";
	};

	const onClientUploadComplete = async (
		res: Array<{ serverData: { packageId: string } }>,
	) => {
		if (res && res.length <= 0) {
			return;
		}

		toast.success("Upload complete! Starting processing...");
		const { serverData } = res[0];

		let abortController: AbortController | null = null;
		let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
		let cancelled = false;

		setIsProcessing(true);
		abortController = new AbortController();
		try {
			const response = await fetch("/api/package/new", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ packageId: serverData.packageId }),
				signal: abortController.signal,
			});
			if (!response.body) throw new Error("No response body");
			reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";
			while (!cancelled) {
				const { value, done } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";
				for (const line of lines) {
					if (!line.trim()) continue;
					try {
						const progressData: PackageProgressData = JSON.parse(line);
						setProcessingProgress(progressData.percentage);
						setProcessingSteps(progressData.processingSteps);
						if (progressData.error) {
							setIsProcessing(false);
							toast.error(progressData.error);
							cancelled = true;
							if (reader) await reader.cancel();
							abortController?.abort();
							return;
						}
						if (progressData.percentage >= 100) {
							setIsProcessing(false);
							setTimeout(() => {
								toast.success("Package processed successfully!");
							}, 1000);
							cancelled = true;
							if (reader) await reader.cancel();
							abortController?.abort();
							return;
						}
					} catch (e) {
						// ignore parse errors for partial lines
					}
				}
			}
		} catch (error) {
			if (!cancelled) {
				setIsProcessing(false);
				toast.error(
					`Streaming error: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		}
	};

	return (
		<div>
			<div className="mb-8 text-center">
				<h1 className="mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-bold text-3xl text-transparent">
					Upload Your Spotify Data
				</h1>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Transform your listening history into beautiful insights and discover
					your unique music journey through interactive visualizations.
				</p>
			</div>

			<FeatureShowcase className="mb-6" />

			<Card>
				<CardHeader className="mb-4">
					<CardTitle>Upload Your Spotify Data Package</CardTitle>
					<CardDescription>
						Please upload your Spotify data package to generate your listening
						stats.
					</CardDescription>
				</CardHeader>
				<CardContent className="group mx-6 rounded-xl border border-2 border-border border-dashed p-8 text-center transition-all duration-500 hover:border-muted-foreground hover:duration-200">
					<div className="isolate flex justify-center">
						<>
							<div className="-rotate-6 group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 relative top-1.5 left-2.5 grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:duration-200">
								<Files className="size-6 text-muted-foreground" />
							</div>
							<div className="group-hover:-translate-y-0.5 relative z-10 grid size-12 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:duration-200">
								<Package className="size-6 text-muted-foreground" />
							</div>
							<div className="group-hover:-translate-y-0.5 relative top-1.5 right-2.5 grid size-12 rotate-6 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:translate-x-5 group-hover:rotate-12 group-hover:duration-200">
								<CloudUpload className="size-6 text-muted-foreground" />
							</div>
						</>
					</div>
					<h2 className="mt-6 font-medium text-foreground">
						Upload Your Spotify Data Package
					</h2>
					<p className="mt-1 whitespace-pre-line text-muted-foreground text-sm">
						Please upload your Spotify data package to generate your listening
						stats.
					</p>
					<div className="mt-4 flex items-center justify-center gap-2">
						<UploadButton
							/*
                                "ut-button:data-[state=disabled]:bg-green-400 ut-button:data-[state=ready]:bg-background ut-button:data-[state=readying]:bg-green-400 ut-button:data-[state=uploading]:bg-green-400 ut-button:data-[state=uploading]:after:bg-green-600",
                             */
							className={cn(
								buttonVariants()
									.split(" ")
									.map((cls) => `ut-button:${cls}`),
								"ut-button:!bg-primary ut-button:!text-primary-foreground ut-button:!shadow-xs ut-button:hover:!bg-primary/90 ut-button:!ring-0",
							)}
							config={{ cn: cn }}
							appearance={{
								allowedContent: { display: "none" },
							}}
							endpoint="spotifyPackageUploader"
							onBeforeUploadBegin={async (files) => {
								if (await verifPackage(files)) {
									toast.info(
										"Package validation successful. Starting upload...",
									);
									return files;
								}
								return [];
							}}
							onUploadError={(error: Error) => {
								toast.error(`Error uploading package: ${error.message}`);
							}}
							onClientUploadComplete={onClientUploadComplete}
						/>
					</div>

					{isProcessing && (
						<Card className="mx-auto mt-6 w-full max-w-md p-4">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="font-medium">Processing package...</h3>
									<span className="text-muted-foreground text-sm">
										{formatTime(10)}
									</span>
								</div>

								{isProcessing && (
									<>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>{getProcessingStatusText()}</span>
												<span>{Math.round(processingProgress)}%</span>
											</div>
											<Progress value={processingProgress} className="h-2" />
										</div>

										<div className="space-y-2">
											{processingSteps.map((step) => (
												<div
													key={step.name}
													className="flex items-center gap-3"
												>
													{step.status === "pending" && (
														<div className="size-4 rounded-full bg-muted" />
													)}
													{step.status === "processing" && (
														<Loader2 className="size-4 animate-spin text-primary" />
													)}
													{step.status === "completed" && (
														<div className="size-4 rounded-full bg-green-500" />
													)}
													{step.status === "error" && (
														<div className="size-4 rounded-full bg-destructive" />
													)}
													<div className="flex flex-col">
														<span
															className={cn(
																"text-sm",
																step.status === "processing" &&
																	"font-medium text-foreground",
																step.status === "completed" &&
																	"text-muted-foreground",
																step.status === "error" && "text-destructive",
															)}
														>
															{step.name}
														</span>
													</div>
												</div>
											))}
										</div>
									</>
								)}
							</div>
						</Card>
					)}
				</CardContent>
				<CardFooter className="mt-2 justify-between">
					<DocsModal>
						<Button variant="ghost">
							<HelpCircle className="size-4" />
							How to get my package
						</Button>
					</DocsModal>

					<HistoryModal>{children}</HistoryModal>
				</CardFooter>
			</Card>
		</div>
	);
};

const FeatureShowcase = ({ className }: { className?: string }) => {
	return (
		<div className={cn("grid gap-3 sm:grid-cols-2", className)}>
			<Card className="flex-row gap-2 p-4">
				<div className="flex size-8 min-w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
					<LineChart className="size-4" />
				</div>
				<div>
					<CardTitle>Track your listening patterns</CardTitle>
					<CardDescription>
						See how your music taste evolves over time with beautiful
						visualizations.
					</CardDescription>
				</div>
			</Card>
			<Card className="flex-row gap-2 p-4">
				<div className="flex size-8 min-w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
					<Sparkles className="size-4" />
				</div>
				<div>
					<CardTitle>Discover hidden gems</CardTitle>
					<CardDescription>
						Uncover forgotten favorites and tracks you've loved but rarely play.
					</CardDescription>
				</div>
			</Card>
			<Card className="flex-row gap-2 p-4">
				<div className="flex size-8 min-w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
					<Layers className="size-4" />
				</div>
				<div>
					<CardTitle>Compare artists and genres</CardTitle>
					<CardDescription>
						See which artists and genres dominate your listening habits.
					</CardDescription>
				</div>
			</Card>
			<Card className="flex-row gap-2 p-4">
				<div className="flex size-8 min-w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
					<Clock className="size-4" />
				</div>
				<div>
					<CardTitle>View your all-time top tracks</CardTitle>
					<CardDescription>
						Get insights into your most played songs and artists.
					</CardDescription>
				</div>
			</Card>
		</div>
	);
};
