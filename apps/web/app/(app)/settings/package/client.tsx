"use client";

import { PropsWithChildren, useTransition } from "react";
import { signOut } from "@repo/auth/actions";
import { Button } from "@repo/ui/button";
import { EmptyState } from "@repo/ui/empty-state";
import { cn } from "@repo/ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { CloudUpload, Files, HelpCircle, Package } from "lucide-react";
import { toast } from "sonner";

import { UploadButton } from "~/lib/uploadthing";
import { verifPackage } from "~/services/packages/verif-package";

import { DocsModal } from "./docs-modal";
import { HistoryModal } from "./history-modal";

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
  const [inTransition, startTransition] = useTransition();

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
            if (await verifPackage(files)) return files;
            return [];
          }}
          onUploadError={(error: Error) => {
            toast.error("Error uploading package: " + error.message);
          }}
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              const { serverData } = res[0];
              startTransition(async () => {
                const res = await fetch("/api/package/new", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(serverData),
                });
                const json = await res.json();

                if (res.status !== 200) {
                  toast.error(json.message);
                } else {
                  toast.success("Package processed successfully!");
                  queryClient.clear();
                  // Sign out and redirect to refresh the session with new data
                  await signOut({
                    redirect: true,
                    redirectTo: "/settings/package",
                  });
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
      {!inTransition && hasPackage && !isDemo && (
        <HistoryModal>{children}</HistoryModal>
      )}
    </EmptyState>
  );
};
