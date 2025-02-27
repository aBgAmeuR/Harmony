import { Button } from "@repo/ui/button";
import { Progress } from "@repo/ui/progress";
import { ScrollArea } from "@repo/ui/scroll-area";
import { AlertCircle, ArrowLeft, Check, FileJson, Loader2 } from "lucide-react";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

interface FilePreviewProps {
  fileName: string;
  fileSize: number;
  fileContents: {
    filename: string;
    status: "pending" | "processing" | "done" | "error";
  }[];
  onContinue: () => void;
  onCancel: () => void;
  isProcessing: boolean;
  progress: number;
}

export function FilePreview({
  fileName,
  fileSize,
  fileContents,
  onContinue,
  onCancel,
  isProcessing,
  progress,
}: FilePreviewProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <div className="size-4 rounded-full bg-muted-foreground/30" />;
      case "processing":
        return <Loader2 className="size-4 animate-spin text-blue-500" />;
      case "done":
        return <Check className="size-4 text-green-500" />;
      case "error":
        return <AlertCircle className="size-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Package Preview</h3>
          <p className="text-sm text-muted-foreground">
            We found {fileContents.length} files in your Spotify data package
          </p>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="font-medium">{fileName}</span>
          <span className="mx-2">•</span>
          <span>{formatFileSize(fileSize)}</span>
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="p-3 bg-muted/50 border-b flex justify-between items-center">
          <span className="font-medium">Files ({fileContents.length})</span>
          {fileContents.length > 0 ? (
            <div className="flex items-center text-sm text-green-600">
              <Check className="size-4 mr-1" />
              Valid package
            </div>
          ) : (
            <div className="flex items-center text-sm text-destructive">
              <AlertCircle className="size-4 mr-1" />
              No files found
            </div>
          )}
        </div>

        <ScrollArea className="h-[240px]">
          <ul className="divide-y">
            {fileContents.map((file, index) => (
              <li key={index} className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FileJson className="size-5 mr-3 text-muted-foreground" />
                  <span>{file.filename.split("/").pop()}</span>
                </div>
                {getStatusIcon(file.status)}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>

      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Processing files...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex items-center"
          disabled={isProcessing}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>

        <Button
          onClick={onContinue}
          disabled={fileContents.length === 0 || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Package"
          )}
        </Button>
      </div>
    </div>
  );
}
