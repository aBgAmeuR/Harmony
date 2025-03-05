"use client";

import { PropsWithChildren, useRef, useState, useTransition } from "react";
import { signOut } from "@repo/auth/actions";
import { Button, buttonVariants } from "@repo/ui/button";
import { EmptyState } from "@repo/ui/empty-state";
import { Progress } from "@repo/ui/progress";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  CloudUpload,
  Files,
  HelpCircle,
  History,
  Loader2,
  Package,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { processUploadedZipFile } from "~/services/upload-processing";
import { UploadButton, UploadDropzone } from "~/lib/uploadthing";

import { DocsModal } from "./docs-modal";
import { HistoryModal } from "./history-modal";
import { verifPackage } from "~/services/packages/verif-package";
import { cn } from "@repo/ui/lib/utils";

type ClientProps = PropsWithChildren<{
  isDemo?: boolean;
  hasPackage?: boolean;
}>;

export const Client = ({
  isDemo = false,
  hasPackage = false,
  children,
}: ClientProps) => {
  const queryClient = useQueryClient();
  const [processingProgress, setProcessingProgress] = useState(0);
  const [inTransition, startTransition] = useTransition();
  const [filesQueue, setFilesQueue] = useState<
    {
      filename: string;
      status: "pending" | "processing" | "done" | "error";
    }[]
  >([]);

  const setProgress = (progress: number) => {
    setProcessingProgress(progress);
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
              return files;
            }
            return []
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
          // onClientUploadComplete={(res) => {
          //   // if (res && res.length > 0) {
          //   //   const { ufsUrl } = res[0];

          //   //   // Use the file URL to process the uploaded ZIP file
          //   //   startTransition(async () => {
          //   //     const result = await processUploadedZipFile(ufsUrl, setProgress);

          //   //     if (result.message === "error") {
          //   //       toast.error(result.error);
          //   //       return;
          //   //     }

          //   //     toast.success("Package processed successfully!");
          //   //     queryClient.clear();
          //   //     // Sign out and redirect to refresh the session with new data
          //   //     await signOut({ redirect: true, redirectTo: "/settings/package" });
          //   //   });
          //   // }
          // }}
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            alert("Upload Completed");
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
      {!inTransition && hasPackage && !isDemo && (
        <HistoryModal>{children}</HistoryModal>
      )}

      {filesQueue.length > 0 ? (
        <div className="mt-4 space-y-4">
          <Progress value={processingProgress} />
          <div className="space-y-2">
            {filesQueue.map((file, index) => (
              <div key={index} className="flex items-center gap-2">
                {file.status === "pending" && (
                  <AlertCircle className="size-4 text-muted-foreground" />
                )}
                {file.status === "processing" && (
                  <Loader2 className="size-4 animate-spin text-primary" />
                )}
                {file.status === "done" && (
                  <Check className="size-4 text-primary" />
                )}
                {file.status === "error" && (
                  <AlertCircle className="size-4 text-destructive" />
                )}
                <span className="text-sm">{file.filename.split("/")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </EmptyState>
  );
};
