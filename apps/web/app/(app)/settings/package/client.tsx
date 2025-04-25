"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@repo/ui/accordion";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { Progress } from "@repo/ui/progress";
import { toast } from "@repo/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
	ChevronRight,
	CloudUpload,
	FileText,
	Files,
	HelpCircle,
	Loader2,
	Package,
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
	const queryClient = useQueryClient();
	const [inTransition, startTransition] = useTransition();
	const [uploadProgress, setUploadProgress] = useState(0);
	const [processingProgress, setProcessingProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>(
		PROCESSING_STEPS_NAME.map((step) => ({
			name: step,
			status: "pending",
		})),
	);
	const [packageId, setPackageId] = useState<string | null>(null);
	const [processingDetails, setProcessingDetails] = useState<{
		files?: string[];
		count?: number;
		currentFile?: string;
	} | null>(null);

	// Time tracking effect
	useEffect(() => {
		let interval: ReturnType<typeof setTimeout> | null = null;

		if ((isUploading || isProcessing) && !interval && startTime) {
			interval = setInterval(() => {
				setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
			}, 1000);
		}

		if (!isUploading && !isProcessing && interval) {
			clearInterval(interval);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isUploading, isProcessing, startTime]);

	// Progress streaming effect (remplace le polling)
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		let abortController: AbortController | null = null;
		let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
		let cancelled = false;

		const streamProgress = async () => {
			if (!isProcessing || !packageId) return;
			abortController = new AbortController();
			try {
				const response = await fetch("/api/package/new", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ packageId }),
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

		if (isProcessing && packageId) {
			streamProgress();
		}
		return () => {
			cancelled = true;
			if (reader) reader.cancel();
			abortController?.abort();
		};
	}, [isProcessing, packageId, queryClient, hasPackage]);

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

	// Get a truncated file name that's not too long for display
	const truncateFileName = (fileName: string, maxLength = 30) => {
		if (!fileName) return "";
		if (fileName.length <= maxLength) return fileName;

		const parts = fileName.split("/");
		const name = parts[parts.length - 1];

		if (name.length > maxLength - 3) {
			return `...${name.slice(-(maxLength - 3))}`;
		}

		return `.../${name}`;
	};

	// Typage strict pour la complétion d'upload
	const onClientUploadComplete = (
		res: Array<{ serverData: { packageId: string } }>,
	) => {
		if (res && res.length > 0) {
			setIsUploading(false);
			setIsProcessing(true);
			setProcessingProgress(0);
			toast.success("Upload complete! Starting processing...");

			const { serverData } = res[0];

			// Store the package ID for progress tracking
			setPackageId(serverData.packageId);

			// Plus de requête POST ici, le streaming effect s'occupe de tout
		}
	};

	return (
		<div>
			<div className="mb-10 text-center">
				<h1 className="mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-bold text-3xl text-transparent">
					Upload Your Spotify Data
				</h1>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Transform your listening history into beautiful insights and discover
					your unique music journey
				</p>
			</div>
			<div className="mb-12 rounded-lg border border-primary/20 bg-primary/10 p-4">
				<h2 className="mb-2 flex items-center gap-2 font-medium">
					<Package className="size-5 text-primary" />
					Why upload your data?
				</h2>
				<p className="mb-2 text-muted-foreground text-sm">
					Harmony transforms your raw Spotify data into beautiful visualizations
					and deep insights about your music preferences.
				</p>
				<ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
					<li className="flex items-start gap-2">
						<ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" />
						<span>View your all-time top tracks and artists</span>
					</li>
					<li className="flex items-start gap-2">
						<ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" />
						<span>Track your listening patterns over time</span>
					</li>
					<li className="flex items-start gap-2">
						<ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" />
						<span>Discover hidden gems in your library</span>
					</li>
					<li className="flex items-start gap-2">
						<ChevronRight className="mt-0.5 size-4 shrink-0 text-primary" />
						<span>Compare artists and genres you love</span>
					</li>
				</ul>
			</div>
			<div className="w-full">
				<div className="group w-full rounded-xl border-2 border-border border-dashed bg-background p-14 text-center transition duration-500 hover:border-border/80 hover:bg-muted/50 hover:duration-200">
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
							className={cn(
								"ut-button:hover:!bg-accent ut-button:inline-flex ut-button:h-9 ut-button:items-center ut-button:justify-center ut-button:gap-2 ut-button:whitespace-nowrap ut-button:rounded-md ut-button:border ut-button:border-input ut-button:bg-background ut-button:px-4 ut-button:py-2 ut-button:font-medium ut-button:text-sm ut-button:shadow-sm ut-button:transition-colors ut-button:focus-within:ring-0 ut-button:hover:text-accent-foreground ut-button:focus-visible:outline-none ut-button:focus-visible:ring-1 ut-button:focus-visible:ring-ring ut-button:disabled:pointer-events-none ut-button:disabled:opacity-50 ut-button:[&_svg]:pointer-events-none ut-button:[&_svg]:size-4 ut-button:[&_svg]:shrink-0",
								"ut-button:data-[state=disabled]:bg-green-400 ut-button:data-[state=ready]:bg-background ut-button:data-[state=readying]:bg-green-400 ut-button:data-[state=uploading]:bg-green-400 ut-button:data-[state=uploading]:after:bg-green-600",
							)}
							config={{ cn: cn }}
							appearance={{
								allowedContent: { display: "none" },
							}}
							endpoint="spotifyPackageUploader"
							onBeforeUploadBegin={async (files) => {
								if (await verifPackage(files)) {
									setIsUploading(true);
									setStartTime(Date.now());
									toast.info(
										"Package validation successful. Starting upload...",
									);
									return files;
								}
								return [];
							}}
							onUploadProgress={setUploadProgress}
							onUploadError={(error: Error) => {
								setIsUploading(false);
								setIsProcessing(false);
								toast.error(`Error uploading package: ${error.message}`);
							}}
							onClientUploadComplete={onClientUploadComplete}
						/>

						<DocsModal>
							<Button variant="outline">
								<HelpCircle className="size-4" />
								How to get my package
							</Button>
						</DocsModal>
					</div>

					{(isUploading || isProcessing) && (
						<Card className="mx-auto mt-6 w-full max-w-md p-4">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="font-medium">
										{isUploading
											? "Uploading package..."
											: "Processing package..."}
									</h3>
									<span className="text-muted-foreground text-sm">
										{formatTime(elapsedTime)}
									</span>
								</div>

								{isUploading && (
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Uploading files...</span>
											<span>{Math.round(uploadProgress)}%</span>
										</div>
										<Progress value={uploadProgress} className="h-2" />
									</div>
								)}

								{isProcessing && (
									<>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>{getProcessingStatusText()}</span>
												<span>{Math.round(processingProgress)}%</span>
											</div>
											<Progress value={processingProgress} className="h-2" />

											{processingDetails?.currentFile && (
												<div className="flex items-center gap-2 text-muted-foreground text-xs">
													<FileText className="size-3" />
													<span className="truncate">
														{truncateFileName(processingDetails.currentFile)}
													</span>
												</div>
											)}

											{processingDetails?.count && (
												<div className="text-muted-foreground text-xs">
													Processing {processingDetails.count} items
												</div>
											)}
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

										{processingDetails?.files &&
											processingDetails.files.length > 0 && (
												<Accordion
													type="single"
													collapsible={true}
													className="w-full"
												>
													<AccordionItem value="files">
														<AccordionTrigger className="text-sm">
															Show processed files (
															{processingDetails.files.length})
														</AccordionTrigger>
														<AccordionContent>
															<div className="max-h-36 space-y-1 overflow-y-auto text-xs">
																{processingDetails.files.map((file, index) => (
																	<div
																		key={index}
																		className="flex items-center gap-2"
																	>
																		<FileText className="size-3 text-muted-foreground" />
																		<span className="truncate">{file}</span>
																	</div>
																))}
															</div>
														</AccordionContent>
													</AccordionItem>
												</Accordion>
											)}
									</>
								)}
							</div>
						</Card>
					)}

					{!inTransition &&
						hasPackage &&
						!isDemo &&
						!isUploading &&
						!isProcessing && <HistoryModal>{children}</HistoryModal>}
				</div>
			</div>
		</div>
	);
};
