"use client";

import { PropsWithChildren, useEffect, useState, useTransition } from "react";
import { signOut } from "@repo/auth/actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/accordion";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { EmptyState } from "@repo/ui/empty-state";
import { cn } from "@repo/ui/lib/utils";
import { Progress } from "@repo/ui/progress";
import { useQueryClient } from "@tanstack/react-query";
import {
  CloudUpload,
  Files,
  FileText,
  HelpCircle,
  Loader2,
  Package,
} from "lucide-react";
import { toast } from "sonner";

import { UploadButton } from "~/lib/uploadthing";
import { verifPackage } from "~/services/packages/verif-package";

import { DocsModal } from "./docs-modal";
import { HistoryModal } from "./history-modal";

type ClientProps = PropsWithChildren<{
  isDemo?: boolean;
  hasPackage?: boolean;
}>;

type ProcessingStep = {
  name: string;
  status: "pending" | "processing" | "completed" | "error";
  message: string;
  startTime?: number;
  endTime?: number;
  details?: {
    files?: string[];
    count?: number;
    currentFile?: string;
  };
};

interface ProgressData {
  step: string;
  percentage: number;
  message: string;
  stepStatus: "pending" | "processing" | "completed" | "error";
  processingSteps: ProcessingStep[];
  details?: {
    files?: string[];
    count?: number;
    currentFile?: string;
  };
}

const POLLING_INTERVAL = 1000; // Poll every 1 second

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
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    {
      name: "Extract Files",
      status: "pending",
      message: "Extracting files from archive",
    },
    {
      name: "Process Tracks",
      status: "pending",
      message: "Processing track information",
    },
    {
      name: "Fetch Spotify Data",
      status: "pending",
      message: "Retrieving additional track details",
    },
    {
      name: "Save To Database",
      status: "pending",
      message: "Saving your listening history",
    },
  ]);
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

  // Progress polling effect
  useEffect(() => {
    let pollInterval: ReturnType<typeof setTimeout> | null = null;

    const pollProgress = async () => {
      if (!isProcessing || !packageId) return;

      try {
        const response = await fetch(
          `/api/package/progress?packageId=${packageId}`,
        );

        if (!response.ok) {
          // If 404 (progress not found) or any other error, stop polling
          if (response.status === 404) {
            clearInterval(pollInterval as ReturnType<typeof setTimeout>);
            return;
          }

          const errorText = await response.text();
          console.error("Error fetching progress:", errorText);
          return;
        }

        const progressData: ProgressData = await response.json();

        // Update state with server progress
        setProcessingProgress(progressData.percentage);
        setProcessingSteps(progressData.processingSteps);

        // Update processing details if available
        if (progressData.details) {
          setProcessingDetails(progressData.details);
        }

        // Find current active step and update processing details from that step
        const activeStep = progressData.processingSteps.find(
          (step) => step.status === "processing",
        );

        if (activeStep?.details) {
          setProcessingDetails(activeStep.details);
        }

        // Check if processing is complete or errored
        const isComplete =
          progressData.stepStatus === "completed" &&
          progressData.percentage >= 100;
        const hasError = progressData.stepStatus === "error";

        if (isComplete || hasError) {
          // Stop polling if processing is complete or errored
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }

          if (hasError) {
            setIsProcessing(false);
            toast.error("Error processing package: " + progressData.message);
          } else if (isComplete) {
            // Short delay to allow seeing the completed state
            setTimeout(() => {
              toast.success("Package processed successfully!");
              queryClient.clear();
              // Sign out and redirect to refresh the session with new data
              if (!hasPackage) {
                signOut({
                  redirect: true,
                  redirectTo: "/settings/package",
                });
              }
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Progress polling error:", error);
      }
    };

    // Start polling if we're processing and have a package ID
    if (isProcessing && packageId) {
      // Poll immediately then set interval
      pollProgress();
      pollInterval = setInterval(pollProgress, POLLING_INTERVAL);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isProcessing, packageId, queryClient]);

  // Format elapsed time as mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getProcessingStatusText = () => {
    const currentStep = processingSteps.find(
      (step) => step.status === "processing",
    );
    if (!currentStep) return "Preparing...";
    return currentStep.message;
  };

  // Get a truncated file name that's not too long for display
  const truncateFileName = (fileName: string, maxLength = 30) => {
    if (!fileName) return "";
    if (fileName.length <= maxLength) return fileName;

    const parts = fileName.split("/");
    const name = parts[parts.length - 1];

    if (name.length > maxLength - 3) {
      return "..." + name.slice(-(maxLength - 3));
    }

    return ".../" + name;
  };

  return (
    <EmptyState
      title="Upload Your Spotify Data Package"
      description="Please upload your Spotify data package to generate your listening stats."
      icons={[Files, Package, CloudUpload]}
      action={
        <UploadButton
          className={cn(
            "ut-button:inline-flex ut-button:items-center ut-button:justify-center ut-button:gap-2 ut-button:whitespace-nowrap ut-button:rounded-md ut-button:text-sm ut-button:font-medium ut-button:transition-colors ut-button:focus-visible:outline-none ut-button:focus-visible:ring-1 ut-button:focus-visible:ring-ring ut-button:disabled:pointer-events-none ut-button:disabled:opacity-50 ut-button:[&_svg]:pointer-events-none ut-button:[&_svg]:size-4 ut-button:[&_svg]:shrink-0 ut-button:border ut-button:border-input ut-button:bg-background ut-button:shadow-sm ut-button:focus-within:ring-0 ut-button:hover:!bg-accent ut-button:hover:text-accent-foreground ut-button:h-9 ut-button:px-4 ut-button:py-2",
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
              toast.info("Package validation successful. Starting upload...");
              return files;
            }
            return [];
          }}
          onUploadProgress={(progress) => {
            setUploadProgress(progress);
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false);
            setIsProcessing(false);
            toast.error("Error uploading package: " + error.message);
          }}
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              setIsUploading(false);
              setIsProcessing(true);
              setProcessingProgress(0);
              toast.success("Upload complete! Starting processing...");

              const { serverData } = res[0];

              // Store the package ID for progress tracking
              setPackageId(serverData.packageId);

              // Make the initial API call to process the package
              startTransition(async () => {
                try {
                  const res = await fetch("/api/package/new", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(serverData),
                  });

                  if (!res.ok) {
                    const json = await res.json();
                    setIsProcessing(false);
                    toast.error(json.message || "Error processing package");
                  }

                  // We don't need to handle success here as the polling will manage that
                } catch (error) {
                  setIsProcessing(false);
                  const errorMessage =
                    error instanceof Error
                      ? error.message
                      : "Unknown error occurred";
                  toast.error("Processing error: " + errorMessage);
                }
              });
            }
          }}
        />
      }
      action2={
        <DocsModal>
          <Button variant="outline">
            <HelpCircle className="size-4" />
            How to get my package
          </Button>
        </DocsModal>
      }
    >
      {(isUploading || isProcessing) && (
        <Card className="p-4 mt-6 w-full max-w-md mx-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {isUploading ? "Uploading package..." : "Processing package..."}
              </h3>
              <span className="text-sm text-muted-foreground">
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
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="size-3" />
                      <span className="truncate">
                        {truncateFileName(processingDetails.currentFile)}
                      </span>
                    </div>
                  )}

                  {processingDetails?.count && (
                    <div className="text-xs text-muted-foreground">
                      Processing {processingDetails.count} items
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {processingSteps.map((step) => (
                    <div key={step.name} className="flex items-center gap-3">
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
                              "text-foreground font-medium",
                            step.status === "completed" &&
                              "text-muted-foreground",
                            step.status === "error" && "text-destructive",
                          )}
                        >
                          {step.name}
                        </span>
                        {step.status === "processing" && step.message && (
                          <span className="text-xs text-muted-foreground">
                            {step.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {processingDetails?.files &&
                  processingDetails.files.length > 0 && (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="files">
                        <AccordionTrigger className="text-sm">
                          Show processed files ({processingDetails.files.length}
                          )
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="max-h-36 overflow-y-auto text-xs space-y-1">
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
    </EmptyState>
  );
};
